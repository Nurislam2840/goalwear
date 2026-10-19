// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, setAdminSessionCookie } from "@/lib/admin-session";
import crypto from "crypto";

// Rate limiting
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

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

// 👇 Timing-safe comparison helper
const hash = (s: string) => crypto.createHash("sha256").update(s).digest();

export async function POST(req: NextRequest) {
  try {
    // 👇 Vercel-এর trusted IP হেডার ব্যবহার (x-forwarded-for জাল করা যায়)
    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 👇 Timing-safe তুলনা (এটি Brute-force টাইমিং অ্যাটাক ঠেকায়)
    const emailMatch = crypto.timingSafeEqual(hash(email.trim().toLowerCase()), hash(ADMIN_EMAIL.trim().toLowerCase()));
    const passwordMatch = crypto.timingSafeEqual(hash(password), hash(ADMIN_PASSWORD));

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 👇 Debug log সম্পূর্ণ মুছে ফেলা হয়েছে

    // Success — create session
    const token = createSessionToken();
    await setAdminSessionCookie(token);

    loginAttempts.delete(ip);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}