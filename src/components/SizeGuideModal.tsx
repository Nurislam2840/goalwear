// src/components/SizeGuideModal.tsx
"use client";

import { X, Ruler } from "lucide-react";
import { useEffect } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

const jerseySizes = [
  { size: "S", chest: "36-38", length: "27", shoulder: "16.5" },
  { size: "M", chest: "38-40", length: "28", shoulder: "17.5" },
  { size: "L", chest: "40-42", length: "29", shoulder: "18.5" },
  { size: "XL", chest: "42-44", length: "30", shoulder: "19.5" },
  { size: "XXL", chest: "44-46", length: "31", shoulder: "20.5" },
];

const shoeSizes = [
  { uk: "UK 6", us: "US 7", eu: "EU 40", cm: "25.0" },
  { uk: "UK 7", us: "US 8", eu: "EU 41", cm: "25.7" },
  { uk: "UK 8", us: "US 9", eu: "EU 42.5", cm: "26.5" },
  { uk: "UK 9", us: "US 10", eu: "EU 44", cm: "27.5" },
  { uk: "UK 10", us: "US 11", eu: "EU 45", cm: "28.5" },
];

export default function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isShoe = category === "Football Shoes";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-brand-dark rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-brand-dark border-b border-gray-100 dark:border-brand-border p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Ruler className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold dark:text-white text-lg">Size Guide</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isShoe ? "Shoe Size Chart" : "Jersey Size Chart"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-brand-card rounded-full hover:bg-gray-200 dark:hover:bg-brand-border transition-colors"
          >
            <X className="w-4 h-4 dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {isShoe ? (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Measurements are in Centimeters (CM). For the best fit, measure your foot length and add 0.5 cm for comfort.
              </p>
              <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-brand-border">
                <table className="w-full">
                  <thead className="bg-brand-green">
                    <tr>
                      <th className="text-left text-xs font-bold text-black px-4 py-3">UK</th>
                      <th className="text-left text-xs font-bold text-black px-4 py-3">US</th>
                      <th className="text-left text-xs font-bold text-black px-4 py-3">EU</th>
                      <th className="text-left text-xs font-bold text-black px-4 py-3">CM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoeSizes.map((row, idx) => (
                      <tr
                        key={row.uk}
                        className={`border-t border-gray-100 dark:border-brand-border ${
                          idx % 2 === 0 ? "bg-white dark:bg-brand-card" : "bg-gray-50 dark:bg-brand-dark/50"
                        }`}
                      >
                        <td className="text-sm font-semibold dark:text-white px-4 py-3">{row.uk}</td>
                        <td className="text-sm dark:text-gray-300 px-4 py-3">{row.us}</td>
                        <td className="text-sm dark:text-gray-300 px-4 py-3">{row.eu}</td>
                        <td className="text-sm dark:text-gray-300 px-4 py-3">{row.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Measurements are in Inches. Jersey sizes are unisex unless stated otherwise.
              </p>
              <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-brand-border">
                <table className="w-full">
                  <thead className="bg-brand-green">
                    <tr>
                      <th className="text-left text-xs font-bold text-black px-4 py-3">Size</th>
                      <th className="text-left text-xs font-bold text-black px-4 py-3">Chest</th>
                      <th className="text-left text-xs font-bold text-black px-4 py-3">Length</th>
                      <th className="text-left text-xs font-bold text-black px-4 py-3">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jerseySizes.map((row, idx) => (
                      <tr
                        key={row.size}
                        className={`border-t border-gray-100 dark:border-brand-border ${
                          idx % 2 === 0 ? "bg-white dark:bg-brand-card" : "bg-gray-50 dark:bg-brand-dark/50"
                        }`}
                      >
                        <td className="text-sm font-semibold dark:text-white px-4 py-3">{row.size}</td>
                        <td className="text-sm dark:text-gray-300 px-4 py-3">{row.chest}"</td>
                        <td className="text-sm dark:text-gray-300 px-4 py-3">{row.length}"</td>
                        <td className="text-sm dark:text-gray-300 px-4 py-3">{row.shoulder}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Tips */}
          <div className="mt-5 p-4 bg-brand-green/10 border border-brand-green/30 rounded-2xl">
            <p className="text-xs font-bold text-black dark:text-brand-green mb-1">💡 Fitting Tips:</p>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 list-disc pl-4">
              <li>If you're between two sizes, order the larger size for a looser fit.</li>
              <li>Jerseys may shrink slightly after the first wash.</li>
              <li>For shoes, consider adding 0.5 cm to your foot measurement.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}