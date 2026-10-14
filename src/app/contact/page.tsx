import InfoPageLayout from "@/components/InfoPageLayout";

export default function ContactPage() {
  return (
    <InfoPageLayout title="Contact Us" subtitle="We'd love to hear from you">
      <p>For any questions, orders, or support, reach out to us:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>📧 Email: support@goalwear.com</li>
        <li>📞 Phone: +880 1234-567890</li>
        <li>📍 Address: 123 Stadium Road, Dhaka, Bangladesh</li>
      </ul>
      <p>Our support team responds within 24 hours, 7 days a week.</p>
    </InfoPageLayout>
  );
}