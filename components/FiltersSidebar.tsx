'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { brands } from '@/lib/brands'
import { stores } from '@/lib/stores'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

interface FiltersSidebarProps {
  className?: string
}

export function FiltersSidebar({ className = '' }: FiltersSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentBrand = searchParams.get('marca') || ''
  const currentStore = searchParams.get('tienda') || ''
  const currentMaxPrice = searchParams.get('precioMax') ? parseInt(searchParams.get('precioMax')!) : 10000

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/buscar?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const query = searchParams.get('q')
    if (query) params.set('q', query)
    router.push(`/buscar?${params.toString()}`)
  }

  const hasActiveFilters = currentBrand || currentStore || currentMaxPrice < 10000

  return (
    <aside className={`rounded-xl border border-border/50 bg-card p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Filtros</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
            Limpiar
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {/* Brand Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Marca</Label>
          <Select value={currentBrand || 'all'} onValueChange={(value) => updateFilter('marca', value)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Todas las marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.nombre}>
                  {brand.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Store Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tienda</Label>
          <Select value={currentStore || 'all'} onValueChange={(value) => updateFilter('tienda', value)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Todas las tiendas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las tiendas</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.nombre}>
                  {store.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Precio máximo</Label>
            <span className="text-sm font-medium text-foreground">
              ${currentMaxPrice.toLocaleString('es-MX')}
            </span>
          </div>
          <Slider
            value={[currentMaxPrice]}
            min={500}
            max={10000}
            step={500}
            onValueChange={([value]) => updateFilter('precioMax', value.toString())}
            className="w-full"
          />
        </div>
      </div>
    </aside>
  )
}
