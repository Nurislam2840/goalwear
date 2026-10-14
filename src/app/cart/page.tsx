// src/app/cart/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import CouponInput from "@/components/CouponInput";
import { useCart } from "@/context/CartContext";
import { useCoupon } from "@/context/CouponContext";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal } = useCart();
  const { appliedCoupon, calculateDiscount } = useCoupon();

  const discount = calculateDiscount(cartTotal);
  const finalTotal = Math.round((cartTotal - discount) * 100) / 100;

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="p-2 bg-gray-100 dark:bg-brand-card rounded-full">
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty.</p>
            <Link href="/" className="bg-brand-green text-black font-bold px-6 py-3 rounded-full">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-brand-dark rounded-xl flex items-center justify-center p-2 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold dark:text-white line-clamp-1">{item.name}</h3>
                    {/* 👇 Price - সলিড সবুজ BG + কালো টেক্সট */}
                    <span className="inline-block bg-brand-green text-black text-xs font-bold px-3 py-1 rounded-full mt-1.5">
                      ${item.price.toFixed(2)}
                    </span>

                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => decreaseQuantity(item.id)} className="p-1 bg-gray-100 dark:bg-brand-dark rounded-full">
                        <Minus className="w-3 h-3 dark:text-white" />
                      </button>
                      <span className="text-sm font-bold dark:text-white">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)} className="p-1 bg-gray-100 dark:bg-brand-dark rounded-full">
                        <Plus className="w-3 h-3 dark:text-white" />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full h-fit">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-brand-card p-6 rounded-2xl border border-gray-100 dark:border-brand-border h-fit">
              <h2 className="text-lg font-bold dark:text-white mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold dark:text-white">${cartTotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && discount > 0 && (
                  <div className="flex items-center justify-between gap-2 bg-brand-green text-black rounded-xl px-3 py-2.5">
                    <span className="text-xs font-bold">
                      Discount ({appliedCoupon.code})
                    </span>
                    <span className="text-sm font-bold">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span>Shipping</span>
                  <span className="bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full">
                    {appliedCoupon?.type === "shipping" ? "FREE 🎉" : "Free"}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-brand-border pt-3 flex justify-between font-bold text-lg dark:text-white">
                  <span>Total</span>
                  <span className="bg-brand-green text-black px-3 py-1 rounded-full">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-200 dark:border-brand-border">
                <CouponInput />
              </div>

              <Link
                href="/checkout"
                className="block text-center w-full bg-brand-green text-black font-bold py-4 rounded-full mt-6 hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}