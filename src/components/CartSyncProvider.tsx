// src/components/CartSyncProvider.tsx
"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useSiteData } from "@/context/SiteDataContext";

export default function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const { syncPrices } = useCart();
  const { products, isHydrated } = useSiteData();

  // 👇 SiteData hydrate হলে cart-এর prices sync করব
  useEffect(() => {
    if (isHydrated && products.length > 0) {
      syncPrices(products);
    }
  }, [isHydrated, products, syncPrices]);

  return <>{children}</>;
}