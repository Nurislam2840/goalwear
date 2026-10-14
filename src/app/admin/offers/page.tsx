// src/app/admin/offers/page.tsx
"use client";

import { useState } from "react";
import { useSiteData, Offer } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import ImageUploader from "@/components/ImageUploader";
import {
  Plus, Edit3, Trash2, X, Flame, Loader2, ToggleLeft, ToggleRight, Calendar
} from "lucide-react";

export default function AdminOffersPage() {
  const { offers, updateOffers } = useSiteData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Offer | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const getDefaultEndDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 16);
  };

  const emptyOffer: Offer = {
    id: 0,
    badge: "Flash Sale",
    title: "End of Season",
    highlight: "Mega Sale",
    discountText: "50",
    description: "",
    couponCode: "GOAL10",
    image: "",
    cta: "/shop",
    endDate: new Date(getDefaultEndDate()).toISOString(),
    isActive: true,
  };

  const [formData, setFormData] = useState<Offer>(emptyOffer);

  const handleAddNew = () => {
    setEditing(null);
    setFormData({ ...emptyOffer, id: Date.now() });
    setIsModalOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setEditing(offer);
    setFormData({ ...offer });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (editing) {
        updateOffers(offers.map((o) => (o.id === formData.id ? formData : o)));
        showToast("Offer updated!", "success");
      } else {
        updateOffers([...offers, formData]);
        showToast("Offer added!", "success");
      }
      setIsModalOpen(false);
      setIsSaving(false);
    }, 300);
  };

  const handleDelete = (offer: Offer) => {
    updateOffers(offers.filter((o) => o.id !== offer.id));
    showToast("Offer deleted!", "success");
    setDeleteConfirm(null);
  };

  const toggleActive = (offer: Offer) => {
    updateOffers(
      offers.map((o) => (o.id === offer.id ? { ...o, isActive: !o.isActive } : o))
    );
    showToast(offer.isActive ? "Offer deactivated" : "Offer activated", "success");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (value: string) => {
    setFormData({ ...formData, image: value });
  };

  const formatEndDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid";
    }
  };

  const isExpired = (iso: string) => new Date(iso).getTime() < Date.now();

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Offers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {offers.length} offer{offers.length !== 1 ? "s" : ""} in your store
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add New Offer
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Flame className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No offers</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Add your first flash sale offer
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => {
            const expired = isExpired(offer.endDate);
            return (
              <div
                key={offer.id}
                className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border overflow-hidden"
              >
                <div className="relative h-40 bg-gray-100 dark:bg-brand-dark">
                  {offer.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Flame className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3" strokeWidth={2.5} />
                    {offer.badge}
                  </div>

                  <button
                    onClick={() => toggleActive(offer)}
                    className="absolute top-3 right-3"
                    aria-label="Toggle active"
                  >
                    {offer.isActive ? (
                      <ToggleRight className="w-8 h-8 text-brand-green" strokeWidth={2} />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" strokeWidth={2} />
                    )}
                  </button>

                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-brand-green text-[10px] font-bold uppercase tracking-wider">
                      Up to {offer.discountText}% OFF
                    </p>
                    <p className="text-white text-sm font-bold line-clamp-1">
                      {offer.title} {offer.highlight}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                    {offer.description}
                  </p>

                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-500 dark:text-gray-400">Code:</span>
                    <span className="bg-brand-green text-black font-bold px-2 py-0.5 rounded">
                      {offer.couponCode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Ends:
                    </span>
                    <span className={`font-bold ${expired ? "text-red-500" : "dark:text-white"}`}>
                      {expired ? "Expired" : formatEndDate(offer.endDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        offer.isActive
                          ? "bg-brand-green text-black"
                          : "bg-gray-200 dark:bg-brand-dark text-gray-500"
                      }`}
                    >
                      {offer.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand-green text-black text-xs font-bold py-2 rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" strokeWidth={2.5} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(offer)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-500 text-white text-xs font-bold py-2 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <div>
                <h2 className="text-lg font-bold dark:text-white">
                  {editing ? "Edit Offer" : "Add New Offer"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {editing ? "Update offer details" : "Create a flash sale offer"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full"
              >
                <X className="w-4 h-4 dark:text-white" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Badge Text *
                  </label>
                  <input
                    type="text"
                    required
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="Flash Sale"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Discount % *
                  </label>
                  <input
                    type="text"
                    required
                    name="discountText"
                    value={formData.discountText}
                    onChange={handleChange}
                    placeholder="50"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="End of Season"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Highlight *
                  </label>
                  <input
                    type="text"
                    required
                    name="highlight"
                    value={formData.highlight}
                    onChange={handleChange}
                    placeholder="Mega Sale"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    placeholder="GOAL10"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    name="cta"
                    value={formData.cta}
                    onChange={handleChange}
                    placeholder="/shop"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Offer End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => {
                    const iso = new Date(e.target.value).toISOString();
                    setFormData({ ...formData, endDate: iso });
                  }}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
                  Countdown timer will use this date
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Description *
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Limited time offer! Grab your favorite jerseys..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
                ></textarea>
              </div>

              <ImageUploader
                value={formData.image}
                onChange={handleImageChange}
                label="Offer Image (16:9 recommended)"
                placeholder="https://images.unsplash.com/..."
                previewHeight="h-40"
              />

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-brand-dark rounded-xl border border-gray-200 dark:border-brand-border">
                <div>
                  <p className="text-sm font-bold dark:text-white">Active</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show this offer on the homepage
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className="flex-shrink-0"
                >
                  {formData.isActive ? (
                    <ToggleRight className="w-10 h-10 text-brand-green" strokeWidth={2} />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-400" strokeWidth={2} />
                  )}
                </button>
              </div>
            </form>

            <div className="p-5 border-t border-gray-100 dark:border-brand-border bg-gray-50 dark:bg-brand-dark flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-brand-green text-black font-bold px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    {editing ? "Update Offer" : "Add Offer"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          ></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
            <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold dark:text-white text-center mb-2">
              Delete Offer?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Delete offer{" "}
              <span className="font-bold dark:text-white">"{deleteConfirm.title}"</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}