// src/components/Navbar.tsx
"use client";

import { Search, ShoppingCart, Menu, User, Sun, Moon, Heart, LogOut, ChevronDown, X, Edit3 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useSiteData } from "@/context/SiteDataContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MobileDrawer from "@/components/MobileDrawer";
import BrandName from "@/components/BrandName";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const { siteConfig } = useSiteData();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    showToast("Logged out successfully", "success");
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowMobileSearch(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-brand-border px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo & Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileDrawer(true)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-brand-card transition-colors md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 dark:text-white" />
            </button>

            <Link href="/" className="flex items-center gap-2">
              {siteConfig.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  className="h-8 md:h-10 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <BrandName
                  name={siteConfig.name}
                  className="text-xl md:text-2xl font-bold tracking-tight"
                />
              )}
            </Link>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 dark:bg-brand-card rounded-full px-4 py-2 w-1/3">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jerseys, shoes..."
              className="bg-transparent border-none outline-none ml-2 w-full text-sm dark:text-white placeholder-gray-500"
            />
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => setShowMobileSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-brand-card transition-colors md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5 dark:text-white" />
            </button>

            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            )}

            <Link
              href="/wishlist"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 dark:text-white" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 dark:text-white" />
              {mounted && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-black text-[10px] font-bold px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {mounted && isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1.5 pr-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-green text-black flex items-center justify-center text-xs font-bold overflow-hidden border border-brand-green/30">
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
                  <ChevronDown className="w-3.5 h-3.5 hidden md:block dark:text-white" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-white dark:bg-brand-card border border-gray-100 dark:border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                    <div className="p-4 border-b border-gray-100 dark:border-brand-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-green text-black flex items-center justify-center text-sm font-bold overflow-hidden flex-shrink-0">
                        {user?.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
                      >
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      <Link
                        href="/account/edit"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
                      >
                        <Edit3 className="w-4 h-4" /> Edit Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" /> My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
                      >
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 p-2 md:pr-4 rounded-full hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
                aria-label="Login"
              >
                <User className="w-5 h-5 dark:text-white" />
                <span className="text-sm font-bold hidden md:inline dark:text-white">Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileSearch(false)}></div>
          <div className="relative bg-white dark:bg-brand-dark p-4 animate-slide-up">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-gray-100 dark:bg-brand-card rounded-full px-4 py-3">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for jerseys, shoes..."
                  className="bg-transparent border-none outline-none ml-2 w-full text-sm dark:text-white placeholder-gray-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="p-2.5 bg-gray-100 dark:bg-brand-card rounded-full"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </form>

            <div className="mt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Real Madrid", "Nike", "Barcelona", "Adidas", "Boots", "Jersey"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      router.push(`/search?q=${encodeURIComponent(tag)}`);
                      setShowMobileSearch(false);
                    }}
                    className="bg-gray-100 dark:bg-brand-card text-xs font-semibold dark:text-gray-300 px-3 py-2 rounded-full hover:bg-brand-green hover:text-black transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <MobileDrawer
        isOpen={showMobileDrawer}
        onClose={() => setShowMobileDrawer(false)}
      />
    </>
  );
}