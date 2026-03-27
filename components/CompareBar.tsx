'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Scale, X } from 'lucide-react'
import { useCompare } from '@/context/compare'

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  if (compareList.length === 0) return null

  const compareUrl = `/comparar?ids=${compareList.map(p => p.id).join(',')}`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5E5E5] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom duration-300">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">

        {/* Label */}
        <div className="hidden items-center gap-2 sm:flex shrink-0">
          <Scale className="h-4 w-4 text-[#31470B]" />
          <span className="text-sm font-semibold text-[#0B0B0B]">
            Comparar ({compareList.length}/3)
          </span>
        </div>

        {/* Products */}
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {compareList.map(p => (
            <div
              key={p.id}
              className="relative flex shrink-0 items-center gap-2 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] px-2.5 py-1.5"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-lg shrink-0">
                <Image
                  src={p.imagen}
                  alt={p.nombre}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
              <div className="max-w-[110px]">
                <p className="truncate text-[11px] font-medium text-[#0B0B0B] leading-tight">
                  {p.nombre}
                </p>
                <p className="text-xs font-bold text-[#31470B]">
                  ${p.precio.toLocaleString('es-MX')}
                </p>
              </div>
              <button
                onClick={() => removeFromCompare(p.id)}
                aria-label={`Quitar ${p.nombre} del comparador`}
                className="ml-0.5 rounded-full p-0.5 text-[#AAAAAA] hover:text-[#0B0B0B] transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - compareList.length }).map((_, i) => (
            <div
              key={i}
              className="hidden sm:flex h-[52px] w-[150px] shrink-0 items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] text-[11px] text-[#888888]"
            >
              + Agrega un producto
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="hidden text-xs text-[#6B6B6B] hover:text-[#0B0B0B] transition-colors sm:block"
          >
            Limpiar
          </button>
          {compareList.length >= 2 && (
            <Link
              href={compareUrl}
              className="rounded-full bg-[#31470B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3d5a0d] whitespace-nowrap"
            >
              Comparar
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}
