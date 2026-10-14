// src/components/ProductListingLayout.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import AdvancedFilters, { FilterState, DEFAULT_FILTERS } from "@/components/AdvancedFilters";
import { Product } from "@/data/products";
import { SlidersHorizontal, X, Search, Filter } from "lucide-react";

interface ProductListingLayoutProps {
  title: string;
  subtitle: string;
  products: Product[];
  breadcrumb: string;
}

export default function ProductListingLayout({
  title,
  subtitle,
  products,
  breadcrumb,
}: ProductListingLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [breadcrumb]);

  // 👇 Available options from products
  const availableBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const availableCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const availableSubCategories = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.subCategory).filter(Boolean))
      ).sort(),
    [products]
  );

  // 👇 Filter products
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchText = [
          p.name,
          p.brand,
          p.team,
          p.category,
          p.subCategory,
          p.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!searchText.includes(q)) return false;
      }

      // Price
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;

      // Categories
      if (filters.categories.length > 0 && !filters.categories.includes(p.category))
        return false;

      // Sub Categories
      if (
        filters.subCategories.length > 0 &&
        !filters.subCategories.includes(p.subCategory)
      )
        return false;

      // Brands
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand))
        return false;

      return true;
    });

    // Sort
    if (filters.sortBy === "price-asc")
      result = [...result].sort((a, b) => a.price - b.price);
    if (filters.sortBy === "price-desc")
      result = [...result].sort((a, b) => b.price - a.price);
    if (filters.sortBy === "rating")
      result = [...result].sort((a, b) => b.rating - a.rating);
    if (filters.sortBy === "newest")
      result = [...result].sort((a, b) => b.id - a.id);

    return result;
  }, [products, searchQuery, filters]);

  // 👇 Active filter count
  const activeFilterCount =
    filters.brands.length +
    filters.categories.length +
    filters.subCategories.length +
    (filters.minPrice > 0 || filters.maxPrice < 1000 ? 1 : 0);

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Home / <span className="bg-brand-green text-black font-bold px-2 py-0.5 rounded-full">{breadcrumb}</span>
        </p>
        <h1 className="text-3xl md:text-4xl font-bold dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{subtitle}</p>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-brand-border">
          
          {/* Search */}
          <div className="flex items-center bg-gray-100 dark:bg-brand-card rounded-full px-4 py-2.5 w-full md:w-80">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 w-full text-sm dark:text-white placeholder-gray-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Result Count */}
          <p className="text-sm text-gray-500 dark:text-gray-400 md:ml-4">
            {isLoading ? (
              <span className="inline-block w-24 h-4 bg-gray-200 dark:bg-brand-dark rounded animate-pulse"></span>
            ) : (
              <>
                <span className="font-bold dark:text-white">{filtered.length}</span> products
              </>
            )}
          </p>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="ml-auto inline-flex items-center gap-2 bg-brand-green text-black font-bold px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity text-sm"
          >
            <Filter className="w-4 h-4" strokeWidth={2.5} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filters Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Active:
            </span>

            {filters.categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setFilters({
                    ...filters,
                    categories: filters.categories.filter((c) => c !== cat),
                  })
                }
                className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full"
              >
                {cat}
                <X className="w-3 h-3" strokeWidth={3} />
              </button>
            ))}

            {filters.subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() =>
                  setFilters({
                    ...filters,
                    subCategories: filters.subCategories.filter((s) => s !== sub),
                  })
                }
                className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full"
              >
                {sub}
                <X className="w-3 h-3" strokeWidth={3} />
              </button>
            ))}

            {filters.brands.map((brand) => (
              <button
                key={brand}
                onClick={() =>
                  setFilters({
                    ...filters,
                    brands: filters.brands.filter((b) => b !== brand),
                  })
                }
                className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full"
              >
                {brand}
                <X className="w-3 h-3" strokeWidth={3} />
              </button>
            ))}

            {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
              <button
                onClick={() =>
                  setFilters({ ...filters, minPrice: 0, maxPrice: 1000 })
                }
                className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full"
              >
                ${filters.minPrice} - ${filters.maxPrice}
                <X className="w-3 h-3" strokeWidth={3} />
              </button>
            )}

            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-xs font-bold text-red-500 hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <ProductSkeletonGrid count={8} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold dark:text-white mb-1">
              No products found
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Try changing your filters
            </p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full text-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
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

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
        currentFilters={filters}
        availableBrands={availableBrands}
        availableCategories={availableCategories}
        availableSubCategories={availableSubCategories}
      />

      <Footer />
    </main>
  );
}