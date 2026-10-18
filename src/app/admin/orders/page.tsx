// src/app/admin/orders/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useOrders, Order } from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";
import ThemedSelect from "@/components/ThemedSelect";
import {
  ShoppingCart, Search, X, ChevronDown, ChevronUp,
  Clock, CheckCircle2, Truck, XCircle, Trash2,
  User, Mail, Phone, MapPin, DollarSign, Plane, Ship
} from "lucide-react";
import Image from "next/image";

const STATUS_OPTIONS: Order["status"][] = ["Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder, updateShippingMethod } = useOrders();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Order["status"]>("All");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Order | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerInfo.name.toLowerCase().includes(q) ||
          o.customerInfo.email.toLowerCase().includes(q) ||
          o.customerInfo.phone.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} → ${newStatus}`, "success");
    if (newStatus === "Shipped") setExpandedOrder(orderId); // Auto-expand to choose shipping method
  };

  const handleShippingMethodChange = (orderId: string, method: string) => {
    updateShippingMethod(orderId, method);
    showToast(`Shipping method updated to ${method.toUpperCase()}`, "success");
  };

  const handleDeleteOrder = (order: Order) => {
    deleteOrder(order.id);
    showToast(`Order ${order.id} deleted`, "success");
    setDeleteConfirm(null);
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

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const processing = orders.filter((o) => o.status === "Processing").length;
  const shipped = orders.filter((o) => o.status === "Shipped").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          Orders
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage all customer orders and update their status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-brand-card p-4 rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Revenue
          </p>
          <p className="text-lg font-bold dark:text-white mt-0.5">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-brand-card p-4 rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Processing
          </p>
          <p className="text-lg font-bold dark:text-white mt-0.5">{processing}</p>
        </div>
        <div className="bg-white dark:bg-brand-card p-4 rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center mb-2">
            <Truck className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Shipped
          </p>
          <p className="text-lg font-bold dark:text-white mt-0.5">{shipped}</p>
        </div>
        <div className="bg-white dark:bg-brand-card p-4 rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Delivered
          </p>
          <p className="text-lg font-bold dark:text-white mt-0.5">{delivered}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-xl px-4 py-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, email, phone..."
            className="bg-transparent border-none outline-none ml-2 w-full text-sm dark:text-white placeholder-gray-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["All", ...STATUS_OPTIONS] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === status
                  ? "bg-brand-green text-black"
                  : "bg-white dark:bg-brand-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-brand-border hover:border-brand-green"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No orders found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {searchQuery || statusFilter !== "All"
              ? "Try a different filter or search"
              : "Orders will appear here when customers make a purchase"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const currentShipping = order.shippingMethod || "truck";
            
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border overflow-hidden"
              >
                {/* Header Row */}
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                        Order ID
                      </p>
                      <p className="font-bold dark:text-white text-sm">
                        {order.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="min-w-[140px]">
                        <ThemedSelect
                          value={order.status}
                          onChange={(value) =>
                            handleStatusChange(order.id, value as Order["status"])
                          }
                          options={STATUS_OPTIONS}
                          size="sm"
                          fullWidth
                        />
                      </div>

                      <button
                        onClick={() => setDeleteConfirm(order)}
                        className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
                        aria-label="Delete order"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Customer</p>
                        <p className="text-xs font-bold dark:text-white">
                          {order.customerInfo.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Items</p>
                        <p className="font-bold dark:text-white">
                          {order.items.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total</p>
                        <p className="font-bold dark:text-white">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Date</p>
                        <p className="font-bold dark:text-white">
                          {formatDate(order.date).split(",")[0]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* শিপিং মেথড সিলেক্টর (শুধু Shipped হলে দেখাবে) */}
                  {order.status === "Shipped" && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-500" />
                        <p className="text-xs font-bold dark:text-white">How is this shipping?</p>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { id: "truck", icon: Truck, label: "Truck" },
                          { id: "plane", icon: Plane, label: "Plane" },
                          { id: "ship", icon: Ship, label: "Ship" },
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => handleShippingMethodChange(order.id, m.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentShipping === m.id
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-white dark:bg-brand-dark text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                            }`}
                          >
                            <m.icon className="w-3.5 h-3.5" />
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full mt-4 flex items-center justify-center gap-1.5 bg-brand-green text-black text-xs font-bold py-2.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    {isExpanded ? (
                      <>
                        Hide Details <ChevronUp className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </>
                    ) : (
                      <>
                        View Details <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-brand-border p-5 bg-gray-50 dark:bg-brand-dark/50 animate-slide-up">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                      Items ({order.items.length})
                    </h3>
                    <div className="space-y-2 mb-5">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white dark:bg-brand-card rounded-xl p-3"
                        >
                          <div className="w-12 h-12 bg-gray-50 dark:bg-brand-dark rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="object-contain mix-blend-multiply dark:mix-blend-normal"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold dark:text-white line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                      Customer Information
                    </h3>
                    <div className="bg-white dark:bg-brand-card rounded-xl p-4 space-y-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">Name</p>
                          <p className="text-sm font-semibold dark:text-white">
                            {order.customerInfo.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-sm font-semibold dark:text-white break-all">
                            {order.customerInfo.email || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-sm font-semibold dark:text-white">
                            {order.customerInfo.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">Address</p>
                          <p className="text-sm font-semibold dark:text-white">
                            {order.customerInfo.address || "N/A"}
                            {order.customerInfo.city && `, ${order.customerInfo.city}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-brand-card rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          Payment Method
                        </p>
                        <p className="text-sm font-bold dark:text-white">
                          {order.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          Order Date
                        </p>
                        <p className="text-sm font-bold dark:text-white">
                          {formatDate(order.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setDeleteConfirm(null)}
          ></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
            <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold dark:text-white text-center mb-2">
              Delete Order?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete order{" "}
              <span className="font-bold dark:text-white">"{deleteConfirm.id}"</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl hover:bg-gray-200 dark:hover:bg-brand-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(deleteConfirm)}
                className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:opacity-90 transition-opacity"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}