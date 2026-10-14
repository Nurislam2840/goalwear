// src/app/admin/coupons/page.tsx
"use client";

import { useState } from "react";
import { useSiteData, CouponData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import ThemedSelect from "@/components/ThemedSelect";
import { Plus, Edit3, Trash2, X, Tag, Loader2, Percent, DollarSign, Truck } from "lucide-react";

const TYPE_OPTIONS = [
  { label: "Percentage (%)", value: "percent" },
  { label: "Fixed Amount ($)", value: "fixed" },
  { label: "Free Shipping", value: "shipping" },
];

export default function AdminCouponsPage() {
  const { coupons, updateCoupons } = useSiteData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<CouponData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<CouponData | null>(null);
  const [formData, setFormData] = useState<CouponData>({
    id: 0,
    code: "",
    type: "percent",
    value: 10,
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = () => {
    setEditing(null);
    setFormData({ id: Date.now(), code: "", type: "percent", value: 10, description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (c: CouponData) => {
    setEditing(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const finalData = { ...formData, code: formData.code.toUpperCase().trim() };
    setTimeout(() => {
      if (editing) {
        updateCoupons(coupons.map((c) => (c.id === finalData.id ? finalData : c)));
        showToast("Coupon updated!", "success");
      } else {
        updateCoupons([...coupons, finalData]);
        showToast("Coupon added!", "success");
      }
      setIsModalOpen(false);
      setIsSaving(false);
    }, 300);
  };

  const handleDelete = (c: CouponData) => {
    updateCoupons(coupons.filter((x) => x.id !== c.id));
    showToast("Coupon deleted!", "success");
    setDeleteConfirm(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "value" ? Number(value) : name === "code" ? value.toUpperCase() : value,
    });
  };

  const getTypeIcon = (type: string) => {
    if (type === "percent") return <Percent className="w-4 h-4" strokeWidth={2.5} />;
    if (type === "fixed") return <DollarSign className="w-4 h-4" strokeWidth={2.5} />;
    return <Truck className="w-4 h-4" strokeWidth={2.5} />;
  };

  const getTypeLabel = (type: string) => {
    if (type === "percent") return "Percentage";
    if (type === "fixed") return "Fixed Amount";
    return "Free Shipping";
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Coupons</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{coupons.length} active coupons</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-3 rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No coupons</h3>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full mt-4"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
                    {getTypeIcon(c.type)}
                  </div>
                  <div>
                    <p className="text-base font-extrabold dark:text-white">{c.code}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{getTypeLabel(c.type)}</p>
                  </div>
                </div>
                {c.type !== "shipping" && (
                  <span className="bg-brand-green text-black text-xs font-bold px-3 py-1 rounded-full">
                    {c.type === "percent" ? `${c.value}%` : `$${c.value}`} OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{c.description}</p>
              <div className="flex gap-2">
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
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-lg shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <h2 className="text-lg font-bold dark:text-white">
                {editing ? "Edit Coupon" : "Add Coupon"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full">
                <X className="w-4 h-4 dark:text-white" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="GOAL10"
                  maxLength={20}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green uppercase font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Type
                  </label>
                  {/* 👇 ThemedSelect */}
                  <ThemedSelect
                    value={formData.type}
                    onChange={(value) =>
                      setFormData({ ...formData, type: value as any })
                    }
                    options={TYPE_OPTIONS}
                    fullWidth
                  />
                </div>
                {formData.type !== "shipping" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Value {formData.type === "percent" ? "(%)" : "($)"}
                    </label>
                    <input
                      type="number"
                      required
                      name="value"
                      min={0}
                      value={formData.value}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="10% off your order"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>
            </form>
            <div className="p-5 border-t border-gray-100 dark:border-brand-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} className="bg-brand-green text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" strokeWidth={2.5} />}
                {editing ? "Update" : "Add"}
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
            <h3 className="text-lg font-bold dark:text-white text-center mb-2">
              Delete Coupon?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Delete "{deleteConfirm.code}"?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}