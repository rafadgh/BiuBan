'use client'

import { useState, useCallback } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Star, Tag, Percent } from 'lucide-react'
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
  'Nike','Adidas','Zara','H&M','Liverpool','Amazon México',
  'Mercado Libre','Palacio de Hierro',"Levi's",'Lacoste',
  'New Balance','Puma','Converse','Vans','Innovasport',
  'Martí','Coppel','Pull&Bear','Bershka','Stradivarius',
  'Mango','Uniqlo','Gap','Abercrombie & Fitch','Hollister','Under Armour',
]

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

const TALLAS_ROPA     = ['XS','S','M','L','XL','XXL','3XL']
const TALLAS_TENIS    = ['22','23','24','25','26','27','28','29','30','31']
const TALLAS_PANTALON = ['28','30','32','34','36','38','40']

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

function Section({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border/40 pb-4 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
               : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  )
}

export function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategorias  = parseMulti(searchParams.get('categoria'))
  const currentTiendas     = parseMulti(searchParams.get('tienda'))
  const currentColores     = parseMulti(searchParams.get('color'))
  const currentTallas      = parseMulti(searchParams.get('talla'))
  const currentDescuentos  = parseMulti(searchParams.get('descuento'))
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
    router.push(`/buscar?${params.toString()}`)
    setIsOpen(false)
  }

  const activeCount = [
    ...currentCategorias, ...currentTiendas, ...currentColores,
    ...currentTallas, ...currentDescuentos,
    savedMin > 0 ? '1' : '',
    savedMax < 10000 ? '1' : '',
    currentSoloOfertas ? '1' : '',
    currentMejorOpcion ? '1' : '',
  ].filter(Boolean).length

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

            {/* Header fijo */}
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

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto px-6">

              <Section title="Categoría" defaultOpen={true}>
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

              <Section title="Rango de precio" defaultOpen={true}>
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

              <Section title="Especiales">
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

              <Section title="% de descuento">
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

              <Section title="Color">
                <div className="flex flex-wrap gap-3 py-1">
                  {COLORES.map((color) => (
                    <button key={color.value}
                      onClick={() => toggleMulti('color', currentColores, color.value)}
                      title={color.value}
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

              <Section title="Talla ropa">
                <div className="flex flex-wrap gap-2">
                  {TALLAS_ROPA.map((t) => (
                    <button key={t} onClick={() => toggleMulti('talla', currentTallas, t)}
                      className={`rounded-lg border px-4 py-2 text-sm font-bold transition-colors ${
                        currentTallas.includes(t)
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-foreground/80'
                      }`}>{t}</button>
                  ))}
                </div>
              </Section>

              <Section title="Talla tenis (MX)">
                <div className="flex flex-wrap gap-2">
                  {TALLAS_TENIS.map((t) => (
                    <button key={t} onClick={() => toggleMulti('talla', currentTallas, t)}
                      className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                        currentTallas.includes(t)
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-foreground/80'
                      }`}>{t}</button>
                  ))}
                </div>
              </Section>

              <Section title="Talla pantalón (cintura)">
                <div className="flex flex-wrap gap-2">
                  {TALLAS_PANTALON.map((t) => (
                    <button key={t} onClick={() => toggleMulti('talla', currentTallas, t)}
                      className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                        currentTallas.includes(t)
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-foreground/80'
                      }`}>{t}</button>
                  ))}
                </div>
              </Section>

              <Section title="Tienda">
                <div className="grid grid-cols-2 gap-1.5">
                  {TIENDAS.map((store) => (
                    <button key={store}
                      onClick={() => toggleMulti('tienda', currentTiendas, store)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        currentTiendas.includes(store)
                          ? 'border-foreground bg-foreground text-background font-medium'
                          : 'border-border text-foreground/80'
                      }`}>{store}</button>
                  ))}
                </div>
              </Section>

              <div className="h-4" />
            </div>

            {/* Footer fijo */}
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