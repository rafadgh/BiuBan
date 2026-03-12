'use client'

import { useState } from 'react'
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
  'Nike', 'Adidas', 'Zara', 'H&M', 'Liverpool',
  'Amazon México', 'Mercado Libre', 'Palacio de Hierro',
  "Levi's", 'Lacoste', 'New Balance', 'Puma', 'Converse',
  'Vans', 'Innovasport', 'Martí', 'Coppel', 'Pull&Bear',
  'Bershka', 'Stradivarius', 'Mango', 'Uniqlo', 'Gap',
  'Abercrombie & Fitch', 'Hollister', 'Under Armour',
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

const TALLAS_ROPA     = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const TALLAS_TENIS    = ['22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
const TALLAS_PANTALON = ['28', '30', '32', '34', '36', '38', '40']

const DESCUENTOS = [
  { value: '10', label: '10% o más' },
  { value: '20', label: '20% o más' },
  { value: '30', label: '30% o más' },
  { value: '50', label: '50% o más' },
]

function Section({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border/40 pb-4 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-left">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}

export function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategoria   = searchParams.get('categoria') || ''
  const currentBrand       = searchParams.get('marca') || ''
  const currentStore       = searchParams.get('tienda') || ''
  const currentColor       = searchParams.get('color') || ''
  const currentTalla       = searchParams.get('talla') || ''
  const currentMinPrice    = searchParams.get('precioMin') ? parseInt(searchParams.get('precioMin')!) : 0
  const currentMaxPrice    = searchParams.get('precioMax') ? parseInt(searchParams.get('precioMax')!) : 10000
  const currentDescuento   = searchParams.get('descuento') || ''
  const currentSoloOfertas = searchParams.get('ofertas') === '1'
  const currentMejorOpcion = searchParams.get('mejor') === '1'

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value); else params.delete(key)
    router.push(`/buscar?${params.toString()}`)
  }

  const toggleFilter = (key: string, current: string, value: string) => {
    updateFilter(key, current === value ? '' : value)
  }

  const toggleBoolean = (key: string, current: boolean) => {
    updateFilter(key, current ? '' : '1')
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const query = searchParams.get('q')
    if (query) params.set('q', query)
    router.push(`/buscar?${params.toString()}`)
    setIsOpen(false)
  }

  const activeCount = [
    currentCategoria, currentBrand, currentStore, currentColor, currentTalla, currentDescuento,
    currentMinPrice > 0 ? '1' : '',
    currentMaxPrice < 10000 ? '1' : '',
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

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
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

            <div className="space-y-0">

              <Section title="Categoría" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORIAS.map((cat) => (
                    <button key={cat.value}
                      onClick={() => toggleFilter('categoria', currentCategoria, cat.value)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        currentCategoria === cat.value
                          ? 'border-foreground bg-foreground text-background font-medium'
                          : 'border-border text-foreground/80 hover:border-foreground/40'
                      }`}>{cat.label}</button>
                  ))}
                </div>
              </Section>

              <Section title="Rango de precio" defaultOpen={true}>
                <div className="space-y-4 px-1">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>${currentMinPrice.toLocaleString('es-MX')}</span>
                    <span>${currentMaxPrice.toLocaleString('es-MX')}</span>
                  </div>
                  <Slider
                    value={[currentMinPrice, currentMaxPrice]}
                    min={0} max={10000} step={200}
                    onValueChange={([min, max]) => {
                      const params = new URLSearchParams(searchParams.toString())
                      if (min > 0) params.set('precioMin', min.toString()); else params.delete('precioMin')
                      if (max < 10000) params.set('precioMax', max.toString()); else params.delete('precioMax')
                      router.push(`/buscar?${params.toString()}`)
                    }}
                    className="w-full"
                  />
                </div>
              </Section>

              <Section title="Especiales">
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 px-1 py-1">
                    <Checkbox checked={currentSoloOfertas} onCheckedChange={() => toggleBoolean('ofertas', currentSoloOfertas)} />
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-orange-500" />Solo con descuento
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 px-1 py-1">
                    <Checkbox checked={currentMejorOpcion} onCheckedChange={() => toggleBoolean('mejor', currentMejorOpcion)} />
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />Mejor opción
                    </div>
                  </label>
                </div>
              </Section>

              <Section title="% de descuento">
                <div className="grid grid-cols-2 gap-1.5">
                  {DESCUENTOS.map((d) => (
                    <button key={d.value}
                      onClick={() => toggleFilter('descuento', currentDescuento, d.value)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        currentDescuento === d.value
                          ? 'border-foreground bg-foreground text-background font-medium'
                          : 'border-border text-foreground/80 hover:border-foreground/40'
                      }`}>
                      <Percent className="h-3.5 w-3.5" />{d.label}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Color">
                <div className="flex flex-wrap gap-3">
                  {COLORES.map((color) => (
                    <button key={color.value}
                      onClick={() => toggleFilter('color', currentColor, color.value)}
                      title={color.value}
                      className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                        currentColor === color.value
                          ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card'
                          : 'ring-1 ring-border'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Talla ropa">
                <div className="flex flex-wrap gap-2">
                  {TALLAS_ROPA.map((t) => (
                    <button key={t} onClick={() => toggleFilter('talla', currentTalla, t)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        currentTalla === t
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-foreground/80 hover:border-foreground/40'
                      }`}>{t}</button>
                  ))}
                </div>
              </Section>

              <Section title="Talla tenis (MX)">
                <div className="flex flex-wrap gap-2">
                  {TALLAS_TENIS.map((t) => (
                    <button key={t} onClick={() => toggleFilter('talla', currentTalla, t)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        currentTalla === t
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-foreground/80 hover:border-foreground/40'
                      }`}>{t}</button>
                  ))}
                </div>
              </Section>

              <Section title="Talla pantalón (cintura)">
                <div className="flex flex-wrap gap-2">
                  {TALLAS_PANTALON.map((t) => (
                    <button key={t} onClick={() => toggleFilter('talla', currentTalla, t)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        currentTalla === t
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-foreground/80 hover:border-foreground/40'
                      }`}>{t}</button>
                  ))}
                </div>
              </Section>

              <Section title="Tienda">
                <div className="grid grid-cols-2 gap-1.5">
                  {TIENDAS.map((store) => (
                    <button key={store}
                      onClick={() => toggleFilter('tienda', currentStore, store)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        currentStore === store
                          ? 'border-foreground bg-foreground text-background font-medium'
                          : 'border-border text-foreground/80 hover:border-foreground/40'
                      }`}>{store}</button>
                  ))}
                </div>
              </Section>

            </div>

            <div className="mt-6 flex gap-3">
              {activeCount > 0 && (
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  Limpiar todo
                </Button>
              )}
              <Button className="flex-1" onClick={() => setIsOpen(false)}>
                Ver resultados{activeCount > 0 ? ` (${activeCount} filtros)` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}