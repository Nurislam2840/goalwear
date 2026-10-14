// src/components/WishlistSyncProvider.tsx
"use client";

import { useEffect } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useSiteData } from "@/context/SiteDataContext";

export default function WishlistSyncProvider({ children }: { children: React.ReactNode }) {
  const { syncWishlist } = useWishlist();
  const { products, isHydrated } = useSiteData();

  useEffect(() => {
    if (isHydrated && products.length > 0) {
      syncWishlist(products);
    }
  }, [isHydrated, products, syncWishlist]);

  return <>{children}</>;
}