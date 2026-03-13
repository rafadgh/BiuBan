'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'

const sortOptions = [
  { value: 'relevancia',   label: 'Relevancia' },
  { value: 'precio-asc',   label: 'Precio: menor a mayor' },
  { value: 'precio-desc',  label: 'Precio: mayor a menor' },
  { value: 'descuento',    label: 'Mayor descuento' },
]

interface SortBarProps {
  resultCount: number
  query: string
}

export function SortBar({ resultCount, query }: SortBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('ordenar') || 'relevancia'

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'relevancia') params.delete('ordenar')
    else params.set('ordenar', value)
    router.push(`/buscar?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      {/* Contador */}
      <p className="text-sm text-[#6B6B6B]">
        <span className="font-semibold text-[#0B0B0B]">{resultCount}</span>{' '}
        {resultCount === 1 ? 'resultado' : 'resultados'} para{' '}
        <span className="font-semibold text-[#0B0B0B]">&ldquo;{query}&rdquo;</span>
      </p>

      {/* Ordenar — botones tipo toggle, sin select */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-[#6B6B6B]" />
        <div className="flex items-center gap-1 rounded-xl border border-[#E5E5E5] bg-white p-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                currentSort === opt.value
                  ? 'bg-[#0B0B0B] text-white'
                  : 'text-[#6B6B6B] hover:bg-[#F3F4F6] hover:text-[#0B0B0B]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}