// src/components/PageLoader.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[999] h-1.5 bg-gray-200 dark:bg-brand-card overflow-hidden">
      <div className="h-full bg-brand-green animate-loading-bar"></div>
    </div>
  );
}