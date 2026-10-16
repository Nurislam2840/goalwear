// src/components/StockNotifier.tsx
"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";

/**
 * Cart-এ থাকা প্রোডাক্টের stock কমে গেলে user-কে alert দেবে।
 */
export default function StockNotifier({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cart } = useCart();
  const { products, isHydrated } = useSiteData();
  const { showToast } = useToast();
  const notifiedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!isHydrated) return;

    cart.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);

      // Product deleted from store
      if (!product) {
        if (!notifiedRef.current.has(cartItem.id)) {
          notifiedRef.current.add(cartItem.id);
          showToast(`"${cartItem.name}" is no longer available`, "error");
        }
        return;
      }

      const stock = product.stock ?? 999;

      // Out of stock
      if (stock <= 0 && !notifiedRef.current.has(cartItem.id)) {
        notifiedRef.current.add(cartItem.id);
        showToast(`"${product.name}" is out of stock`, "error");
      }
      // Low stock warning
      else if (stock > 0 && stock <= 3 && !notifiedRef.current.has(cartItem.id)) {
        notifiedRef.current.add(cartItem.id);
        showToast(`Only ${stock} left of "${product.name}"!`, "wishlist");
      }
      // Back in stock — reset so future warnings can fire
      else if (stock > 5) {
        notifiedRef.current.delete(cartItem.id);
      }
    });

    // Clean up: remove items from notified that are no longer in cart
    const cartIds = new Set(cart.map((c) => c.id));
    notifiedRef.current.forEach((id) => {
      if (!cartIds.has(id)) notifiedRef.current.delete(id);
    });
  }, [cart, products, isHydrated, showToast]);

  return <>{children}</>;
}