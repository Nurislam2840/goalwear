// src/components/admin/ProductFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Loader2,
  Trash2,
  Palette,
  Check,
  Sparkles,
  Award,
} from "lucide-react";
import {
  Product,
  ColorOption,
  DEFAULT_COLORS,
  COLOR_PRESETS,
  getHexFromColorName,
} from "@/data/products";
import MultiImageUploader from "@/components/MultiImageUploader";
import ThemedSelect from "@/components/ThemedSelect";
import { useSiteData } from "@/context/SiteDataContext";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
  existingIds: number[];
}

const SUB_CATEGORIES = ["Country", "Club", "Boot"];
const BRANDS = [
  "Nike", "Adidas", "Puma", "Reebok", "New Balance",
  "Under Armour", "Mizuno", "Asics", "Umbro", "Diadora", "Other",
];
const TYPE_OPTIONS = ["Home", "Away", "Boot"];
const JERSEY_SIZES = ["S", "M", "L", "XL", "XXL"];
const BOOT_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

const KIT_TYPE_OPTIONS = ["Home", "Away", "Third", "Goalkeeper"];
const SLEEVE_OPTIONS = ["Short Sleeve", "Long Sleeve", "Sleeveless"];
const COLLAR_OPTIONS = ["Crew Neck", "V-Neck", "Polo", "Henley"];
const FIT_OPTIONS = ["Regular", "Slim", "Oversized"];

const SURFACE_OPTIONS = ["FG", "SG", "AG", "IC", "TF", "MG"];
const PLAY_STYLE_OPTIONS = ["Speed", "Control", "Power", "Balance"];
const BOOT_HEIGHT_OPTIONS = ["Low", "Mid", "High"];
const CLOSURE_OPTIONS = ["Lace-up", "Laceless", "Straps", "Mixed"];

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  product,
  existingIds,
}: ProductFormModalProps) {
  const { categories: siteCategories } = useSiteData();
  const CATEGORIES =
    siteCategories.length > 0
      ? siteCategories.map((c) => c.name)
      : ["Jerseys", "Football Shoes"];

  const emptyProduct: Product = {
    id: 0,
    name: "",
    category: CATEGORIES[0] || "Jerseys",
    subCategory: "Club",
    brand: "Nike",
    team: "",
    type: "Home",
    price: 0,
    image_url: "",
    images: [],
    rating: 4.5,
    reviews_count: 0,
    description: "",
    sizes: ["S", "M", "L", "XL"],
    reviews: [],
    stock: 50,
    colors: [...DEFAULT_COLORS],
    season: "",
    highlights: [],
    specifications: [],
    customFields: [],
    kitType: "Home",
    playerName: "",
    playerNumber: undefined,
    isPlayerEdition: false,
    sleeveType: "Short Sleeve",
    collarType: "Crew Neck",
    fitType: "Regular",
    sponsor: "",
    surface: "FG",
    playStyle: "Speed",
    bootHeight: "Low",
    weightGrams: undefined,
    upperMaterial: "",
    soleplate: "",
    studType: "",
    closureType: "Lace-up",
    collection: "",
    releaseYear: undefined,
  };

  const [formData, setFormData] = useState<Product>(emptyProduct);
  const [sizesInput, setSizesInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        const images =
          product.images && product.images.length > 0
            ? product.images
            : product.image_url
            ? [product.image_url]
            : [];

        setFormData({
          ...emptyProduct,
          ...product,
          stock: product.stock ?? 50,
          images,
          image_url: images[0] || product.image_url || "",
          colors:
            product.colors && product.colors.length > 0
              ? product.colors
              : [...DEFAULT_COLORS],
          highlights: product.highlights || [],
          specifications: product.specifications || [],
          customFields: product.customFields || [],
        });
        setSizesInput(product.sizes.join(", "));
      } else {
        setFormData({ ...emptyProduct });
        setSizesInput("S, M, L, XL");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isJersey = formData.subCategory === "Club" || formData.subCategory === "Country";
  const isBoot = formData.subCategory === "Boot";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isNumeric = ["price", "rating", "reviews_count", "stock", "playerNumber", "weightGrams", "releaseYear"].includes(name);
    const isCheckbox = type === "checkbox";

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : isNumeric
        ? Number(value) || 0
        : value,
    }));
  };

  const handleImagesChange = (newImages: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: newImages,
      image_url: newImages[0] || "",
    }));
  };

  // Highlights
  const handleAddHighlight = () => {
    setFormData({ ...formData, highlights: [...(formData.highlights || []), ""] });
  };
  const handleUpdateHighlight = (index: number, value: string) => {
    const updated = [...(formData.highlights || [])];
    updated[index] = value;
    setFormData({ ...formData, highlights: updated });
  };
  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: (formData.highlights || []).filter((_, i) => i !== index),
    });
  };

  // Specifications
  const handleAddSpec = () => {
    setFormData({
      ...formData,
      specifications: [...(formData.specifications || []), { label: "", value: "" }],
    });
  };
  const handleUpdateSpec = (index: number, field: "label" | "value", value: string) => {
    const updated = [...(formData.specifications || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, specifications: updated });
  };
  const handleRemoveSpec = (index: number) => {
    setFormData({
      ...formData,
      specifications: (formData.specifications || []).filter((_, i) => i !== index),
    });
  };

  // Custom Fields
  const handleAddCustomField = () => {
    setFormData({
      ...formData,
      customFields: [...(formData.customFields || []), { label: "", value: "" }],
    });
  };
  const handleUpdateCustomField = (index: number, field: "label" | "value", value: string) => {
    const updated = [...(formData.customFields || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, customFields: updated });
  };
  const handleRemoveCustomField = (index: number) => {
    setFormData({
      ...formData,
      customFields: (formData.customFields || []).filter((_, i) => i !== index),
    });
  };

  // Colors
  const handleAddColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: "New Color", hex: "#CCFF00" }],
    });
  };
  const handleRemoveColor = (index: number) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });
  };
  const handleColorChange = (index: number, field: "name" | "hex", value: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.map((c, i) => {
        if (i !== index) return c;
        if (field === "name") {
          const autoHex = getHexFromColorName(value);
          return { ...c, name: value, hex: autoHex || c.hex };
        }
        return { ...c, [field]: value };
      }),
    });
  };
  const handleApplyPreset = (presetColors: ColorOption[]) => {
    setFormData({ ...formData, colors: [...presetColors] });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const parsedSizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    let newId = formData.id;
    if (!product) {
      newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    }

    const mainImage =
      formData.images[0] ||
      formData.image_url ||
      "https://via.placeholder.com/400";

    const finalProduct: Product = {
      ...formData,
      id: newId,
      sizes: parsedSizes.length > 0 ? parsedSizes : ["S", "M", "L", "XL"],
      image_url: mainImage,
      images: formData.images.length > 0 ? formData.images : [mainImage],
      stock: formData.stock ?? 0,
      colors: formData.colors.length > 0 ? formData.colors : [...DEFAULT_COLORS],
      highlights: (formData.highlights || []).filter((h) => h.trim() !== ""),
      specifications: (formData.specifications || []).filter(
        (s) => s.label.trim() !== "" && s.value.trim() !== ""
      ),
      customFields: (formData.customFields || []).filter(
        (c) => c.label.trim() !== "" && c.value.trim() !== ""
      ),
    };

    setTimeout(() => {
      onSave(finalProduct);
      setIsSaving(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border bg-white dark:bg-brand-card">
          <div>
            <h2 className="text-lg font-bold dark:text-white">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {product ? `Editing: ${product.name}` : "Create a new product"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full"
          >
            <X className="w-4 h-4 dark:text-white" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 space-y-4"
        >
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Real Madrid Home Jersey 2025/26"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
            />
          </div>

          {/* Category Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Category *
              </label>
              <ThemedSelect
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                options={CATEGORIES}
                fullWidth
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Sub Category
              </label>
              <ThemedSelect
                value={formData.subCategory}
                onChange={(value) => setFormData({ ...formData, subCategory: value as any })}
                options={SUB_CATEGORIES}
                fullWidth
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Brand *
              </label>
              <ThemedSelect
                value={formData.brand}
                onChange={(value) => setFormData({ ...formData, brand: value })}
                options={BRANDS}
                fullWidth
              />
            </div>
          </div>

          {/* Team + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Team / Player
              </label>
              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                placeholder="Real Madrid"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Type
              </label>
              <ThemedSelect
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value as any })}
                options={TYPE_OPTIONS}
                fullWidth
              />
            </div>
          </div>

          {/* Season */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Season
            </label>
            <input
              type="text"
              name="season"
              value={formData.season || ""}
              onChange={handleChange}
              placeholder="2025/26"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                required
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Reviews
              </label>
              <input
                type="number"
                name="reviews_count"
                min="0"
                value={formData.reviews_count}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Stock *
              </label>
              <input
                type="number"
                required
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
              />
            </div>
          </div>

          {/* Multi Image Uploader */}
          <MultiImageUploader
            images={formData.images}
            onChange={handleImagesChange}
            label="Product Images"
            maxImages={8}
          />

          {/* JERSEY-SPECIFIC FIELDS */}
          {isJersey && (
            <div className="bg-brand-green/5 border-2 border-brand-green/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-brand-green" strokeWidth={2.5} />
                <h3 className="text-sm font-bold dark:text-white">
                  Jersey Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Kit Type
                  </label>
                  <ThemedSelect
                    value={formData.kitType || "Home"}
                    onChange={(value) => setFormData({ ...formData, kitType: value as any })}
                    options={KIT_TYPE_OPTIONS}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Sponsor
                  </label>
                  <input
                    type="text"
                    name="sponsor"
                    value={formData.sponsor || ""}
                    onChange={handleChange}
                    placeholder="Emirates"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Player Name
                  </label>
                  <input
                    type="text"
                    name="playerName"
                    value={formData.playerName || ""}
                    onChange={handleChange}
                    placeholder="Mbappé"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Player Number
                  </label>
                  <input
                    type="number"
                    name="playerNumber"
                    min="0"
                    max="99"
                    value={formData.playerNumber || ""}
                    onChange={handleChange}
                    placeholder="9"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Sleeve
                  </label>
                  <ThemedSelect
                    value={formData.sleeveType || "Short Sleeve"}
                    onChange={(value) => setFormData({ ...formData, sleeveType: value as any })}
                    options={SLEEVE_OPTIONS}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Collar
                  </label>
                  <ThemedSelect
                    value={formData.collarType || "Crew Neck"}
                    onChange={(value) => setFormData({ ...formData, collarType: value as any })}
                    options={COLLAR_OPTIONS}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Fit
                  </label>
                  <ThemedSelect
                    value={formData.fitType || "Regular"}
                    onChange={(value) => setFormData({ ...formData, fitType: value as any })}
                    options={FIT_OPTIONS}
                    fullWidth
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer p-3 bg-white dark:bg-brand-dark rounded-xl border border-gray-200 dark:border-brand-border">
                <input
                  type="checkbox"
                  name="isPlayerEdition"
                  checked={formData.isPlayerEdition || false}
                  onChange={handleChange}
                  className="w-4 h-4 accent-brand-green cursor-pointer"
                />
                <span className="text-sm font-semibold dark:text-white">
                  Player Edition
                </span>
              </label>
            </div>
          )}

          {/* BOOT-SPECIFIC FIELDS */}
          {isBoot && (
            <div className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-900/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-blue-500" strokeWidth={2.5} />
                <h3 className="text-sm font-bold dark:text-white">
                  Boot Details
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Surface
                  </label>
                  <ThemedSelect
                    value={formData.surface || "FG"}
                    onChange={(value) => setFormData({ ...formData, surface: value as any })}
                    options={SURFACE_OPTIONS}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Play Style
                  </label>
                  <ThemedSelect
                    value={formData.playStyle || "Speed"}
                    onChange={(value) => setFormData({ ...formData, playStyle: value as any })}
                    options={PLAY_STYLE_OPTIONS}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Height
                  </label>
                  <ThemedSelect
                    value={formData.bootHeight || "Low"}
                    onChange={(value) => setFormData({ ...formData, bootHeight: value as any })}
                    options={BOOT_HEIGHT_OPTIONS}
                    fullWidth
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Closure Type
                  </label>
                  <ThemedSelect
                    value={formData.closureType || "Lace-up"}
                    onChange={(value) => setFormData({ ...formData, closureType: value as any })}
                    options={CLOSURE_OPTIONS}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Collection
                  </label>
                  <input
                    type="text"
                    name="collection"
                    value={formData.collection || ""}
                    onChange={handleChange}
                    placeholder="Superfly"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Weight (grams)
                  </label>
                  <input
                    type="number"
                    name="weightGrams"
                    min="0"
                    value={formData.weightGrams || ""}
                    onChange={handleChange}
                    placeholder="195"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Release Year
                  </label>
                  <input
                    type="number"
                    name="releaseYear"
                    min="2000"
                    max="2100"
                    value={formData.releaseYear || ""}
                    onChange={handleChange}
                    placeholder="2025"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Upper Material
                  </label>
                  <input
                    type="text"
                    name="upperMaterial"
                    value={formData.upperMaterial || ""}
                    onChange={handleChange}
                    placeholder="Vaporposite+"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Soleplate
                  </label>
                  <input
                    type="text"
                    name="soleplate"
                    value={formData.soleplate || ""}
                    onChange={handleChange}
                    placeholder="Carbon Fiber"
                    className="w-full px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>
          )}

          {/* HIGHLIGHTS */}
          <div className="bg-gray-50 dark:bg-brand-dark rounded-2xl p-4 border border-gray-200 dark:border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold dark:text-white">
                Product Highlights
              </h3>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1.5 bg-brand-green text-black text-[10px] font-bold px-3 py-1.5 rounded-full"
              >
                <Plus className="w-3 h-3" strokeWidth={2.5} />
                Add
              </button>
            </div>

            {(formData.highlights || []).length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-3">
                No highlights added
              </p>
            ) : (
              <div className="space-y-2">
                {(formData.highlights || []).map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                      placeholder="Premium breathable fabric"
                      className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-lg text-xs dark:text-white outline-none focus:border-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SPECIFICATIONS */}
          <div className="bg-gray-50 dark:bg-brand-dark rounded-2xl p-4 border border-gray-200 dark:border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold dark:text-white">
                Specifications
              </h3>
              <button
                type="button"
                onClick={handleAddSpec}
                className="inline-flex items-center gap-1.5 bg-brand-green text-black text-[10px] font-bold px-3 py-1.5 rounded-full"
              >
                <Plus className="w-3 h-3" strokeWidth={2.5} />
                Add
              </button>
            </div>

            {(formData.specifications || []).length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-3">
                No specifications added
              </p>
            ) : (
              <div className="space-y-2">
                {(formData.specifications || []).map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpec(idx, "label", e.target.value)}
                      placeholder="Material"
                      className="w-[40%] px-3 py-2 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-lg text-xs dark:text-white outline-none focus:border-brand-green"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                      placeholder="100% Polyester"
                      className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-lg text-xs dark:text-white outline-none focus:border-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CUSTOM FIELDS */}
          <div className="bg-gray-50 dark:bg-brand-dark rounded-2xl p-4 border border-gray-200 dark:border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold dark:text-white">
                Custom Fields
              </h3>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="inline-flex items-center gap-1.5 bg-brand-green text-black text-[10px] font-bold px-3 py-1.5 rounded-full"
              >
                <Plus className="w-3 h-3" strokeWidth={2.5} />
                Add
              </button>
            </div>

            {(formData.customFields || []).length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-3">
                No custom fields added
              </p>
            ) : (
              <div className="space-y-2">
                {(formData.customFields || []).map((cf, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cf.label}
                      onChange={(e) => handleUpdateCustomField(idx, "label", e.target.value)}
                      placeholder="Warranty"
                      className="w-[40%] px-3 py-2 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-lg text-xs dark:text-white outline-none focus:border-brand-green"
                    />
                    <input
                      type="text"
                      value={cf.value}
                      onChange={(e) => handleUpdateCustomField(idx, "value", e.target.value)}
                      placeholder="6 months"
                      className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-lg text-xs dark:text-white outline-none focus:border-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(idx)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLOR OPTIONS */}
          <div className="bg-gray-50 dark:bg-brand-dark rounded-2xl p-4 border border-gray-200 dark:border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-green" strokeWidth={2.5} />
                <h3 className="text-sm font-bold dark:text-white">
                  Color Options
                </h3>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  ({formData.colors.length})
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddColor}
                className="inline-flex items-center gap-1.5 bg-brand-green text-black text-[10px] font-bold px-3 py-1.5 rounded-full"
              >
                <Plus className="w-3 h-3" strokeWidth={2.5} />
                Add Color
              </button>
            </div>

            <div className="mb-3">
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Quick Presets:
              </p>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset.colors)}
                    className="inline-flex items-center gap-1.5 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border text-[10px] font-bold px-3 py-1.5 rounded-full hover:border-brand-green dark:text-white"
                  >
                    <div className="flex items-center gap-0.5">
                      {preset.colors.slice(0, 3).map((c, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {formData.colors.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                No colors added
              </p>
            ) : (
              <div className="space-y-2">
                {formData.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white dark:bg-brand-card rounded-xl p-2 border border-gray-100 dark:border-brand-border"
                  >
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => handleColorChange(index, "hex", e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-brand-border"
                      style={{ padding: 0 }}
                    />
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => handleColorChange(index, "name", e.target.value)}
                      placeholder="Red, Blue..."
                      className="flex-1 min-w-0 px-3 py-2 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-lg text-xs dark:text-white outline-none focus:border-brand-green"
                    />
                    <input
                      type="text"
                      value={color.hex}
                      onChange={(e) => handleColorChange(index, "hex", e.target.value)}
                      placeholder="#000000"
                      className="w-20 flex-shrink-0 px-2 py-2 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-lg text-[10px] dark:text-white outline-none focus:border-brand-green font-mono uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Sizes (comma separated)
            </label>
            <input
              type="text"
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              placeholder="S, M, L, XL, XXL"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {isJersey && (
                <button
                  type="button"
                  onClick={() => setSizesInput(JERSEY_SIZES.join(", "))}
                  className="text-[10px] font-bold bg-brand-green text-black px-3 py-1.5 rounded-full"
                >
                  Use Jersey Sizes
                </button>
              )}
              {isBoot && (
                <button
                  type="button"
                  onClick={() => setSizesInput(BOOT_SIZES.join(", "))}
                  className="text-[10px] font-bold bg-brand-green text-black px-3 py-1.5 rounded-full"
                >
                  Use Boot Sizes
                </button>
              )}
            </div>
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
              placeholder="Official product description..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
            ></textarea>
          </div>
        </form>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 dark:border-brand-border bg-gray-50 dark:bg-brand-dark flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-border rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="bg-brand-green text-black font-bold px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" strokeWidth={2.5} />
                {product ? "Update Product" : "Add Product"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}