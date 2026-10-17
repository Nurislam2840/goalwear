// src/app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowLeft,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError("");
    setIsLoading(true);

    try {
      const result = await login(loginEmail.trim(), loginPassword);
      if (result.success) {
        showToast("Welcome back!", "success");
        router.push("/");
        router.refresh();
      } else {
        setInlineError(result.error || "Login failed");
        showToast(result.error || "Login failed", "error");
        setIsLoading(false);
      }
    } catch (err: any) {
      setInlineError(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError("");

    if (!signupName.trim()) {
      setInlineError("Please enter your full name");
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      setInlineError("Please enter a valid email");
      return;
    }
    if (signupPassword.length < 6) {
      setInlineError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(
        signupName.trim(),
        signupEmail.trim().toLowerCase(),
        signupPassword
      );

      if (result.success) {
        showToast("Account created! Welcome 🎉", "success");
        router.push("/");
        router.refresh();
      } else {
        setInlineError(result.error || "Signup failed");
        showToast(result.error || "Signup failed", "error");
        setIsLoading(false);
      }
    } catch (err: any) {
      setInlineError(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-brand-dark dark:via-brand-dark dark:to-brand-card flex flex-col items-center justify-center p-4 relative py-12">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold dark:text-white tracking-tight">
          Goal<span className="text-brand-green">Wear</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Premium Football Gear
        </p>
      </div>

      {inlineError && (
        <div className="w-full max-w-md mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-3 flex items-center gap-2 animate-slide-up">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs font-semibold text-red-600 dark:text-red-400">
            {inlineError}
          </p>
        </div>
      )}

      <div className="flip-container">
        <div className={`flip-inner ${isFlipped ? "flipped" : ""}`}>
          {/* ============ LOGIN PANEL ============ */}
          <div className="form-panel">
            <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center mx-auto mb-5">
              <Lock className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-bold text-center dark:text-white mb-1">
              Welcome Back
            </h2>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
              Login to continue your journey
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email Address"
                  className="flip-input flip-input-with-icon-left"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="flip-input flip-input-with-icon-both"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-green z-10"
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="accent-brand-green w-3.5 h-3.5"
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="bg-brand-green text-black font-bold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity text-[11px]"
                >
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" disabled={isLoading} className="flip-btn">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Don't have an account?
              </p>
              <button
                onClick={() => {
                  setIsFlipped(true);
                  setInlineError("");
                }}
                className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center mx-auto hover:scale-110 transition-transform shadow-lg shadow-brand-green/30"
                aria-label="Go to signup"
              >
                <Plus className="w-5 h-5 text-black" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* ============ SIGNUP PANEL ============ */}
          <div className="form-panel signup-panel">
            <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center mx-auto mb-5">
              <UserIcon className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-bold text-center dark:text-white mb-1">
              Create Account
            </h2>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
              Join GoalWear today
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Full Name"
                  className="flip-input flip-input-with-icon-left"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Email Address"
                  className="flip-input flip-input-with-icon-left"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type={showSignupPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Password (min 6 chars)"
                  className="flip-input flip-input-with-icon-both"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-green z-10"
                >
                  {showSignupPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flip-btn mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Already have an account?
              </p>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setInlineError("");
                }}
                className="bg-brand-green text-black font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity text-xs shadow-lg shadow-brand-green/30"
              >
                Login Instead
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}