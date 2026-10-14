// src/components/ProductCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Eye,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart, Product } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useSiteData } from "@/context/SiteDataContext";
import { DEFAULT_COLORS } from "@/data/products";
import QuickViewModal from "@/components/QuickViewModal";

interface ProductProps extends Product {
  isNew?: boolean;
  isOnSale?: boolean;
  salePercent?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  image_url,
  rating,
  reviews_count,
  isNew,
}: ProductProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { products } = useSiteData();
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const inWishlist = isInWishlist(id);
  const fullProduct = products.find((p) => p.id === id) || null;
  const stock = fullProduct?.stock ?? 999;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const categoryLabel = fullProduct
    ? fullProduct.category === "Football Shoes"
      ? "Football Shoes"
      : fullProduct.category === "Cricket Jersey"
      ? "Cricket Jersey"
      : fullProduct.category
    : "Product";

  const subLabel = fullProduct?.subCategory || "";
  const season = fullProduct?.season || "";
  const kitType = fullProduct?.kitType || fullProduct?.type || "";
  const showNew = isNew ?? (id > 200 && id < 210);

  const productColors =
    fullProduct?.colors && fullProduct.colors.length > 0
      ? fullProduct.colors
      : DEFAULT_COLORS;

  const productImages =
    fullProduct?.images && fullProduct.images.length > 0
      ? fullProduct.images
      : [image_url];

  const hasMultipleImages = productImages.length > 1;

  const currentImage =
    productImages[
      (selectedColor + currentImageIndex) % productImages.length
    ] || productImages[0];

  const handleMouseEnter = () => {
    if (!hasMultipleImages) return;
    hoverIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 1500);
  };

  const handleMouseLeave = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
    setCurrentImageIndex(0);
  };

  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      showToast("This product is out of stock", "error");
      return;
    }
    addToCart({ id, name, price, image_url, rating, reviews_count });
    showToast("Added to cart!", "success");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id, name, price, image_url, rating, reviews_count });
    showToast(
      inWishlist ? "Removed from wishlist" : "Added to wishlist!",
      "wishlist"
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (fullProduct) setShowQuickView(true);
  };

  const handleColorClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(index);
    setCurrentImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  return (
    <>
      <Link href={`/product/${id}`} className="block group">
        <div
          className="product-card-minimal"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* ============ IMAGE AREA ============ */}
          <div className="product-card-minimal-image">
            <Image
              src={currentImage}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-contain p-4 mix-blend-multiply dark:mix-blend-normal transition-all duration-500 ${
                isOutOfStock ? "opacity-40 grayscale" : ""
              }`}
            />

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 dark:bg-brand-card/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft
                    className="w-3 h-3 dark:text-white"
                    strokeWidth={3}
                  />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 dark:bg-brand-card/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  aria-label="Next image"
                >
                  <ChevronRight
                    className="w-3 h-3 dark:text-white"
                    strokeWidth={3}
                  />
                </button>
              </>
            )}

            {/* Image Dots */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
                {productImages.slice(0, 5).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all ${
                      (selectedColor + currentImageIndex) %
                        productImages.length ===
                      idx
                        ? "w-4 bg-brand-green"
                        : "w-1 bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Badges */}
            {showNew && !isOutOfStock && !isLowStock && (
              <div className="absolute top-2.5 left-2.5 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full z-10">
                New
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full z-10">
                Sold Out
              </div>
            )}

            {isLowStock && !isOutOfStock && (
              <div className="absolute top-2.5 left-2.5 bg-yellow-400 text-black text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full z-10 animate-pulse">
                Only {stock} Left
              </div>
            )}

            {/* Floating Actions */}
            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
              <button
                onClick={handleWishlist}
                className={`product-card-minimal-action ${
                  inWishlist ? "active" : ""
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`w-3 h-3 ${inWishlist ? "fill-current" : ""}`}
                  strokeWidth={2.8}
                />
              </button>

              {!isOutOfStock && (
                <button
                  onClick={handleQuickView}
                  className="product-card-minimal-action"
                  aria-label="Quick view"
                >
                  <Eye className="w-3 h-3" strokeWidth={2.8} />
                </button>
              )}
            </div>
          </div>

          {/* ============ INFO AREA ============ */}
          <div className="mt-3">
            <p className="product-card-minimal-cat">
              {categoryLabel}
              {subLabel && ` • ${subLabel}`}
            </p>

            <h3 className="product-card-minimal-title text-gray-900 dark:text-white mt-1.5 min-h-[30px]">
              {name}
            </h3>

            {/* Season / Kit Type badges */}
            {(season || kitType) && (
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                {kitType && (
                  <span className="bg-brand-green/20 text-black dark:text-brand-green text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {kitType}
                  </span>
                )}
                {season && (
                  <span className="bg-gray-100 dark:bg-brand-dark text-gray-600 dark:text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {season}
                  </span>
                )}
              </div>
            )}

            {/* Color Picker */}
            <div className="flex items-center gap-1.5 mt-2">
              {productColors.slice(0, 4).map((color, idx) => (
                <button
                  key={`${color.name}-${idx}`}
                  onClick={(e) => handleColorClick(e, idx)}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 border-2 ${
                    selectedColor === idx
                      ? "ring-2 ring-offset-1 ring-black dark:ring-white dark:ring-offset-brand-card scale-110"
                      : "hover:scale-110 opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: color.hex,
                    borderColor:
                      selectedColor === idx
                        ? "transparent"
                        : "rgba(0,0,0,0.1)",
                  }}
                  aria-label={color.name}
                  title={color.name}
                />
              ))}
              {productColors.length > 4 && (
                <span className="text-[9px] font-bold text-gray-400 ml-0.5">
                  +{productColors.length - 4}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                {rating}
              </span>
              <span className="text-[10px] text-gray-400">
                ({reviews_count})
              </span>
            </div>

            {/* Price + Add */}
            <div className="flex items-end justify-between mt-2.5 gap-2">
              <div className="flex flex-col">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                  Price
                </p>
                <p className="product-card-minimal-price text-gray-900 dark:text-white leading-none">
                  ${price.toFixed(0)}
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="product-card-add-green inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <ShoppingBag className="w-3 h-3" strokeWidth={3} />
                {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </Link>

      {!isOutOfStock && (
        <QuickViewModal
          product={fullProduct}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}