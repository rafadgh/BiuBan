import { Suspense } from 'react'
import { Header } from '@/components/Header'
import { FiltersSidebar } from '@/components/FiltersSidebar'
import { MobileFilters } from '@/components/MobileFilters'
import { SortBar } from '@/components/SortBar'
import { ProductCard } from '@/components/ProductCard'
import { SearchBar } from '@/components/SearchBar'
import { searchProductsFromDB } from '@/lib/products'

interface SearchPageProps {
  searchParams: Promise<{
    q?:         string
    categoria?: string
    marca?:     string
    tienda?:    string
    color?:     string
    talla?:     string
    precioMin?: string
    precioMax?: string
    descuento?: string
    ofertas?:   string
    mejor?:     string
    ordenar?:   string
  }>
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params  = await searchParams
  const query   = params.q || ''

  const products = await searchProductsFromDB({
    query,
    categoria:  params.categoria,
    marca:      params.marca,
    tienda:     params.tienda,
    color:      params.color,
    talla:      params.talla,
    precioMin:  params.precioMin,
    precioMax:  params.precioMax,
    descuento:  params.descuento,
    ofertas:    params.ofertas,
    mejor:      params.mejor,
    ordenar:    params.ordenar,
  })

  return (
    <>
      <SortBar resultCount={products.length} query={query || 'todo'} />

      {products.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F5F5]">
            <svg className="h-8 w-8 text-[#6B6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-[#0B0B0B]">Sin resultados</p>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Intenta con otras palabras o ajusta los filtros
          </p>
        </div>
      )}
    </>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F5F5]">
      <Header />

      <main className="flex min-h-0 flex-1 flex-col">
        {/* Barra superior */}
        <div className="shrink-0 border-b border-[#E5E5E5] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <div className="flex-1">
              <SearchBar initialQuery={params.q || ''} />
            </div>
            <Suspense fallback={null}>
              <MobileFilters />
            </Suspense>
          </div>
        </div>

        {/* Sidebar + resultados */}
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 gap-0 px-4 sm:px-6 lg:px-8">

          {/* Sidebar desktop */}
          <div className="hidden w-64 shrink-0 lg:flex lg:flex-col">
            <Suspense fallback={<div className="w-64" />}>
              <FiltersSidebar className="my-6 flex-1 min-h-0 overflow-hidden" />
            </Suspense>
          </div>

          {/* Resultados */}
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto py-6 lg:pl-8">
            <Suspense
              fallback={
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#E5E5E5]" />
                  ))}
                </div>
              }
            >
              <SearchResults searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}