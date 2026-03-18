import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function MarcasLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="h-8 w-32 animate-pulse rounded-lg bg-[#E5E5E5] mb-2" />
            <div className="h-4 w-48 animate-pulse rounded bg-[#E5E5E5]" />
          </div>
          {/* Brand grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-[#E5E5E5]" />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
