'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Product } from '@/types/product'
import { CompareButton } from './CompareButton'
import { ProductDetailModal } from './ProductDetailModal'
import { addUtmParams } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const hasDiscount = !!product.descuento && product.descuento > 0

  return (
    <>
      <article
        className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-md ${
          product.mejorOpcion
            ? 'border-[#31470B] ring-1 ring-[#31470B]/20'
            : 'border-[#E5E5E5] hover:border-[#586E26]'
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

        {/* Image — click opens modal */}
        <button
          onClick={() => setModalOpen(true)}
          className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5] text-left"
          aria-label={`Ver detalles de ${product.nombre}`}
        >
          <Image
            src={product.imagen}
            alt={product.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </button>

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
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0B0B0B] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1A1A1A]"
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
