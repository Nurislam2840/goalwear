// src/app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import ImageUploader from "@/components/ImageUploader";
import {
  Save,
  Loader2,
  Store,
  Mail,
  Phone,
  MapPin,
  Award,
  Sparkles,
} from "lucide-react";

// Social Icons
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);
const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);
const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function AdminSettingsPage() {
  const { siteConfig, updateSiteConfig, products } = useSiteData();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(siteConfig);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(siteConfig);
  }, [siteConfig]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (value: string) => {
    setFormData({ ...formData, logo: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateSiteConfig(formData);
      showToast("Settings saved!", "success");
      setIsSaving(false);
    }, 400);
  };

  // 👇 Safe array reference (never undefined)
  const newArrivalIds: number[] = formData.newArrivalIds || [];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          Site Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Update your store name, logo, contact information, and social links
        </p>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        {/* Logo & Branding */}
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold dark:text-white">Logo & Branding</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload your store logo or paste URL
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <ImageUploader
              value={formData.logo || ""}
              onChange={handleLogoChange}
              label="Store Logo"
              placeholder="https://example.com/logo.png"
              previewHeight="h-24"
            />

            <div className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-4">
              <p className="text-xs font-bold text-black dark:text-brand-green mb-2">
                📌 Logo Tips:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 list-disc pl-4">
                <li>PNG or SVG format is best (transparent background)</li>
                <li>Recommended size: 200 × 60 pixels</li>
                <li>Max file size: 2MB</li>
                <li>Use URL or File Upload — either works</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ============ NEW ARRIVALS SELECTION ============ */}
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold dark:text-white">New Arrivals</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose which products appear in the "New Arrivals" section
              </p>
            </div>
            <span className="bg-brand-green text-black text-[10px] font-bold px-3 py-1.5 rounded-full">
              {newArrivalIds.length} selected
            </span>
          </div>

          <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">
            💡 If none are selected, the 4 latest products will be shown
            automatically.
          </p>

          <div className="max-h-72 overflow-y-auto bg-gray-50 dark:bg-brand-dark rounded-xl p-3 border border-gray-200 dark:border-brand-border">
            {products.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">
                No products available. Add products first.
              </p>
            ) : (
              <div className="space-y-2">
                {products.map((product) => {
                  const isSelected = newArrivalIds.includes(product.id);
                  return (
                    <label
                      key={product.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-brand-green/20 border border-brand-green"
                          : "bg-white dark:bg-brand-card border border-transparent hover:bg-gray-100 dark:hover:bg-brand-border"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...newArrivalIds, product.id]
                            : newArrivalIds.filter((id) => id !== product.id);
                          setFormData({ ...formData, newArrivalIds: updated });
                        }}
                        className="w-4 h-4 accent-brand-green"
                      />
                      <div className="w-10 h-10 bg-white dark:bg-brand-card rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 dark:border-brand-border">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold dark:text-white line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          #{product.id} • {product.brand} • ${product.price}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {newArrivalIds.length > 0 && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, newArrivalIds: [] })}
              className="mt-3 text-xs font-bold text-red-500 hover:underline"
            >
              Clear all selections
            </button>
          )}
        </div>

        {/* Store Info */}
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold dark:text-white">Store Information</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Basic store details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="GoalWear"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Premium Football Gear"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Shop the latest football jerseys..."
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold dark:text-white">Contact Information</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                How customers can reach you
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="support@goalwear.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1234-567890"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Stadium Road, Dhaka, Bangladesh"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold dark:text-white">Social Media</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Connect your social profiles
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Facebook URL
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600">
                    <FacebookIcon />
                  </div>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/goalwear"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Instagram URL
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-500">
                    <InstagramIcon />
                  </div>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/goalwear"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Twitter / X URL
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black dark:text-white">
                    <TwitterIcon />
                  </div>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/goalwear"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  YouTube URL
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-600">
                    <YoutubeIcon />
                  </div>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@goalwear"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                WhatsApp Number
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-600">
                  <WhatsAppIcon />
                </div>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="8801234567890 (without +)"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
                  Format: country code + number (without + sign). Example:
                  8801234567890
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-4 bg-white/90 dark:bg-brand-card/90 backdrop-blur-md border border-gray-200 dark:border-brand-border rounded-2xl p-4 flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Changes will apply immediately across the site
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" strokeWidth={2.5} /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}