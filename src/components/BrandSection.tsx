// src/components/BrandSection.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

export default function BrandSection() {
  const { brands } = useSiteData();

  if (brands.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center bg-brand-green text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Top Brands
          </div>
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white">
            Shop by Brand
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Official gear from world-class brands
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity w-fit"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/shop?brand=${brand.slug}`}
            className="group bg-white dark:bg-brand-card p-5 rounded-2xl border border-gray-100 dark:border-brand-border hover:border-brand-green dark:hover:border-brand-green transition-all duration-300 hover:shadow-lg text-center"
          >
            {/* 👇 Logo if available, else fallback to text */}
            <div className="w-full h-16 md:h-20 flex items-center justify-center mb-3">
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                    const parent = img.parentElement;
                    if (parent && !parent.querySelector("span")) {
                      const span = document.createElement("span");
                      span.className =
                        "text-xl md:text-2xl font-extrabold tracking-tight dark:text-white group-hover:text-brand-green transition-colors";
                      span.style.fontFamily = "Impact, system-ui, sans-serif";
                      span.textContent = brand.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              ) : (
                <span
                  className="text-xl md:text-2xl font-extrabold tracking-tight dark:text-white group-hover:text-brand-green transition-colors"
                  style={{ fontFamily: "Impact, system-ui, sans-serif" }}
                >
                  {brand.name}
                </span>
              )}
            </div>

            {/* Brand name shown below logo as small label */}
            <p className="text-[10px] font-bold dark:text-white uppercase tracking-wider line-clamp-1">
              {brand.name}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 italic line-clamp-1 mt-0.5">
              "{brand.tagline}"
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}