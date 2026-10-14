// src/components/RelatedProducts.tsx
"use client";

import ProductCard from "@/components/ProductCard";
import { useSiteData } from "@/context/SiteDataContext";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedProductsProps {
  currentId: number;
  category: string;
}

export default function RelatedProducts({ currentId, category }: RelatedProductsProps) {
  const { products, categories } = useSiteData();

  const related = products
    .filter((p) => p.category === category && p.id !== currentId)
    .slice(0, 4);

  if (related.length === 0) return null;

  // 👇 Find matching category slug for the "View All" link
  const matchedCategory = categories.find(
    (c) => c.name.toLowerCase() === category.toLowerCase()
  );
  const viewAllHref = matchedCategory
    ? `/category/${matchedCategory.slug}`
    : `/shop?category=${encodeURIComponent(category)}`;

  return (
    <section className="max-w-5xl mx-auto px-4 mt-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold dark:text-white">
            You May Also Like
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            More from {category}
          </p>
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product) => (
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
    </section>
  );
}