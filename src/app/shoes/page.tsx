// src/app/shoes/page.tsx
"use client";

import ProductListingLayout from "@/components/ProductListingLayout";
import { useSiteData } from "@/context/SiteDataContext";

export default function ShoesPage() {
  const { products } = useSiteData();
  const shoes = products.filter((p) => p.category === "Football Shoes");

  return (
    <ProductListingLayout
      title="Football Shoes"
      subtitle="Premium boots and cleats engineered for performance"
      products={shoes}
      breadcrumb="Football Shoes"
    />
  );
}