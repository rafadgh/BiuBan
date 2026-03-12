import { Suspense } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SearchBar } from '@/components/SearchBar'
import { FiltersSidebar } from '@/components/FiltersSidebar'
import { MobileFilters } from '@/components/MobileFilters'
import { SortBar } from '@/components/SortBar'
import { ProductCard } from '@/components/ProductCard'
import { searchProductsFromDB } from '@/lib/search'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    marca?: string
    tienda?: string
    precioMax?: string
    ordenar?: string
  }>
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const products = await searchProductsFromDB({
    query:    params.q,
    marca:    params.marca,
    tienda:   params.tienda,
    precioMax: params.precioMax,
    ordenar:  params.ordenar,
  })

  return (
    <>
      <SortBar resultCount={products.length} query={params.q || 'todo'} />

      {products.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-foreground">No encontramos resultados</p>
          <p className="mt-2 text-sm text-muted-foreground">
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
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Buscar productos
              </h1>
              <div className="mt-3 max-w-lg">
                <SearchBar initialQuery={params.q || ''} />
              </div>
            </div>
            <Suspense fallback={null}>
              <MobileFilters />
            </Suspense>
          </div>

          <div className="flex gap-8">
            <Suspense fallback={<div className="hidden w-64 shrink-0 lg:block" />}>
              <FiltersSidebar className="sticky top-24 hidden h-fit w-64 shrink-0 lg:block" />
            </Suspense>

            <div className="min-w-0 flex-1">
              <Suspense fallback={
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-muted" />
                  ))}
                </div>
              }>
                <SearchResults searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}