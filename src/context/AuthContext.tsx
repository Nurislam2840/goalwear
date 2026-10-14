// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: {
    name?: string;
    avatar?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Cookie helper for server-side API routes
// ============================================
function setUserCookie(user: User | null) {
  if (typeof document === "undefined") return;

  if (user) {
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `goalwear-user=${encodeURIComponent(
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = "goalwear-user=; path=/; max-age=0; SameSite=Lax";
  }
}

// ============================================
// Extract user from Supabase session
// ============================================
function sessionToUser(session: any): User | null {
  if (!session?.user) return null;

  const u = session.user;
  return {
    id: u.id,
    email: u.email || "",
    name:
      u.user_metadata?.name ||
      u.user_metadata?.full_name ||
      u.email?.split("@")[0] ||
      "User",
    avatar: u.user_metadata?.avatar || "",
  };
}

// ============================================
// Auth Provider
// ============================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasLoadedRef = useRef(false);

  // Initial load + listener
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentUser = sessionToUser(session);
        setUser(currentUser);
        setUserCookie(currentUser);

        if (currentUser) {
          console.log("✅ Auth: User logged in:", currentUser.email);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsHydrated(true);
      }
    }

    initAuth();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 Auth state change:", event);

        const currentUser = sessionToUser(session);
        setUser(currentUser);
        setUserCookie(currentUser);

        if (event === "SIGNED_IN") {
          console.log("✅ Signed in:", currentUser?.email);
        }
        if (event === "SIGNED_OUT") {
          console.log("👋 Signed out");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        return { success: false, error: "Invalid email or password" };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed" };
    }
  };

  // SIGNUP
  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name,
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        return {
          success: true,
          error:
            "Please check your email to confirm your account before logging in.",
        };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Signup failed" };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUserCookie(null);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // RESET PASSWORD (send email)
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to send reset email",
      };
    }
  };

  // UPDATE PASSWORD (after reset)
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Password update failed",
      };
    }
  };

  // UPDATE PROFILE
  const updateProfile = async (updates: {
    name?: string;
    avatar?: string;
  }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Update failed" };
    }
  };

  // CHANGE PASSWORD
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      if (!user?.email) {
        return { success: false, error: "Not logged in" };
      }

      const { error: verifyError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (verifyError) {
        return { success: false, error: "Current password is incorrect" };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Password change failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        updateProfile,
        changePassword,
        isAuthenticated: !!user,
        isHydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}