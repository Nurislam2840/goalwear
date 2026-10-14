// src/app/checkout/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import CouponInput from "@/components/CouponInput";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useCoupon } from "@/context/CouponContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { useAddresses, Address } from "@/context/AddressContext";
import {
  ArrowLeft,
  Loader2,
  Lock,
  MapPin,
  Plus,
  Check,
  Home as HomeIcon,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LABEL_ICONS: Record<string, any> = {
  Home: HomeIcon,
  Office: Briefcase,
  Other: MapPin,
};

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { appliedCoupon, calculateDiscount } = useCoupon();
  const { user, isAuthenticated, isHydrated: authHydrated } = useAuth();
  const { addresses, isHydrated: addrHydrated } = useAddresses();
  const { showToast } = useToast();
  const router = useRouter();

  const discount = calculateDiscount(cartTotal);
  const finalTotal = Math.round((cartTotal - discount) * 100) / 100;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authHydrated || !addrHydrated) return;

    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }

    if (addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      applyAddressToForm(defaultAddr);
      setSelectedAddressId(defaultAddr.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHydrated, addrHydrated, isAuthenticated, user, addresses.length]);

  const applyAddressToForm = (addr: Address) => {
    setFormData((prev) => ({
      ...prev,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
    }));
  };

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    applyAddressToForm(addr);
    showToast(`Address "${addr.label}" selected`, "success");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      // ============================================
      // COD — Save order to Supabase
      // ============================================
      if (paymentMethod === "cod") {
        if (!isAuthenticated) {
          showToast("Please login to place an order", "error");
          router.push("/login");
          return;
        }

        const orderItems = cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          quantity: item.quantity,
        }));

        const orderId = await addOrder({
          items: orderItems,
          total: finalTotal,
          customerInfo: formData,
          paymentMethod: appliedCoupon
            ? `Cash on Delivery (Coupon: ${appliedCoupon.code})`
            : "Cash on Delivery",
        });

        clearCart();

        showToast(`Order ${orderId} placed successfully!`, "success");
        router.push(`/success?orderId=${orderId}`);
        return;
      }

      // ============================================
      // CARD — Server-side Stripe (SECURE)
      // ============================================
      const cartItemsForServer = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cartItemsForServer,
          customerInfo: formData,
          couponCode: appliedCoupon?.code || "",
          userId: user?.id || "", // 👈 Send user ID
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Your cart is empty!
          </p>
          <Link
            href="/"
            className="bg-brand-green text-black font-bold px-6 py-3 rounded-full"
          >
            Go Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/cart"
            className="p-2 bg-gray-100 dark:bg-brand-card rounded-full"
          >
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">Checkout</h1>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="md:col-span-2 space-y-6">
            {/* Saved Addresses */}
            {isAuthenticated && addresses.length > 0 && (
              <div className="bg-brand-green/5 dark:bg-brand-green/5 p-6 rounded-2xl border-2 border-brand-green/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-black" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold dark:text-white">
                        Saved Addresses
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Click to auto-fill your details
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/account/addresses"
                    className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-3 py-2 rounded-full hover:opacity-90"
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                    Add New
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {addresses.map((addr) => {
                    const LabelIcon = LABEL_ICONS[addr.label] || MapPin;
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectAddress(addr)}
                        className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-brand-green bg-white dark:bg-brand-card shadow-lg"
                            : "border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card hover:border-brand-green/50"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-brand-green rounded-full flex items-center justify-center">
                            <Check
                              className="w-3.5 h-3.5 text-black"
                              strokeWidth={3}
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                            <LabelIcon
                              className="w-3.5 h-3.5 text-black"
                              strokeWidth={2.5}
                            />
                          </div>
                          <p className="text-xs font-bold dark:text-white uppercase tracking-wider">
                            {addr.label}
                          </p>
                          {addr.isDefault && (
                            <span className="bg-brand-green text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold dark:text-gray-300 mb-1">
                          {addr.name}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                          {addr.address}, {addr.city}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shipping Information */}
            <div className="bg-gray-50 dark:bg-brand-card p-6 rounded-2xl border border-gray-100 dark:border-brand-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold dark:text-white">
                  Shipping Information
                </h2>
                {selectedAddressId && (
                  <span className="bg-brand-green text-black text-[10px] font-bold px-3 py-1 rounded-full">
                    Auto-filled ✓
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1234-567890"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-gray-300 mb-1">
                    Full Address
                  </label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, House No..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-gray-300 mb-1">
                    City / Country
                  </label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Dhaka, Bangladesh"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 dark:bg-brand-card p-6 rounded-2xl border border-gray-100 dark:border-brand-border">
              <h2 className="text-lg font-bold dark:text-white mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === "cod"
                      ? "border-brand-green bg-brand-green/10"
                      : "border-gray-200 dark:border-brand-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-brand-green"
                  />
                  <div className="flex-1">
                    <p className="font-semibold dark:text-white text-sm">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pay when you receive
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === "card"
                      ? "border-brand-green bg-brand-green/10"
                      : "border-gray-200 dark:border-brand-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-brand-green"
                  />
                  <div className="flex-1">
                    <p className="font-semibold dark:text-white text-sm">
                      Credit / Debit Card
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Secure via Stripe
                    </p>
                  </div>
                  <Lock className="w-4 h-4 text-brand-green" />
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-brand-card p-6 rounded-2xl border border-gray-100 dark:border-brand-border h-fit">
            <h2 className="text-lg font-bold dark:text-white mb-4">
              Your Order
            </h2>

            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-xs dark:text-gray-300"
                >
                  <span className="line-clamp-1 flex-1">
                    {item.name}{" "}
                    <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-bold ml-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-brand-border pt-4 space-y-3 text-sm dark:text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && discount > 0 && (
                <div className="flex items-center justify-between gap-2 bg-brand-green text-black rounded-xl px-3 py-2.5">
                  <span className="text-xs font-bold">
                    Discount ({appliedCoupon.code})
                  </span>
                  <span className="text-sm font-bold">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <span>Shipping</span>
                <span className="bg-brand-green text-black text-xs font-bold px-3 py-1.5 rounded-full">
                  {appliedCoupon?.type === "shipping" ? "FREE 🎉" : "Free"}
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-brand-border pt-3 flex justify-between items-center font-bold text-lg dark:text-white">
                <span>Total</span>
                <span className="bg-brand-green text-black px-3 py-1 rounded-full">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-200 dark:border-brand-border">
              <CouponInput />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-brand-green text-black font-bold py-4 rounded-full mt-6 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" /> Place Order — $
                  {finalTotal.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}