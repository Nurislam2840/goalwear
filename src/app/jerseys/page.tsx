// src/app/jerseys/page.tsx
"use client";

import ProductListingLayout from "@/components/ProductListingLayout";
import { useSiteData } from "@/context/SiteDataContext";

export default function JerseysPage() {
  const { products } = useSiteData();
  const jerseys = products.filter((p) => p.category === "Jerseys");

  return (
    <ProductListingLayout
      title="Football Jerseys"
      subtitle="Authentic club and national team jerseys for true fans"
      products={jerseys}
      breadcrumb="Jerseys"
    />
  );
}