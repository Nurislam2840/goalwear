// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getCurrentUserId } from "@/lib/supabase-server";
import { calculateDiscount } from "@/lib/coupon";

// ============ GET — List user's orders ============
export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET orders]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const orders = (data || []).map((row) => ({
      id: row.id,
      date: row.created_at,
      items: row.items || [],
      total: Number(row.total),
      status: row.status,
      customerInfo: row.customer_info || {},
      paymentMethod: row.payment_method || "Unknown",
      shippingMethod: row.shipping_method || "truck",
    }));

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("[GET orders] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ============ POST — Create new order ============
export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, customerInfo, paymentMethod, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json(
        { error: "Customer info required" },
        { status: 400 }
      );
    }

    // 🔒 Fetch real prices and stock from Supabase
    const productIds = items
      .map((i: any) => Number(i.id))
      .filter((n: number) => Number.isFinite(n) && n > 0);

    const { data: dbProducts, error: dbError } = await supabaseAdmin
      .from("products")
      .select("id, price, stock")
      .in("id", productIds);

    if (dbError) {
      console.error("[POST orders] DB fetch error:", dbError.message);
      return NextResponse.json(
        { error: "Failed to verify products" },
        { status: 500 }
      );
    }

    let subtotal = 0;
    const verifiedItems: any[] = [];

    for (const item of items) {
      const product = (dbProducts || []).find(
        (p) => p.id === Number(item.id)
      );
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.id} not found` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Math.min(Number(item.quantity) || 1, 10));

      // 👇 স্টক চেক (০ বা তার কম হলে ব্লক)
      if (Number(product.stock ?? 0) < qty) {
        return NextResponse.json(
          { error: `Insufficient stock for "${item.name}"` },
          { status: 400 }
        );
      }

      const price = Number(product.price);
      subtotal += price * qty;
      verifiedItems.push({
        id: product.id,
        name: item.name,
        price,
        image_url: item.image_url,
        quantity: qty,
      });
    }

    // 👇 সার্ভার সাইডে কুপন ক্যালকুলেশন (ক্লায়েন্টের টোটাল বিশ্বাস না করে)
    const { discount, couponCode: verifiedCouponCode } = await calculateDiscount(
      couponCode || "",
      subtotal
    );

    const finalTotal = Math.round((subtotal - discount) * 100) / 100;
    const orderId = `GW-${Date.now().toString().slice(-8)}`;

    const finalPaymentMethod = verifiedCouponCode
      ? `${paymentMethod || "Cash on Delivery"} (Coupon: ${verifiedCouponCode})`
      : paymentMethod || "Cash on Delivery";

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        id: orderId,
        user_id: userId,
        items: verifiedItems,
        total: finalTotal,
        status: "Processing",
        customer_info: customerInfo,
        payment_method: finalPaymentMethod,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST orders]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // 👇 COD অর্ডারের জন্য কনফার্মেশন ইমেইল পাঠানো
    const { sendOrderConfirmationEmail } = await import("@/lib/email");
    await sendOrderConfirmationEmail({
    	to: customerInfo.email,
    	customerName: customerInfo.name,
    	orderId: data.id,
    	items: verifiedItems.map((i) => ({
    		name: i.name,
    		quantity: i.quantity,
    		price: i.price,
    	})),
    	total: finalTotal,
    	paymentMethod: finalPaymentMethod,
    });

    // 👇 Atomic স্টক কমানো (ডাটাবেস ফাংশন দিয়ে)
    for (const item of verifiedItems) {
      await supabaseAdmin.rpc("decrement_stock", {
        p_id: item.id,
        p_qty: item.quantity,
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: data.id,
        date: data.created_at,
        items: data.items || [],
        total: Number(data.total),
        status: data.status,
        customerInfo: data.customer_info || {},
        paymentMethod: data.payment_method,
      },
    });
  } catch (err: any) {
    console.error("[POST orders] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}