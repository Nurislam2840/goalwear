// src/context/ToastContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CheckCircle2, Heart, Trash2, X } from "lucide-react";

type ToastType = "success" | "wishlist" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    if (type === "success") return <CheckCircle2 className="w-5 h-5 text-brand-green" />;
    if (type === "wishlist") return <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />;
    return <Trash2 className="w-5 h-5 text-red-500" />;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 bg-white dark:bg-brand-card border border-gray-100 dark:border-brand-border px-4 py-3 rounded-xl shadow-2xl animate-slide-up min-w-[260px] max-w-xs"
          >
            {getIcon(toast.type)}
            <p className="text-sm font-semibold dark:text-white flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-brand-dark rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}