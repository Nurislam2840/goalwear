// src/app/wishlist/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ArrowLeft, Heart, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = (item: any) => {
    addToCart(item);
    removeFromWishlist(item.id);
    showToast("Moved to cart!", "success");
  };

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="p-2 bg-gray-100 dark:bg-brand-card rounded-full">
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">My Wishlist</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Save your favorite items and shop them later
            </p>
            <Link
              href="/shop"
              className="inline-block bg-brand-green text-black font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border"
              >
                <Link
                  href={`/product/${item.id}`}
                  className="w-24 h-24 bg-gray-50 dark:bg-brand-dark rounded-xl flex items-center justify-center p-2 flex-shrink-0 overflow-hidden"
                >
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-contain mix-blend-multiply dark:mix-blend-normal"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="text-sm font-semibold dark:text-white line-clamp-1 hover:text-brand-green">
                      {item.name}
                    </h3>
                  </Link>

                  {/* 👇 Price - সলিড সবুজ BG + কালো টেক্সট */}
                  <span className="inline-block bg-brand-green text-black text-xs font-bold px-3 py-1 rounded-full mt-1.5">
                    ${item.price}
                  </span>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5} /> Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        removeFromWishlist(item.id);
                        showToast("Removed from wishlist", "error");
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}