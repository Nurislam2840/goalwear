// src/app/admin/layout.tsx
"use client";

import { useAdmin } from "@/context/AdminContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Award,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  Image as ImageIcon,
  Zap,
  MessageSquare,
  Home,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import BrandName from "@/components/BrandName";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/hero", label: "Hero Slider", icon: ImageIcon },
  { href: "/admin/offers", label: "Offers", icon: Flame },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/brands", label: "Brands", icon: Award },
  { href: "/admin/teams", label: "Teams", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/features", label: "Features", icon: Zap },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isHydrated, adminLogout } = useAdmin();
  const { siteConfig } = useSiteData();
  const router = useRouter();
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isHydrated) return;
    if (pathname === "/admin/login") return;

    if (!isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAdmin, isHydrated, pathname, router]);

  // Login page — render children directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading / unauthorized state
  if (!isHydrated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-black" strokeWidth={2.5} />
          </div>
          <Loader2 className="w-6 h-6 text-brand-green animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark">
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white dark:bg-brand-card border-b border-gray-200 dark:border-brand-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-brand-dark rounded-lg"
        >
          <Menu className="w-5 h-5 dark:text-white" />
        </button>
        <h1 className="font-bold">
          <BrandName name={siteConfig.name} />
          <span className="text-gray-400 dark:text-gray-500 font-semibold text-xs ml-1">
            Admin
          </span>
        </h1>
        <Link
          href="/"
          className="p-2 hover:bg-gray-100 dark:hover:bg-brand-dark rounded-lg"
        >
          <Home className="w-5 h-5 dark:text-white" />
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-brand-card border-r border-gray-200 dark:border-brand-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-200 dark:border-brand-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">
                {siteConfig.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">
                <BrandName name={siteConfig.name} />
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Admin Panel
              </p>
            </div>
          </Link>
          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-brand-dark rounded-lg"
          >
            <X className="w-4 h-4 dark:text-white" />
          </button>
        </div>

        <nav
          className="p-3 overflow-y-auto"
          style={{ height: "calc(100vh - 170px)" }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowSidebar(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-green text-black"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-dark"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-brand-border bg-white dark:bg-brand-card">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-dark transition-colors"
          >
            <Home className="w-4 h-4" strokeWidth={2.5} />
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </aside>

      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      <main className="lg:ml-64 min-h-screen">{children}</main>
    </div>
  );
}