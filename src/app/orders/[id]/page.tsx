// src/app/orders/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Calendar,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";

const STATUS_STEPS = [
  { key: "Processing", label: "Order Placed", icon: Clock },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("goalwear-user")?.value;

  if (!userCookie) return null;

  try {
    const parsed = JSON.parse(userCookie);
    return parsed?.id || null;
  } catch {
    return null;
  }
}

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("goalwear-admin-session")?.value;
}

async function fetchOrder(id: string, userId: string | null, admin: boolean) {
  if (!userId && !admin) return null;

  let query = supabaseAdmin.from("orders").select("*").eq("id", id);

  // If NOT admin, only fetch user's own order
  if (!admin && userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    date: data.created_at,
    items: data.items || [],
    total: Number(data.total),
    status: data.status,
    customerInfo: data.customer_info || {},
    paymentMethod: data.payment_method || "Unknown",
  };
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Auth check
  const userId = await getCurrentUserId();
  const admin = await isAdmin();

  if (!userId && !admin) {
    redirect("/login");
  }

  // 2. Fetch order with ownership check
  const order = await fetchOrder(id, userId, admin);

  // 3. If not found OR not owned by user → 404
  if (!order) {
    notFound();
  }

  // 4. Render
  const currentStepIndex = STATUS_STEPS.findIndex(
    (s) => s.key === order.status
  );
  const isCancelled = order.status === "Cancelled";

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark pb-24 md:pb-0">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/orders"
            className="p-2 bg-gray-100 dark:bg-brand-card rounded-full"
          >
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Track Order
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Order ID:{" "}
              <span className="font-bold text-brand-green">{order.id}</span>
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-white dark:bg-brand-card rounded-3xl border border-gray-100 dark:border-brand-border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Current Status
              </p>
              <p className="text-xl font-bold dark:text-white">
                {order.status}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                isCancelled
                  ? "bg-red-500 text-white"
                  : order.status === "Delivered"
                  ? "bg-brand-green text-black"
                  : order.status === "Shipped"
                  ? "bg-blue-500 text-white"
                  : "bg-yellow-400 text-black"
              }`}
            >
              {order.status}
            </div>
          </div>

          {/* Timeline */}
          {!isCancelled && (
            <div className="relative mt-8">
              <div className="flex items-center justify-between relative z-10">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center flex-1 relative"
                    >
                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute top-5 left-1/2 w-full h-1 ${
                            idx < currentStepIndex
                              ? "bg-brand-green"
                              : "bg-gray-200 dark:bg-brand-border"
                          }`}
                        />
                      )}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? "bg-brand-green border-brand-green"
                            : "bg-white dark:bg-brand-card border-gray-200 dark:border-brand-border"
                        } ${
                          isCurrent
                            ? "scale-110 shadow-lg shadow-brand-green/40"
                            : ""
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isCompleted ? "text-black" : "text-gray-400"
                          }`}
                          strokeWidth={2.5}
                        />
                      </div>
                      <p
                        className={`text-[10px] font-bold mt-2 text-center ${
                          isCompleted
                            ? "text-brand-green"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                  This order has been cancelled.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Delivery Information */}
          <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-black" strokeWidth={2.5} />
              </div>
              <h2 className="font-bold dark:text-white text-sm">
                Delivery To
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs dark:text-gray-300">
                  {order.customerInfo.name}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs dark:text-gray-300">
                  {order.customerInfo.phone || "N/A"}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs dark:text-gray-300 break-all">
                  {order.customerInfo.email || "N/A"}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs dark:text-gray-300">
                  {order.customerInfo.address}, {order.customerInfo.city}
                </p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-black" strokeWidth={2.5} />
              </div>
              <h2 className="font-bold dark:text-white text-sm">
                Order Details
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Order Date
                  </p>
                  <p className="text-xs dark:text-gray-300">
                    {formatDate(order.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Payment Method
                  </p>
                  <p className="text-xs dark:text-gray-300">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Package className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Total Amount
                  </p>
                  <p className="text-sm font-bold text-brand-green">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-5 mb-6">
          <h2 className="font-bold dark:text-white text-sm mb-4">
            Items ({order.items.length})
          </h2>

          <div className="space-y-3">
            {order.items.map((item: any, idx: number) => (
              <Link
                key={idx}
                href={`/product/${item.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-brand-dark rounded-xl hover:bg-gray-100 dark:hover:bg-brand-card transition-colors"
              >
                <div className="w-14 h-14 bg-white dark:bg-brand-card rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 border border-gray-100 dark:border-brand-border">
                  <Image
                    src={item.image_url || "https://via.placeholder.com/56"}
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
                    ${Number(item.price).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold dark:text-white">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-5">
          <p className="text-xs font-bold dark:text-white mb-1">Need Help?</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            For any questions about your order, contact us at{" "}
            <span className="text-brand-green font-bold">
              support@goalwear.com
            </span>
          </p>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}