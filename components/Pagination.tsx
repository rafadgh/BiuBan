'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  total:    number
  page:     number
  perPage:  number
  basePath?: string
}

export function Pagination({ total, page, perPage, basePath = '/buscar' }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / perPage)

  if (totalPages <= 1) return null

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (p === 1) params.delete('pagina')
    else params.set('pagina', p.toString())
    router.push(`${basePath}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Mostrar máximo 5 páginas alrededor de la actual
  const delta = 2
  const start = Math.max(1, page - delta)
  const end   = Math.min(totalPages, page + delta)
  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)

  const btnBase = 'flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors'
  const btnIdle = 'border-[#E5E5E5] bg-white text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#0B0B0B]'
  const btnActive = 'border-[#0B0B0B] bg-[#0B0B0B] text-white'
  const btnDisabled = 'border-[#E5E5E5] bg-white text-[#D1D1D1] cursor-not-allowed'

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <p className="text-xs text-[#6B6B6B]">
        Mostrando{' '}
        <span className="font-semibold text-[#0B0B0B]">
          {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)}
        </span>{' '}
        de{' '}
        <span className="font-semibold text-[#0B0B0B]">{total}</span> resultados
      </p>

      <div className="flex items-center gap-1.5">
        {/* Anterior */}
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnIdle}`}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Primera página si no está visible */}
        {start > 1 && (
          <>
            <button onClick={() => goToPage(1)} className={`${btnBase} ${btnIdle}`}>1</button>
            {start > 2 && <span className="px-1 text-[#9CA3AF]">…</span>}
          </>
        )}

        {/* Páginas del rango */}
        {pages.map(p => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`${btnBase} ${p === page ? btnActive : btnIdle}`}
          >
            {p}
          </button>
        ))}

        {/* Última página si no está visible */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-[#9CA3AF]">…</span>}
            <button onClick={() => goToPage(totalPages)} className={`${btnBase} ${btnIdle}`}>{totalPages}</button>
          </>
        )}

        {/* Siguiente */}
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnIdle}`}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
