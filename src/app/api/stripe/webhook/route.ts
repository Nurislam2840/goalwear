// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") return NextResponse.json({ received: true });

    // Idempotency: একই session দুবার এলেও একবারই অর্ডার হবে
    const { data: existing } = await supabaseAdmin
      .from("orders").select("id").eq("stripe_session_id", session.id).maybeSingle();
    
    if (existing) return NextResponse.json({ received: true });

    const lines = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const items = lines.data.map((li) => {
      const product = li.price?.product as Stripe.Product;
      return {
        id: Number(product.metadata?.product_id),
        name: li.description,
        price: (li.amount_total ?? 0) / 100 / (li.quantity || 1),
        quantity: li.quantity || 1,
        image_url: product.images?.[0] || "",
      };
    });

    // Stock কমানো (RPC)
    for (const it of items) {
      await supabaseAdmin.rpc("decrement_stock", { p_id: it.id, p_qty: it.quantity });
    }

    // অর্ডার তৈরি
    await supabaseAdmin.from("orders").insert({
      id: `GW-${crypto.randomBytes(5).toString("hex").toUpperCase()}`,
      user_id: session.metadata?.userId || null,
      items,
      total: (session.amount_total ?? 0) / 100,
      status: "Processing",
      customer_info: {
        name: session.metadata?.customerName || "",
        email: session.customer_email || "",
        phone: session.metadata?.customerPhone || "",
        address: session.metadata?.customerAddress || "",
        city: session.metadata?.customerCity || "",
      },
      payment_method: "Card (Stripe)",
      stripe_session_id: session.id,
    });
  }

  return NextResponse.json({ received: true });
}