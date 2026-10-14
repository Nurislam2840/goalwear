// src/app/reset-password/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { supabase } from "@/lib/supabase";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  const { updatePassword } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Verify session from URL
  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setIsValidSession(true);
          console.log("✅ Reset session valid");
        } else {
          setTimeout(async () => {
            const {
              data: { session: retrySession },
            } = await supabase.auth.getSession();
            setIsValidSession(!!retrySession);
          }, 1500);
        }
      } catch (err) {
        setIsValidSession(false);
      }
    }

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const result = await updatePassword(password);

    if (result.success) {
      setIsSuccess(true);
      showToast("Password updated successfully!", "success");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(result.error || "Password update failed");
    }

    setIsLoading(false);
  };

  if (isValidSession === null) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-brand-dark dark:via-brand-dark dark:to-brand-card flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Verifying your reset link...
          </p>
        </div>
      </main>
    );
  }

  if (!isValidSession) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-brand-dark dark:via-brand-dark dark:to-brand-card flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold dark:text-white mb-3">
            Invalid Reset Link
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            This password reset link is invalid or has expired. Please request
            a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block bg-brand-green text-black font-bold px-6 py-3 rounded-full"
          >
            Request New Link
          </Link>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-brand-dark dark:via-brand-dark dark:to-brand-card flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2
              className="w-10 h-10 text-black"
              strokeWidth={2.5}
            />
          </div>
          <h1 className="text-2xl font-bold dark:text-white mb-3">
            Password Updated!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your password has been successfully reset. Redirecting to
            login...
          </p>
          <Link
            href="/login"
            className="inline-block bg-brand-green text-black font-bold px-6 py-3 rounded-full"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-brand-dark dark:via-brand-dark dark:to-brand-card flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold dark:text-white tracking-tight">
            Goal<span className="text-brand-green">Wear</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Set New Password
          </p>
        </div>

        <div className="bg-white dark:bg-brand-card rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>

          <h2 className="text-xl font-bold text-center dark:text-white mb-2">
            Create New Password
          </h2>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
            Enter your new password below
          </p>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password (min 6 chars)"
                className="w-full pl-11 pr-11 py-3.5 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
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

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-green text-black font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                <>Update Password</>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}