// src/components/NewArrivals.tsx
"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useSiteData } from "@/context/SiteDataContext";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NewArrivals() {
  const { products } = useSiteData();
  const newProducts = products.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-brand-green text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
            Just Dropped
          </div>
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white">
            New Arrivals
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fresh gear added this week
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity w-fit"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {newProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image_url={product.image_url}
            rating={product.rating}
            reviews_count={product.reviews_count}
          />
        ))}
      </div>
    </section>
  );
}