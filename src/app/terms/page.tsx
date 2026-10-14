import InfoPageLayout from "@/components/InfoPageLayout";

export default function TermsPage() {
  return (
    <InfoPageLayout title="Terms & Conditions" subtitle="Please read carefully">
      <p>By using GoalWear, you agree to these terms and conditions.</p>
      <h2 className="text-xl font-bold dark:text-white mt-6">Use of Service</h2>
      <p>You agree to provide accurate information when placing orders.</p>
      <h2 className="text-xl font-bold dark:text-white mt-6">Pricing</h2>
      <p>All prices are in USD and subject to change without notice.</p>
    </InfoPageLayout>
  );
}