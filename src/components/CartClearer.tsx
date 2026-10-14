// src/components/CartClearer.tsx
"use client";

import { useEffect } from "react";

export default function CartClearer() {
  useEffect(() => {
    try {
      // Clear localStorage cart
      localStorage.setItem("goalwear-cart", JSON.stringify([]));
      console.log("[CartClearer] 🛒 Cart cleared from localStorage");

      // Notify all mounted components (CartContext)
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("cart-cleared"));

      // Small delay then reload cart context
      setTimeout(() => {
        window.dispatchEvent(new Event("storage"));
      }, 100);
    } catch (err) {
      console.error("[CartClearer] Error:", err);
    }
  }, []);

  return null;
}