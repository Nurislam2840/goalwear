// src/app/admin/brands/page.tsx
"use client";

import { useState } from "react";
import { useSiteData, Brand } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import { Plus, Edit3, Trash2, X, Award, Loader2 } from "lucide-react";

export default function AdminBrandsPage() {
  const { brands, updateBrands } = useSiteData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<Brand>({ id: 0, name: "", slug: "", tagline: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = () => {
    setEditing(null);
    setFormData({ id: Date.now(), name: "", slug: "", tagline: "" });
    setIsModalOpen(true);
  };
  const handleEdit = (b: Brand) => { setEditing(b); setFormData({ ...b }); setIsModalOpen(true); };
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (editing) { updateBrands(brands.map((b) => (b.id === formData.id ? formData : b))); showToast("Brand updated!", "success"); }
      else { updateBrands([...brands, formData]); showToast("Brand added!", "success"); }
      setIsModalOpen(false); setIsSaving(false);
    }, 300);
  };
  const handleDelete = (b: Brand) => { updateBrands(brands.filter((x) => x.id !== b.id)); showToast("Brand deleted!", "success"); setDeleteConfirm(null); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === "slug" ? e.target.value.toLowerCase().replace(/\s+/g, "-") : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Brands</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{brands.length} brands</p>
        </div>
        <button onClick={handleAddNew} className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-3 rounded-xl hover:opacity-90">
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Brand
        </button>
      </div>

      {brands.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No brands</h3>
          <button onClick={handleAddNew} className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full mt-4">
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Brand
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-4 text-center">
              <div className="w-full h-16 flex items-center justify-center mb-2">
                <span className="text-xl font-extrabold dark:text-white" style={{ fontFamily: "Impact, system-ui" }}>{b.name}</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 italic line-clamp-1">"{b.tagline}"</p>
              <div className="flex gap-1.5 mt-3">
                <button onClick={() => handleEdit(b)} className="flex-1 p-2 bg-brand-green rounded-lg flex items-center justify-center">
                  <Edit3 className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                </button>
                <button onClick={() => setDeleteConfirm(b)} className="flex-1 p-2 bg-red-500 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-lg shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <h2 className="text-lg font-bold dark:text-white">{editing ? "Edit Brand" : "Add Brand"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full">
                <X className="w-4 h-4 dark:text-white" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Name *</label>
                <input type="text" required name="name" value={formData.name} onChange={handleChange} placeholder="Nike"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Slug *</label>
                <input type="text" required name="slug" value={formData.slug} onChange={handleChange} placeholder="nike"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Tagline</label>
                <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="Just Do It"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green" />
              </div>
            </form>
            <div className="p-5 border-t border-gray-100 dark:border-brand-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="bg-brand-green text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" strokeWidth={2.5} />} {editing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
            <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold dark:text-white text-center mb-2">Delete Brand?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Delete "{deleteConfirm.name}"?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}