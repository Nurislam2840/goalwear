// src/components/InfoPageLayout.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface InfoPageProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function InfoPageLayout({ title, subtitle, children }: InfoPageProps) {
  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold dark:text-white mb-2">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{subtitle}</p>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
}