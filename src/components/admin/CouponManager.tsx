// src/components/admin/CouponManager.tsx
"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Power, X, Save, Tag } from "lucide-react";
import { useSiteData, CouponData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";

const EMPTY_FORM = {
  code: "",
  type: "percent" as "percent" | "fixed" | "shipping",
  value: 0,
  description: "",
  isActive: true,
  minOrder: 0,
  maxDiscount: 0,
  expiresAt: "",
};

export default function CouponManager() {
  const { coupons, updateCoupons } = useSiteData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (c: CouponData) => {
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      description: c.description,
      isActive: c.isActive,
      minOrder: c.minOrder ?? 0,
      maxDiscount: c.maxDiscount ?? 0,
      expiresAt: c.expiresAt ?? "",
    });
    setEditingId(c.id);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) return showToast("Code required", "error");
    if (form.type !== "shipping" && form.value <= 0)
      return showToast("Value must be > 0", "error");

    const codeUpper = form.code.trim().toUpperCase();

    // duplicate check
    const duplicate = coupons.find(
      (c) => c.code === codeUpper && c.id !== editingId
    );
    if (duplicate) return showToast("Code already exists", "error");

    setSaving(true);
    try {
      let updated: CouponData[];

      if (editingId) {
        updated = coupons.map((c) =>
          c.id === editingId
            ? {
                ...c,
                code: codeUpper,
                type: form.type,
                value: form.value,
                description: form.description,
                isActive: form.isActive,
                minOrder: form.minOrder || undefined,
                maxDiscount: form.maxDiscount || undefined,
                expiresAt: form.expiresAt || undefined,
              }
            : c
        );
      } else {
        const newId = coupons.length > 0 ? Math.max(...coupons.map((c) => c.id)) + 1 : 1;
        updated = [
          ...coupons,
          {
            id: newId,
            code: codeUpper,
            type: form.type,
            value: form.value,
            description: form.description,
            isActive: form.isActive,
            minOrder: form.minOrder || undefined,
            maxDiscount: form.maxDiscount || undefined,
            expiresAt: form.expiresAt || undefined,
          },
        ];
      }

      await updateCoupons(updated);
      showToast(editingId ? "Coupon updated" : "Coupon added", "success");
      setIsModalOpen(false);
    } catch (err) {
      showToast("Failed to save. Check Supabase schema.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const updated = coupons.filter((c) => c.id !== id);
      await updateCoupons(updated);
      showToast("Coupon deleted", "success");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const handleToggleActive = async (c: CouponData) => {
    try {
      const updated = coupons.map((x) =>
        x.id === c.id ? { ...x, isActive: !x.isActive } : x
      );
      await updateCoupons(updated);
      showToast(c.isActive ? "Coupon disabled" : "Coupon enabled", "success");
    } catch {
      showToast("Failed to update", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Coupons</h2>
          <p className="text-sm text-gray-500 mt-1">{coupons.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-brand-green text-black font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-2xl p-5 ${
              !c.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-brand-green/10 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-brand-green" />
                </div>
                <div>
                  <p className="font-black text-lg dark:text-white">{c.code}</p>
                  <p className="text-[10px] uppercase text-gray-500">{c.type}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  c.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {c.isActive ? "ACTIVE" : "OFF"}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {c.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4 text-[10px]">
              {c.type === "percent" && (
                <span className="bg-gray-100 dark:bg-brand-dark px-2 py-1 rounded">
                  {c.value}%
                </span>
              )}
              {c.type === "fixed" && (
                <span className="bg-gray-100 dark:bg-brand-dark px-2 py-1 rounded">
                  {c.value}৳
                </span>
              )}
              {c.type === "shipping" && (
                <span className="bg-gray-100 dark:bg-brand-dark px-2 py-1 rounded">
                  Free ship
                </span>
              )}
              {c.minOrder ? (
                <span className="bg-gray-100 dark:bg-brand-dark px-2 py-1 rounded">
                  Min {c.minOrder}৳
                </span>
              ) : null}
              {c.maxDiscount ? (
                <span className="bg-gray-100 dark:bg-brand-dark px-2 py-1 rounded">
                  Max {c.maxDiscount}৳
                </span>
              ) : null}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(c)}
                className="flex-1 bg-gray-100 dark:bg-brand-dark text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => handleToggleActive(c)}
                className={`flex-1 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 ${
                  c.isActive
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <Power className="w-3 h-3" />
                {c.isActive ? "Off" : "On"}
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-100 text-red-700 p-2 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-2xl">
          <Tag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No coupons yet</p>
          <button
            onClick={openCreate}
            className="bg-brand-green text-black font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add first coupon
          </button>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-brand-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-brand-border">
              <h3 className="text-lg font-bold dark:text-white">
                {editingId ? "Edit Coupon" : "New Coupon"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-brand-dark flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="GOAL25"
                  className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl px-3 py-2.5 text-sm dark:text-white outline-none focus:border-brand-green uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl px-3 py-2.5 text-sm dark:text-white outline-none focus:border-brand-green"
                >
                  <option value="percent">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="shipping">Free Shipping</option>
                </select>
              </div>

              {form.type !== "shipping" && (
                <div>
                  <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">
                    Value * {form.type === "percent" ? "(%)" : "(৳)"}
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl px-3 py-2.5 text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="25% off your order"
                  className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl px-3 py-2.5 text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">Min Order (৳)</label>
                  <input
                    type="number"
                    value={form.minOrder}
                    onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl px-3 py-2.5 text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">Max Discount (৳)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl px-3 py-2.5 text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl px-3 py-2.5 text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-brand-green"
                />
                <span className="text-sm dark:text-gray-300">Active (users can apply)</span>
              </label>
            </div>

            <div className="flex gap-2 p-5 border-t border-gray-200 dark:border-brand-border">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-100 dark:bg-brand-dark text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-brand-green text-black font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}