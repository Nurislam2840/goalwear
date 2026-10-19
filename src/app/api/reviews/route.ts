// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, user_name, rating, comment, image_url } = body;

    if (!product_id || !user_name || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    if (user_name.length > 50 || comment.length > 1000) {
      return NextResponse.json({ error: "Name or comment too long" }, { status: 400 });
    }

    // Insert as unapproved
    const { error } = await supabaseAdmin.from("reviews").insert({
      product_id,
      user_name,
      rating,
      comment,
      image_url: image_url || null,
      approved: false,
    });

    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}