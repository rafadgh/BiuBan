export const dynamic = 'force-dynamic'

// app/buscar/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Header } from '@/components/Header'
import { FiltersSidebar } from '@/components/FiltersSidebar'
import { MobileFilters } from '@/components/MobileFilters'
import { SortBar } from '@/components/SortBar'
import { ProductCard } from '@/components/ProductCard'
import { SearchBar } from '@/components/SearchBar'
import { Pagination } from '@/components/Pagination'
import { searchProductsFromDB, getPriceRange, getSearchFacets } from '@/lib/products'
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton'

const PER_PAGE = 24

interface SearchPageProps {
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
    ofertas?:   string
    mejor?:     string
    ordenar?:   string
    pagina?:    string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams
  const query     = params.q?.trim() || ''
  const marca     = params.marca?.trim() || ''
  const categoria = params.categoria?.trim() || ''
  const tienda    = params.tienda?.trim() || ''
  const genero    = params.genero?.trim() || ''

  let title       = 'Buscar — BiuBan'
  let description = 'Encuentra ropa, tenis y accesorios. Compara precios entre Nike, Adidas, Zara, Liverpool, Amazon México y más tiendas.'

  if (query) {
    const cap = query.charAt(0).toUpperCase() + query.slice(1)
    title       = `${cap} — BiuBan`
    description = `Resultados para "${query}" en BiuBan. Compara precios entre los mejores vendedores de México.`
  } else if (marca && categoria) {
    title       = `${marca} ${categoria} — BiuBan`
    description = `${categoria} de ${marca} en BiuBan. Compara precios y encuentra la mejor opción.`
  } else if (marca) {
    title       = `${marca} — BiuBan`
    description = `Todos los productos ${marca} en BiuBan. Compara precios entre los mejores vendedores de México.`
  } else if (categoria) {
    const cap = categoria.charAt(0).toUpperCase() + categoria.slice(1)
    title       = `${cap}${genero ? ` ${genero}` : ''} — BiuBan`
    description = `Los mejores ${categoria} en BiuBan. Filtra por talla, color, marca y precio.`
  } else if (tienda) {
    title       = `${tienda} — BiuBan`
    description = `Todos los productos de ${tienda} disponibles en BiuBan.`
  }

  const canonical = query
    ? `https://biuban.com/buscar?q=${encodeURIComponent(query)}`
    : 'https://biuban.com/buscar'

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'website' },
    twitter:   { card: 'summary', title, description },
  }
}


/** Construye una etiqueta legible a partir de los filtros activos */
function buildLabel(p: {
  q?: string; marca?: string; categoria?: string; tienda?: string
  genero?: string; color?: string; talla?: string
}): string {
  if (p.q) return p.q
  const parts = [p.genero, p.color, p.talla, p.categoria, p.marca, p.tienda ? `en ${p.tienda}` : '']
    .filter(Boolean) as string[]
  return parts.length > 0 ? parts.join(' ') : 'todos los productos'
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query  = params.q || ''
  const page   = Math.max(1, parseInt(params.pagina || '1'))

  const allProducts = await searchProductsFromDB({
    query,
    categoria:  params.categoria,
    marca:      params.marca,
    tienda:     params.tienda,
    color:      params.color,
    talla:      params.talla,
    genero:     params.genero,
    precioMin:  params.precioMin,
    precioMax:  params.precioMax,
    descuento:  params.descuento,
    ofertas:    params.ofertas,
    mejor:      params.mejor,
    ordenar:    params.ordenar,
  })

  const total    = allProducts.length
  const products = allProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const label    = buildLabel(params)

  return (
    <>
      <SortBar resultCount={total} query={label} />

      {products.length > 0 ? (
        <>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Suspense fallback={null}>
            <Pagination total={total} page={page} perPage={PER_PAGE} basePath="/buscar" />
          </Suspense>
        </>
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

  const baseFilters = {
    query:     params.q,
    categoria: params.categoria,
    marca:     params.marca,
    tienda:    params.tienda,
  }

  const [priceRange, facets] = await Promise.all([
    getPriceRange({ ...baseFilters, genero: params.genero, color: params.color, talla: params.talla, descuento: params.descuento, mejor: params.mejor }),
    getSearchFacets({ ...baseFilters, genero: params.genero }),
  ])

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
              <MobileFilters priceRange={priceRange} facets={facets} />
            </Suspense>
          </div>
        </div>

        {/* Layout principal */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Sidebar — solo desktop */}
          <div className="hidden w-72 shrink-0 overflow-y-auto border-r border-[#E5E5E5] bg-white p-4 lg:block xl:w-80">
            <Suspense fallback={null}>
              <FiltersSidebar className="h-full" priceRange={priceRange} facets={facets} />
            </Suspense>
          </div>

          {/* Resultados */}
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <Suspense
                fallback={<div className="mt-8"><ProductGridSkeleton count={8} /></div>}
              >
                <SearchResults searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
