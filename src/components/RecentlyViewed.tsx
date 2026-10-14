// src/components/RecentlyViewed.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Trash2 } from "lucide-react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useToast } from "@/context/ToastContext";

interface RecentlyViewedProps {
  currentProductId?: number; // প্রোডাক্ট পেজে বর্তমান প্রোডাক্ট বাদ দিতে
  maxItems?: number;
}

export default function RecentlyViewed({ currentProductId, maxItems = 6 }: RecentlyViewedProps) {
  const { recentlyViewed, clearRecentlyViewed, isHydrated } = useRecentlyViewed();
  const { showToast } = useToast();

  // Hydration না হলে কিছু দেখাব না
  if (!isHydrated) return null;

  // বর্তমান প্রোডাক্ট বাদ দিলাম
  let items = recentlyViewed;
  if (currentProductId) {
    items = items.filter((p) => p.id !== currentProductId);
  }
  items = items.slice(0, maxItems);

  // কমপক্ষে ২টি আইটেম না থাকলে সেকশন দেখাব না
  if (items.length < 2) return null;

  const handleClear = () => {
    clearRecentlyViewed();
    showToast("Recently viewed cleared", "success");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-brand-green text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Clock className="w-3 h-3" strokeWidth={2.5} />
            History
          </div>
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white">
            Recently Viewed
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pick up where you left off
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-brand-card text-gray-600 dark:text-gray-300 text-xs font-bold px-3 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group bg-white dark:bg-brand-card rounded-2xl p-3 border border-gray-100 dark:border-brand-border hover:border-brand-green dark:hover:border-brand-green hover:shadow-lg transition-all duration-300"
          >
            <div className="relative bg-gray-50 dark:bg-brand-dark rounded-xl p-3 h-28 flex items-center justify-center overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.name}
                width={120}
                height={120}
                className="h-full w-auto object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-2.5">
              <h3 className="text-xs font-semibold dark:text-white line-clamp-2 leading-tight min-h-[2rem]">
                {product.name}
              </h3>
              <p className="text-sm font-bold dark:text-white mt-1.5">
                ${product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}