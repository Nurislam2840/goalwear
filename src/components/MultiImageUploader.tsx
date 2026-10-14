// src/components/MultiImageUploader.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Link2, X, Plus, Image as ImageIcon, Star, GripVertical } from "lucide-react";

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  maxImages?: number;
}

export default function MultiImageUploader({
  images,
  onChange,
  label = "Product Images",
  maxImages = 8,
}: MultiImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploadingIndex(images.length);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onChange([...images, base64]);
      setUploadingIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      alert("Failed to read image");
      setUploadingIndex(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleUpdateUrl = (index: number, value: string) => {
    onChange(images.map((img, i) => (i === index ? value : img)));
  };

  const handleMoveFirst = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    onChange(newImages);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label} ({images.length}/{maxImages})
        </label>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          First image = Main
        </span>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-2 mb-3">
          {images.map((img, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 bg-gray-50 dark:bg-brand-dark rounded-xl p-2 border-2 transition-colors ${
                index === 0
                  ? "border-brand-green/40"
                  : "border-gray-200 dark:border-brand-border"
              }`}
            >
              {/* Position */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black ${
                    index === 0
                      ? "bg-brand-green text-black"
                      : "bg-gray-200 dark:bg-brand-card text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {index + 1}
                </span>
              </div>

              {/* Preview Thumbnail */}
              <div className="w-14 h-14 bg-white dark:bg-brand-card rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-brand-border">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0.3";
                    }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-300" />
                )}
              </div>

              {/* URL Input */}
              <input
                type="text"
                value={img.startsWith("data:") ? "📁 Uploaded File" : img}
                onChange={(e) => handleUpdateUrl(index, e.target.value)}
                disabled={img.startsWith("data:")}
                placeholder="https://..."
                className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-lg text-xs dark:text-white outline-none focus:border-brand-green disabled:opacity-60"
              />

              {/* Make Main */}
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleMoveFirst(index)}
                  className="p-2 bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-black rounded-lg transition-colors flex-shrink-0"
                  aria-label="Make main image"
                  title="Set as main image"
                >
                  <Star className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex-shrink-0"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image */}
      {images.length < maxImages && (
        <div className="border-2 border-dashed border-gray-200 dark:border-brand-border rounded-xl p-3 bg-gray-50/50 dark:bg-brand-dark/50">
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Add Image
          </p>

          {/* URL Input */}
          <div className="flex gap-2 mb-2">
            <div className="flex-1 flex items-center bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-lg px-3 py-2">
              <Link2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 min-w-0 bg-transparent border-none outline-none ml-2 text-xs dark:text-white placeholder-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              className="inline-flex items-center gap-1 bg-brand-green text-black text-[10px] font-bold px-3 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Plus className="w-3 h-3" strokeWidth={3} />
              Add URL
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-brand-border"></div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-brand-border"></div>
          </div>

          {/* File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingIndex !== null}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border text-gray-700 dark:text-gray-300 text-[10px] font-bold py-2 rounded-lg hover:border-brand-green hover:text-brand-green transition-colors disabled:opacity-50"
          >
            {uploadingIndex !== null ? (
              <>
                <div className="w-3 h-3 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-3 h-3" strokeWidth={2.5} />
                Upload File (Max 2MB)
              </>
            )}
          </button>
        </div>
      )}

      {/* Helper Text — English */}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
        💡 The first image will be used as the main image. Click the ★ button to set any image as main.
      </p>
    </div>
  );
}