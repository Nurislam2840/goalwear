// src/app/product/[id]/layout.tsx
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { id } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://goalwear.vercel.app";

  try {
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("id, name, description, image_url")
      .eq("id", Number(id))
      .maybeSingle();

    if (!product) {
      return { title: "Product Not Found" };
    }

    const desc = (product.description || "").slice(0, 160);

    return {
      title: product.name,
      description: desc,
      openGraph: {
        title: product.name,
        description: desc,
        type: "website",
        url: `${baseUrl}/product/${product.id}`,
        images: product.image_url
          ? [{ url: product.image_url, width: 800, height: 800, alt: product.name }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: desc,
        images: product.image_url ? [product.image_url] : [],
      },
    };
  } catch (err) {
    console.error("[product metadata] error:", err);
    return { title: "Product" };
  }
}

export default function ProductLayout({ children }: LayoutProps) {
  return <>{children}</>;
}