// src/app/shipping/page.tsx
import InfoPageLayout from "@/components/InfoPageLayout";
import { Truck, Plane, Ship, ShieldCheck } from "lucide-react";

export default function ShippingPage() {
  return (
    <InfoPageLayout title="Shipping Information" subtitle="Everything you need to know about our delivery process.">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 dark:bg-brand-card p-5 rounded-2xl border border-gray-100 dark:border-brand-border">
          <Truck className="w-6 h-6 text-brand-green mb-3" />
          <h3 className="font-bold dark:text-white mb-1">Inside Bangladesh</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">3 Business Days (All Divisions)</p>
        </div>
        <div className="bg-gray-50 dark:bg-brand-card p-5 rounded-2xl border border-gray-100 dark:border-brand-border">
          <Plane className="w-6 h-6 text-brand-green mb-3" />
          <h3 className="font-bold dark:text-white mb-1">South Asia</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">5-7 Business Days (India, Sri Lanka, Pakistan, Nepal)</p>
        </div>
        <div className="bg-gray-50 dark:bg-brand-card p-5 rounded-2xl border border-gray-100 dark:border-brand-border">
          <Ship className="w-6 h-6 text-brand-green mb-3" />
          <h3 className="font-bold dark:text-white mb-1">Rest of the World</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">7-10 Business Days</p>
        </div>
        <div className="bg-gray-50 dark:bg-brand-card p-5 rounded-2xl border border-gray-100 dark:border-brand-border">
          <ShieldCheck className="w-6 h-6 text-brand-green mb-3" />
          <h3 className="font-bold dark:text-white mb-1">Free Shipping</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">On all orders over $50 worldwide</p>
        </div>
      </div>

      <h2 className="text-xl font-bold dark:text-white mt-8 mb-3">Order Tracking</h2>
      <p>Once your order is shipped, you will receive an email and SMS with a tracking number. You can also track your order directly from the <strong>"My Orders"</strong> section in your account. Our live 3D map will show you exactly how your package is traveling (by Truck, Plane, or Ship).</p>

      <h2 className="text-xl font-bold dark:text-white mt-8 mb-3">Shipping Costs</h2>
      <p>We offer <strong>Free Shipping</strong> on all orders over $50. For orders under $50, a flat shipping fee of $5 will be applied at checkout.</p>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4 mt-8">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 <strong>Note:</strong> During peak seasons or national holidays, delivery times may be slightly longer. We appreciate your patience!
        </p>
      </div>
    </InfoPageLayout>
  );
}