'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Tag, LayoutGrid, X, Camera } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Suggestion } from '@/app/api/suggestions/route'

interface SearchBarProps {
  initialQuery?: string
  size?:         'default' | 'large'
  className?:    string
  basePath?:     string
  placeholder?:  string
}

export function SearchBar({
  initialQuery = '',
  size         = 'default',
  className    = '',
  basePath     = '/buscar',
  placeholder,
}: SearchBarProps) {
  const [query,        setQuery]        = useState(initialQuery)
  const [suggestions,  setSuggestions]  = useState<Suggestion[]>([])
  const [open,         setOpen]         = useState(false)
  const [activeIdx,    setActiveIdx]    = useState(-1)
  const [loading,      setLoading]      = useState(false)
  const [imgLoading,   setImgLoading]   = useState(false)
  const containerRef   = useRef<HTMLDivElement>(null)
  const debounceRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInputRef   = useRef<HTMLInputElement>(null)
  const router         = useRouter()
  const isLarge        = size === 'large'

  // ── Debounced fetch de sugerencias ────────────────────────────────────────
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.trim().length < 2) { setSuggestions([]); setOpen(false); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res  = await fetch(`/api/suggestions?q=${encodeURIComponent(q.trim())}`)
        const data: Suggestion[] = await res.json()
        setSuggestions(data)
        setOpen(data.length > 0)
        setActiveIdx(-1)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 220)
  }, [])

  // ── Cerrar dropdown al hacer click fuera ─────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Submit (Enter / botón / selección) ───────────────────────────────────
  const navigate = (href: string) => {
    setOpen(false)
    setActiveIdx(-1)
    router.push(href)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeIdx >= 0 && suggestions[activeIdx]) {
      const s = suggestions[activeIdx]
      setQuery(s.text)
      navigate(s.href)
    } else if (query.trim()) {
      navigate(`${basePath}?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQuery(v)
    fetchSuggestions(v)
  }

  const clearQuery = () => {
    setQuery('')
    setSuggestions([])
    setOpen(false)
  }

  // ── Búsqueda por imagen ───────────────────────────────────────────────────
  const handleImageSearch = useCallback(async (file: File) => {
    setImgLoading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string
          const res = await fetch('/api/buscar-imagen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
          })
          const { query: q } = await res.json()
          if (q) {
            setQuery(q)
            setOpen(false)
            router.push(`${basePath}?q=${encodeURIComponent(q)}`)
          }
        } catch {
          // sin-op: el loader se apaga en finally
        } finally {
          setImgLoading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch {
      setImgLoading(false)
    }
  }, [basePath, router])

  // ── Icono por tipo de sugerencia ──────────────────────────────────────────
  const SuggestionIcon = ({ type }: { type: Suggestion['type'] }) => {
    if (type === 'marca')     return <Tag        className="h-3.5 w-3.5 shrink-0 text-[#586E26]" />
    if (type === 'categoria') return <LayoutGrid className="h-3.5 w-3.5 shrink-0 text-[#586E26]" />
    return                           <Search     className="h-3.5 w-3.5 shrink-0 text-[#6B6B6B]" />
  }

  const defaultPlaceholder = isLarge
    ? 'Nike Air Force 1, tenis blancos, hoodie...'
    : 'Buscar productos...'

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden file input for image search */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleImageSearch(file)
          e.target.value = ''
        }}
      />

      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${isLarge ? 'h-5 w-5' : 'h-4 w-4'}`} />

          <Input
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
            placeholder={placeholder ?? defaultPlaceholder}
            autoComplete="off"
            className={`w-full rounded-full border-border/50 bg-card pl-11 shadow-sm transition-all focus:border-foreground/30 focus:shadow-md ${
              isLarge ? 'h-14 text-base sm:h-16 sm:text-lg' : 'h-10'
            } ${isLarge ? 'pr-28 sm:pr-32' : 'pr-20'}`}
          />

          {/* Botón limpiar — solo cuando hay texto */}
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${
                isLarge ? 'right-24 sm:right-28' : 'right-16'
              }`}
              aria-label="Limpiar"
            >
              <X className={isLarge ? 'h-5 w-5' : 'h-4 w-4'} />
            </button>
          )}

          {/* Botón buscar por imagen */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={imgLoading}
            title="Buscar por imagen"
            className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50 ${
              isLarge ? 'right-14 sm:right-16 h-9 w-9' : 'right-9 h-7 w-7'
            }`}
            aria-label="Buscar por imagen"
          >
            {imgLoading
              ? <span className={`animate-spin rounded-full border-2 border-muted border-t-foreground ${isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
              : <Camera className={isLarge ? 'h-5 w-5' : 'h-4 w-4'} />
            }
          </button>

          {/* Botón submit */}
          <button
            type="submit"
            className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 ${
              isLarge ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-7 w-7'
            }`}
            aria-label="Buscar"
          >
            {loading
              ? <span className={`animate-spin rounded-full border-2 border-background/30 border-t-background ${isLarge ? 'h-5 w-5' : 'h-3.5 w-3.5'}`} />
              : <ArrowRight className={isLarge ? 'h-5 w-5' : 'h-4 w-4'} />
            }
          </button>
        </div>
      </form>

      {/* ── Dropdown de sugerencias ────────────────────────────────────────── */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-xl">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={(e) => {
                e.preventDefault() // evita que el input pierda focus antes del click
                setQuery(s.text)
                navigate(s.href)
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                i === activeIdx ? 'bg-[#F5F5F5]' : 'hover:bg-[#FAFAFA]'
              } ${i > 0 ? 'border-t border-[#F0F0F0]' : ''}`}
            >
              <SuggestionIcon type={s.type} />

              <div className="min-w-0 flex-1">
                {/* Resalta la parte de la query dentro del texto */}
                <HighlightMatch text={s.text} query={query} />
              </div>

              {s.sub && (
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  s.type === 'marca'     ? 'bg-[#F0F5E8] text-[#586E26]' :
                  s.type === 'categoria' ? 'bg-[#EFF6FF] text-[#3B82F6]' :
                                           'bg-[#F5F5F5] text-[#6B6B6B]'
                }`}>
                  {s.sub}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Componente auxiliar: resalta la porción que coincide con la query ─────────
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span className="text-sm font-medium text-[#0B0B0B]">{text}</span>

  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim())
  if (idx === -1) return <span className="text-sm font-medium text-[#0B0B0B]">{text}</span>

  return (
    <span className="text-sm font-medium text-[#0B0B0B]">
      {text.slice(0, idx)}
      <mark className="bg-[#F0F5E8] text-[#31470B] rounded px-0.5">
        {text.slice(idx, idx + query.trim().length)}
      </mark>
      {text.slice(idx + query.trim().length)}
    </span>
  )
}
