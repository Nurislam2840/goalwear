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

// Tables that support id-based upsert + cleanup
const UPSERT_TABLES: AllowedTable[] = [
  "products",
  "hero_slides",
  "offers",
  "features",
  "categories",
  "brands",
  "teams",
  "testimonials",
  "coupons",
];

const DELETE_BATCH_SIZE = 200;

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

    if (data === undefined || data === null) {
      return NextResponse.json({ error: "Data required" }, { status: 400 });
    }

    // ---------- Special case: site_config (single row) ----------
    if (table === "site_config") {
      const { error } = await supabaseAdmin.from("site_config").upsert(
        {
          id: 1,
          config: data.config,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("[save site_config]", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // ---------- Special case: instagram_images (delete + insert) ----------
    if (table === "instagram_images") {
      // Delete all first
      const { error: delError } = await supabaseAdmin
        .from(table)
        .delete()
        .gte("id", 0);

      if (delError) {
        console.warn("[delete instagram_images]", delError.message);
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

    // ---------- Default: upsert array of rows ----------
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Data must be an array for this table" },
        { status: 400 }
      );
    }

    // Empty array = delete everything from this table
    if (data.length === 0) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .gte("id", 0);

      if (error) {
        console.error(`[save ${table}] empty-delete`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // Upsert all rows in one shot
    const { error: upsertError } = await supabaseAdmin
      .from(table)
      .upsert(data, { onConflict: "id" });

    if (upsertError) {
      console.error(`[save ${table}]`, upsertError.message);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    // Cleanup — delete rows whose id is NOT in the new set
    if (UPSERT_TABLES.includes(table as AllowedTable)) {
      const ids = data
        .map((r: any) => r.id)
        .filter((id: any) => id != null);

      if (ids.length > 0) {
        // Batch delete to avoid URL limits
        const existingRes = await supabaseAdmin
          .from(table)
          .select("id");

        if (!existingRes.error && existingRes.data) {
          const existingIds = existingRes.data.map((r: any) => r.id);
          const keep = new Set(ids);
          const toDelete = existingIds.filter((id: any) => !keep.has(id));

          for (let i = 0; i < toDelete.length; i += DELETE_BATCH_SIZE) {
            const chunk = toDelete.slice(i, i + DELETE_BATCH_SIZE);
            const { error: delErr } = await supabaseAdmin
              .from(table)
              .delete()
              .in("id", chunk);

            if (delErr) {
              console.warn(`[cleanup ${table}]`, delErr.message);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[save route]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}