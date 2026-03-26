// app/buscar/loading.tsx
// Se muestra automáticamente durante la navegación a /buscar
import { Header } from '@/components/Header'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'

export default function BuscarLoading() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F5F5]">
      <Header />

      <main className="flex min-h-0 flex-1 flex-col">
        {/* Barra superior skeleton */}
        <div className="shrink-0 border-b border-[#E5E5E5] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="h-10 w-full rounded-xl shimmer" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Sidebar skeleton — solo desktop */}
          <div className="hidden w-72 shrink-0 border-r border-[#E5E5E5] bg-white p-4 lg:block xl:w-80">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="h-4 w-20 rounded shimmer" />
                <div className="h-5 w-full rounded shimmer" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 border-t border-[#E5E5E5] pt-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 rounded shimmer" />
                    <div className="h-4 w-4 rounded shimmer" />
                  </div>
                  <div className="space-y-1.5">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-8 w-full rounded-lg shimmer" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de productos skeleton */}
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              {/* SortBar skeleton */}
              <div className="mb-5 flex items-center justify-between">
                <div className="h-5 w-40 rounded shimmer" />
                <div className="h-9 w-36 rounded-lg shimmer" />
              </div>
              {/* Cards con watermark */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
