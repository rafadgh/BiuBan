'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  initialQuery?: string
  size?: 'default' | 'large'
  className?: string
}

export function SearchBar({ initialQuery = '', size = 'default', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const isLarge = size === 'large'

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${isLarge ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isLarge ? 'Nike Air Force 1, tenis blancos, hoodie...' : 'Buscar productos...'}
          className={`w-full rounded-full border-border/50 bg-card pl-11 shadow-sm transition-all focus:border-foreground/30 focus:shadow-md ${
            isLarge ? 'h-14 pr-14 text-base sm:h-16 sm:pr-16 sm:text-lg' : 'h-10 pr-10'
          }`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 ${
            isLarge ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-7 w-7'
          }`}
          aria-label="Buscar"
        >
          <ArrowRight className={isLarge ? 'h-5 w-5' : 'h-4 w-4'} />
        </button>
      </div>
    </form>
  )
}
