// src/components/PopularTeams.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

export default function PopularTeams() {
  const { teams } = useSiteData();

  if (teams.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Popular Teams</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Support your favorite club
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/shop?team=${team.name.toLowerCase().replace(/\s+/g, "-")}`}
            className={`group p-6 rounded-2xl bg-gradient-to-br ${team.bgColor} border border-gray-100 dark:border-brand-border hover:border-brand-green transition-all duration-300 text-center`}
          >
            <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={team.logo}
                alt={`${team.name} logo`}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/80?text=T";
                }}
              />
            </div>

            <h3 className="font-bold text-sm dark:text-white">{team.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}