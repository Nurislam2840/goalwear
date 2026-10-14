// src/app/category/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useSiteData } from "@/context/SiteDataContext";
import ProductListingLayout from "@/components/ProductListingLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, PackageSearch } from "lucide-react";
import Link from "next/link";

export default function DynamicCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { categories, products, isHydrated } = useSiteData();

  // Find the category by slug
  const category = categories.find((c) => c.slug === slug);

  // Loading state
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Category not found
  if (!category) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageSearch className="w-10 h-10 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white mb-3">
            Category Not Found
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            The category "<span className="font-bold">{slug}</span>" doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-brand-green text-black font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-brand-card text-gray-900 dark:text-white font-bold px-6 py-3 rounded-full hover:bg-gray-200 dark:hover:bg-brand-border transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Filter products matching this category
  // Match either category name OR subCategory
  const categoryProducts = products.filter(
    (p) =>
      p.category.toLowerCase() === category.name.toLowerCase() ||
      p.subCategory?.toLowerCase() === category.name.toLowerCase() ||
      p.type?.toLowerCase() === category.name.toLowerCase()
  );

  return (
    <ProductListingLayout
      title={category.name}
      subtitle={category.desc || `Browse all ${category.name}`}
      products={categoryProducts}
      breadcrumb={category.name}
    />
  );
}