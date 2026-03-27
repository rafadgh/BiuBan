'use client'

import { Scale } from 'lucide-react'
import { useCompare } from '@/context/compare'
import type { Product } from '@/types/product'

export function CompareButton({ product }: { product: Product }) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare()
  const inCompare = isInCompare(product.id)
  const isFull = compareList.length >= 3 && !inCompare

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) removeFromCompare(product.id)
    else addToCompare(product)
  }

  if (isFull) return null

  return (
    <button
      onClick={handleClick}
      aria-label={inCompare ? `Quitar ${product.name} del comparador` : `Agregar ${product.name} al comparador`}
      aria-pressed={inCompare}
      className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
        inCompare
          ? 'border-[#31470B] bg-[#31470B] text-white shadow-sm'
          : 'border-[#E5E5E5] bg-white text-[#6B6B6B] opacity-0 group-hover:opacity-100 focus:opacity-100 hover:border-[#31470B] hover:text-[#31470B]'
      }`}
    >
      <Scale className="h-3.5 w-3.5" />
    </button>
  )
}
