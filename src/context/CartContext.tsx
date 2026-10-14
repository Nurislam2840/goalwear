// src/context/CartContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  rating?: number;
  reviews_count?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  syncPrices: (products: Product[]) => void;
  cartCount: number;
  cartTotal: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const saved = localStorage.getItem("goalwear-cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed);
      } catch (err) {
        console.error("Failed to parse cart", err);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("goalwear-cart", JSON.stringify(cart));
  }, [cart, isHydrated]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1, price: product.price, name: product.name, image_url: product.image_url }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("goalwear-cart", JSON.stringify([]));
  };

  // 👇 নতুন: Cart-এর product data latest products থেকে sync করব
  const syncPrices = (products: Product[]) => {
    setCart((prev) => {
      let changed = false;
      const updated = prev.map((item) => {
        const latest = products.find((p) => p.id === item.id);
        if (!latest) {
          // Product আর নেই → remove from cart
          changed = true;
          return null;
        }
        if (
          latest.price !== item.price ||
          latest.name !== item.name ||
          latest.image_url !== item.image_url
        ) {
          changed = true;
          return {
            ...item,
            price: latest.price,
            name: latest.name,
            image_url: latest.image_url,
            rating: latest.rating,
            reviews_count: latest.reviews_count,
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];

      return changed ? updated : prev;
    });
  };

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        syncPrices,
        cartCount,
        cartTotal,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}