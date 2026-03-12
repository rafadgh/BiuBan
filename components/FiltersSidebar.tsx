'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, ChevronUp, X, Star, Tag, Percent } from 'lucide-react'
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

function Section({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border/40 pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {open
          ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        }
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}

function ActiveTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground">
      {label}
      <button onClick={onRemove} className="ml-0.5 rounded-full hover:text-red-500">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

interface FiltersSidebarProps {
  className?: string
}

export function FiltersSidebar({ className = '' }: FiltersSidebarProps) {
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
    if (value) params.set(key, value)
    else params.delete(key)
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
  }

  const activeCount = [
    currentCategoria, currentBrand, currentStore, currentColor,
    currentTalla, currentDescuento,
    currentMinPrice > 0 ? '1' : '',
    currentMaxPrice < 10000 ? '1' : '',
    currentSoloOfertas ? '1' : '',
    currentMejorOpcion ? '1' : '',
  ].filter(Boolean).length

  return (
    <aside className={`rounded-xl border border-border/50 bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
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

      <div className="space-y-4">

        {/* Tags activos */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-2">
            {currentCategoria && <ActiveTag label={currentCategoria} onRemove={() => updateFilter('categoria', '')} />}
            {currentBrand     && <ActiveTag label={currentBrand}     onRemove={() => updateFilter('marca', '')} />}
            {currentStore     && <ActiveTag label={currentStore}     onRemove={() => updateFilter('tienda', '')} />}
            {currentColor     && <ActiveTag label={currentColor}     onRemove={() => updateFilter('color', '')} />}
            {currentTalla     && <ActiveTag label={`Talla ${currentTalla}`} onRemove={() => updateFilter('talla', '')} />}
            {currentDescuento && <ActiveTag label={`-${currentDescuento}% o más`} onRemove={() => updateFilter('descuento', '')} />}
            {currentSoloOfertas && <ActiveTag label="Solo ofertas"   onRemove={() => updateFilter('ofertas', '')} />}
            {currentMejorOpcion && <ActiveTag label="Mejor opción"   onRemove={() => updateFilter('mejor', '')} />}
          </div>
        )}

        {/* Categoría */}
        <Section title="Categoría">
          <div className="space-y-1">
            {CATEGORIAS.map((cat) => (
              <button key={cat.value}
                onClick={() => toggleFilter('categoria', currentCategoria, cat.value)}
                className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                  currentCategoria === cat.value
                    ? 'bg-foreground text-background font-medium'
                    : 'text-foreground/80 hover:bg-muted'
                }`}>
                {cat.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Precio */}
        <Section title="Rango de precio">
          <div className="space-y-4 px-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">${currentMinPrice.toLocaleString('es-MX')}</span>
              <span className="font-medium">${currentMaxPrice.toLocaleString('es-MX')}</span>
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
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span><span>$10,000+</span>
            </div>
          </div>
        </Section>

        {/* Descuento */}
        <Section title="Descuento" defaultOpen={false}>
          <div className="space-y-1">
            {DESCUENTOS.map((d) => (
              <button key={d.value}
                onClick={() => toggleFilter('descuento', currentDescuento, d.value)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                  currentDescuento === d.value
                    ? 'bg-foreground text-background font-medium'
                    : 'text-foreground/80 hover:bg-muted'
                }`}>
                <Percent className="h-3.5 w-3.5" />{d.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Especiales */}
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

        {/* Color */}
        <Section title="Color" defaultOpen={false}>
          <div className="flex flex-wrap gap-2 pt-1">
            {COLORES.map((color) => (
              <button key={color.value}
                onClick={() => toggleFilter('color', currentColor, color.value)}
                title={color.value}
                className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                  currentColor === color.value
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card'
                    : 'ring-1 ring-border'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
          {currentColor && (
            <p className="mt-2 text-xs text-muted-foreground">
              Color: <span className="font-medium text-foreground">{currentColor}</span>
            </p>
          )}
        </Section>

        {/* Talla ropa */}
        <Section title="Talla ropa" defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS_ROPA.map((t) => (
              <button key={t} onClick={() => toggleFilter('talla', currentTalla, t)}
                className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                  currentTalla === t
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}>{t}</button>
            ))}
          </div>
        </Section>

        {/* Talla tenis */}
        <Section title="Talla tenis (MX)" defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS_TENIS.map((t) => (
              <button key={t} onClick={() => toggleFilter('talla', currentTalla, t)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  currentTalla === t
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}>{t}</button>
            ))}
          </div>
        </Section>

        {/* Talla pantalón */}
        <Section title="Talla pantalón (cintura)" defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS_PANTALON.map((t) => (
              <button key={t} onClick={() => toggleFilter('talla', currentTalla, t)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  currentTalla === t
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/80 hover:border-foreground/40'
                }`}>{t}</button>
            ))}
          </div>
        </Section>

        {/* Tienda */}
        <Section title="Tienda" defaultOpen={false}>
          <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
            {TIENDAS.map((store) => (
              <button key={store}
                onClick={() => toggleFilter('tienda', currentStore, store)}
                className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                  currentStore === store
                    ? 'bg-foreground text-background font-medium'
                    : 'text-foreground/80 hover:bg-muted'
                }`}>{store}</button>
            ))}
          </div>
        </Section>

      </div>
    </aside>
  )
}