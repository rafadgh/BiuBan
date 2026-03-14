// components/MobileFilters.tsx
'use client'

import { useState, useCallback, useMemo } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Star, Tag, Percent, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  'Abercrombie & Fitch', 'Adidas', 'Amazon México', 'Bershka',
  'Converse', 'Coppel', 'Gap', 'H&M', 'Hollister', 'Innovasport',
  'Lacoste', "Levi's", 'Liverpool', 'Mango', 'Martí', 'Mercado Libre',
  'New Balance', 'Nike', 'Palacio de Hierro', 'Pull&Bear', 'Puma',
  'Stradivarius', 'Under Armour', 'Uniqlo', 'Vans', 'Zara',
]

const COLORES = [
  { value: 'negro',    label: 'Negro',    hex: '#1a1a1a' },
  { value: 'blanco',   label: 'Blanco',   hex: '#f5f5f5' },
  { value: 'gris',     label: 'Gris',     hex: '#9ca3af' },
  { value: 'azul',     label: 'Azul',     hex: '#3b82f6' },
  { value: 'navy',     label: 'Navy',     hex: '#1e3a5f' },
  { value: 'rojo',     label: 'Rojo',     hex: '#ef4444' },
  { value: 'verde',    label: 'Verde',    hex: '#22c55e' },
  { value: 'rosa',     label: 'Rosa',     hex: '#ec4899' },
  { value: 'morado',   label: 'Morado',   hex: '#a855f7' },
  { value: 'amarillo', label: 'Amarillo', hex: '#eab308' },
  { value: 'naranja',  label: 'Naranja',  hex: '#f97316' },
  { value: 'cafe',     label: 'Café',     hex: '#92400e' },
  { value: 'beige',    label: 'Beige',    hex: '#d4b896' },
  { value: 'dorado',   label: 'Dorado',   hex: '#d4af37' },
]

const GENEROS = [
  { value: 'hombre', label: 'Hombre' },
  { value: 'mujer',  label: 'Mujer'  },
  { value: 'nino',   label: 'Niño'   },
  { value: 'nina',   label: 'Niña'   },
  { value: 'unisex', label: 'Unisex' },
]

const TALLAS_ROPA_H    = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const TALLAS_ROPA_M    = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const TALLAS_NUMERICAS = ['0', '2', '4', '6', '8', '10', '12', '14']
const TALLAS_TENIS_H   = ['24', '25', '26', '27', '27.5', '28', '28.5', '29', '30', '31']
const TALLAS_TENIS_M   = ['22', '22.5', '23', '23.5', '24', '24.5', '25', '25.5', '26']
const TALLAS_TENIS_KID = ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21']
const TALLAS_PANTALON  = ['28', '30', '32', '34', '36', '38', '40']

const DESCUENTOS = [
  { value: '10', label: '10% o más' },
  { value: '20', label: '20% o más' },
  { value: '30', label: '30% o más' },
  { value: '50', label: '50% o más' },
]

function parseMulti(value: string | null): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

function groupByLetter(items: string[]): Record<string, string[]> {
  return items.reduce<Record<string, string[]>>((acc, item) => {
    const letter = item[0].toUpperCase()
    acc[letter] = acc[letter] ?? []
    acc[letter].push(item)
    return acc
  }, {})
}

function Section({
  title, children, defaultOpen = false, badge = 0,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; badge?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border/40 pb-4 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          {title}
          {badge > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              {badge}
            </span>
          )}
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  )
}

export function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false)
  const [tiendaSearch, setTiendaSearch] = useState('')
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
    setIsOpen(false)
  }

  const activeCount = [
    ...currentCategorias, ...currentTiendas, ...currentColores,
    ...currentTallas, ...currentDescuentos, ...currentGeneros,
    savedMin > 0 ? '1' : '', savedMax < 10000 ? '1' : '',
    currentSoloOfertas ? '1' : '', currentMejorOpcion ? '1' : '',
  ].filter(Boolean).length

  const filteredTiendas = useMemo(() =>
    tiendaSearch.trim()
      ? TIENDAS.filter(t => t.toLowerCase().includes(tiendaSearch.toLowerCase()))
      : TIENDAS,
    [tiendaSearch]
  )
  const tiendaGroups = useMemo(() => groupByLetter(filteredTiendas), [filteredTiendas])

  const TallaBtn = ({ t, arr }: { t: string; arr: string[] }) => (
    <button onClick={() => toggleMulti('talla', currentTallas, t)}
      className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
        currentTallas.includes(t)
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-foreground/80'
      }`}>{t}</button>
  )

  return (
    <>
      <Button variant="outline" size="sm"
        className="flex items-center gap-2 lg:hidden"
        onClick={() => setIsOpen(true)}>
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
            {activeCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="absolute bottom-0 left-0 right-0 flex max-h-[92vh] flex-col rounded-t-2xl bg-card shadow-2xl">

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-6 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
                {activeCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    {activeCount}
                  </span>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto px-6">

              <Section title="Género" defaultOpen badge={currentGeneros.length}>
                <div className="flex flex-wrap gap-2">
                  {GENEROS.map((g) => (
                    <button key={g.value}
                      onClick={() => toggleMulti('genero', currentGeneros, g.value)}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                        currentGeneros.includes(g.value)
                          ? 'border-foreground bg-foreground text-background font-medium'
                          : 'border-border text-foreground/80'
                      }`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Categoría" defaultOpen badge={currentCategorias.length}>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORIAS.map((cat) => (
                    <button key={cat.value}
                      onClick={() => toggleMulti('categoria', currentCategorias, cat.value)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        currentCategorias.includes(cat.value)
                          ? 'border-foreground bg-foreground text-background font-medium'
                          : 'border-border text-foreground/80'
                      }`}>{cat.label}</button>
                  ))}
                </div>
              </Section>

              <Section title="Rango de precio" defaultOpen>
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
                  <Slider value={sliderValues} min={0} max={10000} step={200}
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

              <Section title="Especiales" badge={(currentSoloOfertas ? 1 : 0) + (currentMejorOpcion ? 1 : 0)}>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 py-1">
                    <Checkbox checked={currentSoloOfertas} onCheckedChange={() => toggleBoolean('ofertas', currentSoloOfertas)} />
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-orange-500" />Solo con descuento
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 py-1">
                    <Checkbox checked={currentMejorOpcion} onCheckedChange={() => toggleBoolean('mejor', currentMejorOpcion)} />
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />Mejor opción
                    </div>
                  </label>
                </div>
              </Section>

              <Section title="% de descuento" badge={currentDescuentos.length}>
                <div className="flex flex-wrap gap-2">
                  {DESCUENTOS.map((d) => (
                    <button key={d.value}
                      onClick={() => toggleMulti('descuento', currentDescuentos, d.value)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        currentDescuentos.includes(d.value)
                          ? 'border-foreground bg-foreground text-background font-medium'
                          : 'border-border text-foreground/80'
                      }`}>
                      <Percent className="h-3.5 w-3.5" />{d.label}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Color" badge={currentColores.length}>
                <div className="flex flex-wrap gap-3 py-1">
                  {COLORES.map((color) => (
                    <button key={color.value}
                      onClick={() => toggleMulti('color', currentColores, color.value)}
                      title={color.label}
                      className={`relative h-9 w-9 rounded-full transition-transform hover:scale-110 ${
                        currentColores.includes(color.value)
                          ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card'
                          : 'ring-1 ring-border'
                      }`}
                      style={{ backgroundColor: color.hex }}>
                      {currentColores.includes(color.value) && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="h-2.5 w-2.5 rounded-full bg-white shadow" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Talla — Hombre / Unisex" badge={currentTallas.filter(t => TALLAS_ROPA_H.includes(t)).length}>
                <div className="flex flex-wrap gap-2">
                  {TALLAS_ROPA_H.map(t => <TallaBtn key={t} t={t} arr={TALLAS_ROPA_H} />)}
                </div>
              </Section>

              <Section title="Talla — Mujer" badge={currentTallas.filter(t => [...TALLAS_ROPA_M, ...TALLAS_NUMERICAS].includes(t)).length}>
                <p className="mb-2 text-xs text-muted-foreground">Letras</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {TALLAS_ROPA_M.map(t => <TallaBtn key={t} t={t} arr={TALLAS_ROPA_M} />)}
                </div>
                <p className="mb-2 text-xs text-muted-foreground">Numéricas</p>
                <div className="flex flex-wrap gap-2">
                  {TALLAS_NUMERICAS.map(t => <TallaBtn key={t} t={t} arr={TALLAS_NUMERICAS} />)}
                </div>
              </Section>

              <Section title="Talla tenis — Hombre (MX)" badge={currentTallas.filter(t => TALLAS_TENIS_H.includes(t)).length}>
                <div className="flex flex-wrap gap-2">
                  {TALLAS_TENIS_H.map(t => <TallaBtn key={t} t={t} arr={TALLAS_TENIS_H} />)}
                </div>
              </Section>

              <Section title="Talla tenis — Mujer (MX)" badge={currentTallas.filter(t => TALLAS_TENIS_M.includes(t)).length}>
                <div className="flex flex-wrap gap-2">
                  {TALLAS_TENIS_M.map(t => <TallaBtn key={t} t={t} arr={TALLAS_TENIS_M} />)}
                </div>
              </Section>

              <Section title="Talla tenis — Niño / Niña (MX)" badge={currentTallas.filter(t => TALLAS_TENIS_KID.includes(t)).length}>
                <div className="flex flex-wrap gap-2">
                  {TALLAS_TENIS_KID.map(t => <TallaBtn key={t} t={t} arr={TALLAS_TENIS_KID} />)}
                </div>
              </Section>

              <Section title="Talla pantalón (cintura)" badge={currentTallas.filter(t => TALLAS_PANTALON.includes(t)).length}>
                <div className="flex flex-wrap gap-2">
                  {TALLAS_PANTALON.map(t => <TallaBtn key={t} t={t} arr={TALLAS_PANTALON} />)}
                </div>
              </Section>

              <Section title="Tienda" badge={currentTiendas.length}>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text" value={tiendaSearch}
                    onChange={(e) => setTiendaSearch(e.target.value)}
                    placeholder="Buscar tienda..."
                    className="h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
                  />
                  {tiendaSearch && (
                    <button onClick={() => setTiendaSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {Object.keys(tiendaGroups).sort().map((letter) => (
                    <div key={letter}>
                      <p className="mb-1 pl-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                        {letter}
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {tiendaGroups[letter].map((store) => (
                          <button key={store}
                            onClick={() => toggleMulti('tienda', currentTiendas, store)}
                            className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                              currentTiendas.includes(store)
                                ? 'border-foreground bg-foreground text-background font-medium'
                                : 'border-border text-foreground/80'
                            }`}>{store}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredTiendas.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Sin resultados para &ldquo;{tiendaSearch}&rdquo;
                    </p>
                  )}
                </div>
              </Section>

              <div className="h-4" />
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border/40 p-4 flex gap-3">
              {activeCount > 0 && (
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  Limpiar todo
                </Button>
              )}
              <Button className="flex-1" onClick={() => setIsOpen(false)}>
                Ver resultados{activeCount > 0 ? ` · ${activeCount} filtros` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}