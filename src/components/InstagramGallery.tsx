// src/components/InstagramGallery.tsx
import Image from "next/image";

// Instagram আইকন Inline SVG হিসেবে (lucide-react-এ নেই)
const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const images = [
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
];

export default function InstagramGallery() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-3">
          <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
          <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">
            @goalwear
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold dark:text-white">
          Follow Us on Instagram
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Tag @goalwear to be featured
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {images.map((img, idx) => (
          <a
            key={idx}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-brand-card"
          >
            <Image
              src={img}
              alt={`Instagram post ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <InstagramIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}