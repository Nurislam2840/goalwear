// src/context/CouponContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useSiteData, CouponData } from "./SiteDataContext";

interface CouponContextType {
  appliedCoupon: CouponData | null;
  applyCoupon: (code: string) => { success: boolean; error?: string };
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;
  isHydrated: boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
  const { coupons } = useSiteData();
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      const saved = localStorage.getItem("goalwear-coupon");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.code) {
          const stillValid = coupons.find(
            (c) =>
              c.code === parsed.code &&
              c.value === parsed.value &&
              c.isActive
          );
          if (stillValid) {
            setAppliedCoupon(stillValid);
          } else {
            localStorage.removeItem("goalwear-coupon");
          }
        }
      }
    } catch (err) {
      console.error("Failed to parse coupon", err);
    }
    setIsHydrated(true);
  }, [coupons]);

  useEffect(() => {
    if (!isHydrated) return;
    if (appliedCoupon) {
      localStorage.setItem("goalwear-coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("goalwear-coupon");
    }
  }, [appliedCoupon, isHydrated]);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed);

    if (!found) {
      return { success: false, error: "Invalid coupon code" };
    }
    if (!found.isActive) {
      return { success: false, error: "This coupon is not active" };
    }
    if (found.expiresAt && new Date(found.expiresAt) < new Date()) {
      return { success: false, error: "This coupon has expired" };
    }

    setAppliedCoupon(found);
    return { success: true };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const calculateDiscount = (subtotal: number): number => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) {
      return 0;
    }

    if (appliedCoupon.type === "percent") {
      let raw = (subtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount) {
        raw = Math.min(raw, appliedCoupon.maxDiscount);
      }
      return Math.round(raw * 100) / 100;
    }
    if (appliedCoupon.type === "fixed") {
      return Math.min(appliedCoupon.value, subtotal);
    }
    return 0;
  };

  return (
    <CouponContext.Provider
      value={{
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
        isHydrated,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error("useCoupon must be used within CouponProvider");
  return ctx;
}