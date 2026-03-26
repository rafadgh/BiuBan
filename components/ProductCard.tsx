'use client'

import { useState, useCallback } from 'react'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types/product'
import { CompareButton } from './CompareButton'
import { ProductDetailModal } from './ProductDetailModal'
import { addUtmParams } from '@/lib/utils'

// Imagen con fallback a letra — usa <img> directo para evitar
// que el optimizador de Next.js bloquee dominios externos (VTEX, etc.)
function ImageWithFallback({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-4xl font-bold text-[#D0D0D0]">{fallback}</span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  )
}

// Carousel de imágenes — flechas y puntos al hacer hover
function ImageCarousel({
  images,
  alt,
  fallback,
  onOpenModal,
}: {
  images: string[]
  alt: string
  fallback: string
  onOpenModal: () => void
}) {
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)

  const prev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent(i => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent(i => (i + 1) % images.length)
  }, [images.length])

  const goTo = useCallback((e: React.MouseEvent, idx: number) => {
    e.stopPropagation()
    setCurrent(idx)
  }, [])

  if (images.length === 0) {
    return (
      <button
        onClick={onOpenModal}
        className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5] text-left"
        aria-label={`Ver detalles de ${alt}`}
      >
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-4xl font-bold text-[#D0D0D0]">{fallback}</span>
        </div>
      </button>
    )
  }

  return (
    <div
      className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagen actual */}
      <button
        onClick={onOpenModal}
        className="absolute inset-0 text-left w-full h-full"
        aria-label={`Ver detalles de ${alt}`}
      >
        <ImageWithFallback
          src={images[current]}
          alt={`${alt} - imagen ${current + 1}`}
          fallback={fallback}
        />
      </button>

      {/* Flechas — solo si hay más de 1 imagen y está en hover */}
      {images.length > 1 && hovered && (
        <>
          <button
            onClick={prev}
            className="absolute left-1.5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-1 shadow-md transition hover:bg-white"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-4 w-4 text-[#0B0B0B]" />
          </button>
          <button
            onClick={next}
            className="absolute right-1.5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-1 shadow-md transition hover:bg-white"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-4 w-4 text-[#0B0B0B]" />
          </button>
        </>
      )}

      {/* Puntos indicadores */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1 pointer-events-none">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={e => goTo(e, idx)}
              className={`h-1.5 rounded-full transition-all pointer-events-auto ${
                idx === current
                  ? 'w-4 bg-white shadow'
                  : 'w-1.5 bg-white/55'
              }`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const hasDiscount = !!product.descuento && product.descuento > 0

  // Lista completa de imágenes (principal + adicionales, sin duplicados)
  const allImages: string[] = []
  if (product.imagen) allImages.push(product.imagen)
  if (product.imagenesAdicionales?.length) {
    for (const img of product.imagenesAdicionales) {
      if (img && !allImages.includes(img)) allImages.push(img)
    }
  }

  return (
    <>
      <article
        className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
          product.mejorOpcion
            ? 'border-[#31470B] ring-1 ring-[#31470B]/20'
            : 'border-[#E8E8E8] hover:border-[#586E26]'
        }`}
      >
        {product.mejorOpcion && (
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded-full bg-[#31470B] px-2.5 py-1 text-xs font-medium text-white shadow-sm">
              Mejor opción
            </span>
          </div>
        )}

        {hasDiscount && (
          <div
            className={`absolute top-3 z-10 ${
              product.mejorOpcion ? 'right-3' : 'left-3'
            }`}
          >
            <span className="rounded-full bg-[#0B0B0B] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              -{product.descuento}%
            </span>
          </div>
        )}

        {/* Compare button — top right */}
        <div className="absolute right-3 top-3 z-10">
          <CompareButton product={product} />
        </div>

        {/* Carousel de imágenes */}
        <ImageCarousel
          images={allImages}
          alt={product.nombre}
          fallback={product.nombre.charAt(0).toUpperCase()}
          onOpenModal={() => setModalOpen(true)}
        />

        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#0B0B0B]">
              {product.marca}
            </span>
            <span className="rounded-md bg-[#F5F5F5] px-2 py-0.5 text-[11px] font-medium text-[#6B6B6B]">
              {product.tienda}
            </span>
          </div>

          {/* Name — click opens modal */}
          <button
            onClick={() => setModalOpen(true)}
            className="mb-4 flex-1 text-left"
          >
            <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#0B0B0B] hover:text-[#31470B] transition-colors">
              {product.nombre}
            </h3>
          </button>

          <div className="mb-4 flex items-baseline gap-2">
            <span
              className={`text-xl font-bold ${
                hasDiscount ? 'text-[#31470B]' : 'text-[#0B0B0B]'
              }`}
            >
              ${product.precio.toLocaleString('es-MX')}
            </span>

            {product.precioOriginal && (
              <span className="text-sm line-through text-[#6B6B6B]">
                ${product.precioOriginal.toLocaleString('es-MX')}
              </span>
            )}
          </div>

          <a
            href={addUtmParams(product.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0B0B0B] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#31470B] active:scale-[0.98]"
            onClick={e => e.stopPropagation()}
          >
            Ver vendedor
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </article>

      <ProductDetailModal
        product={product}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
