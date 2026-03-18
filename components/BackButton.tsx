'use client'

import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#0B0B0B] transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Volver atrás
    </button>
  )
}
