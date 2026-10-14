// src/context/RecentlyViewedContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

export interface ViewedProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
  rating: number;
  reviews_count: number;
  viewedAt: number;
}

interface RecentlyViewedContextType {
  recentlyViewed: ViewedProduct[];
  addToRecentlyViewed: (product: Omit<ViewedProduct, "viewedAt">) => void;
  clearRecentlyViewed: () => void;
  isHydrated: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_ITEMS = 8; // সর্বোচ্চ ৮টি প্রোডাক্ট রাখব

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<ViewedProduct[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasLoadedRef = useRef(false);

  // localStorage থেকে লোড
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      const saved = localStorage.getItem("goalwear-recently-viewed");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentlyViewed(parsed);
      }
    } catch (err) {
      console.error("Failed to parse recently viewed", err);
    }
    setIsHydrated(true);
  }, []);

  // localStorage-এ সেভ
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("goalwear-recently-viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed, isHydrated]);

  const addToRecentlyViewed = (product: Omit<ViewedProduct, "viewedAt">) => {
    setRecentlyViewed((prev) => {
      // আগেরটা বাদ দিয়ে নতুনটা সামনে যোগ করব
      const filtered = prev.filter((p) => p.id !== product.id);
      const newItem: ViewedProduct = { ...product, viewedAt: Date.now() };
      return [newItem, ...filtered].slice(0, MAX_ITEMS);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem("goalwear-recently-viewed");
  };

  return (
    <RecentlyViewedContext.Provider
      value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed, isHydrated }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return context;
}