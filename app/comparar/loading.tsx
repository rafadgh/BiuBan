import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function CompararLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9F9F9]">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="mb-8">
            <div className="h-7 w-52 animate-pulse rounded-lg bg-[#E5E5E5]" />
          </div>
          {/* Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
                <div className="aspect-square w-full animate-pulse rounded-xl bg-[#E5E5E5] mb-4" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-[#E5E5E5] mb-2" />
                <div className="h-4 w-full animate-pulse rounded bg-[#E5E5E5] mb-2" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[#E5E5E5] mb-4" />
                <div className="h-8 w-full animate-pulse rounded-full bg-[#E5E5E5]" />
              </div>
            ))}
          </div>
          {/* Table rows */}
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-[#E5E5E5]" />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
