// src/app/admin/features/page.tsx
"use client";

import { useState } from "react";
import { useSiteData, Feature } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import ThemedSelect from "@/components/ThemedSelect";
import { Plus, Edit3, Trash2, X, Zap, Loader2 } from "lucide-react";

const ICON_OPTIONS = [
  { label: "Truck (Delivery)", value: "Truck" },
  { label: "ShieldCheck (Secure)", value: "ShieldCheck" },
  { label: "Award (Quality)", value: "Award" },
  { label: "Headphones (Support)", value: "Headphones" },
  { label: "Package (Product)", value: "Package" },
  { label: "Star (Rating)", value: "Star" },
  { label: "Heart (Love)", value: "Heart" },
  { label: "Zap (Fast)", value: "Zap" },
];

export default function AdminFeaturesPage() {
  const { features, updateFeatures } = useSiteData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Feature | null>(null);
  const [formData, setFormData] = useState<Feature>({
    id: 0,
    title: "",
    desc: "",
    icon: "Truck",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = () => {
    setEditing(null);
    setFormData({ id: Date.now(), title: "", desc: "", icon: "Truck" });
    setIsModalOpen(true);
  };

  const handleEdit = (f: Feature) => {
    setEditing(f);
    setFormData({ ...f });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (editing) {
        updateFeatures(
          features.map((f) => (f.id === formData.id ? formData : f))
        );
        showToast("Feature updated!", "success");
      } else {
        updateFeatures([...features, formData]);
        showToast("Feature added!", "success");
      }
      setIsModalOpen(false);
      setIsSaving(false);
    }, 300);
  };

  const handleDelete = (f: Feature) => {
    updateFeatures(features.filter((x) => x.id !== f.id));
    showToast("Feature deleted!", "success");
    setDeleteConfirm(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
            Features
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {features.length} feature badges
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-3 rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Feature
        </button>
      </div>

      {features.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No features</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Add your first feature badge
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Feature
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.id}
              className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-5"
            >
              <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold dark:text-white">{f.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {f.desc}
              </p>
              <p className="text-[10px] text-brand-green font-bold mt-2">
                Icon: {f.icon}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(f)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand-green text-black text-xs font-bold py-2 rounded-lg"
                >
                  <Edit3 className="w-3.5 h-3.5" strokeWidth={2.5} /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(f)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-500 text-white text-xs font-bold py-2 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-lg shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <div>
                <h2 className="text-lg font-bold dark:text-white">
                  {editing ? "Edit Feature" : "Add Feature"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {editing
                    ? "Update feature details"
                    : "Create a new feature badge"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full"
              >
                <X className="w-4 h-4 dark:text-white" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Fast Delivery"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  placeholder="Worldwide shipping"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Icon
                </label>
                <ThemedSelect
                  value={formData.icon}
                  onChange={(value) => setFormData({ ...formData, icon: value })}
                  options={ICON_OPTIONS}
                  fullWidth
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
              Delete Feature?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Delete "
              <span className="font-bold dark:text-white">
                {deleteConfirm.title}
              </span>
              "?
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