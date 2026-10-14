// src/components/ProductGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

interface ProductGalleryProps {
  images: string[];
  name: string;
  productId: number;
  price: number;
  rating: number;
  reviews_count: number;
}

export default function ProductGallery({
  images,
  name,
  productId,
  price,
  rating,
  reviews_count,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const inWishlist = isInWishlist(productId);

  const handleWishlist = () => {
    toggleWishlist({
      id: productId,
      name,
      price,
      image_url: images[0],
      rating,
      reviews_count,
    });
    showToast(inWishlist ? "Removed from wishlist" : "Added to wishlist!", "wishlist");
  };

  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative">
      {/* 👇 Main Image with Fixed 1:1 Aspect Ratio */}
      <div className="relative aspect-square bg-gray-50 dark:bg-brand-card rounded-3xl overflow-hidden">
        <Image
          src={images[selectedIndex]}
          alt={`${name} - View ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-contain p-8 mix-blend-multiply dark:mix-blend-normal transition-all duration-300"
          priority
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-3 bg-white dark:bg-brand-dark rounded-full shadow-md hover:scale-110 transition-transform z-10"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              inWishlist ? "text-pink-500 fill-pink-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* NEW Badge */}
        <div className="absolute top-4 left-4 bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full z-10">
          NEW
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-brand-dark/90 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 dark:text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-brand-dark/90 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 dark:text-white" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square bg-gray-50 dark:bg-brand-card rounded-xl overflow-hidden transition-all duration-200 ${
                selectedIndex === idx
                  ? "ring-2 ring-brand-green ring-offset-2 dark:ring-offset-brand-dark"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                sizes="100px"
                className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}