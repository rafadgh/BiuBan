// components/MobileFilters.tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Star, Tag, Percent, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
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
      { value: 'mochilas',   label: 'Mochilas / Bolsas'     },
      { value: 'gorras',     label: 'Gorras / Sombreros'    },
      { value: 'calcetines', label: 'Calcetines'            },
      { value: 'cinturones', label: 'Cinturones'            },
      { value: 'carteras',   label: 'Carteras / Billeteras' },
      { value: 'bufandas',   label: 'Bufandas / Gorros'     },
      { value: 'lentes',     label: 'Lentes / Gafas'        },
    ],
  },
]

const COLORES = [
  { value: 'negro',      label: 'Negro',      hex: '#1a1a1a' },
  { value: 'blanco',     label: 'Blanco',     hex: '#f5f5f5' },
  { value: 'gris',       label: 'Gris',       hex: '#9ca3af' },
  { value: 'azul',       label: 'Azul',       hex: '#3b82f6' },
  { value: 'navy',       label: 'Navy',       hex: '#1e3a5f' },
  { value: 'rojo',       label: 'Rojo',       hex: '#ef4444' },
  { value: 'verde',      label: 'Verde',      hex: '#22c55e' },
  { value: 'rosa',       label: 'Rosa',       hex: '#ec4899' },
  { value: 'morado',     label: 'Morado',     hex: '#a855f7' },
  { value: 'amarillo',   label: 'Amarillo',   hex: '#eab308' },
  { value: 'naranja',    label: 'Naranja',    hex: '#f97316' },
  { value: 'cafe',       label: 'Café',       hex: '#92400e' },
  { value: 'beige',      label: 'Beige',      hex: '#d4b896' },
  { value: 'dorado',     label: 'Dorado',     hex: '#d4af37' },
  { value: 'plateado',   label: 'Plateado',   hex: '#c0c0c0' },
  { value: 'turquesa',   label: 'Turquesa',   hex: '#06b6d4' },
  { value: 'salmon',     label: 'Salmón',     hex: '#f87171' },
  { value: 'vino',       label: 'Vino',       hex: '#7f1d1d' },
  { value: 'multicolor', label: 'Multicolor', hex: '' },
]

const GENEROS = [
  { value: 'hombre', label: 'Hombre' },
  { value: 'mujer',  label: 'Mujer'  },
  { value: 'nino',   label: 'Niño'   },
  { value: 'nina',   label: 'Niña'   },
]

// ── Tallas ropa ───────────────────────────────────────────────────────────────
const TALLAS_ROPA_H    = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const TALLAS_ROPA_M    = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const TALLAS_NUMERICAS = ['0', '2', '4', '6', '8', '10', '12', '14']
const TALLAS_ROPA_KID  = ['2', '4', '6', '8', '10', '12', '14', '16']

// ── Tallas calzado ────────────────────────────────────────────────────────────
const TALLAS_TENIS_H   = ['24', '25', '26', '27', '27.5', '28', '28.5', '29', '30', '31']
const TALLAS_TENIS_M   = ['22', '22.5', '23', '23.5', '24', '24.5', '25', '25.5', '26']
const TALLAS_TENIS_KID = ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21']

// ── Tallas pantalón ───────────────────────────────────────────────────────────
// Sincronizado con FiltersSidebar: tallas reales de Levi's MX (24–44)
const TALLAS_CINTURA = ['24','25','26','27','28','29','30','31','32','33','34','35','36','38','40','42','44']
const TALLAS_LARGO   = ['27','28','29','30','31','32','34','36']

const DESCUENTOS = [
  { value: '10', label: '10% o más' },
  { value: '20', label: '20% o más' },
  { value: '30', label: '30% o más' },
  { value: '50', label: '50% o más' },
]

function nrm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}
function parseMulti(value: string | null): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

function hasFacetColor(facets: SearchFacets | undefined, value: string): boolean {
  if (!facets || facets.colores.length === 0) return true
  return facets.colores.includes(nrm(value))
}
function hasFacetGenero(facets: SearchFacets | undefined, value: string): boolean {
  if (!facets || facets.generos.length === 0) return true
  return facets.generos.includes(nrm(value))
}
function hasFacetTalla(facets: SearchFacets | undefined, value: string): boolean {
  if (!facets) return true                      // facets aún no cargados → mostrar todo
  if (facets.tallas.length === 0) return false  // cargados pero sin tallas → ocultar todo
  return facets.tallas.includes(value)
}
const CATGROUP_ALIASES: Record<string, string[]> = {
  mochilas:   ['mochila', 'bolsa', 'bolso', 'accesorios', 'accesorio'],
  gorras:     ['gorra', 'sombrero', 'accesorios', 'accesorio'],
  calcetines: ['calcetin', 'sock', 'accesorios', 'accesorio'],
  cinturones: ['cinturon', 'belt', 'accesorios', 'accesorio'],
  carteras:   ['cartera', 'billetera', 'wallet', 'accesorios', 'accesorio'],
  bufandas:   ['bufanda', 'gorro', 'scarf', 'accesorios', 'accesorio'],
  lentes:     ['lente', 'gafa', 'sunglass', 'accesorios', 'accesorio'],
  running:    ['running', 'atletismo', 'correr'],
  gym:        ['gym', 'fitness', 'crossfit', 'yoga'],
  futbol:     ['futbol', 'soccer'],
}

function hasFacetSubcat(facets: SearchFacets | undefined, catValue: string): boolean {
  if (!facets || facets.subcategorias.length === 0) return true
  const aliases = CATGROUP_ALIASES[catValue] ?? [nrm(catValue)]
  return aliases.some(alias =>
    facets.subcategorias.some(s => s === alias || s.includes(alias) || alias.includes(s))
  )
}

function Section({
  title, children, defaultOpen = false, badge = 0,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; badge?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border/40 pb-4 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-3 text-left">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          {title}
          {badge > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              {badge}
            </span>
          )}
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-3 first:mt-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
      {children}
    </p>
  )
}

export function MobileFilters({ priceRange, facets, basePath = '/buscar', sizeContext }: { priceRange?: PriceRange; facets?: SearchFacets; basePath?: string; sizeContext?: 'calzado' | 'ropa' | 'accesorios' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tiendaSearch, setTiendaSearch] = useState('')
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

  useEffect(() => {
    setSliderValues([
      urlMin !== null ? Math.max(effectiveMin, Math.min(urlMin, effectiveMax)) : effectiveMin,
      urlMax !== null ? Math.max(effectiveMin, Math.min(urlMax, effectiveMax)) : effectiveMax,
    ])
  }, [effectiveMin, effectiveMax, urlMin, urlMax])

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
    setIsOpen(false)
  }

  const activeCount = [
    ...currentCategorias, ...currentMarcas, ...currentTiendas, ...currentColores,
    ...currentTallas, ...currentDescuentos, ...currentGeneros,
    (urlMin !== null && urlMin > effectiveMin) ? '1' : '',
    (urlMax !== null && urlMax < effectiveMax) ? '1' : '',
    currentSoloOfertas ? '1' : '', currentMejorOpcion ? '1' : '',
  ].filter(Boolean).length

  // Step dinámico del slider
  const range = effectiveMax - effectiveMin
  const step = range <= 500 ? 10 : range <= 2000 ? 50 : range <= 10000 ? 100 : 500

  // ── Opciones filtradas por facetas ────────────────────────────────────────
  const hasKids = facets?.generos.includes('kids') ?? true
  const visibleGeneros = GENEROS.filter(g => {
    if (g.value === 'nino' || g.value === 'nina') return hasKids || hasFacetGenero(facets, g.value)
    return hasFacetGenero(facets, g.value)
  })
  const visibleColores   = COLORES.filter(c => hasFacetColor(facets, c.value))
  const filterTallas     = (arr: string[]) => arr.filter(t => hasFacetTalla(facets, t))
  // Grupos de categoría: si AL MENOS UN item del grupo tiene datos en facetas,
  // se muestra el grupo COMPLETO para que el usuario pueda explorar todos los sub-items
  const visibleCatGroups = CATEGORIA_GROUPS
    .filter(g =>
      !facets ||
      facets.subcategorias.length === 0 ||
      g.items.some(item => hasFacetSubcat(facets, item.value))
    )

  // Talla ropa
  const visibleTallasRopaH = filterTallas(TALLAS_ROPA_H)
  const visibleTallasRopaM = filterTallas(TALLAS_ROPA_M)
  const visibleTallasNum   = filterTallas(TALLAS_NUMERICAS)
  const visibleTallasKid   = filterTallas(TALLAS_ROPA_KID)
  const hasAnyRopa = (visibleTallasRopaH.length > 0 || visibleTallasRopaM.length > 0 ||
    visibleTallasNum.length > 0 || visibleTallasKid.length > 0) &&
    sizeContext !== 'calzado' && sizeContext !== 'accesorios'

  // Talla calzado
  const visibleTenisH   = filterTallas(TALLAS_TENIS_H)
  const visibleTenisM   = filterTallas(TALLAS_TENIS_M)
  const visibleTenisKid = filterTallas(TALLAS_TENIS_KID)
  const hasAnyCalzado = (visibleTenisH.length > 0 || visibleTenisM.length > 0 || visibleTenisKid.length > 0) &&
    sizeContext !== 'ropa' && sizeContext !== 'accesorios'

  // Talla pantalón
  const visibleCintura = filterTallas(TALLAS_CINTURA)
  const visibleLargo   = filterTallas(TALLAS_LARGO)
  const hasAnyPantalon = (visibleCintura.length > 0 || visibleLargo.length > 0) &&
    sizeContext !== 'calzado' && sizeContext !== 'accesorios'

  // Badge contadores
  const allRopaTallas     = [...TALLAS_ROPA_H, ...TALLAS_ROPA_M, ...TALLAS_NUMERICAS, ...TALLAS_ROPA_KID]
  const allTenisTallas    = [...TALLAS_TENIS_H, ...TALLAS_TENIS_M, ...TALLAS_TENIS_KID]
  const allPantalonTallas = [...TALLAS_CINTURA, ...TALLAS_LARGO]

  // Tiendas dinámicas (de facets)
  const tiendas = facets?.tiendas ?? []
  const filteredTiendas = tiendaSearch.trim()
    ? tiendas.filter(t => t.toLowerCase().includes(tiendaSearch.toLowerCase()))
    : tiendas

  const TallaBtn = ({ t }: { t: string }) => (
    <button onClick={() => toggleMulti('talla', currentTallas, t)}
      className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
        currentTallas.includes(t)
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-foreground/80'
      }`}>{t}</button>
  )

  const TallaBtnGenero = ({ t, genero }: { t: string; genero: string }) => {
    const active = currentTallas.includes(t) && currentGeneros.includes(genero)
    return (
      <button
        onClick={() => {
          const nextTallas = active ? currentTallas.filter(v => v !== t) : [...currentTallas, t]
          const nextGeneros = active
            ? currentGeneros.filter(g => g !== genero)
            : currentGeneros.includes(genero) ? currentGeneros : [...currentGeneros, genero]
          pushParams({
            talla: nextTallas.join(',') || null,
            genero: nextGeneros.join(',') || null,
          })
        }}
        className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
          active
            ? 'border-foreground bg-foreground text-background'
            : 'border-border text-foreground/80'
        }`}>{t}</button>
    )
  }

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-2 lg:hidden" onClick={() => setIsOpen(true)}>
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

              {/* ── Género ── */}
              {visibleGeneros.length > 0 && (
                <Section title="Género" badge={currentGeneros.length}>
                  <div className="flex flex-wrap gap-2">
                    {visibleGeneros.map((g) => (
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
              )}

              {/* ── Categoría ── */}
              {visibleCatGroups.length > 0 && (
                <Section title="Categoría" badge={currentCategorias.length}>
                  <div className="space-y-3">
                    {visibleCatGroups.map(group => (
                      <div key={group.group}>
                        <p className="mb-1.5 pl-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                          {group.group}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {group.items.map((cat) => (
                            <button key={cat.value}
                              onClick={() => toggleMulti('categoria', currentCategorias, cat.value)}
                              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                                currentCategorias.includes(cat.value)
                                  ? 'border-foreground bg-foreground text-background font-medium'
                                  : 'border-border text-foreground/80'
                              }`}>{cat.label}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── Marca ── */}
              {facets?.marcas && facets.marcas.length > 0 && (
                <Section title="Marca" badge={currentMarcas.length}>
                  <div className="max-h-52 space-y-1 overflow-y-auto">
                    {facets.marcas.map((marca) => (
                      <button key={marca}
                        onClick={() => toggleMulti('marca', currentMarcas, marca)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          currentMarcas.includes(marca)
                            ? 'border-foreground bg-foreground text-background font-medium'
                            : 'border-border text-foreground/80'
                        }`}>
                        {marca}
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── Precio ── */}
              <Section title="Rango de precio">
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
                    <span>${effectiveMax.toLocaleString('es-MX')}</span>
                  </div>
                </div>
              </Section>

              {/* ── Descuento (solo si hay productos con descuento) ── */}
              {facets?.tieneDescuentos !== false && (
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
              )}

              {/* ── Especiales ── */}
              <Section title="Especiales" badge={(currentSoloOfertas ? 1 : 0) + (currentMejorOpcion ? 1 : 0)}>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 py-1">
                    <Checkbox checked={currentSoloOfertas} onCheckedChange={() => toggleBoolean('ofertas', currentSoloOfertas)} />
                    <div className="flex items-center gap-2 text-sm"><Tag className="h-4 w-4 text-orange-500" />Solo con descuento</div>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 py-1">
                    <Checkbox checked={currentMejorOpcion} onCheckedChange={() => toggleBoolean('mejor', currentMejorOpcion)} />
                    <div className="flex items-center gap-2 text-sm"><Star className="h-4 w-4 text-yellow-500" />Mejor opción</div>
                  </label>
                </div>
              </Section>

              {/* ── Color ── */}
              {visibleColores.length > 0 && (
                <Section title="Color" badge={currentColores.length}>
                  <div className="flex flex-wrap gap-3 py-1">
                    {visibleColores.map((color) => (
                      <button key={color.value}
                        onClick={() => toggleMulti('color', currentColores, color.value)}
                        title={color.label}
                        className={`relative h-9 w-9 rounded-full transition-transform hover:scale-110 ${
                          currentColores.includes(color.value)
                            ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card'
                            : 'ring-1 ring-border'
                        }`}
                        style={color.value === 'multicolor'
                          ? { background: 'conic-gradient(red 0deg, yellow 60deg, green 120deg, blue 200deg, purple 270deg, red 360deg)' }
                          : { backgroundColor: color.hex }}>
                        {currentColores.includes(color.value) && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-2.5 w-2.5 rounded-full bg-white shadow" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── Talla ropa (unificada) ── */}
              {hasAnyRopa && (
                <Section title="Talla"
                  badge={currentTallas.filter(t => allRopaTallas.includes(t)).length}>
                  <div className="space-y-1">
                    {visibleTallasRopaH.length > 0 && (
                      <>
                        <SubLabel>Hombre</SubLabel>
                        <div className="flex flex-wrap gap-2">{visibleTallasRopaH.map(t => <TallaBtnGenero key={t} t={t} genero="hombre" />)}</div>
                      </>
                    )}
                    {(visibleTallasRopaM.length > 0 || visibleTallasNum.length > 0) && (
                      <>
                        <SubLabel>Mujer</SubLabel>
                        <div className="flex flex-wrap gap-2">
                          {visibleTallasRopaM.map(t => <TallaBtnGenero key={t} t={t} genero="mujer" />)}
                          {visibleTallasNum.map(t => <TallaBtnGenero key={t} t={t} genero="mujer" />)}
                        </div>
                      </>
                    )}
                    {visibleTallasKid.length > 0 && (
                      <>
                        <SubLabel>Niño / Niña</SubLabel>
                        <div className="flex flex-wrap gap-2">{visibleTallasKid.map(t => <TallaBtnGenero key={t} t={t} genero="nino" />)}</div>
                      </>
                    )}
                  </div>
                </Section>
              )}

              {/* ── Talla Calzado (unificada) ── */}
              {hasAnyCalzado && (
                <Section title="Talla Calzado"
                  badge={currentTallas.filter(t => allTenisTallas.includes(t)).length}>
                  <div className="space-y-1">
                    {visibleTenisH.length > 0 && (
                      <>
                        <SubLabel>Hombre (MX)</SubLabel>
                        <div className="flex flex-wrap gap-2">{visibleTenisH.map(t => <TallaBtn key={t} t={t} />)}</div>
                      </>
                    )}
                    {visibleTenisM.length > 0 && (
                      <>
                        <SubLabel>Mujer (MX)</SubLabel>
                        <div className="flex flex-wrap gap-2">{visibleTenisM.map(t => <TallaBtn key={t} t={t} />)}</div>
                      </>
                    )}
                    {visibleTenisKid.length > 0 && (
                      <>
                        <SubLabel>Niño / Niña (MX)</SubLabel>
                        <div className="flex flex-wrap gap-2">{visibleTenisKid.map(t => <TallaBtn key={t} t={t} />)}</div>
                      </>
                    )}
                  </div>
                </Section>
              )}

              {/* ── Talla Pantalón ── */}
              {hasAnyPantalon && (
                <Section title="Talla Pantalón"
                  badge={currentTallas.filter(t => allPantalonTallas.includes(t)).length}>
                  <div className="space-y-1">
                    {visibleCintura.length > 0 && (
                      <>
                        <SubLabel>Cintura (pulgadas)</SubLabel>
                        <div className="flex flex-wrap gap-2">{visibleCintura.map(t => <TallaBtn key={t} t={t} />)}</div>
                      </>
                    )}
                    {visibleLargo.length > 0 && (
                      <>
                        <SubLabel>Largo (pulgadas)</SubLabel>
                        <div className="flex flex-wrap gap-2">{visibleLargo.map(t => <TallaBtn key={t} t={t} />)}</div>
                      </>
                    )}
                  </div>
                </Section>
              )}

              {/* ── Vendedor (dinámico desde facets) ── */}
              {tiendas.length > 0 && (
                <Section title="Vendedor" badge={currentTiendas.length}>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={tiendaSearch} onChange={(e) => setTiendaSearch(e.target.value)}
                      placeholder="Buscar vendedor..."
                      className="h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
                    />
                    {tiendaSearch && (
                      <button onClick={() => setTiendaSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {filteredTiendas.map((store) => (
                      <button key={store} onClick={() => toggleMulti('tienda', currentTiendas, store)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          currentTiendas.includes(store)
                            ? 'border-foreground bg-foreground text-background font-medium'
                            : 'border-border text-foreground/80'
                        }`}>{store}</button>
                    ))}
                  </div>
                  {filteredTiendas.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Sin resultados para &ldquo;{tiendaSearch}&rdquo;
                    </p>
                  )}
                </Section>
              )}

              <div className="h-4" />
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border/40 p-4 flex gap-3">
              {activeCount > 0 && (
                <Button variant="outline" className="flex-1" onClick={clearFilters}>Limpiar todo</Button>
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
