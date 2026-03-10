import { Award } from 'lucide-react'

export function BestOptionBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-amber-950 shadow-md ring-1 ring-amber-500/20">
      <Award className="h-3.5 w-3.5" />
      Mejor opción
    </span>
  )
}
