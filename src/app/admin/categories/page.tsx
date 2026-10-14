// src/app/admin/categories/page.tsx
"use client";

import { useState } from "react";
import { useSiteData, Category } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import { Plus, Edit3, Trash2, X, Tag, Loader2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

export default function AdminCategoriesPage() {
  const { categories, updateCategories } = useSiteData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Category>({
    id: 0,
    name: "",
    slug: "",
    desc: "",
    image: "",
  });

  const handleAddNew = () => {
    setEditing(null);
    setFormData({ id: Date.now(), name: "", slug: "", desc: "", image: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (c: Category) => {
    setEditing(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.slug.trim()) {
      showToast("Slug is required", "error");
      return;
    }

    const duplicate = categories.find(
      (c) => c.slug === formData.slug && c.id !== formData.id
    );
    if (duplicate) {
      showToast("This slug is already in use", "error");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      if (editing) {
        updateCategories(
          categories.map((c) => (c.id === formData.id ? formData : c))
        );
        showToast("Category updated!", "success");
      } else {
        updateCategories([...categories, formData]);
        showToast("Category added!", "success");
      }
      setIsModalOpen(false);
      setIsSaving(false);
    }, 300);
  };

  const handleDelete = (c: Category) => {
    updateCategories(categories.filter((x) => x.id !== c.id));
    showToast("Category deleted!", "success");
    setDeleteConfirm(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value =
      e.target.name === "slug"
        ? e.target.value.toLowerCase().replace(/\s+/g, "-")
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (value: string) => {
    setFormData({ ...formData, image: value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        prev.slug ||
        name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
            Categories
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-3 rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No categories</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Add your first category
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border overflow-hidden"
            >
              <div className="relative h-40 bg-gray-100 dark:bg-brand-dark">
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold dark:text-white">{c.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {c.desc}
                </p>
                <p className="text-[10px] text-brand-green font-bold mt-1.5">
                  /category/{c.slug}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(c)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand-green text-black text-xs font-bold py-2 rounded-lg"
                  >
                    <Edit3 className="w-3.5 h-3.5" strokeWidth={2.5} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(c)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-500 text-white text-xs font-bold py-2 rounded-lg"
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <div>
                <h2 className="text-lg font-bold dark:text-white">
                  {editing ? "Edit Category" : "Add Category"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {editing
                    ? "Update category details"
                    : "Create a new product category"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full"
              >
                <X className="w-4 h-4 dark:text-white" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Cricket Jersey"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="cricket-jersey"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green lowercase"
                />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
                  Page URL will be:{" "}
                  <span className="font-bold text-brand-green">
                    /category/{formData.slug || "your-slug"}
                  </span>
                </p>
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
                  placeholder="Cricket Team Jerseys"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>

              <ImageUploader
                value={formData.image}
                onChange={handleImageChange}
                label="Category Image *"
                placeholder="https://images.unsplash.com/..."
                previewHeight="h-32"
              />

              <div className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-4">
                <p className="text-xs font-bold text-black dark:text-brand-green mb-2">
                  💡 Image Tips:
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 list-disc pl-4">
                  <li>
                    Recommended size: <span className="font-bold">800 × 800 px</span>
                  </li>
                  <li>Transparent PNG or solid background works best</li>
                  <li>Place subject in center or bottom-right for best look</li>
                </ul>
              </div>
            </form>

            <div className="p-5 border-t border-gray-100 dark:border-brand-border flex justify-end gap-3">
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
                className="bg-brand-green text-black font-bold px-6 py-2.5 rounded-xl hover:opacity-90 flex items-center gap-2 text-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" strokeWidth={2.5} />{" "}
                    {editing ? "Update" : "Add"}
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
              Delete Category?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Delete "
              <span className="font-bold dark:text-white">
                {deleteConfirm.name}
              </span>
              "? Products under this category will not be deleted.
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