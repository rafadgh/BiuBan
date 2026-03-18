import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Check, X, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getProductsByIds } from '@/lib/products'
import { addUtmParams } from '@/lib/utils'
import type { Product } from '@/types/product'

export const metadata = {
  title: 'Comparar productos | BiuBan',
  description: 'Compara precios, tallas y características de productos lado a lado.',
}

interface Row {
  label: string
  key: keyof Product
  format?: (v: unknown) => string
  highlight?: boolean
}

const ROWS: Row[] = [
  { label: 'Precio actual',    key: 'precio',            format: v => v ? `$${Number(v).toLocaleString('es-MX')}` : '—', highlight: true },
  { label: 'Precio original',  key: 'precioOriginal',    format: v => v ? `$${Number(v).toLocaleString('es-MX')}` : '—' },
  { label: 'Descuento',        key: 'descuento',         format: v => v ? `-${v}%` : 'Sin descuento' },
  { label: 'Tienda',           key: 'tienda' },
  { label: 'Categoría',        key: 'categoria' },
  { label: 'Color',            key: 'color',             format: v => String(v || '—') },
  { label: 'Género',           key: 'genero',            format: v => String(v || '—') },
  { label: 'Envío gratis',     key: 'envioGratis' },
  { label: 'Calificación',     key: 'calificacion',      format: v => v ? `${v} ★` : '—' },
  { label: 'Tallas disponibles', key: 'tallasDisponibles', format: v => Array.isArray(v) && v.length ? (v as string[]).join(', ') : '—' },
  { label: 'Material',         key: 'material',          format: v => String(v || '—') },
  { label: 'Colección',        key: 'coleccion',         format: v => String(v || '—') },
]

function cellValue(product: Product, row: Row): string {
  const v = product[row.key]
  if (row.format) return row.format(v)
  if (typeof v === 'boolean') return v ? 'Sí' : 'No'
  return String(v ?? '—')
}

function isBestPrice(products: Product[], key: keyof Product) {
  const prices = products.map(p => p[key]).filter(v => typeof v === 'number') as number[]
  if (prices.length < 2) return () => false
  const min = Math.min(...prices)
  return (product: Product) => product[key] === min
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids } = await searchParams
  const idList = (ids ?? '').split(',').filter(Boolean).slice(0, 3)

  if (idList.length < 2) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#F9F9F9] px-4 py-20 text-center">
          <p className="text-2xl font-bold text-[#0B0B0B] mb-4">
            Necesitas al menos 2 productos para comparar
          </p>
          <p className="text-[#6B6B6B] mb-8">
            Usa el botón <strong>⚖</strong> en las tarjetas de producto para agregarlos al comparador.
          </p>
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 rounded-full bg-[#31470B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3d5a0d] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Ir a buscar
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const products = await getProductsByIds(idList)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F9F9F9]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-[#6B6B6B]">
            <Link href="/buscar" className="hover:text-[#0B0B0B] transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver a buscar
            </Link>
          </div>

          <h1 className="mb-8 text-2xl font-bold text-[#0B0B0B]">
            Comparando {products.length} productos
          </h1>

          {/* Product headers */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-40 sm:w-52 p-0" />
                  {products.map(p => (
                    <th key={p.id} className="p-3 text-left align-top">
                      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F5F5F5] mb-3">
                          <Image
                            src={p.imagen}
                            alt={p.nombre}
                            fill
                            className="object-cover"
                            sizes="220px"
                          />
                          {!!p.descuento && p.descuento > 0 && (
                            <div className="absolute left-2 top-2 rounded-full bg-[#0B0B0B] px-2 py-0.5 text-[10px] font-semibold text-white">
                              -{p.descuento}%
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#31470B] mb-0.5">
                          {p.marca}
                        </p>
                        <p className="text-sm font-semibold text-[#0B0B0B] leading-snug line-clamp-2 mb-3">
                          {p.nombre}
                        </p>
                        <a
                          href={addUtmParams(p.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#0B0B0B] py-2 text-xs font-semibold text-white hover:bg-[#1A1A1A] transition-colors"
                        >
                          Ver en {p.tienda}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {ROWS.map((row, ri) => {
                  const isBest = row.key === 'precio' ? isBestPrice(products, 'precio') : () => false

                  return (
                    <tr
                      key={row.key}
                      className={ri % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F9]'}
                    >
                      <td className="rounded-l-xl px-4 py-3 text-sm font-semibold text-[#6B6B6B]">
                        {row.label}
                      </td>

                      {products.map(p => {
                        const val = cellValue(p, row)
                        const best = isBest(p)
                        const isBoolean = typeof p[row.key] === 'boolean'

                        return (
                          <td
                            key={p.id}
                            className={`px-4 py-3 text-sm text-center last:rounded-r-xl ${
                              best ? 'font-bold text-[#31470B]' : 'text-[#0B0B0B]'
                            }`}
                          >
                            {isBoolean ? (
                              p[row.key] ? (
                                <Check className="mx-auto h-4 w-4 text-emerald-500" />
                              ) : (
                                <X className="mx-auto h-4 w-4 text-[#CCCCCC]" />
                              )
                            ) : (
                              <span className={best ? 'rounded-full bg-[#F0F5E8] px-2.5 py-0.5' : ''}>
                                {val}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
