// src/app/account/addresses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAddresses, Address } from "@/context/AddressContext";
import { useToast } from "@/context/ToastContext";
import {
  ArrowLeft, Plus, Edit3, Trash2, MapPin, X, Home as HomeIcon,
  Briefcase, CheckCircle2, Star, Loader2
} from "lucide-react";
import Link from "next/link";

const LABELS = [
  { value: "Home", icon: HomeIcon },
  { value: "Office", icon: Briefcase },
  { value: "Other", icon: MapPin },
];

export default function AddressesPage() {
  const { user, isAuthenticated, isHydrated: authHydrated } = useAuth();
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isHydrated,
  } = useAddresses();
  const { showToast } = useToast();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const emptyAddress: Omit<Address, "id"> = {
    label: "Home",
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    isDefault: addresses.length === 0,
  };

  const [formData, setFormData] = useState<Omit<Address, "id">>(emptyAddress);

  // Auth guard
  useEffect(() => {
    if (authHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authHydrated, isAuthenticated, router]);

  // Sync form name with user
  useEffect(() => {
    if (user && !editing && !formData.name) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!authHydrated || !isHydrated || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </main>
    );
  }

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      label: "Home",
      name: user?.name || "",
      phone: "",
      address: "",
      city: "",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditing(address);
    setFormData({
      label: address.label,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      isDefault: address.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      if (editing) {
        updateAddress(editing.id, formData);
        showToast("Address updated!", "success");
      } else {
        addAddress(formData);
        showToast("Address added!", "success");
      }
      setIsModalOpen(false);
      setIsSaving(false);
    }, 300);
  };

  const handleDelete = (address: Address) => {
    deleteAddress(address.id);
    showToast("Address deleted!", "success");
    setDeleteConfirm(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark pb-24 md:pb-0">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="p-2 bg-gray-100 dark:bg-brand-card rounded-full">
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold dark:text-white">My Addresses</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {addresses.length} {addresses.length === 1 ? "address" : "addresses"} saved
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-2.5 rounded-xl hover:opacity-90 text-sm"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add New
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
            <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-black" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold dark:text-white mb-2">No addresses yet</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Save your shipping addresses for faster checkout
            </p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-8 py-3 rounded-full"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => {
              const LabelIcon = LABELS.find((l) => l.value === address.label)?.icon || MapPin;
              return (
                <div
                  key={address.id}
                  className={`relative p-5 rounded-2xl border-2 transition-all ${
                    address.isDefault
                      ? "border-brand-green bg-brand-green/5"
                      : "border-gray-100 dark:border-brand-border bg-white dark:bg-brand-card"
                  }`}
                >
                  {address.isDefault && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-brand-green text-black text-[10px] font-bold px-2.5 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-black" strokeWidth={2.5} />
                      Default
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center flex-shrink-0">
                      <LabelIcon className="w-5 h-5 text-black" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold dark:text-white uppercase tracking-wider">
                        {address.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {address.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <p className="text-sm dark:text-gray-300">
                      <span className="text-gray-400">📞</span> {address.phone}
                    </p>
                    <p className="text-sm dark:text-gray-300 leading-relaxed">
                      <span className="text-gray-400">📍</span> {address.address}, {address.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-brand-border">
                    {!address.isDefault && (
                      <button
                        onClick={() => {
                          setDefaultAddress(address.id);
                          showToast("Set as default!", "success");
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-brand-dark text-gray-700 dark:text-gray-300 text-xs font-bold py-2 rounded-lg hover:bg-brand-green hover:text-black transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className={`${address.isDefault ? "flex-1" : ""} inline-flex items-center justify-center gap-1.5 bg-brand-green text-black text-xs font-bold py-2 px-3 rounded-lg`}
                    >
                      <Edit3 className="w-3.5 h-3.5" strokeWidth={2.5} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(address)}
                      className="inline-flex items-center justify-center gap-1.5 bg-red-500 text-white text-xs font-bold py-2 px-3 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-16">
        <Footer />
      </div>

      {/* ============ Form Modal ============ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <div>
                <h2 className="text-lg font-bold dark:text-white">
                  {editing ? "Edit Address" : "Add New Address"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {editing ? "Update your address details" : "Save a new shipping address"}
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
              {/* Label Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Address Type *
                </label>
                <div className="flex gap-2">
                  {LABELS.map((label) => {
                    const Icon = label.icon;
                    return (
                      <button
                        key={label.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, label: label.value })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                          formData.label === label.value
                            ? "bg-brand-green text-black"
                            : "bg-gray-100 dark:bg-brand-dark text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-brand-border"
                        }`}
                      >
                        <Icon className="w-4 h-4" strokeWidth={2.5} />
                        {label.value}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Full Name *
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

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1234-567890"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Full Address *
                </label>
                <textarea
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House, Road, Area..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
                ></textarea>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  City / Country *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Dhaka, Bangladesh"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>

              {/* Default Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-brand-dark rounded-xl border border-gray-200 dark:border-brand-border">
                <div>
                  <p className="text-sm font-bold dark:text-white">Set as Default</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Use this address for checkout by default
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                  className={`w-12 h-7 rounded-full transition-all relative flex-shrink-0 ${
                    formData.isDefault ? "bg-brand-green" : "bg-gray-300 dark:bg-brand-border"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                      formData.isDefault ? "left-6" : "left-1"
                    }`}
                  ></span>
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
                    {editing ? "Update Address" : "Add Address"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ Delete Confirmation ============ */}
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
              Delete Address?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Delete the <span className="font-bold dark:text-white">{deleteConfirm.label}</span> address?
              This cannot be undone.
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
    </main>
  );
}