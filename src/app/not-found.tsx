// src/app/not-found.tsx
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-brand-dark dark:via-brand-dark dark:to-brand-card flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Big Text */}
        <div className="relative mb-6">
          <h1 className="text-[140px] md:text-[200px] font-extrabold text-gradient leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-brand-green/10 backdrop-blur-sm rounded-full blur-2xl"></div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold dark:text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been moved.
          Try checking the URL or head back to our store.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-green text-black font-bold px-6 py-3.5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-brand-green/30"
          >
            <Home className="w-4 h-4" strokeWidth={2.5} />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-brand-card text-gray-900 dark:text-white font-bold px-6 py-3.5 rounded-full hover:bg-gray-200 dark:hover:bg-brand-border transition-colors"
          >
            <Search className="w-4 h-4" strokeWidth={2.5} />
            Browse Shop
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-brand-border">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            Popular Pages
          </p>
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {[
              { href: "/jerseys", label: "Jerseys" },
              { href: "/shoes", label: "Boots" },
              { href: "/cart", label: "Cart" },
              { href: "/wishlist", label: "Wishlist" },
              { href: "/login", label: "Login" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-gray-100 dark:bg-brand-card text-xs font-semibold dark:text-gray-300 px-3 py-2 rounded-full hover:bg-brand-green hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}