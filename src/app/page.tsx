// src/app/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import FeaturesBar from "@/components/FeaturesBar";
import CategorySection from "@/components/CategorySection";
import BrandSection from "@/components/BrandSection";
import NewArrivals from "@/components/NewArrivals";
import OfferBanner from "@/components/OfferBanner";
import PopularTeams from "@/components/PopularTeams";
import Testimonials from "@/components/Testimonials";
import InstagramGallery from "@/components/InstagramGallery";
import Newsletter from "@/components/Newsletter";
import ProductCard from "@/components/ProductCard";
import RecentlyViewed from "@/components/RecentlyViewed";
import Footer from "@/components/Footer";
import { useSiteData } from "@/context/SiteDataContext";
import { useState, useMemo } from "react";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { products, coupons } = useSiteData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Country Jerseys", "Club Jerseys", "Boots"];

  const featuredCoupon = useMemo(() => {
    return coupons.find((c) => c.type === "percent") || coupons[0];
  }, [coupons]);

  const displayedProducts = useMemo(() => {
    let filtered = products;

    if (selectedFilter === "Country Jerseys") {
      filtered = products.filter((p) => p.subCategory === "Country");
    } else if (selectedFilter === "Club Jerseys") {
      filtered = products.filter((p) => p.subCategory === "Club");
    } else if (selectedFilter === "Boots") {
      filtered = products.filter((p) => p.subCategory === "Boot");
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.slice(0, 8);
  }, [products, selectedFilter, searchQuery]);

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark">
      <Navbar />
      <HeroSlider />
      <FeaturesBar />
      <CategorySection />
      <BrandSection />
      <NewArrivals />

      <OfferBanner />

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white">
              Popular Products
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Best sellers from our collection
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity w-fit"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
          <div className="flex items-center bg-gray-100 dark:bg-brand-card rounded-full px-4 py-3 w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 w-full text-sm dark:text-white placeholder-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedFilter === filter
                    ? "bg-brand-green text-black"
                    : "bg-gray-100 dark:bg-brand-card text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
            <p className="text-gray-500 dark:text-gray-400">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayedProducts.map((product) => (
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
        )}
      </section>

      <RecentlyViewed />
      <PopularTeams />
      <Testimonials />

      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="relative bg-gradient-to-r from-gray-900 to-black dark:from-brand-card dark:to-brand-dark rounded-3xl overflow-hidden p-8 md:p-12 text-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Ready to Level Up Your Game?
            </h2>
            {featuredCoupon ? (
              <p className="text-gray-400 text-sm md:text-base mb-6 max-w-xl mx-auto">
                {featuredCoupon.type === "percent"
                  ? `Get ${featuredCoupon.value}% off your first order. Use code`
                  : featuredCoupon.type === "fixed"
                  ? `Get $${featuredCoupon.value} off your first order. Use code`
                  : "Get free shipping on your first order. Use code"}{" "}
                <span className="bg-brand-green text-black font-bold px-2 py-0.5 rounded">
                  {featuredCoupon.code}
                </span>{" "}
                at checkout.
              </p>
            ) : (
              <p className="text-gray-400 text-sm md:text-base mb-6 max-w-xl mx-auto">
                Shop our premium collection now and level up your game.
              </p>
            )}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-8 py-3.5 rounded-full hover:scale-105 transition-transform"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <InstagramGallery />
      <Newsletter />
      <Footer />
    </main>
  );
}