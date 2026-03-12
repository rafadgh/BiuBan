import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SearchBar } from '@/components/SearchBar'
import ProductGrid from '@/components/ProductGrid'

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <SearchBar size="large" initialQuery={query} />
        </div>

        <section>
          <h1 className="text-3xl font-bold mb-8">
            Resultados de búsqueda
          </h1>

          <ProductGrid query={query} />
        </section>
      </main>

      <Footer />
    </div>
  )
}