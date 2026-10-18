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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col bg-white dark:bg-brand-card rounded-3xl overflow-hidden border border-gray-100 dark:border-brand-border hover:border-brand-green dark:hover:border-brand-green transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none"
          >
            {/* 👇 ইমেজ সেকশন (উপরে) */}
            <div className="relative w-full aspect-[4/3] bg-gray-50 dark:bg-brand-dark p-6 flex items-center justify-center overflow-hidden">
              {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-6 drop-shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              ) : (
                <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center">
                  <span className="text-brand-green font-bold text-2xl">{cat.name.charAt(0)}</span>
                </div>
              )}
              
              {/* ক্যাটাগরি ব্যাজ */}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md text-black dark:text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-gray-100 dark:border-gray-700 shadow-sm z-10">
                Category
              </div>
            </div>

            {/* 👇 টেক্সট সেকশন (নিচে) */}
            <div className="p-6 flex flex-col flex-1 border-t border-gray-100 dark:border-brand-border/50">
              <h3 className="text-xl md:text-2xl font-bold dark:text-white group-hover:text-brand-green transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 flex-1">
                {cat.desc}
              </p>
              
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Explore</span>
                <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}