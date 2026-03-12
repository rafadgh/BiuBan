import { Suspense } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SearchBar } from '@/components/SearchBar'
import { FiltersSidebar } from '@/components/FiltersSidebar'
import { MobileFilters } from '@/components/MobileFilters'
import { SortBar } from '@/components/SortBar'
import { ProductCard } from '@/components/ProductCard'
import { searchProducts, products } from '@/lib/products'
import { Product } from '@/types/product'

function parseMulti(value: string | undefined): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

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

function filterAndSortProducts(
  allProducts: Product[],
  query: string,
  params: Awaited<SearchPageProps['searchParams']>
): Product[] {
  let filtered = query ? searchProducts(query) : [...allProducts]

  const categorias = parseMulti(params.categoria)
  const tiendas    = parseMulti(params.tienda)
  const colores    = parseMulti(params.color)
  const tallas     = parseMulti(params.talla)
  const descuentos = parseMulti(params.descuento)

  if (categorias.length > 0)
    filtered = filtered.filter(p => categorias.some(c => p.categoria?.toLowerCase().includes(c.toLowerCase())))

  if (tiendas.length > 0)
    filtered = filtered.filter(p => tiendas.some(t => p.tienda.toLowerCase().includes(t.toLowerCase())))

  if (colores.length > 0)
    filtered = filtered.filter(p => colores.some(c => p.color?.toLowerCase().includes(c.toLowerCase())))

  if (tallas.length > 0)
    filtered = filtered.filter(p => tallas.some(t => (p as any).talla?.toLowerCase().includes(t.toLowerCase())))

  if (descuentos.length > 0) {
    const minDescuento = Math.min(...descuentos.map(Number))
    filtered = filtered.filter(p => (p.descuento ?? 0) >= minDescuento)
  }

  if (params.precioMin) filtered = filtered.filter(p => p.precio >= parseInt(params.precioMin!))
  if (params.precioMax) filtered = filtered.filter(p => p.precio <= parseInt(params.precioMax!))
  if (params.ofertas === '1') filtered = filtered.filter(p => (p.descuento ?? 0) > 0)
  if (params.mejor === '1')   filtered = filtered.filter(p => p.mejorOpcion)

  if (params.ordenar === 'precio-asc')       filtered.sort((a, b) => a.precio - b.precio)
  else if (params.ordenar === 'precio-desc') filtered.sort((a, b) => b.precio - a.precio)
  else if (params.ordenar === 'descuento')   filtered.sort((a, b) => (b.descuento ?? 0) - (a.descuento ?? 0))

  return filtered
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const filteredProducts = filterAndSortProducts(products, query, params)

  return (
    <>
      <SortBar resultCount={filteredProducts.length} query={query || 'todo'} />
      {filteredProducts.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-foreground">No encontramos resultados</p>
          <p className="mt-2 text-sm text-muted-foreground">Intenta con otras palabras o ajusta los filtros</p>
        </div>
      )}
    </>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        {/* Barra de búsqueda fija arriba */}
        <div className="shrink-0 border-b border-border/40 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <div className="flex-1">
              <SearchBar initialQuery={params.q || ''} />
            </div>
            <Suspense fallback={null}>
              <MobileFilters />
            </Suspense>
          </div>
        </div>

        {/* Dos columnas con scroll independiente */}
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 gap-0 px-4 sm:px-6 lg:px-8">
          {/* Sidebar — su propio scroll */}
          <div className="hidden w-64 shrink-0 lg:flex lg:flex-col">
            <Suspense fallback={<div className="w-64" />}>
              <FiltersSidebar className="my-6 flex-1 min-h-0 overflow-hidden" />
            </Suspense>
          </div>

          {/* Resultados — su propio scroll */}
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto py-6 lg:pl-8">
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
      </main>
    </div>
  )
}