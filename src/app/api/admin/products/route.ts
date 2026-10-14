// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated } from "@/lib/admin-session";

// ============ GET — List all products ============
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("[GET products]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ============ POST — Create or Update (upsert) ============
export async function POST(req: NextRequest) {
  try {
    // ⚠️ Verify admin
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { product } = body;

    if (!product || !product.id) {
      return NextResponse.json(
        { error: "Product with id required" },
        { status: 400 }
      );
    }

    // Convert camelCase → snake_case for DB
    const dbProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      sub_category: product.subCategory,
      brand: product.brand,
      team: product.team,
      type: product.type,
      price: product.price,
      image_url: product.image_url,
      images: product.images || [],
      rating: product.rating || 0,
      reviews_count: product.reviews_count || 0,
      description: product.description,
      sizes: product.sizes || [],
      reviews: product.reviews || [],
      stock: product.stock || 0,
      colors: product.colors || [],
    };

    const { error } = await supabaseAdmin
      .from("products")
      .upsert(dbProduct, { onConflict: "id" });

    if (error) {
      console.error("[POST products]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ============ DELETE — Remove a product ============
export async function DELETE(req: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", Number(id));

    if (error) {
      console.error("[DELETE products]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}