// src/app/success/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CartClearer from "@/components/CartClearer";

interface PageProps {
  searchParams: Promise<{
    session_id?: string;
    orderId?: string;
    user_id?: string;
  }>;
}

// ============================================
// Verify Stripe session & save order
// ============================================
async function verifyAndSaveStripeOrder(
  sessionId: string,
  userIdParam?: string
) {
  console.log("[success] 🔍 Verifying session:", sessionId);
  console.log("[success] 👤 User ID param:", userIdParam || "NONE");

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("[success] ❌ Stripe key missing");
    return { error: "Payment not configured" };
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey);

  // Fetch session from Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("[success] ✅ Session retrieved:", {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
    });
  } catch (err: any) {
    console.error("[success] ❌ Session retrieve error:", err.message);
    return { error: "Invalid session" };
  }

  // Verify payment
  if (session.payment_status !== "paid") {
    console.error("[success] ❌ Payment not paid:", session.payment_status);
    return { error: "Payment not completed" };
  }

  // Check if order already exists (idempotency)
  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (existing) {
    console.log("[success] ✅ Order already exists:", existing.id);
    return { orderId: existing.id, session };
  }

  // Generate order ID
  const orderId = `GW-${Date.now().toString().slice(-8)}`;
  console.log("[success] 📝 Creating new order:", orderId);

  // Fetch line items from Stripe
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

  const items = lineItems.data.map((li: any) => ({
    id: 0,
    name: li.description || "Product",
    price: (li.amount_total || 0) / 100 / (li.quantity || 1),
    image_url: "",
    quantity: li.quantity || 1,
  }));

  console.log("[success] 📦 Items count:", items.length);

  // Use userId from URL param OR from Stripe metadata
  const finalUserId = userIdParam || session.metadata?.userId || null;
  console.log("[success] 👤 Final user ID:", finalUserId);

  // Save order to Supabase
  const { error: insertError } = await supabaseAdmin
    .from("orders")
    .insert({
      id: orderId,
      user_id: finalUserId,
      items,
      total: (session.amount_total || 0) / 100,
      status: "Processing",
      customer_info: {
        name: session.metadata?.customerName || "Customer",
        email: session.customer_email || "",
        phone: session.metadata?.customerPhone || "",
        address: session.metadata?.customerAddress || "",
        city: session.metadata?.customerCity || "",
      },
      payment_method: "Card (Stripe)",
      stripe_session_id: sessionId,
    });

  if (insertError) {
    console.error("[success] ❌ Order save error:", insertError.message);
    return { error: "Failed to save order: " + insertError.message };
  }

  console.log("[success] ✅ Order saved successfully:", orderId);
  return { orderId, session };
}

// ============================================
// Success Page
// ============================================
export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id, orderId, user_id } = await searchParams;

  // CASE 1: COD order — show success directly
  if (orderId && !session_id) {
    return <SuccessUI orderId={orderId} isCOD={true} />;
  }

  // CASE 2: No session_id → invalid link
  if (!session_id) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white mb-2">
            Invalid Payment Link
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            This page requires a valid payment session.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-green text-black font-bold px-6 py-3 rounded-full"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // CASE 3: Stripe session → verify & save
  const result = await verifyAndSaveStripeOrder(session_id, user_id);

  if (result.error) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white mb-2">
            Payment Verified
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Your payment was successful!
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            {result.error}
          </p>
          <div className="flex gap-3">
            <Link
              href="/orders"
              className="flex-1 bg-gray-100 dark:bg-brand-card text-gray-900 dark:text-white font-bold py-3 rounded-full text-center"
            >
              View Orders
            </Link>
            <Link
              href="/"
              className="flex-1 bg-brand-green text-black font-bold py-3 rounded-full text-center"
            >
              Continue
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <SuccessUI orderId={result.orderId!} isCOD={false} />;
}

// ============================================
// Success UI
// ============================================
function SuccessUI({
  orderId,
  isCOD,
}: {
  orderId: string;
  isCOD: boolean;
}) {
  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center px-4 py-12">
      <CartClearer />

      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2
            className="w-16 h-16 text-black"
            strokeWidth={2.5}
          />
        </div>

        <h1 className="text-3xl font-bold dark:text-white mb-3">
          {isCOD ? "Order Placed!" : "Payment Successful!"}
        </h1>

        <div className="inline-flex items-center gap-2 bg-brand-green text-black rounded-full px-4 py-2 mb-4">
          <span className="text-xs font-bold">Order ID:</span>
          <span className="text-sm font-bold">{orderId}</span>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
          {isCOD
            ? "Thank you for your order! We will confirm and ship your order within 2-3 business days."
            : "Thank you for your order! We've received your payment and will send you a confirmation email shortly. Your order will be shipped within 2-3 business days."}
        </p>

        <div className="bg-gray-50 dark:bg-brand-card p-4 rounded-2xl mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Order Status
            </p>
            <p className="text-sm font-bold dark:text-white">
              Confirmed & Processing
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/orders"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-brand-card text-gray-900 dark:text-white font-bold px-6 py-3 rounded-full hover:bg-gray-200 dark:hover:bg-brand-border transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-green text-black font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Support email — solid green badge for readability */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-brand-border">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need help? Contact us at{" "}
            <span className="inline-block bg-brand-green text-black font-bold px-2 py-0.5 rounded">
              support@goalwear.com
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}