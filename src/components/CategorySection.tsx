// src/components/CategorySection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

export default function CategorySection() {
  const { categories } = useSiteData();

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white">
            Shop by Category
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Find exactly what you need
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-brand-card dark:to-brand-dark rounded-3xl overflow-hidden p-6 md:p-8 h-56 md:h-64 flex items-center justify-between card-hover"
          >
            <div className="z-10">
              <div className="inline-flex items-center bg-brand-green text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Category
              </div>
              <h3 className="text-2xl md:text-3xl font-bold dark:text-white">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {cat.desc}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full group-hover:scale-105 transition-transform">
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-40 h-40 md:w-56 md:h-56 opacity-90">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 160px, 224px"
                loading="eager"
                className="object-cover rounded-tl-full mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}