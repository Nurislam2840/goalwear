// src/components/Newsletter.tsx
"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { siteConfig } = useSiteData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="relative bg-gradient-to-br from-brand-green/10 via-gray-50 to-gray-100 dark:from-brand-green/5 dark:via-brand-card dark:to-brand-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-brand-border p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-green mb-4">
            <Mail className="w-7 h-7 text-black" strokeWidth={2.5} />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold dark:text-white mb-3">
            Get 10% Off Your First Order
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-lg mx-auto">
            Subscribe to {siteConfig.name} newsletter for exclusive deals, new drops, and football news. No spam, unsubscribe anytime.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-3 rounded-full">
              <CheckCircle2 className="w-5 h-5" />
              Subscribed successfully!
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-full text-sm dark:text-white outline-none focus:border-brand-green transition-colors"
              />
              <button
                type="submit"
                className="bg-brand-green text-black font-bold px-7 py-3.5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-brand-green/30"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Join 10,000+ subscribers
          </p>
        </div>
      </div>
    </section>
  );
}