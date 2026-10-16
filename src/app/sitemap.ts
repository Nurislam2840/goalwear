// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 3600; // rebuild sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://goalwear.vercel.app";

  // ---------- Static pages ----------
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/jerseys`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/shoes`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // ---------- Fetch products & categories from Supabase ----------
  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      supabaseAdmin
        .from("products")
        .select("id, updated_at")
        .order("id")
        .limit(5000),
      supabaseAdmin
        .from("categories")
        .select("slug, updated_at, sort_order")
        .order("sort_order"),
    ]);

    if (productsRes.data) {
      productPages = productsRes.data.map((p) => ({
        url: `${baseUrl}/product/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }

    if (categoriesRes.data) {
      categoryPages = categoriesRes.data.map((c) => ({
        url: `${baseUrl}/category/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("[sitemap] Failed to load dynamic URLs:", err);
  }

  return [...staticPages, ...categoryPages, ...productPages];
}