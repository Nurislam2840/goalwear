// src/app/faq/page.tsx
"use client";

import { useState } from "react";
import InfoPageLayout from "@/components/InfoPageLayout";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Delivery inside Bangladesh takes 3 business days. For international delivery (India, Sri Lanka, Pakistan, Nepal), it takes 5-7 business days. The rest of the world takes 7-10 business days.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Credit/Debit Cards (Visa, Mastercard, Amex) processed securely via Stripe. We also support Cash on Delivery (COD) for local orders.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes, we have a 30-day return policy. The item must be unused, in its original packaging, and tags must be attached.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is placed and shipped, you can go to the 'My Orders' section in your account and click on 'Track Order'. You will see a live 3D map tracking your shipment.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship worldwide! We offer free shipping on all orders over $50.",
  },
  {
    q: "How can I contact customer support?",
    a: "You can email us at support@goalwear.com or WhatsApp us. Our support team is available 24/7.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <InfoPageLayout title="Frequently Asked Questions" subtitle="Everything you need to know about GoalWear">
      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`bg-white dark:bg-brand-card rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                isOpen ? "border-brand-green" : "border-gray-100 dark:border-brand-border"
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className={`text-sm md:text-base font-bold ${isOpen ? "text-brand-green" : "dark:text-white"}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-brand-green text-black" : "bg-gray-100 dark:bg-brand-dark text-gray-500"}`}>
                  {isOpen ? <ChevronUp className="w-4 h-4" strokeWidth={3} /> : <ChevronDown className="w-4 h-4" strokeWidth={3} />}
                </div>
              </button>
              <div
                className={`px-5 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                {faq.a}
              </div>
            </div>
          );
        })}
      </div>
    </InfoPageLayout>
  );
}