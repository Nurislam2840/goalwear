// src/app/product/[id]/layout.tsx
import type { Metadata } from "next";
import { mockProducts } from "@/data/products";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === Number(id));

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://goalwear.vercel.app";

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      type: "website",
      url: `${baseUrl}/product/${product.id}`,
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.image_url],
    },
  };
}

export default function ProductLayout({ children }: LayoutProps) {
  return <>{children}</>;
}