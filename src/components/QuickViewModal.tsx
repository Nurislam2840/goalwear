// src/components/QuickViewModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Star, Heart, ShoppingBag, ArrowRight, Sparkles, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { Product } from "@/context/SiteDataContext";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setSelectedSize("");
    setQuantity(1);
    setSelectedColor(0);
  }, [product?.id]);

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product.id);

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url];

  // 👇 No forced defaults — empty if not defined
  const productColors =
    product.colors && product.colors.length > 0 ? product.colors : [];

  const currentColorImage =
    productImages.length > 1
      ? productImages[selectedColor % productImages.length]
      : productImages[0];

  const categoryLabel =
    product.category === "Football Shoes" ? "Boots" : product.category;

  const stock = product.stock ?? 999;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast("This product is out of stock", "error");
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size first", "error");
      return;
    }
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
    onClose();
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      rating: product.rating,
      reviews_count: product.reviews_count,
    });
    showToast(
      inWishlist ? "Removed from wishlist" : "Added to wishlist!",
      "wishlist"
    );
  };

  const isJersey =
    product.subCategory === "Club" || product.subCategory === "Country";
  const isBoot = product.subCategory === "Boot";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-brand-dark rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white dark:bg-brand-card rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label="Close"
        >
          <X className="w-5 h-5 dark:text-white" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-brand-card dark:to-brand-dark aspect-square flex items-center justify-center overflow-hidden rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl">
            <div className="relative w-full h-full p-8 md:p-12">
              <Image
                src={currentColorImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className={`object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-500 ${
                  isOutOfStock ? "opacity-50 grayscale" : ""
                }`}
              />
            </div>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}

            <button
              onClick={handleWishlist}
              className="absolute top-4 left-4 p-3 bg-white dark:bg-brand-card rounded-full shadow-lg hover:scale-110 transition-transform z-10"
              aria-label="Toggle wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  inWishlist ? "text-pink-500 fill-pink-500" : "text-gray-400"
                }`}
              />
            </button>

            <div className="absolute bottom-4 left-4 bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full z-10">
              {categoryLabel}
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
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

            <h2 className="text-xl md:text-2xl font-bold dark:text-white leading-tight">
              {product.name}
            </h2>

            {product.playerName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {product.playerName}
                {product.playerNumber && ` • #${product.playerNumber}`}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold dark:text-white ml-1">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.reviews_count} reviews)
              </span>
            </div>

            <span className="inline-block bg-brand-green text-black text-lg font-bold px-4 py-2 rounded-full mt-4 w-fit">
              ${product.price.toFixed(2)}
            </span>

            {product.stock !== undefined && (
              <div className="mt-3">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
                    Only {stock} left!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                    {stock} in stock
                  </span>
                )}
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-4 bg-brand-green/5 border border-brand-green/20 rounded-xl p-3">
                <p className="text-xs font-bold dark:text-white mb-2 flex items-center gap-1.5">
                  <Sparkles
                    className="w-3.5 h-3.5 text-brand-green"
                    strokeWidth={2.5}
                  />
                  Highlights
                </p>
                <ul className="space-y-1.5">
                  {product.highlights.slice(0, 4).map((highlight, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs dark:text-gray-300"
                    >
                      <Check
                        className="w-3 h-3 text-brand-green flex-shrink-0 mt-0.5"
                        strokeWidth={3}
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isJersey && (product.sleeveType || product.fitType) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sleeveType && (
                  <span className="bg-gray-100 dark:bg-brand-card text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {product.sleeveType}
                  </span>
                )}
                {product.fitType && (
                  <span className="bg-gray-100 dark:bg-brand-card text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {product.fitType} Fit
                  </span>
                )}
                {product.collarType && (
                  <span className="bg-gray-100 dark:bg-brand-card text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {product.collarType}
                  </span>
                )}
              </div>
            )}

            {isBoot && (product.surface || product.playStyle) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.surface && (
                  <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {product.surface}
                  </span>
                )}
                {product.playStyle && (
                  <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {product.playStyle}
                  </span>
                )}
                {product.bootHeight && (
                  <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {product.bootHeight}
                  </span>
                )}
              </div>
            )}

            {/* Color Picker — only if colors exist */}
            {productColors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-bold dark:text-white mb-2">
                  Select Color
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {productColors.map((color, idx) => (
                    <button
                      key={`${color.name}-${idx}`}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-7 h-7 rounded-full transition-all ${
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
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-sm font-bold dark:text-white mb-2">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={isOutOfStock}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-all ${
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

            <div className="mt-4">
              <h3 className="text-sm font-bold dark:text-white mb-2">
                Quantity
              </h3>
              <div className="inline-flex items-center bg-gray-100 dark:bg-brand-card rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="w-9 h-9 flex items-center justify-center text-base font-bold dark:text-white hover:text-brand-green disabled:opacity-50"
                >
                  −
                </button>
                <span className="w-9 text-center font-bold dark:text-white text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                  className="w-9 h-9 flex items-center justify-center text-base font-bold dark:text-white hover:text-brand-green disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-auto pt-5 space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-opacity ${
                  isOutOfStock
                    ? "bg-gray-300 dark:bg-brand-border text-gray-500 cursor-not-allowed"
                    : "bg-brand-green text-black hover:opacity-90"
                }`}
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
                {isOutOfStock
                  ? "Out of Stock"
                  : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
              </button>

              <Link
                href={`/product/${product.id}`}
                onClick={onClose}
                className="w-full border-2 border-gray-200 dark:border-brand-border text-gray-900 dark:text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 hover:border-brand-green transition-colors text-sm"
              >
                View Full Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}