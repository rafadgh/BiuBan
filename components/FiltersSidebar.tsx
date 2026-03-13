// components/FiltersSidebar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback, useMemo } from 'react'
import { ChevronDown, ChevronUp, X, Star, Tag, Percent, Search, User, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

const CATEGORIAS = [
  { value: 'tenis',      label: 'Tenis / Sneakers' },
  { value: 'hoodies',    label: 'Hoodies / Sudaderas' },
  { value: 'playeras',   label: 'Playeras / T-Shirts' },
  { value: 'jeans',      label: 'Jeans / Pantalones' },
  { value: 'chamarras',  label: 'Chamarras / Jackets' },
  { value: 'vestidos',   label: 'Vestidos' },
  { value: 'shorts',     label: 'Shorts / Bermudas' },
  { value: 'deportivo',  label: 'Ropa Deportiva' },
  { value: 'accesorios', label: 'Accesorios / Bolsas' },
  { value: 'botas',      label: 'Botas / Botines' },
]

const TIENDAS = [
  'Abercrombie & Fitch',
  'Adidas',
  'Amazon México',
  'Bershka',
  'Converse',
  'Coppel',
  'Gap',
  'H&M',
  'Hollister',
  'Innovasport',
  'Lacoste',
  "Levi's",
  'Liverpool',
  'Mango',
  'Martí',
  'Mercado Libre',
  'New Balance',
  'Nike',
  'Palacio de Hierro',
  'Pull&Bear',
  'Puma',
  'Stradivarius',
  'Under Armour',
  'Uniqlo',
  'Vans',
  'Zara',
].sort((a, b) => a.localeCompare(b, 'es'))

const COLORES = [
  { value: 'Negro',    hex: '#1a1a1a' },
  { value: 'Blanco',   hex: '#f5f5f5' },
  { value: 'Gris',     hex: '#9ca3af' },
  { value: 'Azul',     hex: '#3b82f6' },
  { value: 'Navy',     hex: '#1e3a5f' },
  { value: 'Rojo',     hex: '#ef4444' },
  { value: 'Verde',    hex: '#22c55e' },
  { value: 'Rosa',     hex: '#ec4899' },
  { value: 'Morado',   hex: '#a855f7' },
  { value: 'Amarillo', hex: '#eab308' },
  { value: 'Naranja',  hex: '#f97316' },
  { value: 'Café',     hex: '#92400e' },
  { value: 'Beige',    hex: '#d4b896' },
  { value: 'Crema',    hex: '#fef9c3' },
]

// Tallas unisex / hombre
const TALLAS_ROPA_H   = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
// Tallas mujer (incluye extras)
const TALLAS_ROPA_M   = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
// Tallas numéricas mujer (vestidos, blusas)
const TALLAS_NUMERICAS = ['0', '2', '4', '6', '8', '10', '12', '14']
// Tallas tenis hombre
const TALLAS_TENIS_H  = ['24', '25', '26', '27', '27.5', '28', '28.5', '29', '30', '31']
// Tallas tenis mujer
const TALLAS_TENIS_M  = ['22', '22.5', '23', '23.5', '24', '24.5', '25', '25.5', '26']
// Tallas pantalón
const TALLAS_PANTALON = ['28', '30', '32', '34', '36', '38', '40']

const DESCUENTOS = [
  { value: '10', label: '10% o más' },
  { value: '20', label: '20% o más' },
  { value: '30', label: '30% o más' },
  { value: '50', label: '50% o más' },
]

const GENEROS = [
  { value: 'hombre', label: 'Hombre', icon: User },
  { value: 'mujer',  label: 'Mujer',  icon: User },
  { value: 'unisex', label: 'Unisex', icon: Users },
]

function parseMulti(value: string | null): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

// Agrupa tiendas por primera letra
function groupByLetter(items: string[]): Record<string, string[]> {
  return items.reduce<Record<string, string[]>>((acc, item) => {
    const letter = item[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(item)
    return acc
  }, {})
}

function Section({
  title,
  children,
  defaultOpen = true,
  count = 0,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  count?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border/40 pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          {count > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              {count}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}

function ActiveTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground">
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:text-red-500">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

export function FiltersSidebar({ className = '' }: { className?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategorias  = parseMulti(searchParams.get('categoria'))
  const currentTiendas     = parseMulti(searchParams.get('tienda'))
  const currentColores     = parseMulti(searchParams.get('color'))
  const currentTallas      = parseMulti(searchParams.get('talla'))
  const currentDescuentos  = parseMulti(searchParams.get('descuento'))
  const currentGeneros     = parseMulti(searchParams.get('genero'))
  const currentSoloOfertas = searchParams.get('ofertas') === '1'
  const currentMejorOpcion = searchParams.get('mejor') === '1'
  const savedMin = searchParams.get('precioMin') ? parseInt(searchParams.get('precioMin')!) : 0
  const savedMax = searchParams.get('precioMax') ? parseInt(searchParams.get('precioMax')!) : 10000

  const [sliderValues, setSliderValues] = useState<[number, number]>([savedMin, savedMax])
  const [tiendaSearch, setTiendaSearch] = useState('')

  const pushParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v); else params.delete(k)
    }
    router.push(`/buscar?${params.toString()}`)
  }, [searchParams, router])

  const toggleMulti = (key: string, current: string[], value: string) => {
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    pushParams({ [key]: next.join(',') || null })
  }

  const toggleBoolean = (key: string, current: boolean) => {
    pushParams({ [key]: current ? null : '1' })
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const q = searchParams.get('q')
    if (q) params.set('q', q)
    setSliderValues([0, 10000])
    setTiendaSearch('')
    router.push(`/buscar?${params.toString()}`)
  }

  const activeCount = [
    ...currentCategorias, ...currentTiendas, ...currentColores,
    ...currentTallas, ...currentDescuentos, ...currentGeneros,
    savedMin > 0 ? '1' : '',
    savedMax < 10000 ? '1' : '',
    currentSoloOfertas ? '1' : '',
    currentMejorOpcion ? '1' : '',
  ].filter(Boolean).length

  // Tiendas filtradas por búsqueda
  const filteredTiendas = useMemo(() => {
    if (!tiendaSearch.trim()) return TIENDAS
    return TIENDAS.filter(t =>
      t.toLowerCase().includes(tiendaSearch.toLowerCase())
    )
  }, [tiendaSearch])

  const tiendaGroups = useMemo(
    () => groupByLetter(filteredTiendas),
    [filteredTiendas]
  )

  return (
    <aside className={`flex flex-col rounded-xl border border-border/50 bg-card ${className}`}>

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-foreground">Filtros</h2>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost" size="sm" onClick={clearFilters}
            className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Limpiar todo
          </Button>
        )}
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Tags de filtros activos */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            {currentGeneros.map(g => (
              <ActiveTag key={g} label={g.charAt(0).toUpperCase() + g.slice(1)} onRemove={() => toggleMulti('genero', currentGeneros, g)} />
            ))}
            {currentCategorias.map(c => (
              <ActiveTag key={c} label={c} onRemove={() => toggleMulti('categoria', currentCategorias, c)} />
            ))}
            {currentTiendas.map(t => (
              <ActiveTag key={t} label={t} onRemove={() => toggleMulti('tienda', currentTiendas, t)} />
            ))}
            {currentColores.map(c => (
              <ActiveTag key={c} label={c} onRemove={() => toggleMulti('color', currentColores, c)} />
            ))}
            {currentTallas.map(t => (
              <ActiveTag key={t} label={`Talla ${t}`} onRemove={() => toggleMulti('talla', currentTallas, t)} />
            ))}
            {currentDescuentos.map(d => (
              <ActiveTag key={d} label={`-${d}% o más`} onRemove={() => toggleMulti('descuento', currentDescuentos, d)} />
            ))}
            {currentSoloOfertas && <ActiveTag label="Solo ofertas" onRemove={() => toggleBoolean('ofertas', true)} />}
            {currentMejorOpcion && <ActiveTag label="Mejor opción" onRemove={() => toggleBoolean('mejor', true)} />}
          </div>
        )}

        {/* ── Género ────────────────────────────────────── */}
        <Section title="Género" count={currentGeneros.length}>
          <div className="flex gap-2">
            {GENEROS.map((g) => (
              <button
                key={g.value}
                onClick={() => toggleMulti('genero', currentGeneros, g.value)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
                  currentGeneros.includes(g.value)
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Categoría ─────────────────────────────────── */}
        <Section title="Categoría" count={currentCategorias.length}>
          <div className="space-y-0.5">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => toggleMulti('categoria', currentCategorias, cat.value)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                  currentCategorias.includes(cat.value)
                    ? 'bg-foreground text-background font-medium'
                    : 'text-foreground/80 hover:bg-muted'
                }`}
              >
                {cat.label}
                {currentCategorias.includes(cat.value) && <X className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Rango de precio ───────────────────────────── */}
        <Section title="Precio">
          <div className="space-y-3 px-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-muted px-2.5 py-1 text-sm font-semibold tabular-nums">
                ${sliderValues[0].toLocaleString('es-MX')}
              </span>
              <span className="text-xs text-muted-foreground">—</span>
              <span className="rounded-lg bg-muted px-2.5 py-1 text-sm font-semibold tabular-nums">
                ${sliderValues[1].toLocaleString('es-MX')}
              </span>
            </div>
            <Slider
              value={sliderValues}
              min={0} max={10000} step={200}
              onValueChange={(v) => setSliderValues(v as [number, number])}
              onValueCommit={(v) => {
                const [min, max] = v as [number, number]
                pushParams({
                  precioMin: min > 0 ? min.toString() : null,
                  precioMax: max < 10000 ? max.toString() : null,
                })
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span><span>$10,000+</span>
            </div>
          </div>
        </Section>

        {/* ── Descuento ─────────────────────────────────── */}
        <Section title="Descuento" defaultOpen={false} count={currentDescuentos.length}>
          <div className="flex flex-wrap gap-1.5">
            {DESCUENTOS.map((d) => (
              <button
                key={d.value}
                onClick={() => toggleMulti('descuento', currentDescuentos, d.value)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  currentDescuentos.includes(d.value)
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}
              >
                <Percent className="h-3 w-3" />{d.label}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Especiales ────────────────────────────────── */}
        <Section title="Especiales" defaultOpen={false}>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-muted">
              <Checkbox checked={currentSoloOfertas} onCheckedChange={() => toggleBoolean('ofertas', currentSoloOfertas)} />
              <div className="flex items-center gap-1.5 text-sm">
                <Tag className="h-3.5 w-3.5 text-orange-500" />Solo con descuento
              </div>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-muted">
              <Checkbox checked={currentMejorOpcion} onCheckedChange={() => toggleBoolean('mejor', currentMejorOpcion)} />
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="h-3.5 w-3.5 text-yellow-500" />Mejor opción
              </div>
            </label>
          </div>
        </Section>

        {/* ── Color ─────────────────────────────────────── */}
        <Section title="Color" defaultOpen={false} count={currentColores.length}>
          <div className="flex flex-wrap gap-2 pt-1">
            {COLORES.map((color) => (
              <button
                key={color.value}
                onClick={() => toggleMulti('color', currentColores, color.value)}
                title={color.value}
                className={`relative h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                  currentColores.includes(color.value)
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card'
                    : 'ring-1 ring-border'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {currentColores.includes(color.value) && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-white shadow-sm" />
                  </span>
                )}
              </button>
            ))}
          </div>
          {currentColores.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">{currentColores.join(', ')}</p>
          )}
        </Section>

        {/* ── Tallas ropa — Hombre / Unisex ─────────────── */}
        <Section title="Talla ropa — Hombre / Unisex" defaultOpen={false} count={currentTallas.filter(t => TALLAS_ROPA_H.includes(t)).length}>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS_ROPA_H.map((t) => (
              <button
                key={t} onClick={() => toggleMulti('talla', currentTallas, t)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                  currentTallas.includes(t)
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}
              >{t}</button>
            ))}
          </div>
        </Section>

        {/* ── Tallas ropa — Mujer ───────────────────────── */}
        <Section title="Talla ropa — Mujer" defaultOpen={false} count={currentTallas.filter(t => TALLAS_ROPA_M.includes(t) || TALLAS_NUMERICAS.includes(t)).length}>
          <p className="mb-2 text-xs text-muted-foreground">Letras</p>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS_ROPA_M.map((t) => (
              <button
                key={t} onClick={() => toggleMulti('talla', currentTallas, t)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                  currentTallas.includes(t)
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}
              >{t}</button>
            ))}
          </div>
          <p className="mb-2 mt-3 text-xs text-muted-foreground">Numéricas</p>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS_NUMERICAS.map((t) => (
              <button
                key={t} onClick={() => toggleMulti('talla', currentTallas, t)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                  currentTallas.includes(t)
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}
              >{t}</button>
            ))}
          </div>
        </Section>

        {/* ── Tallas tenis — Hombre ────────────────────── */}
        <Section title="Talla tenis — Hombre (MX)" defaultOpen={false} count={currentTallas.filter(t => TALLAS_TENIS_H.includes(t)).length}>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS_TENIS_H.map((t) => (
              <button
                key={t} onClick={() => toggleMulti('talla', currentTallas, t)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors ${
                  currentTallas.includes(t)
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}
              >{t}</button>
            ))}
          </div>
        </Section>

        {/* ── Tallas tenis — Mujer ────────────────────── */}
        <Section title="Talla tenis — Mujer (MX)" defaultOpen={false} count={currentTallas.filter(t => TALLAS_TENIS_M.includes(t)).length}>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS_TENIS_M.map((t) => (
              <button
                key={t} onClick={() => toggleMulti('talla', currentTallas, t)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors ${
                  currentTallas.includes(t)
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}
              >{t}</button>
            ))}
          </div>
        </Section>

        {/* ── Tallas pantalón ───────────────────────────── */}
        <Section title="Talla pantalón (cintura)" defaultOpen={false} count={currentTallas.filter(t => TALLAS_PANTALON.includes(t)).length}>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS_PANTALON.map((t) => (
              <button
                key={t} onClick={() => toggleMulti('talla', currentTallas, t)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors ${
                  currentTallas.includes(t)
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}
              >{t}</button>
            ))}
          </div>
        </Section>

        {/* ── Tienda — ordenada A-Z con buscador ───────── */}
        <Section title="Tienda" defaultOpen={false} count={currentTiendas.length}>
          {/* Mini buscador */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={tiendaSearch}
              onChange={(e) => setTiendaSearch(e.target.value)}
              placeholder="Buscar tienda..."
              className="h-8 w-full rounded-lg border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
            />
            {tiendaSearch && (
              <button
                onClick={() => setTiendaSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Lista agrupada por letra */}
          <div className="space-y-3">
            {Object.keys(tiendaGroups).sort().map((letter) => (
              <div key={letter}>
                <p className="mb-1 pl-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {letter}
                </p>
                <div className="space-y-0.5">
                  {tiendaGroups[letter].map((store) => (
                    <button
                      key={store}
                      onClick={() => toggleMulti('tienda', currentTiendas, store)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                        currentTiendas.includes(store)
                          ? 'bg-foreground text-background font-medium'
                          : 'text-foreground/80 hover:bg-muted'
                      }`}
                    >
                      {store}
                      {currentTiendas.includes(store) && <X className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {filteredTiendas.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                Sin resultados para &ldquo;{tiendaSearch}&rdquo;
              </p>
            )}
          </div>
        </Section>

      </div>
    </aside>
  )
}