// src/context/AdminContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AdminContextType {
  isAdmin: boolean;
  adminLogin: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  isHydrated: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 👇 Check session on mount + refresh every 5 minutes
  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (mounted) setIsAdmin(data.isAdmin === true);
      } catch (err) {
        console.error("[AdminContext] Session check failed:", err);
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setIsHydrated(true);
      }
    }

    checkSession();

    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const adminLogin = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      setIsAdmin(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const adminLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("[AdminContext] Logout error:", err);
    } finally {
      setIsAdmin(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{ isAdmin, adminLogin, adminLogout, isHydrated }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}