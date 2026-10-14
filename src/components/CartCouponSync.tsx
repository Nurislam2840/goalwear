// src/components/CartCouponSync.tsx
"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useCoupon } from "@/context/CouponContext";

/**
 * কার্ট খালি হলে অটোমেটিক coupon clear করে।
 * ফলে নতুন প্রোডাক্ট Add করলে আগের coupon auto-apply হবে না।
 */
export default function CartCouponSync({ children }: { children: React.ReactNode }) {
  const { cart, isHydrated: cartHydrated } = useCart();
  const { appliedCoupon, removeCoupon, isHydrated: couponHydrated } = useCoupon();
  const hasClearedRef = useRef(false);

  useEffect(() => {
    if (!cartHydrated || !couponHydrated) return;

    // 👇 কার্ট খালি হলে applied coupon clear করব (শুধু একবার)
    if (cart.length === 0 && appliedCoupon && !hasClearedRef.current) {
      hasClearedRef.current = true;
      removeCoupon();
    }

    // 👇 কার্টে প্রোডাক্ট যোগ হলে flag reset করব
    // যাতে আবার কার্ট খালি হলে coupon clear হয়
    if (cart.length > 0) {
      hasClearedRef.current = false;
    }
  }, [cart.length, cartHydrated, couponHydrated, appliedCoupon, removeCoupon]);

  return <>{children}</>;
}