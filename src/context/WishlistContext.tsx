// src/context/WishlistContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  rating?: number;
  reviews_count?: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  syncWishlist: (products: any[]) => void;
  wishlistCount: number;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      const saved = localStorage.getItem("goalwear-wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setWishlist(parsed);
      }
    } catch (err) {
      console.error("Failed to parse wishlist", err);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("goalwear-wishlist", JSON.stringify(wishlist));
  }, [wishlist, isHydrated]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleWishlist = (item: WishlistItem) => {
    if (wishlist.some((i) => i.id === item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const isInWishlist = (id: number) => wishlist.some((i) => i.id === id);

  // 👇 Sync wishlist prices with latest products
  const syncWishlist = (products: any[]) => {
    setWishlist((prev) => {
      let changed = false;
      const updated = prev
        .map((item) => {
          const latest = products.find((p) => p.id === item.id);
          if (!latest) {
            changed = true;
            return null; // Product deleted
          }
          if (
            latest.price !== item.price ||
            latest.name !== item.name ||
            latest.image_url !== item.image_url
          ) {
            changed = true;
            return {
              ...item,
              price: latest.price,
              name: latest.name,
              image_url: latest.image_url,
              rating: latest.rating,
              reviews_count: latest.reviews_count,
            };
          }
          return item;
        })
        .filter(Boolean) as WishlistItem[];

      return changed ? updated : prev;
    });
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        syncWishlist,
        wishlistCount,
        isHydrated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}