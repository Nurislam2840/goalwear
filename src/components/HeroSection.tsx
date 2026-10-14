// src/components/HeroSection.tsx
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">
      <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-brand-card dark:via-brand-dark dark:to-brand-card rounded-3xl overflow-hidden border border-gray-100 dark:border-brand-border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16">
          <div className="z-10 md:w-1/2 text-center md:text-left">
            {/* New Season badge */}
            <div className="inline-flex items-center gap-1.5 bg-brand-green text-black text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-5">
              <Sparkles className="w-3 h-3" strokeWidth={2.5} />
              New Season 24/25
            </div>

            {/* Title with gradient */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.05] tracking-tight">
              Play <br />
              <span className="text-gradient">Your Way</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-5 mb-8 text-sm md:text-base max-w-md">
              Top jerseys & football shoes for every player. Premium quality
              gear delivered to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <Link
                href="/shop"
                className="bg-brand-green text-black font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-brand-green/30"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="border-2 border-gray-200 dark:border-brand-border text-gray-900 dark:text-white font-bold px-7 py-3.5 rounded-full hover:border-brand-green transition-colors"
              >
                Explore More
              </Link>
            </div>

            <div className="flex items-center gap-6 md:gap-8 mt-8 justify-center md:justify-start">
              <div>
                <p className="text-2xl font-bold dark:text-white">500+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Products
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-brand-border"></div>
              <div>
                <p className="text-2xl font-bold dark:text-white">10K+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Customers
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-brand-border"></div>
              <div>
                <p className="text-2xl font-bold dark:text-white">4.9★</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rating
                </p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-brand-green/20 rounded-full blur-2xl"></div>
              <Image
                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop"
                alt="Football Player"
                fill
                sizes="(max-width: 768px) 288px, 384px"
                className="object-cover rounded-3xl shadow-2xl"
                priority
              />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Free Shipping
                </p>
                <p className="text-sm font-bold dark:text-white">
                  Worldwide 🌍
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}