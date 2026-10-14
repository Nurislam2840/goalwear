// src/components/ThemedSelect.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface ThemedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[] | string[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function ThemedSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  size = "md",
  fullWidth = false,
}: ThemedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedLabel =
    normalizedOptions.find((o) => o.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-3 text-sm",
    lg: "px-5 py-4 text-base",
  };

  return (
    <div
      ref={ref}
      className={`relative ${fullWidth ? "w-full" : ""} ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green transition-colors ${sizeClasses[size]}`}
      >
        <span className="truncate text-left font-semibold">
          {selectedLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <div
            className="fixed inset-0 z-[299] bg-black/20 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute top-full left-0 right-0 mt-2 z-[300] bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-72 overflow-y-auto">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-left transition-colors ${
                    isSelected
                      ? "bg-brand-green text-black"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-brand-dark"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 flex-shrink-0" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}