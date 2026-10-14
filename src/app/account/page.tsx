// src/app/account/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useAddresses } from "@/context/AddressContext";
import { useToast } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User, Mail, Package, Heart, MapPin, LogOut, ShoppingBag,
  ChevronRight, CheckCircle2, Loader2, Edit3
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { user, isAuthenticated, logout, isHydrated } = useAuth();
  const { cartCount } = useCart();
  const { orders } = useOrders();
  const { addresses } = useAddresses();
  const { showToast } = useToast();
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      const saved = localStorage.getItem("goalwear-user");
      const hasValidUser = saved && saved !== "null" && saved !== "undefined";

      if (!hasValidUser && !isAuthenticated) {
        router.push("/login");
      } else {
        setCheckingAuth(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || checkingAuth) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Loading account...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Redirecting to login...</p>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark pb-24 md:pb-0">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">My Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your profile, orders, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Sidebar */}
          <div className="space-y-6">
            
            {/* 👇 Profile Card with Avatar */}
            <div className="bg-gradient-to-br from-brand-green/10 to-gray-50 dark:from-brand-green/5 dark:to-brand-card rounded-3xl p-6 border border-gray-100 dark:border-brand-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-green text-black flex items-center justify-center text-2xl font-bold overflow-hidden flex-shrink-0 border-2 border-brand-green/30">
                  {user.avatar ? (
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
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  <Link
                    href="/account/edit"
                    className="inline-flex items-center gap-1.5 mt-2 bg-brand-green text-black text-[10px] font-bold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    <Edit3 className="w-3 h-3" strokeWidth={2.5} />
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                className="bg-gray-50 dark:bg-brand-card p-4 rounded-2xl border border-gray-100 dark:border-brand-border hover:border-brand-green transition-colors"
              >
                <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center mb-2">
                  <ShoppingBag className="w-4 h-4 text-black" strokeWidth={2.5} />
                </div>
                <p className="text-xl font-bold dark:text-white">{cartCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">In Cart</p>
              </Link>
              <Link
                href="/orders"
                className="bg-gray-50 dark:bg-brand-card p-4 rounded-2xl border border-gray-100 dark:border-brand-border hover:border-brand-green transition-colors"
              >
                <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center mb-2">
                  <Package className="w-4 h-4 text-black" strokeWidth={2.5} />
                </div>
                <p className="text-xl font-bold dark:text-white">{orders.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
              </Link>
            </div>

            {/* Menu */}
            <div className="bg-gray-50 dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border overflow-hidden">
              <Link
                href="/orders"
                className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-brand-border hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-black" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-semibold dark:text-white">My Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-brand-border hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-black" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-semibold dark:text-white">Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/account/addresses"
                className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-brand-border hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-black" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-semibold dark:text-white">Addresses</span>
                </div>
                <div className="flex items-center gap-2">
                  {addresses.length > 0 && (
                    <span className="bg-brand-green text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {addresses.length}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>

              <Link
                href="/account/edit"
                className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-brand-border hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                    <Edit3 className="w-4 h-4 text-black" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-semibold dark:text-white">Edit Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-semibold text-red-500">Logout</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Profile Info */}
            <div className="bg-gray-50 dark:bg-brand-card rounded-2xl p-6 border border-gray-100 dark:border-brand-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold dark:text-white">Profile Information</h2>
                <Link
                  href="/account/edit"
                  className="text-xs font-bold bg-brand-green text-black px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  Edit
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                    Full Name
                  </label>
                  <div className="flex items-center gap-3 bg-white dark:bg-brand-dark px-4 py-3 rounded-xl border border-gray-200 dark:border-brand-border">
                    <div className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm dark:text-white">{user.name}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 bg-white dark:bg-brand-dark px-4 py-3 rounded-xl border border-gray-200 dark:border-brand-border">
                    <div className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm dark:text-white break-all">{user.email}</span>
                    <CheckCircle2 className="w-4 h-4 text-brand-green ml-auto flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-50 dark:bg-brand-card rounded-2xl p-6 border border-gray-100 dark:border-brand-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold dark:text-white">Recent Orders</h2>
                {orders.length > 0 && (
                  <Link
                    href="/orders"
                    className="text-xs font-bold bg-brand-green text-black px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    View All
                  </Link>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-black" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold dark:text-white mb-1">No orders yet</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                    Your order history will appear here
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-brand-green text-black font-bold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <Link
                      key={order.id}
                      href="/orders"
                      className="flex items-center justify-between p-4 bg-white dark:bg-brand-dark rounded-xl border border-gray-200 dark:border-brand-border hover:border-brand-green transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-black" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold dark:text-white truncate">{order.id}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {order.items.length} items • ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-brand-green text-black px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                        {order.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Addresses */}
            <div className="bg-gray-50 dark:bg-brand-card rounded-2xl p-6 border border-gray-100 dark:border-brand-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold dark:text-white">Saved Addresses</h2>
                <Link
                  href="/account/addresses"
                  className="text-xs font-bold bg-brand-green text-black px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  Manage
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-black" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    No addresses saved yet
                  </p>
                  <Link
                    href="/account/addresses"
                    className="inline-block bg-brand-green text-black font-bold px-5 py-2 rounded-full text-xs hover:opacity-90 transition-opacity"
                  >
                    + Add Address
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.slice(0, 2).map((addr) => (
                    <div
                      key={addr.id}
                      className="flex items-start gap-3 p-3 bg-white dark:bg-brand-dark rounded-xl border border-gray-200 dark:border-brand-border"
                    >
                      <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-black" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold dark:text-white uppercase tracking-wider">
                            {addr.label}
                          </p>
                          {addr.isDefault && (
                            <span className="bg-brand-green text-black text-[9px] font-bold px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {addr.address}, {addr.city}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}