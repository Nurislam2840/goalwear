// src/app/privacy/page.tsx
import InfoPageLayout from "@/components/InfoPageLayout";

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="Your trust is our priority. Learn how we handle your data.">
      <p>At GoalWear, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.</p>

      <h2 className="text-xl font-bold dark:text-white mt-8 mb-3">1. Information We Collect</h2>
      <p>When you place an order or create an account, we may collect the following information:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Personal Details:</strong> Name, email address, and phone number.</li>
        <li><strong>Shipping Details:</strong> Billing and shipping address.</li>
        <li><strong>Payment Information:</strong> Processed securely by Stripe. We do not store your card details on our servers.</li>
      </ul>

      <h2 className="text-xl font-bold dark:text-white mt-8 mb-3">2. How We Use Your Information</h2>
      <p>Your information is used solely to enhance your shopping experience:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>To process, fulfill, and deliver your orders.</li>
        <li>To communicate with you regarding order status and updates.</li>
        <li>To improve our website, products, and customer service.</li>
      </ul>

      <h2 className="text-xl font-bold dark:text-white mt-8 mb-3">3. Data Security</h2>
      <p>We implement industry-standard security measures. Your payment data is never stored on our servers; it is securely processed by <strong>Stripe</strong>. Authentication and user data are securely handled via <strong>Supabase</strong>, utilizing modern encryption protocols.</p>

      <h2 className="text-xl font-bold dark:text-white mt-8 mb-3">4. Third-Party Sharing</h2>
      <p>We <strong>do not sell</strong> your personal information. We only share necessary data with trusted third-party services:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Courier Services:</strong> To deliver your orders.</li>
        <li><strong>Payment Gateways:</strong> To process secure payments.</li>
      </ul>
    </InfoPageLayout>
  );
}