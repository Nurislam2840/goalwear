// src/components/ProductSkeleton.tsx
export default function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-brand-card rounded-2xl p-3 border border-gray-100 dark:border-brand-border">
      {/* Image skeleton */}
      <div className="bg-gray-200 dark:bg-brand-dark rounded-xl h-48 animate-pulse"></div>

      {/* Title skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-brand-dark rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-gray-200 dark:bg-brand-dark rounded w-1/2 animate-pulse"></div>
      </div>

      {/* Rating skeleton */}
      <div className="flex items-center gap-2 mt-2">
        <div className="h-3 w-3 bg-gray-200 dark:bg-brand-dark rounded-full animate-pulse"></div>
        <div className="h-3 w-16 bg-gray-200 dark:bg-brand-dark rounded animate-pulse"></div>
      </div>

      {/* Price + Button skeleton */}
      <div className="flex items-center justify-between mt-3">
        <div className="h-5 bg-gray-200 dark:bg-brand-dark rounded w-16 animate-pulse"></div>
        <div className="h-8 bg-gray-200 dark:bg-brand-dark rounded-full w-16 animate-pulse"></div>
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  );
}