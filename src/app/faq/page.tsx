import InfoPageLayout from "@/components/InfoPageLayout";

export default function FAQPage() {
  return (
    <InfoPageLayout title="Frequently Asked Questions" subtitle="Everything you need to know">
      <h2 className="text-xl font-bold dark:text-white mt-4">Do you ship worldwide?</h2>
      <p>Yes, we ship to over 100 countries with free shipping on orders over $50.</p>
      
      <h2 className="text-xl font-bold dark:text-white mt-6">How can I track my order?</h2>
      <p>Once your order ships, you'll receive a tracking number via email.</p>
      
      <h2 className="text-xl font-bold dark:text-white mt-6">What payment methods do you accept?</h2>
      <p>We accept Visa, Mastercard, Apple Pay, Google Pay, and all major credit cards through Stripe.</p>
    </InfoPageLayout>
  );
}