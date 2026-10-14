// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-session";

export async function POST() {
  try {
    await clearAdminSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Logout] Error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}