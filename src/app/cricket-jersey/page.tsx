// src/app/cricket-jersey/page.tsx
"use client";

import ProductListingLayout from "@/components/ProductListingLayout";
import { useSiteData } from "@/context/SiteDataContext";

export default function CricketJerseyPage() {
  const { products } = useSiteData();
  const cricketProducts = products.filter(
    (p) =>
      p.category === "Cricket Jersey" ||
      p.name.toLowerCase().includes("cricket")
  );

  return (
    <ProductListingLayout
      title="Cricket Jerseys"
      subtitle="Premium cricket team jerseys and gear"
      products={cricketProducts}
      breadcrumb="Cricket Jersey"
    />
  );
}