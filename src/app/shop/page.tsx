// src/app/shop/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ProductListingLayout from "@/components/ProductListingLayout";
import { useSiteData } from "@/context/SiteDataContext";
import { Loader2 } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const { products, brands } = useSiteData();

  const brandParam = searchParams.get("brand") || "";
  const teamParam = searchParams.get("team") || "";
  const categoryParam = searchParams.get("category") || "";
  const queryParam = searchParams.get("q") || "";

  // Filter products based on query params
  let filtered = products;

  if (brandParam) {
    // brand slug might be "nike" or "Nike"
    const brandName =
      brands.find((b) => b.slug === brandParam)?.name || brandParam;
    filtered = filtered.filter(
      (p) => p.brand.toLowerCase() === brandName.toLowerCase()
    );
  }

  if (teamParam) {
    // team slug "real-madrid" → "real madrid"
    const teamName = teamParam.replace(/-/g, " ");
    filtered = filtered.filter((p) =>
      p.team.toLowerCase().includes(teamName.toLowerCase())
    );
  }

  if (categoryParam) {
    filtered = filtered.filter((p) => p.category === categoryParam);
  }

  if (queryParam) {
    const q = queryParam.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Dynamic breadcrumb + title
  let breadcrumb = "Shop";
  let title = "All Products";
  let subtitle = "Explore our complete collection of premium football gear";

  if (brandParam) {
    const brand = brands.find((b) => b.slug === brandParam);
    title = brand ? `${brand.name} Products` : "Brand Products";
    subtitle = `All products from ${brand?.name || brandParam}`;
    breadcrumb = brand?.name || brandParam;
  } else if (teamParam) {
    const teamName = teamParam
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    title = `${teamName} Products`;
    subtitle = `All ${teamName} gear`;
    breadcrumb = teamName;
  } else if (categoryParam) {
    title = categoryParam;
    subtitle = `Browse all ${categoryParam.toLowerCase()}`;
    breadcrumb = categoryParam;
  }

  return (
    <ProductListingLayout
      title={title}
      subtitle={subtitle}
      products={filtered}
      breadcrumb={breadcrumb}
    />
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}