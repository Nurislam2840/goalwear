// src/components/InfoPageLayout.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface InfoPageProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function InfoPageLayout({ title, subtitle, children }: InfoPageProps) {
  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark pb-24 md:pb-0">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 mt-8 md:mt-12 mb-16">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-gray-50 dark:bg-brand-card p-6 rounded-3xl border border-gray-100 dark:border-brand-border">
              <h2 className="text-xl font-extrabold dark:text-white mb-4">Information</h2>
              <nav className="flex flex-col gap-1">
                {[
                  { name: "Shipping Info", href: "/shipping" },
                  { name: "Returns Policy", href: "/returns" },
                  { name: "FAQ", href: "/faq" },
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "Contact Us", href: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 rounded-xl hover:bg-white dark:hover:bg-brand-dark hover:text-brand-green dark:hover:text-brand-green transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-8 md:mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold dark:text-white mb-2">{title}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">{subtitle}</p>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}