// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await resetPassword(email);

    if (result.success) {
      setIsSent(true);
      showToast("Reset link sent! Check your email.", "success");
    } else {
      setError(result.error || "Failed to send reset email");
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-brand-dark dark:via-brand-dark dark:to-brand-card flex items-center justify-center p-4 relative py-12">
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold dark:text-white tracking-tight">
            Goal<span className="text-brand-green">Wear</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Password Recovery
          </p>
        </div>

        <div className="bg-white dark:bg-brand-card rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 dark:border-brand-border">
          {isSent ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2
                  className="w-10 h-10 text-black"
                  strokeWidth={2.5}
                />
              </div>

              <h2 className="text-xl font-bold dark:text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                We sent a password reset link to
              </p>
              <p className="font-bold text-brand-green mb-6 break-all">
                {email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Click the link in the email to reset your password. The link
                will expire in 1 hour.
              </p>

              <Link
                href="/login"
                className="inline-block w-full bg-brand-green text-black font-bold py-3.5 rounded-xl hover:opacity-90"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Mail className="w-8 h-8 text-black" strokeWidth={2.5} />
              </div>

              <h2 className="text-xl font-bold text-center dark:text-white mb-2">
                Forgot Password?
              </h2>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
                Enter your email and we'll send you a reset link
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
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email Address"
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
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>Send Reset Link</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}