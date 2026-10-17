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

export interface Coupon {
  code: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
  description: string;
}

// 👇 এখানে কুপন যোগ/এডিট করবেন
export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "GOAL10",
    type: "percent",
    value: 10,
    description: "10% off your order",
  },
  {
    code: "WELCOME20",
    type: "percent",
    value: 20,
    description: "20% off for new customers",
  },
  {
    code: "FLAT15",
    type: "fixed",
    value: 15,
    description: "$15 off your order",
  },
  {
    code: "FREESHIP",
    type: "shipping",
    value: 0,
    description: "Free shipping",
  },
];

interface CouponContextType {
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; error?: string };
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;
  isHydrated: boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      const saved = localStorage.getItem("goalwear-coupon");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.code) setAppliedCoupon(parsed);
      }
    } catch (err) {
      console.error("Failed to parse coupon", err);
    }
    setIsHydrated(true);
  }, []);

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
    const found = AVAILABLE_COUPONS.find((c) => c.code === trimmed);

    if (!found) {
      return { success: false, error: "Invalid coupon code" };
    }

    setAppliedCoupon(found);
    return { success: true };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // 👇 Fixed: Math.round — standard rounding (10% of $99.99 = $10.00)
  const calculateDiscount = (subtotal: number): number => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === "percent") {
      const rawDiscount = (subtotal * appliedCoupon.value) / 100;
      return Math.round(rawDiscount * 100) / 100;
    }
    if (appliedCoupon.type === "fixed") {
      return Math.min(appliedCoupon.value, subtotal);
    }
    return 0; // shipping discount handled separately
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
  const context = useContext(CouponContext);
  if (!context) throw new Error("useCoupon must be used within CouponProvider");
  return context;
}