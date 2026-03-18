// components/FiltersSidebar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { ChevronDown, ChevronUp, X, Star, Tag, Percent, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import type { SearchFacets } from '@/lib/products'

interface PriceRange { min: number; max: number }

const CATEGORIA_GROUPS: { group: string; items: { value: string; label: string }[] }[] = [
  {
    group: 'Calzado',
    items: [
      { value: 'tenis',    label: 'Tenis / Sneakers' },
      { value: 'botas',    label: 'Botas / Botines'  },
    ],
  },
  {
    group: 'Ropa',
    items: [
      { value: 'playeras',  label: 'Playeras / T-Shirts'  },
      { value: 'sudaderas', label: 'Sudaderas / Hoodies'   },
      { value: 'chamarras', label: 'Chamarras / Jackets'   },
      { value: 'jeans',     label: 'Jeans / Pantalones'    },
      { value: 'shorts',    label: 'Shorts / Bermudas'     },
      { value: 'vestidos',  label: 'Vestidos'              },
    ],
  },
  {
    group: 'Deportivo',
    items: [
      { value: 'running',    label: 'Running / Atletismo'   },
      { value: 'gym',        label: 'Gym / Fitness'         },
      { value: 'futbol',     label: 'Fútbol'                },
      { value: 'basketball', label: 'Basketball'            },
      { value: 'golf',       label: 'Golf'                  },
      { value: 'beisbol',    label: 'Béisbol'               },
      { value: 'outdoor',    label: 'Outdoor / Senderismo'  },
    ],
  },
  {
    group: 'Accesorios',
    items: [
      { value: 'mochilas',   label: 'Mochilas / Bolsas'    },
      { value: 'gorras',     label: 'Gorras / Sombreros'   },
      { value: 'calcetines', label: 'Calcetines'           },
    ],
  },
]
const ALL_CATEGORIAS = CATEGORIA_GROUPS.flatMap(g => g.items)


const COLORES = [
  { value: 'negro',     label: 'Negro',     hex: '#1a1a1a' },
  { value: 'blanco',    label: 'Blanco',    hex: '#f5f5f5' },
  { value: 'gris',      label: 'Gris',      hex: '#9ca3af' },
  { value: 'azul',      label: 'Azul',      hex: '#3b82f6' },
  { value: 'navy',      label: 'Navy',      hex: '#1e3a5f' },
  { value: 'rojo',      label: 'Rojo',      hex: '#ef4444' },
  { value: 'verde',     label: 'Verde',     hex: '#22c55e' },
  { value: 'rosa',      label: 'Rosa',      hex: '#ec4899' },
  { value: 'morado',    label: 'Morado',    hex: '#a855f7' },
  { value: 'amarillo',  label: 'Amarillo',  hex: '#eab308' },
  { value: 'naranja',   label: 'Naranja',   hex: '#f97316' },
  { value: 'cafe',      label: 'Café',      hex: '#92400e' },
  { value: 'beige',     label: 'Beige',     hex: '#d4b896' },
  { value: 'dorado',    label: 'Dorado',    hex: '#d4af37' },
  { value: 'multicolor',label: 'Multicolor',hex: 'conic-gradient(red,yellow,green,blue,red)' },
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

// Normaliza para comparaciones (minúsculas, sin acentos)
function nrm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

function parseMulti(value: string | null): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

// Helpers para filtrar opciones basadas en facetas
function hasFacetColor(facets: SearchFacets | undefined, value: string): boolean {
  if (!facets || facets.colores.length === 0) return true
  return facets.colores.includes(nrm(value))
}
function hasFacetGenero(facets: SearchFacets | undefined, value: string): boolean {
  if (!facets || facets.generos.length === 0) return true
  return facets.generos.includes(nrm(value))
}
function hasFacetTalla(facets: SearchFacets | undefined, value: string): boolean {
  if (!facets || facets.tallas.length === 0) return true
  return facets.tallas.includes(value)
}
function hasFacetSubcat(facets: SearchFacets | undefined, catValue: string): boolean {
  if (!facets || facets.subcategorias.length === 0) return true
  const v = nrm(catValue)
  return facets.subcategorias.some(s => s === v || s.includes(v) || v.includes(s))
}

function Section({
  title, children, defaultOpen = true, badge = 0,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; badge?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border/40 pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
          {badge > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              {badge}
            </span>
          )}
        </span>
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

export function FiltersSidebar({
  className = '',
  priceRange,
  facets,
  basePath = '/buscar',
}: {
  className?: string
  priceRange?: PriceRange
  facets?: SearchFacets
  basePath?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const effectiveMin = priceRange?.min ?? 0
  const effectiveMax = priceRange?.max ?? 10000

  const currentCategorias  = parseMulti(searchParams.get('categoria'))
  const currentMarcas      = parseMulti(searchParams.get('marca'))
  const currentTiendas     = parseMulti(searchParams.get('tienda'))
  const currentColores     = parseMulti(searchParams.get('color'))
  const currentTallas      = parseMulti(searchParams.get('talla'))
  const currentDescuentos  = parseMulti(searchParams.get('descuento'))
  const currentGeneros     = parseMulti(searchParams.get('genero'))
  const currentSoloOfertas = searchParams.get('ofertas') === '1'
  const currentMejorOpcion = searchParams.get('mejor') === '1'

  const urlMin = searchParams.get('precioMin') ? parseInt(searchParams.get('precioMin')!) : null
  const urlMax = searchParams.get('precioMax') ? parseInt(searchParams.get('precioMax')!) : null
  const savedMin = urlMin !== null ? Math.max(effectiveMin, Math.min(urlMin, effectiveMax)) : effectiveMin
  const savedMax = urlMax !== null ? Math.max(effectiveMin, Math.min(urlMax, effectiveMax)) : effectiveMax

  const [sliderValues, setSliderValues] = useState<[number, number]>([savedMin, savedMax])
  const [tiendaSearch, setTiendaSearch] = useState('')
  // Tiendas dinámicas: vienen de facets (solo las que tienen productos en el contexto actual)
  const tiendas = facets?.tiendas ?? []

  useEffect(() => {
    setSliderValues([
      urlMin !== null ? Math.max(effectiveMin, Math.min(urlMin, effectiveMax)) : effectiveMin,
      urlMax !== null ? Math.max(effectiveMin, Math.min(urlMax, effectiveMax)) : effectiveMax,
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveMin, effectiveMax])

  const pushParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v); else params.delete(k)
    }
    params.delete('pagina')
    router.push(`${basePath}?${params.toString()}`)
  }, [searchParams, router, basePath])

  const toggleMulti = (key: string, current: string[], value: string) => {
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
    pushParams({ [key]: next.join(',') || null })
  }
  const toggleBoolean = (key: string, current: boolean) => {
    pushParams({ [key]: current ? null : '1' })
  }
  const clearFilters = () => {
    const params = new URLSearchParams()
    const q = searchParams.get('q')
    if (q) params.set('q', q)
    setSliderValues([effectiveMin, effectiveMax])
    setTiendaSearch('')
    router.push(`${basePath}?${params.toString()}`)
  }

  const activeCount = [
    ...currentCategorias, ...currentMarcas, ...currentTiendas, ...currentColores,
    ...currentTallas, ...currentDescuentos, ...currentGeneros,
    (urlMin !== null && urlMin > effectiveMin) ? '1' : '',
    (urlMax !== null && urlMax < effectiveMax) ? '1' : '',
    currentSoloOfertas ? '1' : '', currentMejorOpcion ? '1' : '',
  ].filter(Boolean).length

  const filteredTiendas = useMemo(() =>
    tiendaSearch.trim() ? tiendas.filter(t => t.toLowerCase().includes(tiendaSearch.toLowerCase())) : tiendas,
    [tiendaSearch, tiendas]
  )
  const step = effectiveMax <= 1000 ? 50 : effectiveMax <= 5000 ? 200 : 500

  // ── Opciones filtradas por facetas ────────────────────────────────────────
  const visibleGeneros   = GENEROS.filter(g => hasFacetGenero(facets, g.value))
  const visibleColores   = COLORES.filter(c => hasFacetColor(facets, c.value))
  const filterTallas     = (arr: string[]) => arr.filter(t => hasFacetTalla(facets, t))
  const filterCatItems   = (items: { value: string; label: string }[]) =>
    items.filter(cat => hasFacetSubcat(facets, cat.value))
  const visibleCatGroups = CATEGORIA_GROUPS
    .map(g => ({ ...g, items: filterCatItems(g.items) }))
    .filter(g => g.items.length > 0)

  const visibleTallasRopaH   = filterTallas(TALLAS_ROPA_H)
  const visibleTallasRopaM   = filterTallas(TALLAS_ROPA_M)
  const visibleTallasNum     = filterTallas(TALLAS_NUMERICAS)
  const visibleTallasTenisH  = filterTallas(TALLAS_TENIS_H)
  const visibleTallasTenisM  = filterTallas(TALLAS_TENIS_M)
  const visibleTallasTenisKid= filterTallas(TALLAS_TENIS_KID)
  const visibleTallasPantalon= filterTallas(TALLAS_PANTALON)

  const TallaBtn = ({ t }: { t: string }) => (
    <button onClick={() => toggleMulti('talla', currentTallas, t)}
      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
        currentTallas.includes(t)
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-foreground/80 hover:border-foreground/40'
      }`}>{t}</button>
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
          <Button variant="ghost" size="sm" onClick={clearFilters}
            className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
            Limpiar todo
          </Button>
        )}
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Tags activos */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            {currentGeneros.map(g => {
              const found = GENEROS.find(x => x.value === g)
              return <ActiveTag key={g} label={found?.label ?? g} onRemove={() => toggleMulti('genero', currentGeneros, g)} />
            })}
            {currentMarcas.map(m => (
              <ActiveTag key={m} label={m} onRemove={() => toggleMulti('marca', currentMarcas, m)} />
            ))}
            {currentCategorias.map(c => {
              const found = ALL_CATEGORIAS.find(x => x.value === c)
              return <ActiveTag key={c} label={found?.label ?? c} onRemove={() => toggleMulti('categoria', currentCategorias, c)} />
            })}
            {currentTiendas.map(t => (
              <ActiveTag key={t} label={t} onRemove={() => toggleMulti('tienda', currentTiendas, t)} />
            ))}
            {currentColores.map(c => {
              const found = COLORES.find(x => x.value === c)
              return <ActiveTag key={c} label={found?.label ?? c} onRemove={() => toggleMulti('color', currentColores, c)} />
            })}
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

        {/* ── Género (solo si hay opciones relevantes) ── */}
        {visibleGeneros.length > 0 && (
          <Section title="Género" badge={currentGeneros.length}>
            <div className="flex flex-wrap gap-1.5">
              {visibleGeneros.map((g) => (
                <button key={g.value}
                  onClick={() => toggleMulti('genero', currentGeneros, g.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    currentGeneros.includes(g.value)
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-foreground/80 hover:border-foreground/40'
                  }`}>
                  {g.label}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* ── Categoría (agrupada, solo con resultados) ── */}
        {visibleCatGroups.length > 0 && (
          <Section title="Categoría" badge={currentCategorias.length}>
            <div className="space-y-3">
              {visibleCatGroups.map(group => (
                <div key={group.group}>
                  <p className="mb-1 pl-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    {group.group}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((cat) => (
                      <button key={cat.value}
                        onClick={() => toggleMulti('categoria', currentCategorias, cat.value)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                          currentCategorias.includes(cat.value)
                            ? 'bg-foreground text-background font-medium'
                            : 'text-foreground/80 hover:bg-muted'
                        }`}>
                        {cat.label}
                        {currentCategorias.includes(cat.value) && <X className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Marca (solo marcas con resultados) ── */}
        {facets?.marcas && facets.marcas.length > 0 && (
          <Section title="Marca" defaultOpen={false} badge={currentMarcas.length}>
            <div className="max-h-48 space-y-0.5 overflow-y-auto">
              {facets.marcas.map((marca) => (
                <button key={marca}
                  onClick={() => toggleMulti('marca', currentMarcas, marca)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    currentMarcas.includes(marca)
                      ? 'bg-foreground text-background font-medium'
                      : 'text-foreground/80 hover:bg-muted'
                  }`}>
                  {marca}
                  {currentMarcas.includes(marca) && <X className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* ── Precio dinámico ── */}
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
            <Slider value={sliderValues} min={effectiveMin} max={effectiveMax} step={step}
              onValueChange={(v) => setSliderValues(v as [number, number])}
              onValueCommit={(v) => {
                const [min, max] = v as [number, number]
                pushParams({
                  precioMin: min > effectiveMin ? min.toString() : null,
                  precioMax: max < effectiveMax ? max.toString() : null,
                })
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${effectiveMin.toLocaleString('es-MX')}</span>
              <span>${effectiveMax.toLocaleString('es-MX')}+</span>
            </div>
          </div>
        </Section>

        {/* ── Descuento ── */}
        <Section title="Descuento" defaultOpen={false} badge={currentDescuentos.length}>
          <div className="flex flex-wrap gap-1.5">
            {DESCUENTOS.map((d) => (
              <button key={d.value}
                onClick={() => toggleMulti('descuento', currentDescuentos, d.value)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  currentDescuentos.includes(d.value)
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}>
                <Percent className="h-3 w-3" />{d.label}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Especiales ── */}
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

        {/* ── Color (solo colores que existen en resultados) ── */}
        {visibleColores.length > 0 && (
          <Section title="Color" defaultOpen={false} badge={currentColores.length}>
            <div className="flex flex-wrap gap-2 pt-1">
              {visibleColores.map((color) => (
                <button key={color.value}
                  onClick={() => toggleMulti('color', currentColores, color.value)}
                  title={color.label}
                  className={`relative h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                    currentColores.includes(color.value)
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card'
                      : 'ring-1 ring-border'
                  }`}
                  style={color.value === 'multicolor'
                    ? { background: 'conic-gradient(red 0deg, yellow 60deg, green 120deg, blue 200deg, purple 270deg, red 360deg)' }
                    : { backgroundColor: color.hex }}>
                  {currentColores.includes(color.value) && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-white shadow-sm" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            {currentColores.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {currentColores.map(c => COLORES.find(x => x.value === c)?.label ?? c).join(', ')}
              </p>
            )}
          </Section>
        )}

        {/* ── Tallas ropa hombre/unisex ── */}
        {visibleTallasRopaH.length > 0 && (
          <Section title="Talla — Hombre / Unisex" defaultOpen={false}
            badge={currentTallas.filter(t => visibleTallasRopaH.includes(t)).length}>
            <div className="flex flex-wrap gap-1.5">
              {visibleTallasRopaH.map(t => <TallaBtn key={t} t={t} />)}
            </div>
          </Section>
        )}

        {/* ── Tallas ropa mujer ── */}
        {(visibleTallasRopaM.length > 0 || visibleTallasNum.length > 0) && (
          <Section title="Talla — Mujer" defaultOpen={false}
            badge={currentTallas.filter(t => [...visibleTallasRopaM, ...visibleTallasNum].includes(t)).length}>
            {visibleTallasRopaM.length > 0 && (
              <>
                <p className="mb-1.5 text-xs text-muted-foreground">Letras</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {visibleTallasRopaM.map(t => <TallaBtn key={t} t={t} />)}
                </div>
              </>
            )}
            {visibleTallasNum.length > 0 && (
              <>
                <p className="mb-1.5 text-xs text-muted-foreground">Numéricas</p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleTallasNum.map(t => <TallaBtn key={t} t={t} />)}
                </div>
              </>
            )}
          </Section>
        )}

        {/* ── Tallas tenis hombre ── */}
        {visibleTallasTenisH.length > 0 && (
          <Section title="Talla tenis — Hombre (MX)" defaultOpen={false}
            badge={currentTallas.filter(t => visibleTallasTenisH.includes(t)).length}>
            <div className="flex flex-wrap gap-1.5">
              {visibleTallasTenisH.map(t => <TallaBtn key={t} t={t} />)}
            </div>
          </Section>
        )}

        {/* ── Tallas tenis mujer ── */}
        {visibleTallasTenisM.length > 0 && (
          <Section title="Talla tenis — Mujer (MX)" defaultOpen={false}
            badge={currentTallas.filter(t => visibleTallasTenisM.includes(t)).length}>
            <div className="flex flex-wrap gap-1.5">
              {visibleTallasTenisM.map(t => <TallaBtn key={t} t={t} />)}
            </div>
          </Section>
        )}

        {/* ── Tallas tenis niño/niña ── */}
        {visibleTallasTenisKid.length > 0 && (
          <Section title="Talla tenis — Niño / Niña (MX)" defaultOpen={false}
            badge={currentTallas.filter(t => visibleTallasTenisKid.includes(t)).length}>
            <div className="flex flex-wrap gap-1.5">
              {visibleTallasTenisKid.map(t => <TallaBtn key={t} t={t} />)}
            </div>
          </Section>
        )}

        {/* ── Tallas pantalón ── */}
        {visibleTallasPantalon.length > 0 && (
          <Section title="Talla pantalón (cintura)" defaultOpen={false}
            badge={currentTallas.filter(t => visibleTallasPantalon.includes(t)).length}>
            <div className="flex flex-wrap gap-1.5">
              {visibleTallasPantalon.map(t => <TallaBtn key={t} t={t} />)}
            </div>
          </Section>
        )}

        {/* ── Tiendas (solo las que tienen productos en el contexto actual) ── */}
        {tiendas.length > 0 && (
          <Section title="Vendedor" defaultOpen={false} badge={currentTiendas.length}>
            {tiendas.length > 8 && (
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={tiendaSearch}
                  onChange={(e) => setTiendaSearch(e.target.value)}
                  placeholder="Buscar vendedor..."
                  className="h-8 w-full rounded-lg border border-border bg-muted/50 pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
                />
                {tiendaSearch && (
                  <button onClick={() => setTiendaSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
            <div className="space-y-0.5">
              {filteredTiendas.map((store) => (
                <button key={store}
                  onClick={() => toggleMulti('tienda', currentTiendas, store)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    currentTiendas.includes(store)
                      ? 'bg-foreground text-background font-medium'
                      : 'text-foreground/80 hover:bg-muted'
                  }`}>
                  {store}
                  {currentTiendas.includes(store) && <X className="h-3 w-3" />}
                </button>
              ))}
              {filteredTiendas.length === 0 && tiendaSearch && (
                <p className="py-3 text-center text-xs text-muted-foreground">
                  Sin resultados para &ldquo;{tiendaSearch}&rdquo;
                </p>
              )}
            </div>
          </Section>
        )}

      </div>
    </aside>
  )
}
