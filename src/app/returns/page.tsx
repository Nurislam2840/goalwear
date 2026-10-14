import InfoPageLayout from "@/components/InfoPageLayout";

export default function ReturnsPage() {
  return (
    <InfoPageLayout title="Returns & Refunds" subtitle="Shop with confidence">
      <p>Not satisfied with your purchase? You can return any unused item within 30 days of delivery.</p>
      <h2 className="text-xl font-bold dark:text-white mt-6">Return Policy</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Items must be unused and in original packaging</li>
        <li>Free returns on defective products</li>
        <li>Refunds processed within 5-7 business days</li>
      </ul>
    </InfoPageLayout>
  );
}