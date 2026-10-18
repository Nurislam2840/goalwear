// src/app/returns/page.tsx
import InfoPageLayout from "@/components/InfoPageLayout";

export default function ReturnsPage() {
  return (
    <InfoPageLayout title="Returns & Refunds" subtitle="Shop with confidence. We've got you covered with a hassle-free return policy.">
      <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-black dark:text-brand-green mb-2">30-Day Return Policy</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within <strong>30 days</strong> of delivery for a full refund or exchange.
        </p>
      </div>

      <h2 className="text-xl font-bold dark:text-white mt-8 mb-3">Conditions for Returns</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Items must be unused, unwashed, and in their original packaging.</li>
        <li>Tags must still be attached to the product.</li>
        <li>A receipt or proof of purchase is required.</li>
      </ul>

      <h2 className="text-xl font-bold dark:text-white mt-8 mb-3">How to Initiate a Return</h2>
      <ol className="list-decimal pl-6 space-y-3">
        <li>Contact our support team at <a href="mailto:support@goalwear.com" className="text-brand-green font-bold hover:underline">support@goalwear.com</a>.</li>
        <li>Provide your Order ID and the reason for the return.</li>
        <li>Our team will provide you with a return shipping label.</li>
        <li>Pack the item securely and drop it off at the nearest courier location.</li>
      </ol>

      <h2 className="text-xl font-bold dark:text-white mt-8 mb-3">Refund Processing</h2>
      <p>Once we receive and inspect your returned item, we will process your refund within 5-7 business days. The refund will be credited back to your original payment method. Please note that shipping costs are non-refundable unless the item is defective.</p>
    </InfoPageLayout>
  );
}