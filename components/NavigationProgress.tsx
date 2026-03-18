// components/NavigationProgress.tsx
// Barra de carga delgada en la parte superior — se activa en cada navegación/cambio de filtro
'use client'

import { useEffect, useRef, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function ProgressBar() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const barRef       = useRef<HTMLDivElement>(null)
  const timeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    // Limpiar timeout previo
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Reset sin transición
    bar.style.transition = 'none'
    bar.style.width      = '0%'
    bar.style.opacity    = '1'

    // Iniciar animación en el siguiente frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = 'width 0.4s cubic-bezier(0.4,0,0.2,1)'
        bar.style.width      = '80%'
      })
    })

    // Completar y ocultar
    timeoutRef.current = setTimeout(() => {
      bar.style.transition = 'width 0.2s ease'
      bar.style.width      = '100%'
      setTimeout(() => {
        bar.style.transition = 'opacity 0.25s ease'
        bar.style.opacity    = '0'
      }, 200)
    }, 150)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  // Se dispara en cada cambio de ruta o de search params
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams.toString()])

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[9999] h-[3px]">
      <div
        ref={barRef}
        className="h-full bg-[#586E26]"
        style={{ width: '0%', opacity: 0 }}
      />
    </div>
  )
}

// Suspense necesario porque useSearchParams requiere estar dentro de un boundary
export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  )
}
