export const dynamic = 'force-dynamic'

// app/marca/[slug]/page.tsx
// URL limpia: /marca/adidas-mx, /marca/nike-mx, /marca/zara, etc.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { FiltersSidebar } from '@/components/FiltersSidebar'
import { MobileFilters } from '@/components/MobileFilters'
import { SortBar } from '@/components/SortBar'
import { ProductCard } from '@/components/ProductCard'
import { Pagination } from '@/components/Pagination'
import { SearchBar } from '@/components/SearchBar'
import {
  searchProductsFromDB,
  getPriceRange,
  getSearchFacets,
  getBrandsFromDB,
} from '@/lib/products'
import { toSlug } from '@/lib/slug'

const PER_PAGE = 24

// cache() deduplica las llamadas a getBrandsFromDB en la misma render pass
const getCachedBrands = cache(getBrandsFromDB)

async function resolveBrand(slug: string): Promise<string | null> {
  const brands = await getCachedBrands()
  return brands.find(b => toSlug(b.nombre) === slug)?.nombre ?? null
}

interface BrandPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    q?:         string
    color?:     string
    talla?:     string
    tienda?:    string
    genero?:    string
    precioMin?: string
    precioMax?: string
    descuento?: string
    mejor?:     string
    ordenar?:   string
    pagina?:    string
  }>
}

// ── SEO dinámico ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug }  = await params
  const brandName = await resolveBrand(slug)

  if (!brandName) return { title: 'Marca no encontrada — BiuBan' }

  const title       = `${brandName} — BiuBan`
  const description = `Toda la ropa y calzado ${brandName} en BiuBan. Compara precios entre los mejores vendedores de México.`

  return {
    title,
    description,
    alternates: { canonical: `https://biuban.com/marca/${slug}` },
    openGraph: { title, description, type: 'website' },
    twitter:   { card: 'summary', title, description },
  }
}

// ── Resultados de productos ───────────────────────────────────────────────────
async function BrandResults({
  brandName,
  searchParams,
  basePath,
}: {
  brandName: string
  searchParams: BrandPageProps['searchParams']
  basePath: string
}) {
  const sp   = await searchParams
  const page = Math.max(1, parseInt(sp.pagina || '1'))

  const allProducts = await searchProductsFromDB({
    query:     sp.q,
    marca:     brandName,
    tienda:    sp.tienda,
    color:     sp.color,
    talla:     sp.talla,
    genero:    sp.genero,
    precioMin: sp.precioMin,
    precioMax: sp.precioMax,
    descuento: sp.descuento,
    mejor:     sp.mejor,
    ordenar:   sp.ordenar,
  })

  const total    = allProducts.length
  const products = allProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      <SortBar resultCount={total} query={brandName} basePath={basePath} />

      {products.length > 0 ? (
        <>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <Suspense fallback={null}>
            <Pagination total={total} page={page} perPage={PER_PAGE} basePath={basePath} />
          </Suspense>
        </>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg font-semibold text-[#0B0B0B]">Sin resultados</p>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Intenta ajustar los filtros o{' '}
            <Link href={basePath} className="underline hover:text-[#586E26]">
              ver todos los productos de {brandName}
            </Link>
          </p>
        </div>
      )}
    </>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default async function MarcaPage({ params, searchParams }: BrandPageProps) {
  const { slug }  = await params
  const brandName = await resolveBrand(slug)

  if (!brandName) notFound()

  const sp       = await searchParams
  const basePath = `/marca/${slug}`

  const baseFilters = {
    marca:  brandName,
    tienda: sp.tienda,
    genero: sp.genero,
  }

  const [priceRange, facets] = await Promise.all([
    getPriceRange({ ...baseFilters, color: sp.color, talla: sp.talla, descuento: sp.descuento, mejor: sp.mejor }),
    getSearchFacets(baseFilters),
  ])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F5F5]">
      <Header />

      <main className="flex min-h-0 flex-1 flex-col">
        {/* Cabecera de marca */}
        <div className="shrink-0 border-b border-[#E5E5E5] bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <div className="shrink-0">
              <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                <Link href="/marcas" className="hover:text-[#0B0B0B]">Marcas</Link>
                <span>/</span>
                <span className="text-[#0B0B0B] font-medium">{brandName}</span>
              </div>
              <h1 className="mt-0.5 text-xl font-bold text-[#0B0B0B]">{brandName}</h1>
            </div>
            <div className="flex-1">
              <SearchBar initialQuery={sp.q || ''} basePath={basePath} placeholder={`Buscar en ${brandName}...`} />
            </div>
            <Suspense fallback={null}>
              <MobileFilters priceRange={priceRange} facets={facets} basePath={basePath} />
            </Suspense>
          </div>
        </div>

        {/* Layout */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Sidebar desktop */}
          <div className="hidden w-72 shrink-0 overflow-y-auto border-r border-[#E5E5E5] bg-white p-4 lg:block xl:w-80">
            <Suspense fallback={null}>
              <FiltersSidebar className="h-full" priceRange={priceRange} facets={facets} basePath={basePath} />
            </Suspense>
          </div>

          {/* Resultados */}
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <Suspense
                fallback={
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#E5E5E5]" />
                    ))}
                  </div>
                }
              >
                <BrandResults brandName={brandName} searchParams={searchParams} basePath={basePath} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
