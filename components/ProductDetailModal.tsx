'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ExternalLink, X, TrendingDown, TrendingUp, Minus, Package, Truck, Tag } from 'lucide-react'
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

export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const [history, setHistory] = useState<PriceRecord[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch price history when modal opens
  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/precio-historial/${encodeURIComponent(product.id)}`)
      .then(r => r.json())
      .then(d => setHistory(d.data ?? []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [open, product.id])

  // Cerrar con tecla Escape
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
        {/* Close button */}
        <button
          onClick={onClose}
          autoFocus
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-[#6B6B6B] hover:text-[#0B0B0B] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 p-5 sm:p-6">
          {/* Image */}
          <div className="relative aspect-square w-full sm:w-48 sm:shrink-0 overflow-hidden rounded-xl bg-[#F5F5F5]">
            <Image
              src={product.imagen}
              alt={product.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 192px"
            />
            {hasDiscount && (
              <div className="absolute left-2 top-2 rounded-full bg-[#0B0B0B] px-2 py-1 text-xs font-semibold text-white">
                -{product.descuento}%
              </div>
            )}
          </div>

          {/* Details */}
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

            {/* Price */}
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

            {/* Sizes */}
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

        {/* Price History */}
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
