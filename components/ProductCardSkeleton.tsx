/**
 * ProductCardSkeleton — loading placeholder for ProductCard
 * Shows a shimmer effect with a faint BiuBan logo watermark in the image area
 */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
      {/* Image area with logo watermark */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5] shimmer">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.svg"
            alt=""
            aria-hidden="true"
            className="h-20 w-20 watermark-pulse select-none"
            style={{ filter: 'grayscale(1)' }}
          />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-2 p-3 sm:p-4">
        {/* Brand + Store row */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded shimmer" />
          <div className="h-5 w-14 rounded-md shimmer" />
        </div>

        {/* Name lines */}
        <div className="space-y-1.5 pt-0.5">
          <div className="h-3.5 w-full rounded shimmer" />
          <div className="h-3.5 w-4/5 rounded shimmer" />
        </div>

        {/* Price */}
        <div className="mt-1 h-6 w-24 rounded shimmer" />

        {/* Button */}
        <div className="mt-1 h-9 w-full rounded-full shimmer" />
      </div>
    </div>
  )
}

/** Renders a grid of N skeletons — drop-in replacement while data loads */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
