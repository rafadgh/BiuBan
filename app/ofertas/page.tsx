// app/ofertas/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Header } from '@/components/Header'
import { FiltersSidebar } from '@/components/FiltersSidebar'
import { MobileFilters } from '@/components/MobileFilters'
import { SortBar } from '@/components/SortBar'
import { ProductCard } from '@/components/ProductCard'
import { SearchBar } from '@/components/SearchBar'
import { searchOffersFromDB, getOffersPriceRange, getOffersFacets } from '@/lib/products'
import { Pagination } from '@/components/Pagination'

const PER_PAGE = 24

export const metadata: Metadata = {
  title: 'Ofertas - BiuBan',
  description: 'Las mejores ofertas y descuentos en ropa, tenis y accesorios. Filtra por categoría, talla, color y más.',
}

interface OffersPageProps {
  searchParams: Promise<{
    q?:         string
    categoria?: string
    marca?:     string
    tienda?:    string
    color?:     string
    talla?:     string
    genero?:    string
    precioMin?: string
    precioMax?: string
    descuento?: string
    mejor?:     string
    ordenar?:   string
    pagina?:    string
  }>
}

async function OffersResults({ searchParams }: OffersPageProps) {
  const params = await searchParams
  const page   = Math.max(1, parseInt(params.pagina || '1'))

  const allProducts = await searchOffersFromDB({
    query:     params.q,
    categoria: params.categoria,
    marca:     params.marca,
    tienda:    params.tienda,
    color:     params.color,
    talla:     params.talla,
    genero:    params.genero,
    precioMin: params.precioMin,
    precioMax: params.precioMax,
    descuento: params.descuento,
    mejor:     params.mejor,
    ordenar:   params.ordenar,
  })

  const total    = allProducts.length
  const products = allProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      <SortBar
        resultCount={total}
        query={params.q || 'todas las ofertas'}
        basePath="/ofertas"
      />

      {products.length > 0 ? (
        <>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Suspense fallback={null}>
            <Pagination total={total} page={page} perPage={PER_PAGE} basePath="/ofertas" />
          </Suspense>
        </>
      ) : (
        <div className="mt-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F5F5]">
            <svg className="h-8 w-8 text-[#6B6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-[#0B0B0B]">Sin ofertas con estos filtros</p>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Intenta con otras palabras o ajusta los filtros
          </p>
        </div>
      )}
    </>
  )
}

export default async function OfertasPage({ searchParams }: OffersPageProps) {
  const params = await searchParams

  const baseFilters = {
    query:    params.q,
    categoria: params.categoria,
    marca:    params.marca,
    tienda:   params.tienda,
  }

  const [priceRange, facets] = await Promise.all([
    getOffersPriceRange({ ...baseFilters, genero: params.genero }),
    getOffersFacets({ ...baseFilters, genero: params.genero }),
  ])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F5F5]">
      <Header />

      <main className="flex min-h-0 flex-1 flex-col">
        {/* Barra superior */}
        <div className="shrink-0 border-b border-[#E5E5E5] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <div className="flex-1">
              <SearchBar
                initialQuery={params.q || ''}
                basePath="/ofertas"
                placeholder="Buscar en ofertas..."
              />
            </div>
            <Suspense fallback={null}>
              <MobileFilters priceRange={priceRange} facets={facets} basePath="/ofertas" />
            </Suspense>
          </div>
        </div>

        {/* Layout principal */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Sidebar — solo desktop */}
          <div className="hidden w-72 shrink-0 overflow-y-auto border-r border-[#E5E5E5] bg-white p-4 lg:block xl:w-80">
            <Suspense fallback={null}>
              <FiltersSidebar
                className="h-full"
                priceRange={priceRange}
                facets={facets}
                basePath="/ofertas"
              />
            </Suspense>
          </div>

          {/* Resultados */}
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <Suspense
                fallback={
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#E5E5E5]" />
                    ))}
                  </div>
                }
              >
                <OffersResults searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
