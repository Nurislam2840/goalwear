// src/app/orders/page.tsx
"use client";

import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Package, ChevronDown, ChevronUp, Clock, CheckCircle2,
  Truck, XCircle, ArrowLeft, ShoppingBag, Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { orders, isHydrated: ordersHydrated } = useOrders();
  const { isAuthenticated, isHydrated: authHydrated } = useAuth();
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (authHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authHydrated, router]);

  if (!authHydrated || !ordersHydrated) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Redirecting...</p>
      </main>
    );
  }

  const getStatusIcon = (status: string) => {
    if (status === "Delivered") return <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />;
    if (status === "Shipped") return <Truck className="w-3.5 h-3.5" strokeWidth={2.5} />;
    if (status === "Cancelled") return <XCircle className="w-3.5 h-3.5" strokeWidth={2.5} />;
    return <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />;
  };

  const getStatusStyle = (status: string) => {
    if (status === "Delivered") return "bg-brand-green text-black";
    if (status === "Shipped") return "bg-blue-500 text-white";
    if (status === "Cancelled") return "bg-red-500 text-white";
    return "bg-yellow-400 text-black";
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="p-2 bg-gray-100 dark:bg-brand-card rounded-full">
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">My Orders</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {orders.length} {orders.length === 1 ? "order" : "orders"} total
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
            <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-black" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold dark:text-white mb-2">No orders yet</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Your orders will appear here after you make a purchase
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="w-4 h-4" /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Order ID
                        </p>
                        <p className="font-bold dark:text-white text-sm">
                          {order.id}
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                        <p className="text-sm font-semibold dark:text-white">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                        <p className="text-sm font-bold dark:text-white">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
                        <p className="text-sm font-semibold dark:text-white">
                          {order.items.length}
                        </p>
                      </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-brand-green text-black text-xs font-bold py-2.5 rounded-full hover:opacity-90 transition-opacity"
                      >
                        {isExpanded ? (
                          <>Hide Details <ChevronUp className="w-3.5 h-3.5" strokeWidth={2.5} /></>
                        ) : (
                          <>View Details <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} /></>
                        )}
                      </button>

                      {/* 👇 Track Order Button */}
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-brand-dark text-gray-700 dark:text-gray-300 text-xs font-bold py-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-brand-border transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Track Order
                      </Link>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-brand-border p-5 bg-gray-50 dark:bg-brand-dark/50 animate-slide-up">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                        Items
                      </h3>
                      <div className="space-y-3 mb-5">
                        {order.items.map((item) => (
                          <Link
                            key={item.id}
                            href={`/product/${item.id}`}
                            className="flex items-center gap-3 bg-white dark:bg-brand-card rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
                          >
                            <div className="w-14 h-14 bg-gray-50 dark:bg-brand-dark rounded-xl flex items-center justify-center p-2 flex-shrink-0 border border-gray-100 dark:border-brand-border">
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                width={56}
                                height={56}
                                className="object-contain mix-blend-multiply dark:mix-blend-normal"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold dark:text-white line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ${item.price} × {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-bold dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </Link>
                        ))}
                      </div>

                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                        Delivery Information
                      </h3>
                      <div className="bg-white dark:bg-brand-card rounded-xl p-4 mb-5">
                        <p className="text-sm font-semibold dark:text-white">
                          {order.customerInfo.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {order.customerInfo.phone}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {order.customerInfo.address}, {order.customerInfo.city}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          Payment Method
                        </span>
                        <span className="font-bold dark:text-white">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}