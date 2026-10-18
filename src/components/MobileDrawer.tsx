// src/components/MobileDrawer.tsx
"use client";

import { X, Home, ShoppingBag, Heart, User, LogOut, Sun, Moon, Info, Truck, HelpCircle, MapPin, Edit3, Package } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useSiteData } from "@/context/SiteDataContext";
import { useRouter } from "next/navigation";
import BrandName from "@/components/BrandName";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const { categories, siteConfig } = useSiteData();
  const router = useRouter();

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

  const handleLogout = () => {
    logout();
    onClose();
    showToast("Logged out successfully", "success");
    router.push("/");
  };

  if (!isOpen) return null;

  // 👇 ক্যাটাগরি ডাইনামিক করা হলো
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop All", icon: ShoppingBag },
    ...categories.map((cat) => ({
      href: `/category/${cat.slug}`,
      label: cat.name,
      icon: ShoppingBag,
    })),
    { href: "/wishlist", label: "Wishlist", icon: Heart },
  ];

  const accountItems = [
    { href: "/orders", label: "My Orders", icon: Package },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/edit", label: "Edit Profile", icon: Edit3 },
  ];

  const infoItems = [
    { href: "/contact", label: "Contact Us", icon: Info },
    { href: "/shipping", label: "Shipping Info", icon: Truck },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-brand-dark shadow-2xl flex flex-col animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
          <h1 className="text-xl font-bold">
            <BrandName name={siteConfig.name} />
          </h1>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-brand-card rounded-full hover:bg-gray-200 dark:hover:bg-brand-border transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 dark:text-white" />
          </button>
        </div>

        {/* User Section */}
        {isAuthenticated ? (
          <div className="p-5 border-b border-gray-100 dark:border-brand-border">
            <Link
              href="/account/edit"
              onClick={onClose}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-brand-green text-black flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-brand-green/30 flex-shrink-0">
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <Edit3 className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Link>
          </div>
        ) : (
          <div className="p-5 border-b border-gray-100 dark:border-brand-border">
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-brand-green text-black font-bold py-3 rounded-full"
            >
              <User className="w-4 h-4" /> Login / Sign Up
            </Link>
          </div>
        )}

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
              Shop
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-semibold dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
                >
                  <Icon className="w-4 h-4 text-brand-green" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Account Section */}
          {isAuthenticated && (
            <div className="mb-2 mt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
                My Account
              </p>
              {accountItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-semibold dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
                  >
                    <Icon className="w-4 h-4 text-brand-green" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mb-2 mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
              Support
            </p>
            {infoItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-semibold dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
                >
                  <Icon className="w-4 h-4 text-brand-green" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-gray-100 dark:border-brand-border pt-4">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-3 text-sm font-semibold dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-yellow-400" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-brand-green" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <div className="p-4 border-t border-gray-100 dark:border-brand-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}