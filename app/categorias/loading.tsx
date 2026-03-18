import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function CategoriasLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="h-3 w-20 animate-pulse rounded bg-[#E5E5E5] mb-3" />
            <div className="h-8 w-56 animate-pulse rounded-lg bg-[#E5E5E5]" />
          </div>
          {/* Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-[#E5E5E5]"
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
