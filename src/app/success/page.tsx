// src/app/success/page.tsx
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CartClearer from "@/components/CartClearer";

interface PageProps {
  searchParams: Promise<{ session_id?: string; orderId?: string }>;
}

// 👇 ডাটাবেসে অর্ডার খোঁজার জন্য হেল্পার ফাংশন (Retry Logic সহ)
async function findOrder(sessionId: string) {
  const maxRetries = 5;
  const delay = 1500; // ১.৫ সেকেন্ড

  for (let i = 0; i < maxRetries; i++) {
    const { data } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (data) return data.id;
    
    // না পেলে অপেক্ষা করুন
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return null;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id, orderId } = await searchParams;

  let finalOrderId = orderId;

  // স্ট্রাইপ পেমেন্টের জন্য session_id থাকলে অর্ডার খুঁজব
  if (session_id && !orderId) {
    finalOrderId = await findOrder(session_id);
    
    if (!finalOrderId) {
      // ৫ বার চেষ্টা করেও না পেলে এরর দেখাব
      return (
        <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold dark:text-white mb-2">Order Not Found Yet</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              We received your payment, but your order is still processing. Please check your Orders page in a minute.
            </p>
            <Link href="/orders" className="inline-block bg-brand-green text-black font-bold px-6 py-3 rounded-full">
              Go to My Orders
            </Link>
          </div>
        </main>
      );
    }
  }

  if (!finalOrderId) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white mb-2">Invalid Link</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">No order information found.</p>
          <Link href="/shop" className="inline-block bg-brand-green text-black font-bold px-6 py-3 rounded-full">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center px-4 py-12">
      {/* 👇 কার্ট ক্লিয়ারার এখানে কল করা হলো */}
      <CartClearer />
      
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-16 h-16 text-black" strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-bold dark:text-white mb-3">Order Confirmed!</h1>
        
        <div className="inline-flex items-center gap-2 bg-brand-green text-black rounded-full px-4 py-2 mb-4">
          <span className="text-xs font-bold">Order ID:</span>
          <span className="text-sm font-bold">{finalOrderId}</span>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
          Thank you for your order! We've received your payment and will send you a confirmation email shortly.
        </p>

        <div className="bg-gray-50 dark:bg-brand-card p-4 rounded-2xl mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 dark:text-gray-400">Order Status</p>
            <p className="text-sm font-bold dark:text-white">Confirmed & Processing</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/orders" className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-brand-card text-gray-900 dark:text-white font-bold px-6 py-3 rounded-full hover:bg-gray-200 dark:hover:bg-brand-border transition-colors">
            View My Orders
          </Link>
          <Link href="/" className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-green text-black font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}