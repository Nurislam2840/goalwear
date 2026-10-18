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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative w-full h-[280px] md:h-[350px] rounded-3xl overflow-hidden flex flex-col justify-end p-6 md:p-8 border border-gray-100 dark:border-brand-border shadow-sm hover:shadow-2xl transition-all duration-500"
          >
            {/* Background Image */}
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out z-0"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 dark:bg-brand-dark z-0"></div>
            )}

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Green Hover Glow */}
            <div className="absolute inset-0 bg-brand-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>

            {/* Content */}
            <div className="relative z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <div className="inline-flex items-center bg-brand-green text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-lg shadow-brand-green/30">
                Category
              </div>
              
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
                {cat.name}
              </h3>
              
              <p className="text-sm text-gray-300 mb-5 line-clamp-2 max-w-[80%]">
                {cat.desc}
              </p>

              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-full group-hover:bg-brand-green group-hover:text-black group-hover:border-brand-green transition-all duration-300 shadow-lg">
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}