// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import InfoPageLayout from "@/components/InfoPageLayout";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { siteConfig } = useSiteData();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // সিমুলেশন - এখানে আপনি Resend/Nodemailer যোগ করতে পারেন
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      showToast("Message sent successfully!", "success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSent(false), 3000);
    }, 1000);
  };

  return (
    <InfoPageLayout title="Contact Us" subtitle="We'd love to hear from you. Get in touch with our team.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Form */}
        <div className="bg-white dark:bg-brand-card p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-brand-border shadow-sm">
          <h2 className="text-xl font-bold dark:text-white mb-6">Send us a Message</h2>
          
          {isSent ? (
            <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold dark:text-white mb-1">Message Sent!</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Your Name</label>
                <input
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  required rows={5} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
                ></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-brand-green text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90">
                {isSubmitting ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-brand-card p-6 rounded-2xl border border-gray-100 dark:border-brand-border flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold dark:text-white mb-1">Email Us</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">We reply within 24 hours.</p>
              <a href={`mailto:${siteConfig.email}`} className="text-sm font-bold text-brand-green hover:underline break-all">
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-brand-card p-6 rounded-2xl border border-gray-100 dark:border-brand-border flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold dark:text-white mb-1">Call Us</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mon-Fri from 8am to 5pm.</p>
              <a href={`tel:${siteConfig.phone}`} className="text-sm font-bold text-brand-green hover:underline">
                {siteConfig.phone}
              </a>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-brand-card p-6 rounded-2xl border border-gray-100 dark:border-brand-border flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold dark:text-white mb-1">Visit Us</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {siteConfig.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
}