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
import { useSiteData } from "@/context/SiteDataContext"; // 👈 নতুন ইম্পোর্ট

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
  shippingMethod?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (
    order: Omit<Order, "id" | "date" | "status">
  ) => Promise<string>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  updateShippingMethod: (id: string, method: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  isHydrated: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isHydrated: authHydrated } = useAuth();
  const { products, updateProducts } = useSiteData(); // 👈 স্টক আপডেটের জন্য
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  async function fetchOrders() {
    if (!user?.id) {
      setOrders([]);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("[OrderContext] Fetch error:", err);
    }
  }

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

  const addOrder = async (
    orderData: Omit<Order, "id" | "date" | "status">
  ): Promise<string> => {
    if (!user?.id) {
      throw new Error("You must be logged in to place an order");
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const newOrder: Order = data.order;
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder.id;
    } catch (err: any) {
      throw err;
    }
  };

  const updateOrderStatus = async (
    id: string,
    status: Order["status"]
  ): Promise<void> => {
    // 👇 স্টক ফেরত আনার লজিক (যদি Cancelled করা হয়)
    if (status === "Cancelled") {
      const orderToCancel = orders.find((o) => o.id === id);
      if (orderToCancel && orderToCancel.status !== "Cancelled") {
        const updatedProducts = products.map((p) => {
          const orderedItem = orderToCancel.items.find((i) => i.id === p.id);
          if (orderedItem) {
            return { ...p, stock: (p.stock || 0) + orderedItem.quantity };
          }
          return p;
        });
        await updateProducts(updatedProducts); // ডাটাবেসে স্টক আপডেট
      }
    }

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
        throw new Error("Failed to update order");
      }
    } catch (err: any) {
      if (user?.id) await fetchOrders();
      throw err;
    }
  };

  const updateShippingMethod = async (id: string, method: string): Promise<void> => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, shippingMethod: method } : o))
    );

    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shipping_method: method }),
      });

      if (!res.ok) throw new Error("Failed to update shipping method");
    } catch (err: any) {
      if (user?.id) await fetchOrders();
      throw err;
    }
  };

  const deleteOrder = async (id: string): Promise<void> => {
    setOrders((prev) => prev.filter((o) => o.id !== id));

    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete order");
    } catch (err: any) {
      if (user?.id) await fetchOrders();
      throw err;
    }
  };

  const clearAllOrders = async (): Promise<void> => { setOrders([]); };
  const getOrder = (id: string) => orders.find((o) => o.id === id);
  const refreshOrders = async () => { await fetchOrders(); };

  return (
    <OrderContext.Provider
      value={{
        orders, addOrder, updateOrderStatus, updateShippingMethod, deleteOrder,
        clearAllOrders, getOrder, refreshOrders, isHydrated,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
}