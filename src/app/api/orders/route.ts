// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";

// Helper: get user id from cookie OR header
async function getUserId(req: NextRequest): Promise<string | null> {
  // 1. Try header first (sent from client)
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) {
    console.log("[orders API] User ID from header:", headerUserId);
    return headerUserId;
  }

  // 2. Try cookie fallback
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("goalwear-user")?.value;

  if (userCookie) {
    try {
      const parsed = JSON.parse(userCookie);
      if (parsed && parsed.id) {
        console.log("[orders API] User ID from cookie:", parsed.id);
        return parsed.id;
      }
    } catch {
      // ignore
    }
  }

  console.log("[orders API] ❌ No user ID found");
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

    const orderId = `GW-${Date.now().toString().slice(-8)}`;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        id: orderId,
        user_id: userId,
        items,
        total: Number(total) || 0,
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

    const order = {
      id: data.id,
      date: data.created_at,
      items: data.items || [],
      total: Number(data.total),
      status: data.status,
      customerInfo: data.customer_info || {},
      paymentMethod: data.payment_method,
    };

    console.log("[POST orders] ✅ Order created:", orderId);

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("[POST orders] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}