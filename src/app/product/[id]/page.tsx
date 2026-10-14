// src/app/product/[id]/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedProducts from "@/components/RelatedProducts";
import ProductGallery from "@/components/ProductGallery";
import ProductReviews from "@/components/ProductReviews";
import SizeGuideModal from "@/components/SizeGuideModal";
import RecentlyViewed from "@/components/RecentlyViewed";
import { useSiteData } from "@/context/SiteDataContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { DEFAULT_COLORS } from "@/data/products";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Ruler,
  Sparkles,
  Award,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { products } = useSiteData();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isPending, startTransition] = useTransition();

  const productId = Number(params.id);
  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        rating: product.rating,
        reviews_count: product.reviews_count,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  useEffect(() => {
    setSelectedColor(0);
    setSelectedSize("");
    setQuantity(1);
  }, [product?.id]);

  if (!product) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold dark:text-white mb-4">
            Product not found!
          </h1>
          <Link
            href="/"
            className="bg-brand-green text-black font-bold px-6 py-3 rounded-full"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const stock = product.stock ?? 999;
  const isOutOfStock = stock <= 0;

  const productColors =
    product.colors && product.colors.length > 0
      ? product.colors
      : DEFAULT_COLORS;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast("This product is out of stock", "error");
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size first", "error");
      return;
    }
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: `${product.name} (Size: ${selectedSize})`,
        price: product.price,
        image_url: product.image_url,
        rating: product.rating,
        reviews_count: product.reviews_count,
      });
    }
    showToast(
      `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`,
      "success"
    );
    setTimeout(() => setIsAdding(false), 500);
  };

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url];
  const productReviews =
    product.reviews && product.reviews.length > 0 ? product.reviews : [];

  const categoryLabel =
    product.category === "Football Shoes" ? "Boots" : product.category;

  const galleryImages =
    productImages.length > 1
      ? [
          productImages[selectedColor % productImages.length],
          ...productImages.filter(
            (_, i) => i !== selectedColor % productImages.length
          ),
        ]
      : productImages;

  const isJersey =
    product.subCategory === "Club" || product.subCategory === "Country";
  const isBoot = product.subCategory === "Boot";

  // ============================================
  // Find sibling variants (same team + season)
  // ============================================
  const siblingVariants = product.team
    ? products.filter(
        (p) =>
          p.team === product.team &&
          p.season === product.season &&
          p.id !== product.id &&
          p.subCategory === product.subCategory
      )
    : [];

  const allVariants = [product, ...siblingVariants];

  const kitOrder = ["Home", "Away", "Third", "Goalkeeper"];
  const sortedVariants = [...allVariants].sort((a, b) => {
    const aIdx = kitOrder.indexOf(a.kitType || a.type);
    const bIdx = kitOrder.indexOf(b.kitType || b.type);
    return aIdx - bIdx;
  });

  const showVariants =
    sortedVariants.length > 1 && product.team && isJersey;

  // ============================================
  // Handle variant switch (smooth)
  // ============================================
  const handleVariantSwitch = (variantId: number) => {
    if (variantId === product.id) return;

    startTransition(() => {
      router.push(`/product/${variantId}`, { scroll: false });
    });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark pb-24 md:pb-0">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* ============================================
            VARIANT SELECTOR (Home / Away / Third / GK)
            ============================================ */}
        {showVariants && (
          <div className="mb-6 bg-gradient-to-br from-gray-50 to-white dark:from-brand-card dark:to-brand-dark rounded-2xl border border-gray-100 dark:border-brand-border p-4 relative overflow-hidden">
            {/* Loading overlay during transition */}
            {isPending && (
              <div className="absolute inset-0 bg-white/60 dark:bg-brand-dark/60 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white dark:bg-brand-card px-4 py-2 rounded-full shadow-lg">
                  <Loader2 className="w-4 h-4 text-brand-green animate-spin" />
                  <span className="text-xs font-bold dark:text-white">
                    Loading...
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold dark:text-white">
                  Choose Kit Type
                </h3>
                {product.season && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {product.team} • Season {product.season}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sortedVariants.map((variant) => {
                const isActive = variant.id === product.id;
                const label = variant.kitType || variant.type || "Home";

                // Count GK variants
                const gkCount = sortedVariants.filter(
                  (v) => (v.kitType || v.type) === label
                ).length;

                // Add number if multiple variants with same label
                const sameLabelVariants = sortedVariants.filter(
                  (v) => (v.kitType || v.type) === label
                );
                const sameLabelIndex = sameLabelVariants.findIndex(
                  (v) => v.id === variant.id
                );
                const showNumber = sameLabelVariants.length > 1;
                const displayLabel = showNumber
                  ? `${label} ${sameLabelIndex + 1}`
                  : label;

                return (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSwitch(variant.id)}
                    disabled={isActive || isPending}
                    className={`group relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      isActive
                        ? "bg-brand-green text-black border-brand-green shadow-lg shadow-brand-green/30"
                        : "bg-white dark:bg-brand-dark border-gray-200 dark:border-brand-border text-gray-700 dark:text-gray-300 hover:border-brand-green hover:shadow-md"
                    } ${isPending ? "opacity-50" : ""}`}
                  >
                    {/* Variant thumbnail */}
                    {variant.image_url && (
                      <div
                        className={`w-full h-16 rounded-lg overflow-hidden ${
                          isActive ? "bg-white/40" : "bg-gray-100 dark:bg-brand-card"
                        } flex items-center justify-center`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={variant.image_url}
                          alt={displayLabel}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Label */}
                    <div className="flex items-center gap-1">
                      {isActive && (
                        <Check
                          className="w-3 h-3"
                          strokeWidth={3}
                        />
                      )}
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {displayLabel}
                      </span>
                    </div>

                    {/* Price tag (if different from current) */}
                    {!isActive && variant.price !== product.price && (
                      <span className="absolute top-1 right-1 bg-brand-green text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        ${variant.price.toFixed(0)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery
            images={galleryImages}
            name={product.name}
            productId={product.id}
            price={product.price}
            rating={product.rating}
            reviews_count={product.reviews_count}
          />

          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-brand-green text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {categoryLabel}
              </span>
              {product.subCategory && (
                <span className="bg-gray-100 dark:bg-brand-card text-gray-600 dark:text-gray-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.subCategory}
                </span>
              )}
              {product.season && (
                <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.season}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold dark:text-white leading-tight">
              {product.name}
            </h1>

            {product.playerName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {product.playerName}
                {product.playerNumber && ` • #${product.playerNumber}`}
                {product.isPlayerEdition && (
                  <span className="ml-2 inline-block bg-brand-green text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Player Edition
                  </span>
                )}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold dark:text-white ml-1">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews_count} reviews)
              </span>
            </div>

            <span className="inline-block bg-brand-green text-black text-lg font-bold px-4 py-2 rounded-full mt-4 w-fit">
              ${product.price.toFixed(2)}
            </span>

            {product.stock !== undefined && (
              <div className="mt-4">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Out of Stock
                  </span>
                ) : stock <= 5 ? (
                  <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
                    Only {stock} left in stock!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                    {stock} in stock
                  </span>
                )}
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* HIGHLIGHTS */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-5 bg-brand-green/5 dark:bg-brand-green/5 border border-brand-green/20 rounded-2xl p-4">
                <h3 className="text-sm font-bold dark:text-white mb-3 flex items-center gap-2">
                  <Sparkles
                    className="w-4 h-4 text-brand-green"
                    strokeWidth={2.5}
                  />
                  Highlights
                </h3>
                <ul className="space-y-2">
                  {product.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm dark:text-gray-300"
                    >
                      <Check
                        className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5"
                        strokeWidth={3}
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* JERSEY DETAILS */}
            {isJersey && (
              <div className="mt-5 bg-gray-50 dark:bg-brand-card rounded-2xl p-4 border border-gray-100 dark:border-brand-border">
                <h3 className="text-sm font-bold dark:text-white mb-3 flex items-center gap-2">
                  <Award
                    className="w-4 h-4 text-brand-green"
                    strokeWidth={2.5}
                  />
                  Jersey Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {product.kitType && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Kit Type
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.kitType}
                      </p>
                    </div>
                  )}
                  {product.sleeveType && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sleeve
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.sleeveType}
                      </p>
                    </div>
                  )}
                  {product.collarType && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Collar
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.collarType}
                      </p>
                    </div>
                  )}
                  {product.fitType && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fit
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.fitType}
                      </p>
                    </div>
                  )}
                  {product.sponsor && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sponsor
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.sponsor}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BOOT DETAILS */}
            {isBoot && (
              <div className="mt-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-200 dark:border-blue-900/30">
                <h3 className="text-sm font-bold dark:text-white mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" strokeWidth={2.5} />
                  Boot Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {product.surface && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Surface
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.surface}
                      </p>
                    </div>
                  )}
                  {product.playStyle && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Play Style
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.playStyle}
                      </p>
                    </div>
                  )}
                  {product.bootHeight && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Height
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.bootHeight}
                      </p>
                    </div>
                  )}
                  {product.closureType && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Closure
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.closureType}
                      </p>
                    </div>
                  )}
                  {product.weightGrams && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Weight
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.weightGrams}g
                      </p>
                    </div>
                  )}
                  {product.upperMaterial && (
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Upper
                      </p>
                      <p className="font-semibold dark:text-white">
                        {product.upperMaterial}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SPECIFICATIONS */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-5 bg-gray-50 dark:bg-brand-card rounded-2xl p-4 border border-gray-100 dark:border-brand-border">
                <h3 className="text-sm font-bold dark:text-white mb-3">
                  Specifications
                </h3>
                <div className="space-y-2">
                  {product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-4 text-sm py-2 border-b border-gray-100 dark:border-brand-border last:border-0"
                    >
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        {spec.label}
                      </span>
                      <span className="dark:text-white font-semibold text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CUSTOM FIELDS */}
            {product.customFields && product.customFields.length > 0 && (
              <div className="mt-4 bg-white dark:bg-brand-card rounded-2xl p-4 border border-gray-100 dark:border-brand-border">
                <h3 className="text-sm font-bold dark:text-white mb-3">
                  Additional Information
                </h3>
                <div className="space-y-2">
                  {product.customFields.map((cf, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <span className="text-gray-500 dark:text-gray-400">
                        {cf.label}
                      </span>
                      <span className="dark:text-white font-medium text-right">
                        {cf.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Picker */}
            {productColors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold dark:text-white mb-3">
                  Select Color
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {productColors.map((color, idx) => (
                    <button
                      key={`${color.name}-${idx}`}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-9 h-9 rounded-full transition-all duration-200 ${
                        selectedColor === idx
                          ? "ring-2 ring-offset-2 ring-black dark:ring-white dark:ring-offset-brand-dark scale-110"
                          : "hover:scale-110 opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                  Selected:{" "}
                  <span className="font-bold dark:text-white">
                    {productColors[selectedColor]?.name || "Default"}
                  </span>
                </p>
              </div>
            )}

            {/* SIZE SELECTOR */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold dark:text-white">
                  Select Size
                </h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="inline-flex items-center gap-1.5 bg-brand-green text-black text-[10px] font-bold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  <Ruler className="w-3 h-3" strokeWidth={2.5} /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={isOutOfStock}
                    className={`px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all ${
                      isOutOfStock
                        ? "border-gray-200 dark:border-brand-border text-gray-400 cursor-not-allowed"
                        : selectedSize === size
                        ? "border-brand-green bg-brand-green text-black"
                        : "border-gray-200 dark:border-brand-border text-gray-600 dark:text-gray-300 hover:border-brand-green"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mt-5">
              <h3 className="text-sm font-bold dark:text-white mb-3">
                Quantity
              </h3>
              <div className="inline-flex items-center bg-gray-100 dark:bg-brand-card rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="w-10 h-10 flex items-center justify-center text-lg font-bold dark:text-white hover:text-brand-green disabled:opacity-50"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                  className="w-10 h-10 flex items-center justify-center text-lg font-bold dark:text-white hover:text-brand-green disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isOutOfStock}
              className={`mt-6 w-full font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-opacity ${
                isOutOfStock
                  ? "bg-gray-300 dark:bg-brand-border text-gray-500 cursor-not-allowed"
                  : "bg-brand-green text-black hover:opacity-90 disabled:opacity-50"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isOutOfStock
                ? "Out of Stock"
                : isAdding
                ? "Adding..."
                : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
            </button>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-brand-border">
              <div className="text-center">
                <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-1.5">
                  <Truck className="w-5 h-5 text-black" strokeWidth={2.5} />
                </div>
                <p className="text-[10px] font-bold dark:text-white">
                  Free Shipping
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-1.5">
                  <ShieldCheck
                    className="w-5 h-5 text-black"
                    strokeWidth={2.5}
                  />
                </div>
                <p className="text-[10px] font-bold dark:text-white">
                  Secure Payment
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-1.5">
                  <RotateCcw
                    className="w-5 h-5 text-black"
                    strokeWidth={2.5}
                  />
                </div>
                <p className="text-[10px] font-bold dark:text-white">
                  30-Day Returns
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProductReviews
          productId={product.id}
          reviews={productReviews}
          rating={product.rating}
          reviews_count={product.reviews_count}
        />

        <RelatedProducts currentId={product.id} category={product.category} />

        <RecentlyViewed currentProductId={product.id} />
      </div>

      <div className="mt-16">
        <Footer />
      </div>

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </main>
  );
}