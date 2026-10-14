// src/components/Testimonials.tsx
"use client";

import { Star, Quote } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

export default function Testimonials() {
  const { testimonials } = useSiteData();

  if (testimonials.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center bg-brand-green text-black text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-3">
          Customer Love
        </div>
        <h2 className="text-2xl md:text-3xl font-bold dark:text-white">
          What Our Customers Say
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Trusted by 10,000+ football fans worldwide
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="relative bg-gray-50 dark:bg-brand-card p-6 rounded-2xl border border-gray-100 dark:border-brand-border card-hover"
          >
            <Quote className="absolute top-5 right-5 w-8 h-8 text-brand-green/20" />

            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < t.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
              "{t.text}"
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-brand-border">
              <div className="w-11 h-11 rounded-full bg-brand-green flex items-center justify-center text-black font-bold text-sm">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-bold dark:text-white">{t.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}