// src/app/api/admin/session/route.ts
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";

export async function GET() {
  try {
    const isAdmin = await isAdminAuthenticated();
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("[Admin Session] Error:", error);
    return NextResponse.json({ isAdmin: false });
  }
}