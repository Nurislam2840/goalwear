// src/app/admin/coupons/page.tsx
"use client";

import CouponManager from "@/components/admin/CouponManager";

export default function AdminCouponsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <CouponManager />
    </div>
  );
}