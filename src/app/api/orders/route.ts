// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";

// Helper: get user id from secure cookie ONLY (no header spoofing)
async function getUserId(_req: NextRequest): Promise<string | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("goalwear-user")?.value;

  if (!userCookie) return null;

  try {
    const parsed = JSON.parse(userCookie);
    if (parsed && typeof parsed.id === "string" && parsed.id.length > 0) {
      return parsed.id;
    }
  } catch {
    // ignore malformed cookie
  }

  return null;
}

// ============ GET — List user's orders ============
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);

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
    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, total, customerInfo, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json(
        { error: "Customer info required" },
        { status: 400 }
      );
    }

    // 🔒 Recompute total server-side from DB prices (prevents price manipulation)
    const productIds = items
      .map((i: any) => Number(i.id))
      .filter((n: number) => Number.isFinite(n) && n > 0);

    const { data: dbProducts, error: dbError } = await supabaseAdmin
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to verify products" },
        { status: 500 }
      );
    }

    let verifiedTotal = 0;
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
      const price = Number(product.price);

      verifiedTotal += price * qty;
      verifiedItems.push({
        id: product.id,
        name: item.name,
        price,
        image_url: item.image_url,
        quantity: qty,
      });
    }

    verifiedTotal = Math.round(verifiedTotal * 100) / 100;

    const orderId = `GW-${Date.now().toString().slice(-8)}`;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        id: orderId,
        user_id: userId,
        items: verifiedItems,
        total: verifiedTotal,
        status: "Processing",
        customer_info: customerInfo,
        payment_method: paymentMethod || "Cash on Delivery",
      })
      .select()
      .single();

    if (error) {
      console.error("[POST orders]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
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