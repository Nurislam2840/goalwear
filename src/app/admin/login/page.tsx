// src/app/admin/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Sun,
  Moon,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { adminLogin, isAdmin, isHydrated } = useAdmin();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // 👇 Already logged in হলে /admin-এ পাঠাব
  useEffect(() => {
    if (isHydrated && isAdmin) {
      router.replace("/admin");
    }
  }, [isHydrated, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await adminLogin(email, password);

      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center p-4 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </Link>

      {mounted && (
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2.5 bg-white dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 rounded-full hover:bg-brand-green hover:border-brand-green group transition-all"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400 group-hover:text-black" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700 group-hover:text-black" />
          )}
        </button>
      )}

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-green/30">
            <ShieldCheck className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            GoalWear Dashboard
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@goalwear.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-brand-green transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-brand-green transition-colors placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-green"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-green text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-brand-green/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                </>
              ) : (
                <>Sign In to Dashboard</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          © {new Date().getFullYear()} GoalWear. Admin Access Only.
        </p>
      </div>
    </main>
  );
}