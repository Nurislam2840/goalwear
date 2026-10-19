// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// 👇 Base URL ক্লিন করা হচ্ছে (শেষে স্ল্যাশ থাকলে রিমুভ করবে)
const RAW_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, ""); // শেষের সব স্ল্যাশ মুছে ফেলবে

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const body = await req.json();
    const { items, customerInfo, couponCode, userId } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json({ error: "Customer info required" }, { status: 400 });
    }

    const productIds = items
      .map((i: any) => Number(i.id))
      .filter((n: number) => Number.isFinite(n) && n > 0);

    const { data: dbProducts, error: dbError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, image_url, stock")
      .in("id", productIds);

    if (dbError || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ error: "Products not found" }, { status: 400 });
    }

    const line_items: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = dbProducts.find((p) => p.id === Number(item.id));
      if (!product) {
        return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 400 });
      }

      const qty = Math.max(1, Math.min(Number(item.quantity) || 1, 10));
      if (Number(product.stock ?? 0) < qty) {
        return NextResponse.json({ error: `Insufficient stock for "${product.name}"` }, { status: 400 });
      }

      const serverPrice = Number(product.price);
      subtotal += serverPrice * qty;

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image_url ? [product.image_url] : [],
            metadata: { product_id: String(product.id) },
          },
          unit_amount: Math.round(serverPrice * 100),
        },
        quantity: qty,
      });
    }

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
        const notExpired = !coupon.expires_at || new Date(coupon.expires_at) > new Date();
        if (notExpired) {
          let discountAmountCents = 0;
          if (coupon.type === "percent") {
            discountAmountCents = Math.round(subtotal * (Number(coupon.value) / 100) * 100);
          } else if (coupon.type === "fixed") {
            discountAmountCents = Math.round(Number(coupon.value) * 100);
          }

          if (discountAmountCents > subtotal * 100) discountAmountCents = Math.floor(subtotal * 100);

          if (discountAmountCents > 0) {
            const stripeCoupon = await stripe.coupons.create({
              amount_off: discountAmountCents,
              currency: "usd",
              duration: "once",
              name: coupon.code,
            });
            discounts = [{ coupon: stripeCoupon.id }];
            appliedCouponCode = coupon.code;
          }
        }
      }
    }

    const truncate = (s: string, n = 480) => (s || "").slice(0, n);

    // 👇 successUrl এবং cancelUrl ডাবল স্ল্যাশ ছাড়া তৈরি হচ্ছে
    const successUrl = `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${BASE_URL}/cart`;

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
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error("[checkout] Stripe Error Details:", error.message);
    
    // 👇 এরর মেসেজে যদি Stripe-এর Raw URL থাকে, সেটাকে ছোট করা হচ্ছে
    let errorMessage = error.message || "Unknown error";
    if (errorMessage.length > 200) {
      errorMessage = errorMessage.substring(0, 200) + "...";
    }

    return NextResponse.json(
      { error: `Payment processing failed: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}