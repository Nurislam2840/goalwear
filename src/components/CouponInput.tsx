// src/components/CouponInput.tsx
"use client";

import { useState } from "react";
import { Tag, X, CheckCircle2 } from "lucide-react";
import { useCoupon } from "@/context/CouponContext";
import { useToast } from "@/context/ToastContext";

export default function CouponInput() {
  const [code, setCode] = useState("");
  const { appliedCoupon, applyCoupon, removeCoupon } = useCoupon();
  const { showToast } = useToast();

  const handleApply = () => {
    if (!code.trim()) return;

    const result = applyCoupon(code);
    if (result.success) {
      showToast("Coupon applied successfully!", "success");
      setCode("");
    } else {
      showToast(result.error || "Invalid coupon", "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between gap-3 p-3 bg-brand-green rounded-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-black">{appliedCoupon.code}</p>
            <p className="text-[10px] text-black/70 line-clamp-1">
              {appliedCoupon.description}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            removeCoupon();
            showToast("Coupon removed", "success");
          }}
          className="w-7 h-7 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-black" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 flex items-center bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl px-3 py-2.5">
        <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="Enter coupon code"
          className="bg-transparent border-none outline-none ml-2 w-full text-sm dark:text-white placeholder-gray-500 uppercase"
        />
      </div>
      <button
        type="button"
        onClick={handleApply}
        className="bg-brand-green text-black text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Apply
      </button>
    </div>
  );
}