// src/components/FeaturesBar.tsx
"use client";

import { Truck, ShieldCheck, Award, Headphones, Package, Star, Heart, Zap } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const ICON_MAP: Record<string, any> = {
  Truck, ShieldCheck, Award, Headphones, Package, Star, Heart, Zap,
};

export default function FeaturesBar() {
  const { features } = useSiteData();

  if (features.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature) => {
          const Icon = ICON_MAP[feature.icon] || Truck;
          return (
            <div
              key={feature.id}
              className="group p-5 rounded-2xl border border-gray-100 dark:border-brand-border bg-white dark:bg-brand-card hover:border-brand-green dark:hover:border-brand-green transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-sm dark:text-white">{feature.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}