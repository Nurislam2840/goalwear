// src/app/admin/page.tsx
"use client";

import { useOrders } from "@/context/OrderContext";
import { useSiteData } from "@/context/SiteDataContext";
import {
  Package, ShoppingCart, DollarSign, Users, TrendingUp,
  ArrowRight, Eye, Zap, BarChart3, Award
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function AdminDashboard() {
  const { orders } = useOrders();
  const { products, brands } = useSiteData();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalBrands = brands.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
    },
    {
      label: "Products",
      value: totalProducts,
      icon: Package,
    },
    {
      label: "Avg Order",
      value: `$${avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
    },
  ];

  const recentOrders = orders.slice(0, 5);

  // 👇 Generate last 7 days revenue data (from orders)
  const chartData = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayRevenue = orders
        .filter((o) => {
          const od = new Date(o.date);
          return od >= d && od < nextD;
        })
        .reduce((sum, o) => sum + o.total, 0);

      days.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        value: dayRevenue,
      });
    }
    return days;
  }, [orders]);

  const maxRevenue = Math.max(...chartData.map((d) => d.value), 1);

  // 👇 Top selling products (based on order items)
  const topProducts = useMemo(() => {
    const productCounts: Record<number, { name: string; count: number; revenue: number }> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productCounts[item.id]) {
          productCounts[item.id] = { name: item.name, count: 0, revenue: 0 };
        }
        productCounts[item.id].count += item.quantity;
        productCounts[item.id].revenue += item.price * item.quantity;
      });
    });
    return Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's your store overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-brand-card p-4 md:p-5 rounded-2xl border border-gray-100 dark:border-brand-border"
            >
              <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-xl md:text-2xl font-bold dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* 👇 Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        
        {/* Revenue Chart — Last 7 Days */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-bold dark:text-white text-sm">Revenue — Last 7 Days</h2>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Daily sales overview
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total
              </p>
              <p className="font-bold dark:text-white">
                ${chartData.reduce((s, d) => s + d.value, 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Bar Chart (SVG-based) */}
          <div className="flex items-end justify-between gap-2 md:gap-3 h-40">
            {chartData.map((day, idx) => {
              const heightPercent = (day.value / maxRevenue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full h-32 flex items-end justify-center">
                    <div
                      className="w-full max-w-[40px] bg-brand-green rounded-t-lg transition-all duration-500 relative group"
                      style={{
                        height: `${Math.max(heightPercent, 4)}%`,
                        minHeight: "4px",
                      }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        ${day.value.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    {day.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold dark:text-white text-sm">Top Products</h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Best sellers
              </p>
            </div>
          </div>

          {topProducts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No sales yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-black">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {product.count} sold
                    </p>
                  </div>
                  <p className="text-xs font-bold text-brand-green flex-shrink-0">
                    ${product.revenue.toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-bold dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/admin/products"
            className="bg-brand-green text-black font-bold p-4 rounded-2xl hover:opacity-90 transition-opacity text-center"
          >
            <Package className="w-5 h-5 mx-auto mb-1.5" strokeWidth={2.5} />
            <p className="text-xs">Manage Products</p>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border font-bold p-4 rounded-2xl hover:border-brand-green transition-colors text-center dark:text-white"
          >
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center mx-auto mb-1.5">
              <ShoppingCart className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <p className="text-xs">View Orders</p>
          </Link>
          <Link
            href="/admin/hero"
            className="bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border font-bold p-4 rounded-2xl hover:border-brand-green transition-colors text-center dark:text-white"
          >
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center mx-auto mb-1.5">
              <Eye className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <p className="text-xs">Edit Hero</p>
          </Link>
          <Link
            href="/admin/settings"
            className="bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border font-bold p-4 rounded-2xl hover:border-brand-green transition-colors text-center dark:text-white"
          >
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center mx-auto mb-1.5">
              <TrendingUp className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <p className="text-xs">Site Settings</p>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100 dark:border-brand-border flex items-center justify-between">
          <h2 className="font-bold dark:text-white">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
          >
            View All <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-brand-border">
                  <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Order ID
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Total
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 dark:border-brand-border/50 last:border-0"
                  >
                    <td className="px-5 py-3 text-sm font-bold dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-5 py-3 text-sm dark:text-gray-300">
                      {order.customerInfo.name}
                    </td>
                    <td className="px-5 py-3 text-sm font-bold dark:text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-brand-green text-black text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold dark:text-white">Live Data Editing</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              All changes save instantly and reflect across the site immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}