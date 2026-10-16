// src/lib/admin-session.ts
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "goalwear-admin-session";
const SESSION_DURATION = 60 * 60; // 1 hour in seconds

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set and at least 32 chars");
  }
  return secret;
}

/**
 * Create a new session token (stateless, HMAC-signed)
 */
export function createSessionToken(): string {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + SESSION_DURATION * 1000;
  const data = `${randomBytes}.${expiry}`;

  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("hex");

  return `${data}.${signature}`;
}

/**
 * Verify a session token (stateless — works across serverless instances)
 */
export function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [randomBytes, expiryStr, signature] = parts;
    const expiry = Number(expiryStr);

    if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

    const data = `${randomBytes}.${expiryStr}`;
    const expectedSignature = crypto
      .createHmac("sha256", getSecret())
      .update(data)
      .digest("hex");

    // timing-safe compare
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");

    if (sigBuf.length !== expBuf.length) return false;

    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

/**
 * Set admin session cookie
 */
export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

/**
 * Get admin session token from cookie
 */
export async function getAdminSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Check if the request is from an authenticated admin
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const token = await getAdminSessionToken();
  if (!token) return false;
  return verifySessionToken(token);
}