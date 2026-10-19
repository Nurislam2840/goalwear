// src/lib/coupon.ts
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function calculateDiscount(code: string, subtotal: number) {
  if (!code) return { discount: 0, couponCode: "", type: "" };

  const { data: coupon } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .maybeSingle();

  if (!coupon) return { discount: 0, couponCode: "", type: "" };

  const notExpired = !coupon.expires_at || new Date(coupon.expires_at) > new Date();
  if (!notExpired) return { discount: 0, couponCode: "", type: "" };

  let discountAmount = 0;

  if (coupon.type === "percent") {
    discountAmount = (subtotal * Number(coupon.value)) / 100;
    discountAmount = Math.round(discountAmount * 100) / 100;
  } else if (coupon.type === "fixed") {
    discountAmount = Math.min(Number(coupon.value), subtotal);
  }

  return {
    discount: discountAmount,
    couponCode: coupon.code,
    type: coupon.type,
  };
}