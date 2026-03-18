// app/buscar/loading.tsx
// Se muestra automáticamente durante la navegación a /buscar
import { Header } from '@/components/Header'

export default function BuscarLoading() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F5F5]">
      <Header />

      <main className="flex min-h-0 flex-1 flex-col">
        {/* Barra superior skeleton */}
        <div className="shrink-0 border-b border-[#E5E5E5] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="h-10 w-full animate-pulse rounded-xl bg-[#E5E5E5]" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Sidebar skeleton — solo desktop */}
          <div className="hidden w-72 shrink-0 border-r border-[#E5E5E5] bg-white p-4 lg:block xl:w-80">
            <div className="space-y-5">
              {/* Precio */}
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-[#E5E5E5]" />
                <div className="h-5 w-full animate-pulse rounded bg-[#E5E5E5]" />
              </div>
              {/* Secciones */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 border-t border-[#E5E5E5] pt-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-[#E5E5E5]" />
                    <div className="h-4 w-4 animate-pulse rounded bg-[#E5E5E5]" />
                  </div>
                  <div className="space-y-1.5">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-8 w-full animate-pulse rounded-lg bg-[#E5E5E5]" />
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
                <div className="h-5 w-40 animate-pulse rounded bg-[#E5E5E5]" />
                <div className="h-9 w-36 animate-pulse rounded-lg bg-[#E5E5E5]" />
              </div>
              {/* Cards */}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl bg-white">
                    <div className="aspect-[3/4] animate-pulse bg-[#E5E5E5]" />
                    <div className="space-y-2 p-3">
                      <div className="h-3.5 w-16 animate-pulse rounded bg-[#E5E5E5]" />
                      <div className="h-4 w-full animate-pulse rounded bg-[#E5E5E5]" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-[#E5E5E5]" />
                      <div className="h-5 w-20 animate-pulse rounded bg-[#E5E5E5]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
