// src/app/admin/products/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import ProductFormModal from "@/components/admin/ProductFormModal";
import { Product } from "@/data/products";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

const getCategoryLabel = (category: string) =>
  category === "Football Shoes" ? "Boots" : category;

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export default function AdminProductsPage() {
  const { products, updateProducts } = useSiteData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 👇 Local toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const existingIds = useMemo(() => products.map((p) => p.id), [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (categoryFilter !== "All") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, searchQuery, categoryFilter]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // ============================================
  // SAVE — Update or Add product
  // ============================================
  const handleSave = async (product: Product) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("[handleSave] 🚀 Starting save");
    console.log("[handleSave] Product:", {
      id: product.id,
      name: product.name,
      price: product.price,
    });
    console.log("[handleSave] Mode:", editingProduct ? "EDIT" : "ADD");

    setIsSaving(true);

    try {
      let newProducts: Product[];

      if (editingProduct) {
        newProducts = products.map((p) =>
          p.id === product.id ? product : p
        );
      } else {
        newProducts = [product, ...products];
      }

      await updateProducts(newProducts);

      console.log("[handleSave] ✅ Save completed");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      showToast(
        editingProduct
          ? `"${product.name}" updated successfully`
          : `"${product.name}" added successfully`,
        "success"
      );

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error("[handleSave] ❌ Save FAILED:", err.message);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      showToast(
        err.message || "Failed to save product. Check console for details.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // DELETE — Remove product
  // ============================================
  const handleDelete = async (product: Product) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(
      "[handleDelete] 🗑️  Deleting product:",
      product.id,
      product.name
    );

    try {
      const newProducts = products.filter((p) => p.id !== product.id);
      await updateProducts(newProducts);

      console.log("[handleDelete] ✅ Delete completed");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      showToast(`"${product.name}" deleted`, "success");
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("[handleDelete] ❌ Delete FAILED:", err.message);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      showToast(
        err.message || "Failed to delete product. Check console for details.",
        "error"
      );
    }
  };

  const getToastIcon = (type: ToastType) => {
    if (type === "success")
      return <CheckCircle2 className="w-5 h-5 text-black" strokeWidth={2.5} />;
    if (type === "error")
      return <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />;
    return <Info className="w-5 h-5 text-white" strokeWidth={2.5} />;
  };

  const getToastBg = (type: ToastType) => {
    if (type === "success") return "bg-brand-green text-black";
    if (type === "error") return "bg-red-500 text-white";
    return "bg-blue-500 text-white";
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
            Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {products.length} products in your store
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add New Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-xl px-4 py-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent border-none outline-none ml-2 w-full text-sm dark:text-white placeholder-gray-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {["All", "Jerseys", "Football Shoes"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-brand-green text-black"
                  : "bg-white dark:bg-brand-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-brand-border hover:border-brand-green"
              }`}
            >
              {cat === "Football Shoes" ? "Boots" : cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No products found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            {searchQuery
              ? "Try a different search term"
              : "Add your first product"}
          </p>
          {!searchQuery && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full hover:opacity-90"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-brand-dark">
                <tr>
                  <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Product
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Brand
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Stock
                  </th>
                  <th className="text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stock = product.stock ?? 0;
                  return (
                    <tr
                      key={product.id}
                      className="border-t border-gray-100 dark:border-brand-border hover:bg-gray-50 dark:hover:bg-brand-dark/50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-50 dark:bg-brand-dark rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden">
                            {product.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                onError={(e) => {
                                  (
                                    e.target as HTMLImageElement
                                  ).style.display = "none";
                                }}
                              />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold dark:text-white line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: #{product.id} • ⭐ {product.rating}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-brand-green text-black text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                          {getCategoryLabel(product.category)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm dark:text-gray-300">
                        {product.brand}
                      </td>
                      <td className="px-5 py-3 text-sm font-bold dark:text-white">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            stock <= 0
                              ? "bg-red-500 text-white"
                              : stock <= 5
                              ? "bg-yellow-400 text-black"
                              : "bg-brand-green text-black"
                          }`}
                        >
                          {stock}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
                            aria-label="Edit"
                          >
                            <Edit3
                              className="w-3.5 h-3.5 text-black"
                              strokeWidth={2.5}
                            />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product)}
                            className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
                            aria-label="Delete"
                          >
                            <Trash2
                              className="w-3.5 h-3.5 text-white"
                              strokeWidth={2.5}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-brand-border">
            {filteredProducts.map((product) => {
              const stock = product.stock ?? 0;
              return (
                <div key={product.id} className="p-4 flex gap-3">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-brand-dark rounded-xl flex items-center justify-center p-2 flex-shrink-0 overflow-hidden">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold dark:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-brand-green text-black text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {getCategoryLabel(product.category)}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {product.brand}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold dark:text-white">
                          ${product.price.toFixed(2)}
                        </p>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            stock <= 0
                              ? "bg-red-500 text-white"
                              : stock <= 5
                              ? "bg-yellow-400 text-black"
                              : "bg-brand-green text-black"
                          }`}
                        >
                          Stock: {stock}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(product)}
                          className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center"
                        >
                          <Edit3
                            className="w-3 h-3 text-black"
                            strokeWidth={2.5}
                          />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center"
                        >
                          <Trash2
                            className="w-3 h-3 text-white"
                            strokeWidth={2.5}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
        existingIds={existingIds}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setDeleteConfirm(null)}
          ></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
            <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold dark:text-white text-center mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold dark:text-white">
                "{deleteConfirm.name}"
              </span>
              ? This action cannot be undone.
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

      {/* ============================================
          THEMED TOAST NOTIFICATIONS
          ============================================ */}
      <div className="fixed top-20 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl animate-slide-up min-w-[280px] max-w-sm border-2 ${
              toast.type === "success"
                ? "bg-brand-green border-brand-green/50 text-black"
                : toast.type === "error"
                ? "bg-red-500 border-red-600/50 text-white"
                : "bg-blue-500 border-blue-600/50 text-white"
            }`}
          >
            <div className="flex-shrink-0">{getToastIcon(toast.type)}</div>
            <p className="text-sm font-bold flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`p-1 rounded-full transition-colors flex-shrink-0 ${
                toast.type === "success"
                  ? "hover:bg-black/10"
                  : "hover:bg-white/20"
              }`}
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}