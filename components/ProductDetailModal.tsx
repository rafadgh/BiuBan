'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ExternalLink, X, TrendingDown, TrendingUp, Minus, Package, Truck, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types/product'
import { addUtmParams } from '@/lib/utils'

// Recharts se carga de forma lazy — no entra al bundle inicial
const PriceChart = dynamic(
  () => import('./PriceChart').then(m => m.PriceChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[140px] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-[#31470B]" />
      </div>
    ),
  }
)

interface PriceRecord {
  price: number
  original_price: number | null
  recorded_at: string
}

interface ProductDetailModalProps {
  product: Product
  open: boolean
  onClose: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

function PriceTrend({ history }: { history: PriceRecord[] }) {
  if (history.length < 2) return null
  const first = history[0].price
  const last = history[history.length - 1].price
  const diff = last - first
  const pct = Math.round(Math.abs(diff / first) * 100)

  if (diff < 0) return (
    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
      <TrendingDown className="h-3.5 w-3.5" />
      -{pct}% desde que empezamos a rastrear
    </span>
  )
  if (diff > 0) return (
    <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
      <TrendingUp className="h-3.5 w-3.5" />
      +{pct}% desde que empezamos a rastrear
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-xs text-[#6B6B6B]">
      <Minus className="h-3.5 w-3.5" />
      Precio estable
    </span>
  )
}

// ─── Galería de imágenes ─────────────────────────────────────────────────────
interface ImageGalleryProps {
  images: string[]
  productName: string
  hasDiscount: boolean
  discountPct?: number
}

function ImageGallery({ images, productName, hasDiscount, discountPct }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0)
  const [imgError, setImgError] = useState<Record<number, boolean>>({})

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length])

  // Reset cuando cambia el producto
  useEffect(() => { setCurrent(0); setImgError({}) }, [images[0]])

  // Navegar con teclas dentro del modal
  useEffect(() => {
    if (images.length < 2) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, prev, next])

  const validImages = images.filter((_, i) => !imgError[i])
  const safeCurrent = Math.min(current, validImages.length - 1)
  const displaySrc = validImages[safeCurrent] ?? images[0]

  return (
    <div className="w-full sm:w-52 sm:shrink-0">
      {/* Imagen principal */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F5F5F5]">
        <Image
          key={displaySrc}
          src={displaySrc}
          alt={productName}
          fill
          className="object-cover transition-opacity duration-200"
          sizes="(max-width: 640px) 100vw, 208px"
          onError={() => setImgError(prev => ({ ...prev, [safeCurrent]: true }))}
        />

        {/* Badge descuento */}
        {hasDiscount && discountPct && (
          <div className="absolute left-2 top-2 rounded-full bg-[#0B0B0B] px-2 py-1 text-xs font-semibold text-white">
            -{discountPct}%
          </div>
        )}

        {/* Contador de imagen */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
            {safeCurrent + 1}/{validImages.length}
          </div>
        )}

        {/* Flechas navegación */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow-sm text-[#0B0B0B] hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow-sm text-[#0B0B0B] hover:bg-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {validImages.length > 1 && (
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {validImages.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setCurrent(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === safeCurrent
                  ? 'border-[#31470B] opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="44px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Modal principal ─────────────────────────────────────────────────────────
export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const [history, setHistory] = useState<PriceRecord[]>([])
  const [loading, setLoading] = useState(false)

  // Construir array completo de imágenes: portada + adicionales
  const allImages = [
    product.imagen,
    ...(product.imagenesAdicionales ?? []),
  ].filter(Boolean)

  // Fetch historial de precio cuando abre el modal
  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/precio-historial/${encodeURIComponent(product.id)}`)
      .then(r => r.json())
      .then(d => setHistory(d.data ?? []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [open, product.id])

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const hasDiscount = !!product.descuento && product.descuento > 0
  const minPrice = history.length ? Math.min(...history.map(h => h.price)) : null
  const chartData = history.map(h => ({
    date: formatDate(h.recorded_at),
    price: h.price,
  }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles de ${product.nombre}`}
        className="relative z-10 w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          autoFocus
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-[#6B6B6B] hover:text-[#0B0B0B] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 p-5 sm:p-6">
          {/* Galería */}
          <ImageGallery
            images={allImages}
            productName={product.nombre}
            hasDiscount={hasDiscount}
            discountPct={product.descuento}
          />

          {/* Detalles */}
          <div className="flex flex-1 flex-col pt-4 sm:pt-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#31470B]">
                {product.marca}
              </span>
              <span className="rounded-md bg-[#F5F5F5] px-2 py-0.5 text-[11px] font-medium text-[#6B6B6B]">
                {product.tienda}
              </span>
            </div>

            <h2 className="mb-3 text-base font-semibold leading-snug text-[#0B0B0B]">
              {product.nombre}
            </h2>

            {/* Precio */}
            <div className="mb-4 flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${hasDiscount ? 'text-[#31470B]' : 'text-[#0B0B0B]'}`}>
                ${product.precio.toLocaleString('es-MX')}
              </span>
              {product.precioOriginal && (
                <span className="text-base line-through text-[#AAAAAA]">
                  ${product.precioOriginal.toLocaleString('es-MX')}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {product.envioGratis && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                  <Truck className="h-3 w-3" />
                  Envío gratis
                </span>
              )}
              {product.categoria && (
                <span className="flex items-center gap-1 rounded-full bg-[#F0F5E8] px-2.5 py-1 text-[11px] font-medium text-[#31470B]">
                  <Tag className="h-3 w-3" />
                  {product.categoria}
                </span>
              )}
              {product.color && (
                <span className="flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2.5 py-1 text-[11px] font-medium text-[#6B6B6B]">
                  {product.color}
                </span>
              )}
              {product.genero && (
                <span className="flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2.5 py-1 text-[11px] font-medium text-[#6B6B6B]">
                  {product.genero}
                </span>
              )}
            </div>

            {/* Tallas */}
            {product.tallasDisponibles && product.tallasDisponibles.length > 0 && (
              <div className="mb-4">
                <p className="mb-1.5 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">
                  Tallas disponibles
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.tallasDisponibles.slice(0, 12).map(t => (
                    <span key={t} className="rounded-lg border border-[#E5E5E5] px-2 py-1 text-xs font-medium text-[#0B0B0B]">
                      {t}
                    </span>
                  ))}
                  {product.tallasDisponibles.length > 12 && (
                    <span className="rounded-lg border border-[#E5E5E5] px-2 py-1 text-xs text-[#6B6B6B]">
                      +{product.tallasDisponibles.length - 12} más
                    </span>
                  )}
                </div>
              </div>
            )}

            <a
              href={addUtmParams(product.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0B0B0B] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1A1A1A]"
            >
              Ver en {product.tienda}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Historial de precio */}
        <div className="border-t border-[#F0F0F0] px-5 pb-6 pt-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0B0B0B]">Historial de precio</h3>
              {history.length >= 2 && <PriceTrend history={history} />}
            </div>
            {minPrice && history.length >= 2 && (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-[#6B6B6B]">Precio mínimo</p>
                <p className="text-sm font-bold text-emerald-600">${minPrice.toLocaleString('es-MX')}</p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex h-[140px] items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-[#31470B]" />
            </div>
          ) : chartData.length >= 2 ? (
            <PriceChart data={chartData} minPrice={minPrice} />
          ) : (
            <div className="flex h-[100px] items-center justify-center rounded-xl bg-[#F9F9F9]">
              <div className="text-center">
                <Package className="mx-auto mb-1.5 h-5 w-5 text-[#BBBBBB]" />
                <p className="text-xs text-[#6B6B6B]">
                  {chartData.length === 1
                    ? 'Rastreando desde hoy — vuelve pronto'
                    : 'Empezamos a rastrear este producto hoy'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
