// src/components/ImageUploader.tsx
"use client";

import { useRef, useState } from "react";
import { Upload, Link2, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  previewHeight?: string; // e.g. "h-32"
}

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  placeholder = "https://example.com/image.jpg",
  previewHeight = "h-32",
}: ImageUploaderProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    setIsUploading(true);

    try {
      // Base64-এ কনভার্ট করব (localStorage-এ save হবে)
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onChange(base64);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("Failed to read image");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("Upload failed");
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </label>

      {/* Mode Toggle */}
      <div className="flex bg-gray-100 dark:bg-brand-dark rounded-xl p-1 mb-3">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            mode === "url"
              ? "bg-brand-green text-black"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" strokeWidth={2.5} /> Image URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            mode === "upload"
              ? "bg-brand-green text-black"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Upload className="w-3.5 h-3.5" strokeWidth={2.5} /> Upload File
        </button>
      </div>

      {/* URL Mode */}
      {mode === "url" && (
        <div className="relative">
          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="url"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
          />
          {value && !value.startsWith("data:") && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-brand-border rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      )}

      {/* Upload Mode */}
      {mode === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-6 border-2 border-dashed border-gray-200 dark:border-brand-border rounded-xl hover:border-brand-green transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-brand-dark disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-black" strokeWidth={2.5} />
                </div>
                <p className="text-xs font-bold dark:text-white">
                  Click to upload image
                </p>
                <p className="text-[10px] text-gray-400">
                  PNG, JPG, WEBP (Max 2MB)
                </p>
              </>
            )}
          </button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className={`mt-3 w-full ${previewHeight} bg-gray-50 dark:bg-brand-dark rounded-xl overflow-hidden border border-gray-100 dark:border-brand-border flex items-center justify-center relative group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-full w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}