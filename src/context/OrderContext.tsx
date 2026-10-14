// src/context/OrderContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (
    order: Omit<Order, "id" | "date" | "status">
  ) => Promise<string>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  isHydrated: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isHydrated: authHydrated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // ============ Fetch orders from Supabase ============
  async function fetchOrders() {
    if (!user?.id) {
      console.log("[OrderContext] No user ID, skipping fetch");
      setOrders([]);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "x-user-id": user.id, // 👈 Send user ID in header
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn("[OrderContext] Fetch failed:", res.status, errText);
        return;
      }

      const data = await res.json();
      if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
        console.log(`✅ Loaded ${data.orders.length} orders`);
      }
    } catch (err) {
      console.error("[OrderContext] Fetch error:", err);
    }
  }

  // Load on mount + when user changes
  useEffect(() => {
    if (!authHydrated) return;

    if (isAuthenticated && user?.id) {
      fetchOrders().finally(() => setIsHydrated(true));
    } else {
      setOrders([]);
      setIsHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHydrated, isAuthenticated, user?.id]);

  // ============ Add Order (server-side) ============
  const addOrder = async (
    orderData: Omit<Order, "id" | "date" | "status">
  ): Promise<string> => {
    if (!user?.id) {
      throw new Error("You must be logged in to place an order");
    }

    try {
      console.log("[OrderContext] 🛒 Placing order...");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id, // 👈 Send user ID in header
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("[OrderContext] ❌ Order failed:", data.error);
        throw new Error(data.error || "Failed to create order");
      }

      const newOrder: Order = data.order;
      console.log("[OrderContext] ✅ Order placed:", newOrder.id);

      setOrders((prev) => [newOrder, ...prev]);
      return newOrder.id;
    } catch (err: any) {
      console.error("[OrderContext] addOrder error:", err.message);
      throw err;
    }
  };

  // ============ Update Order Status (admin) ============
  const updateOrderStatus = async (
    id: string,
    status: Order["status"]
  ): Promise<void> => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );

    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update order");
      }
    } catch (err: any) {
      console.error("[OrderContext] updateOrderStatus error:", err.message);
      if (user?.id) await fetchOrders();
      throw err;
    }
  };

  // ============ Delete Order (admin) ============
  const deleteOrder = async (id: string): Promise<void> => {
    setOrders((prev) => prev.filter((o) => o.id !== id));

    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete order");
      }
    } catch (err: any) {
      console.error("[OrderContext] deleteOrder error:", err.message);
      if (user?.id) await fetchOrders();
      throw err;
    }
  };

  const clearAllOrders = async (): Promise<void> => {
    setOrders([]);
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  const refreshOrders = async () => {
    await fetchOrders();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        clearAllOrders,
        getOrder,
        refreshOrders,
        isHydrated,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
}