// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    // 1. Validate Stripe key
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    // 2. Parse body
    const body = await req.json();
    const { items, customerInfo, couponCode, userId } = body;

    console.log("[checkout] Received userId:", userId);

    // 3. Validate input
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (items.length > 50) {
      return NextResponse.json(
        { error: "Too many items (max 50)" },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json(
        { error: "Customer info required" },
        { status: 400 }
      );
    }

    // 4. Fetch REAL prices from Supabase
    const productIds = items
      .map((i: any) => Number(i.id))
      .filter((n: number) => Number.isFinite(n) && n > 0);

    const { data: dbProducts, error: dbError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, image_url, stock")
      .in("id", productIds);

    if (dbError) {
      console.error("[checkout] DB fetch error:", dbError.message);
      return NextResponse.json(
        { error: "Failed to verify products" },
        { status: 500 }
      );
    }

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 400 }
      );
    }

    // 5. Build validated line items
    const line_items: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = dbProducts.find((p) => p.id === Number(item.id));

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.id} not found` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Math.min(Number(item.quantity) || 1, 10));

      if (product.stock && product.stock < qty) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}"` },
          { status: 400 }
        );
      }

      const serverPrice = Number(product.price);
      subtotal += serverPrice * qty;

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image_url ? [product.image_url] : [],
          },
          unit_amount: Math.round(serverPrice * 100),
        },
        quantity: qty,
      });
    }

    // 6. Validate coupon SERVER-SIDE
    let discounts: any[] = [];
    let appliedCouponCode = "";

    if (couponCode && typeof couponCode === "string") {
      const { data: coupon } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase().trim())
        .eq("is_active", true)
        .maybeSingle();

      if (coupon) {
        const notExpired =
          !coupon.expires_at || new Date(coupon.expires_at) > new Date();

        if (notExpired) {
          let discountAmountCents = 0;

          if (coupon.type === "percent") {
            discountAmountCents = Math.round(
              subtotal * (Number(coupon.value) / 100) * 100
            );
          } else if (coupon.type === "fixed") {
            discountAmountCents = Math.round(Number(coupon.value) * 100);
          }

          if (discountAmountCents > subtotal * 100) {
            discountAmountCents = Math.floor(subtotal * 100);
          }

          if (discountAmountCents > 0) {
            // Try to reuse an existing Stripe coupon (idempotent by name)
            const reusableName = `GW-${coupon.code}-${discountAmountCents}`;
            let stripeCouponId: string | null = null;

            try {
              const list = await stripe.coupons.list({ limit: 100 });
              const existing = list.data.find(
                (c) => c.name === reusableName && c.valid
              );
              if (existing) stripeCouponId = existing.id;
            } catch (err) {
              console.warn("[checkout] coupons.list failed, will create new");
            }

            if (!stripeCouponId) {
              const created = await stripe.coupons.create({
                amount_off: discountAmountCents,
                currency: "usd",
                duration: "once",
                name: reusableName,
              });
              stripeCouponId = created.id;
            }

            discounts = [{ coupon: stripeCouponId }];
            appliedCouponCode = coupon.code;
          }
        }
      }
    }

    // 7. Truncate metadata (Stripe limit ~500 chars per value)
    const truncate = (s: string, n = 480) => (s || "").slice(0, n);

    // 8. Build success URL with user_id
    const userParam = userId ? `&user_id=${encodeURIComponent(userId)}` : "";
    const successUrl = `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}${userParam}`;

    // 9. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      discounts: discounts.length > 0 ? discounts : undefined,
      customer_email: customerInfo.email || undefined,
      metadata: {
        customerName: truncate(customerInfo.name || ""),
        customerPhone: truncate(customerInfo.phone || "", 40),
        customerAddress: truncate(customerInfo.address || ""),
        customerCity: truncate(customerInfo.city || "", 100),
        couponCode: appliedCouponCode,
        userId: userId || "",
      },
      success_url: successUrl,
      cancel_url: `${BASE_URL}/cart`,
    });

    console.log("[checkout] ✅ Session created:", session.id);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("[checkout] Error:", error.message);
    return NextResponse.json(
      { error: "Payment processing failed. Please try again." },
      { status: 500 }
    );
  }
}