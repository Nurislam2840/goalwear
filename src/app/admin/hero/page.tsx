// src/app/admin/hero/page.tsx
"use client";

import { useState } from "react";
import { useSiteData, HeroSlide } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import {
  Plus, Edit3, Trash2, X, Image as ImageIcon, Loader2
} from "lucide-react";

export default function AdminHeroPage() {
  const { heroSlides, updateHeroSlides } = useSiteData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<HeroSlide | null>(null);

  const emptySlide: HeroSlide = {
    id: 0,
    badge: "New Season",
    title: "",
    highlight: "",
    player: "",
    quote: "",
    description: "",
    image: "",
    cta: "/shop",
  };

  const [formData, setFormData] = useState<HeroSlide>(emptySlide);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = () => {
    setEditingSlide(null);
    setFormData({ ...emptySlide, id: Date.now() });
    setIsModalOpen(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({ ...slide });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      if (editingSlide) {
        updateHeroSlides(heroSlides.map((s) => (s.id === formData.id ? formData : s)));
        showToast("Slide updated!", "success");
      } else {
        updateHeroSlides([...heroSlides, formData]);
        showToast("Slide added!", "success");
      }
      setIsModalOpen(false);
      setFormData(emptySlide);
      setEditingSlide(null);
      setIsSaving(false);
    }, 300);
  };

  const handleDelete = (slide: HeroSlide) => {
    updateHeroSlides(heroSlides.filter((s) => s.id !== slide.id));
    showToast("Slide deleted!", "success");
    setDeleteConfirm(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Hero Slider</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {heroSlides.length} slides in your slider
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add New Slide
        </button>
      </div>

      {/* Slides Grid */}
      {heroSlides.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No slides yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Add your first hero slide</p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full hover:opacity-90"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroSlides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border overflow-hidden"
            >
              <div className="relative h-40 bg-gray-100 dark:bg-brand-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.player}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
                <div className="absolute top-3 left-3 bg-brand-green text-black text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {slide.badge}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold dark:text-white line-clamp-1">
                  {slide.player}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  "{slide.quote}"
                </p>
                <p className="text-xs font-bold text-brand-green mt-2">
                  {slide.title} {slide.highlight}
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand-green text-black text-xs font-bold py-2 rounded-lg hover:opacity-90"
                  >
                    <Edit3 className="w-3.5 h-3.5" strokeWidth={2.5} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(slide)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-500 text-white text-xs font-bold py-2 rounded-lg hover:opacity-90"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <div>
                <h2 className="text-lg font-bold dark:text-white">
                  {editingSlide ? "Edit Slide" : "Add New Slide"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Update hero slider content
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
              {/* Badge + Player */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Badge *
                  </label>
                  <input
                    type="text"
                    required
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="New Season 24/25"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Player Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="player"
                    value={formData.player}
                    onChange={handleChange}
                    placeholder="Kylian Mbappé"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Title + Highlight */}
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
                    placeholder="Play"
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
                    placeholder="Your Way"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Player Quote
                </label>
                <input
                  type="text"
                  name="quote"
                  value={formData.quote}
                  onChange={handleChange}
                  placeholder="Speed. Precision. Greatness."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Description *
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Top jerseys & football shoes..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
                ></textarea>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
                {formData.image && (
                  <div className="mt-3 w-full h-40 bg-gray-50 dark:bg-brand-dark rounded-xl overflow-hidden border border-gray-100 dark:border-brand-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* CTA Link */}
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
                    {editingSlide ? "Update Slide" : "Add Slide"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
              Delete Slide?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Delete slide for <span className="font-bold dark:text-white">{deleteConfirm.player}</span>?
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