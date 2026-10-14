// src/app/admin/testimonials/page.tsx
"use client";

import { useState } from "react";
import { useSiteData, Testimonial } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import ThemedSelect from "@/components/ThemedSelect";
import { Plus, Edit3, Trash2, X, MessageSquare, Star, Loader2 } from "lucide-react";

const RATING_OPTIONS = [
  { label: "5 Stars ⭐⭐⭐⭐⭐", value: "5" },
  { label: "4 Stars ⭐⭐⭐⭐", value: "4" },
  { label: "3 Stars ⭐⭐⭐", value: "3" },
  { label: "2 Stars ⭐⭐", value: "2" },
  { label: "1 Star ⭐", value: "1" },
];

export default function AdminTestimonialsPage() {
  const { testimonials, updateTestimonials } = useSiteData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Testimonial>({
    id: 0,
    name: "",
    role: "",
    avatar: "",
    text: "",
    rating: 5,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = () => {
    setEditing(null);
    setFormData({ id: Date.now(), name: "", role: "", avatar: "", text: "", rating: 5 });
    setIsModalOpen(true);
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const finalData = {
      ...formData,
      avatar:
        formData.avatar ||
        formData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
    };
    setTimeout(() => {
      if (editing) {
        updateTestimonials(
          testimonials.map((t) => (t.id === finalData.id ? finalData : t))
        );
        showToast("Updated!", "success");
      } else {
        updateTestimonials([...testimonials, finalData]);
        showToast("Added!", "success");
      }
      setIsModalOpen(false);
      setIsSaving(false);
    }, 300);
  };

  const handleDelete = (t: Testimonial) => {
    updateTestimonials(testimonials.filter((x) => x.id !== t.id));
    showToast("Deleted!", "success");
    setDeleteConfirm(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Testimonials</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {testimonials.length} customer reviews
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-3 rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No testimonials</h3>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full mt-4"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-5"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm dark:text-gray-300 line-clamp-3 mb-3">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-brand-border">
                <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-black font-bold text-sm">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold dark:text-white truncate">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {t.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(t)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand-green text-black text-xs font-bold py-2 rounded-lg"
                >
                  <Edit3 className="w-3.5 h-3.5" strokeWidth={2.5} /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(t)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-500 text-white text-xs font-bold py-2 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <h2 className="text-lg font-bold dark:text-white">
                {editing ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
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
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Football Player"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Avatar (Initials)
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="JD"
                  maxLength={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Rating
                </label>
                {/* 👇 ThemedSelect */}
                <ThemedSelect
                  value={String(formData.rating)}
                  onChange={(value) =>
                    setFormData({ ...formData, rating: Number(value) })
                  }
                  options={RATING_OPTIONS}
                  fullWidth
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Review Text *
                </label>
                <textarea
                  required
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Amazing quality..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
                />
              </div>
            </form>
            <div className="p-5 border-t border-gray-100 dark:border-brand-border flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-brand-green text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                )}
                {editing ? "Update" : "Add"}
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
              Delete Testimonial?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Delete review by "{deleteConfirm.name}"?
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