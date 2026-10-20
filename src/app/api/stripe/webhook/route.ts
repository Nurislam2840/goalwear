// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    console.error("[Webhook] ❌ No signature provided");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Raw body নেওয়া বাধ্যতামূলক
  const raw = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log(`[Webhook] ✅ Signature verified. Event: ${event.type}`);
  } catch (err: any) {
    console.error(`[Webhook] ❌ Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`[Webhook] 🛒 Processing checkout session: ${session.id}`);
    
    if (session.payment_status !== "paid") {
      console.log(`[Webhook] ⚠️ Payment not paid. Status: ${session.payment_status}`);
      return NextResponse.json({ received: true });
    }

    // Idempotency চেক
    const { data: existing } = await supabaseAdmin
      .from("orders").select("id").eq("stripe_session_id", session.id).maybeSingle();
    
    if (existing) {
      console.log(`[Webhook] ℹ️ Order already exists for session: ${session.id}`);
      return NextResponse.json({ received: true });
    }

    try {
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

      console.log(`[Webhook] 📦 Items found: ${items.length}`);

      // স্টক কমানো
      for (const it of items) {
        await supabaseAdmin.rpc("decrement_stock", { p_id: it.id, p_qty: it.quantity });
      }
      console.log(`[Webhook] ✅ Stock reduced`);

      // অর্ডার তৈরি
      const { error: insertError } = await supabaseAdmin.from("orders").insert({
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

      if (insertError) {
        console.error(`[Webhook] ❌ Failed to insert order: ${insertError.message}`);
        throw insertError;
      }
      
      console.log(`[Webhook] 🎉 Order created successfully for session: ${session.id}`);
    } catch (err: any) {
      console.error(`[Webhook] ❌ Error processing session: ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}