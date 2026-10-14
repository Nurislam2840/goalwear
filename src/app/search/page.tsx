// src/app/search/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import ThemedSelect from "@/components/ThemedSelect";
import { useSiteData } from "@/context/SiteDataContext";
import { Search, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const { products } = useSiteData();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [initialQuery, selectedCategory, sortBy]);

  const categories = ["All", "Jerseys", "Football Shoes", "Cricket Jersey"];

  let filtered = products.filter((p) => {
    if (!searchQuery.trim()) {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesCategory;
    }

    const q = searchQuery.toLowerCase().trim();
    const searchableText = [
      p.name,
      p.brand,
      p.team,
      p.category,
      p.subCategory,
      p.description,
      p.type,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(q);
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const suggestions = [
    { label: "Real Madrid", query: "Real Madrid" },
    { label: "Nike Boots", query: "Nike" },
    { label: "Adidas Jerseys", query: "Adidas" },
    { label: "Barcelona", query: "Barcelona" },
    { label: "Argentina", query: "Argentina" },
    { label: "Predator", query: "Predator" },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          {searchQuery ? (
            <>
              Search Results for{" "}
              <span className="bg-brand-green text-black px-3 py-1 rounded-full">
                "{searchQuery}"
              </span>
            </>
          ) : (
            "Browse All Products"
          )}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {isLoading ? (
            <span className="inline-block w-32 h-4 bg-gray-200 dark:bg-brand-dark rounded animate-pulse"></span>
          ) : (
            <>
              {filtered.length} {filtered.length === 1 ? "product" : "products"} found
            </>
          )}
        </p>

        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, brand, team, category..."
              className="w-full pl-12 pr-12 py-4 bg-gray-100 dark:bg-brand-card rounded-full text-sm dark:text-white outline-none focus:ring-2 focus:ring-brand-green transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-brand-dark rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </form>

        {!isLoading && filtered.length === 0 && searchQuery && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 py-2">
              Try:
            </span>
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  setSearchQuery(s.query);
                  router.push(`/search?q=${encodeURIComponent(s.query)}`);
                }}
                className="bg-gray-100 dark:bg-brand-card text-xs font-semibold dark:text-gray-300 px-3 py-2 rounded-full hover:bg-brand-green hover:text-black transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-brand-green text-black"
                    : "bg-gray-100 dark:bg-brand-card text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            {/* 👇 ThemedSelect */}
            <ThemedSelect
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              size="sm"
              className="min-w-[180px]"
            />
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <ProductSkeletonGrid count={8} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
            <div className="w-16 h-16 bg-gray-100 dark:bg-brand-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-bold dark:text-white mb-1">No products found</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Try a different search term or browse all products
            </p>
            <Link
              href="/shop"
              className="inline-block bg-brand-green text-black font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Browse All Products
            </Link>
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

      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-brand-dark"></div>}>
      <SearchContent />
    </Suspense>
  );
}