// src/app/api/admin/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated } from "@/lib/admin-session";

// Whitelist of allowed tables
const ALLOWED_TABLES = [
  "products",
  "hero_slides",
  "offers",
  "features",
  "categories",
  "brands",
  "teams",
  "testimonials",
  "instagram_images",
  "coupons",
  "site_config",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

export async function POST(req: NextRequest) {
  try {
    // 🔒 Verify admin
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { table, data } = body as { table: string; data: any };

    // Validate table name
    if (!table || !ALLOWED_TABLES.includes(table as AllowedTable)) {
      return NextResponse.json(
        { error: `Invalid table: ${table}` },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Data required" }, { status: 400 });
    }

    // Special case: site_config (single row)
    if (table === "site_config") {
      const { error } = await supabaseAdmin
        .from("site_config")
        .upsert(
          { id: 1, config: data.config, updated_at: new Date().toISOString() },
          { onConflict: "id" }
        );

      if (error) {
        console.error("[save site_config]", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // Special case: instagram_images (delete + insert, no stable id)
    if (table === "instagram_images") {
      // Delete all first
      const { error: delError } = await supabaseAdmin
        .from(table)
        .delete()
        .neq("id", 0);

      if (delError) {
        console.error("[delete instagram_images]", delError.message);
      }

      // Then insert new
      if (Array.isArray(data) && data.length > 0) {
        const { error } = await supabaseAdmin.from(table).insert(data);

        if (error) {
          console.error("[save instagram_images]", error.message);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }

      return NextResponse.json({ success: true });
    }

    // Default: upsert array of rows
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Data must be an array for this table" },
        { status: 400 }
      );
    }

    if (data.length === 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabaseAdmin
      .from(table)
      .upsert(data, { onConflict: "id" });

    if (error) {
      console.error(`[save ${table}]`, error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // For products/categories/brands/etc — also handle deletions?
    // Delete rows whose ids are NOT in the new array
    if (
      ["products", "categories", "brands", "teams", "testimonials", "coupons", "features", "offers", "hero_slides"].includes(
        table
      )
    ) {
      const ids = data.map((r: any) => r.id).filter((id) => id != null);

      if (ids.length > 0) {
        const { error: delError } = await supabaseAdmin
          .from(table)
          .delete()
          .not("id", "in", `(${ids.join(",")})`);

        if (delError) {
          console.warn(`[cleanup ${table}]`, delError.message);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[save route]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}