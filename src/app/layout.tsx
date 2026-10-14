// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrderProvider } from "@/context/OrderContext";
import { CouponProvider } from "@/context/CouponContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { AdminProvider } from "@/context/AdminContext";
import { AddressProvider } from "@/context/AddressContext";
import FloatingButtons from "@/components/FloatingButtons";
import MobileBottomNav from "@/components/MobileBottomNav";
import PageLoader from "@/components/PageLoader";
import CartSyncProvider from "@/components/CartSyncProvider";
import WishlistSyncProvider from "@/components/WishlistSyncProvider";
import CartCouponSync from "@/components/CartCouponSync";
import StockNotifier from "@/components/StockNotifier";

// 👇 SEO Metadata — complete setup
export const metadata: Metadata = {
  title: {
    default: "GoalWear — Premium Football Gear & Jerseys",
    template: "%s | GoalWear",
  },
  description:
    "Shop the latest football jerseys, boots, and gear. Free shipping worldwide. Premium quality football gear for every player.",
  keywords: [
    "football jerseys",
    "football boots",
    "soccer gear",
    "football shoes",
    "club jerseys",
    "national team jerseys",
    "premium football gear",
    "GoalWear",
  ],
  authors: [{ name: "GoalWear" }],
  creator: "GoalWear",
  publisher: "GoalWear",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://goalwear.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GoalWear",
    title: "GoalWear — Premium Football Gear & Jerseys",
    description:
      "Shop the latest football jerseys, boots, and gear. Free shipping worldwide.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "GoalWear - Premium Football Gear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoalWear — Premium Football Gear & Jerseys",
    description:
      "Shop the latest football jerseys, boots, and gear. Free shipping worldwide.",
    images: [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#CCFF00" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className="antialiased">
        <PageLoader />
        <ThemeProvider>
          <SiteDataProvider>
            <AdminProvider>
              <AuthProvider>
                <ToastProvider>
                  <AddressProvider>
                    <CartProvider>
                      <CartSyncProvider>
                        <WishlistProvider>
                          <WishlistSyncProvider>
                            <CouponProvider>
                              <CartCouponSync>
                                <StockNotifier>
                                  <OrderProvider>
                                    <RecentlyViewedProvider>
                                      {children}
                                      <FloatingButtons />
                                      <MobileBottomNav />
                                    </RecentlyViewedProvider>
                                  </OrderProvider>
                                </StockNotifier>
                              </CartCouponSync>
                            </CouponProvider>
                          </WishlistSyncProvider>
                        </WishlistProvider>
                      </CartSyncProvider>
                    </CartProvider>
                  </AddressProvider>
                </ToastProvider>
              </AuthProvider>
            </AdminProvider>
          </SiteDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}