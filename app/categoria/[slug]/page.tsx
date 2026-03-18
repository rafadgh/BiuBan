// app/categoria/[slug]/page.tsx
// URL limpia: /categoria/tenis, /categoria/sudaderas, /categoria/running, etc.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { FiltersSidebar } from '@/components/FiltersSidebar'
import { MobileFilters } from '@/components/MobileFilters'
import { SortBar } from '@/components/SortBar'
import { ProductCard } from '@/components/ProductCard'
import { Pagination } from '@/components/Pagination'
import { searchProductsFromDB, getPriceRange, getSearchFacets } from '@/lib/products'
import { CATEGORIA_LABELS } from '@/lib/slug'

const PER_PAGE = 24

interface CatPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    color?:     string
    talla?:     string
    marca?:     string
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

function resolveCategory(slug: string): { slug: string; label: string } | null {
  const label = CATEGORIA_LABELS[slug]
  return label ? { slug, label } : null
}

// ── SEO dinámico ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: CatPageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = resolveCategory(slug)
  if (!cat) return { title: 'Categoría no encontrada — BiuBan' }

  const title       = `${cat.label} — BiuBan`
  const description = `Los mejores ${cat.label.toLowerCase()} en BiuBan. Compara precios por talla, color y marca entre tiendas de México.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter:   { card: 'summary', title, description },
  }
}

// ── Resultados ───────────────────────────────────────────────────────────────
async function CatResults({
  catSlug,
  catLabel,
  searchParams,
  basePath,
}: {
  catSlug:     string
  catLabel:    string
  searchParams: CatPageProps['searchParams']
  basePath:    string
}) {
  const sp   = await searchParams
  const page = Math.max(1, parseInt(sp.pagina || '1'))

  const allProducts = await searchProductsFromDB({
    categoria: catSlug,
    marca:     sp.marca,
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
      <SortBar resultCount={total} query={catLabel} basePath={basePath} />

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
              ver todos los {catLabel.toLowerCase()}
            </Link>
          </p>
        </div>
      )}
    </>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default async function CategoriaPage({ params, searchParams }: CatPageProps) {
  const { slug } = await params
  const cat = resolveCategory(slug)
  if (!cat) notFound()

  const sp       = await searchParams
  const basePath = `/categoria/${slug}`

  const baseFilters = {
    categoria: cat.slug,
    marca:     sp.marca,
    tienda:    sp.tienda,
    genero:    sp.genero,
  }

  const [priceRange, facets] = await Promise.all([
    getPriceRange({ ...baseFilters, color: sp.color, talla: sp.talla, descuento: sp.descuento, mejor: sp.mejor }),
    getSearchFacets(baseFilters),
  ])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F5F5]">
      <Header />

      <main className="flex min-h-0 flex-1 flex-col">
        {/* Cabecera de categoría */}
        <div className="shrink-0 border-b border-[#E5E5E5] bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                <Link href="/" className="hover:text-[#0B0B0B]">Inicio</Link>
                <span>/</span>
                <span className="text-[#0B0B0B] font-medium">{cat.label}</span>
              </div>
              <h1 className="mt-0.5 text-xl font-bold text-[#0B0B0B]">{cat.label}</h1>
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
                <CatResults
                  catSlug={cat.slug}
                  catLabel={cat.label}
                  searchParams={searchParams}
                  basePath={basePath}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
