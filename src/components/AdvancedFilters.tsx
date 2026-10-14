// src/components/AdvancedFilters.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Filter, RotateCcw, Search } from "lucide-react";
import ThemedSelect from "@/components/ThemedSelect";

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  brands: string[];
  categories: string[];
  subCategories: string[];
  sortBy: string;
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
  availableBrands: string[];
  availableCategories: string[];
  availableSubCategories: string[];
}

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

export const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 1000,
  brands: [],
  categories: [],
  subCategories: [],
  sortBy: "featured",
};

export default function AdvancedFilters({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  availableBrands,
  availableCategories,
  availableSubCategories,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  const toggleArrayItem = (
    key: "brands" | "categories" | "subCategories",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center md:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Drawer / Modal */}
      <div className="relative bg-white dark:bg-brand-card w-full md:max-w-lg max-h-[90vh] rounded-t-3xl md:rounded-3xl shadow-2xl animate-slide-up flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold dark:text-white">Filters</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Refine your search
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full"
            aria-label="Close filters"
          >
            <X className="w-4 h-4 dark:text-white" />
          </button>
        </div>

        {/* Body — Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Sort By */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Sort By
            </h3>
            <ThemedSelect
              value={filters.sortBy}
              onChange={(value) => setFilters({ ...filters, sortBy: value })}
              options={SORT_OPTIONS}
              fullWidth
            />
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price Range
              </h3>
              <span className="text-xs font-bold text-black dark:text-brand-green bg-brand-green dark:bg-brand-green/20 px-2 py-0.5 rounded-full">
                ${filters.minPrice} - ${filters.maxPrice}
              </span>
            </div>

            {/* Slider Container */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                  Min Price
                </label>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minPrice: Math.min(
                        Number(e.target.value),
                        filters.maxPrice - 10
                      ),
                    })
                  }
                  className="w-full accent-brand-green"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                  Max Price
                </label>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: Math.max(
                        Number(e.target.value),
                        filters.minPrice + 10
                      ),
                    })
                  }
                  className="w-full accent-brand-green"
                />
              </div>
            </div>

            {/* Quick Price Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { label: "Under $100", min: 0, max: 100 },
                { label: "$100-$200", min: 100, max: 200 },
                { label: "$200+", min: 200, max: 1000 },
                { label: "All", min: 0, max: 1000 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      minPrice: preset.min,
                      maxPrice: preset.max,
                    })
                  }
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                    filters.minPrice === preset.min &&
                    filters.maxPrice === preset.max
                      ? "bg-brand-green text-black border-brand-green"
                      : "bg-white dark:bg-brand-dark border-gray-200 dark:border-brand-border text-gray-600 dark:text-gray-300 hover:border-brand-green"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {availableCategories.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                {availableCategories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={() => toggleArrayItem("categories", cat)}
                      className="w-4 h-4 accent-brand-green rounded cursor-pointer"
                    />
                    <span className="text-sm dark:text-gray-300 group-hover:text-brand-green transition-colors">
                      {cat}
                    </span>
                    {filters.categories.includes(cat) && (
                      <span className="ml-auto bg-brand-green text-black text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sub Categories */}
          {availableSubCategories.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableSubCategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleArrayItem("subCategories", sub)}
                    className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                      filters.subCategories.includes(sub)
                        ? "bg-brand-green text-black border-brand-green"
                        : "bg-white dark:bg-brand-dark border-gray-200 dark:border-brand-border text-gray-600 dark:text-gray-300 hover:border-brand-green"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {availableBrands.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Brands
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {availableBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 cursor-pointer group py-1"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleArrayItem("brands", brand)}
                      className="w-3.5 h-3.5 accent-brand-green rounded cursor-pointer"
                    />
                    <span className="text-xs dark:text-gray-300 group-hover:text-brand-green transition-colors truncate">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 dark:border-brand-border bg-gray-50 dark:bg-brand-dark flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-xl hover:border-brand-green transition-colors"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-green text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Search className="w-4 h-4" strokeWidth={2.5} />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}