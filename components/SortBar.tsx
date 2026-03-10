'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const sortOptions = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
]

interface SortBarProps {
  resultCount: number
  query: string
}

export function SortBar({ resultCount, query }: SortBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('ordenar') || 'relevancia'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value !== 'relevancia') {
      params.set('ordenar', value)
    } else {
      params.delete('ordenar')
    }
    router.push(`/buscar?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{resultCount}</span>{' '}
        {resultCount === 1 ? 'resultado' : 'resultados'} para{' '}
        <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
      </p>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Ordenar:</span>
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="h-8 w-40 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
