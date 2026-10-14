// src/components/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  // Login/Cart/Checkout পেজে Bottom Nav দেখাব না
  const hideOn = ["/login", "/cart", "/checkout"];
  if (hideOn.includes(pathname)) return null;

  const navItems = [
    { href: "/", label: "Home", icon: Home, badge: 0 },
    { href: "/shop", label: "Shop", icon: ShoppingBag, badge: cartCount },
    { href: "/wishlist", label: "Wishlist", icon: Heart, badge: wishlistCount },
    {
      href: isAuthenticated ? "/account" : "/login",
      label: isAuthenticated ? (user?.name?.split(" ")[0] || "Account") : "Login",
      icon: User,
      badge: 0,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-brand-border">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                isActive ? "text-brand-green" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-green text-black text-[9px] font-bold px-1.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-green rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}