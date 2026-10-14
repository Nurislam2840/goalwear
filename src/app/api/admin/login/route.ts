// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, setAdminSessionCookie } from "@/lib/admin-session";

// Rate limiting
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) return false;

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("[Admin Login] Env vars missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Simple string comparison
    const emailMatches =
      email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
    const passwordMatches = password === ADMIN_PASSWORD;

    // Debug log
    console.log("=== LOGIN DEBUG ===");
    console.log("Email match:", emailMatches);
    console.log("Password length input:", password.length);
    console.log("Password length expected:", ADMIN_PASSWORD.length);
    console.log("Password match:", passwordMatches);
    console.log("===================");

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Success — create session
    const token = createSessionToken();
    await setAdminSessionCookie(token);

    loginAttempts.delete(ip);

    console.log("✅ LOGIN SUCCESS for", email);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Admin Login] Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}