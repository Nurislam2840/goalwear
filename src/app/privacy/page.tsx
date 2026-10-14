import InfoPageLayout from "@/components/InfoPageLayout";

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="Your data, protected">
      <p>We value your privacy. This policy explains how we collect, use, and protect your personal information.</p>
      <h2 className="text-xl font-bold dark:text-white mt-6">Information We Collect</h2>
      <p>We collect information you provide when placing orders: name, email, address, and payment details.</p>
      <h2 className="text-xl font-bold dark:text-white mt-6">How We Use It</h2>
      <p>Your information is used solely to process orders and improve your shopping experience. We never sell your data.</p>
    </InfoPageLayout>
  );
}