// src/app/account/edit/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  ArrowLeft, User, Mail, Save, Loader2, Lock, Eye, EyeOff,
  Camera, Trash2, Shield, X
} from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const { user, isAuthenticated, isHydrated, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Password section
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Auth guard
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  if (!isHydrated || !isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </main>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await updateProfile(formData);

    if (result.success) {
      showToast("Profile updated successfully!", "success");
    } else {
      showToast(result.error || "Update failed", "error");
    }
    setIsSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordData.newPass.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    const result = await changePassword(passwordData.current, passwordData.newPass);

    if (result.success) {
      showToast("Password changed successfully!", "success");
      setPasswordData({ current: "", newPass: "", confirm: "" });
      setShowPasswordSection(false);
    } else {
      setPasswordError(result.error || "Password change failed");
    }
    setIsChangingPassword(false);
  };

  const handleAvatarRemove = () => {
    setFormData({ ...formData, avatar: "" });
  };

  // Initials fallback
  const initials = formData.name
    ? formData.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark pb-24 md:pb-0">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 mt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/account"
            className="p-2 bg-gray-100 dark:bg-brand-card rounded-full"
          >
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Edit Profile</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your personal information
            </p>
          </div>
        </div>

        {/* ============ Profile Picture Section ============ */}
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold dark:text-white">Profile Picture</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload a photo or paste image URL
              </p>
            </div>
          </div>

          {/* Current Avatar Preview */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-24 h-24 rounded-full bg-brand-green text-black flex items-center justify-center text-3xl font-bold overflow-hidden flex-shrink-0 border-4 border-brand-green/30">
              {formData.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold dark:text-white">{formData.name || "Your Name"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                {formData.email}
              </p>
              {formData.avatar && (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Remove Photo
                </button>
              )}
            </div>
          </div>

          {/* Image Uploader */}
          <ImageUploader
            value={formData.avatar}
            onChange={(value) => setFormData({ ...formData, avatar: value })}
            label="Choose Photo"
            placeholder="https://example.com/photo.jpg"
            previewHeight="h-32"
          />
        </div>

        {/* ============ Personal Info Section ============ */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-bold dark:text-white">Personal Information</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Update your name and email
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-8 py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" strokeWidth={2.5} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* ============ Change Password Section ============ */}
        <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-bold dark:text-white">Security</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Change your password
                </p>
              </div>
            </div>
            {!showPasswordSection && (
              <button
                type="button"
                onClick={() => setShowPasswordSection(true)}
                className="inline-flex items-center gap-1.5 bg-brand-green text-black text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"
              >
                <Lock className="w-3.5 h-3.5" strokeWidth={2.5} />
                Change Password
              </button>
            )}
          </div>

          {showPasswordSection && (
            <form onSubmit={handlePasswordChange} className="space-y-4 mt-4 pt-4 border-t border-gray-100 dark:border-brand-border">
              {passwordError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                    {passwordError}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-11 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-green"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    New Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={passwordData.newPass}
                    onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordData({ current: "", newPass: "", confirm: "" });
                    setPasswordError("");
                  }}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 text-sm"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" strokeWidth={2.5} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}