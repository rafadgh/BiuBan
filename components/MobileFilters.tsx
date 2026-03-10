'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { brands } from '@/lib/brands'
import { stores } from '@/lib/stores'

export function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false)
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
    setIsOpen(false)
  }

  const hasActiveFilters = currentBrand || currentStore || currentMaxPrice < 10000
  const activeFilterCount = [currentBrand, currentStore, currentMaxPrice < 10000].filter(Boolean).length

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-card p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Brand Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Marca</Label>
                <Select value={currentBrand || 'all'} onValueChange={(value) => updateFilter('marca', value)}>
                  <SelectTrigger className="w-full">
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
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Tienda</Label>
                <Select value={currentStore || 'all'} onValueChange={(value) => updateFilter('tienda', value)}>
                  <SelectTrigger className="w-full">
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Precio máximo</Label>
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

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              {hasActiveFilters && (
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  Limpiar
                </Button>
              )}
              <Button className="flex-1" onClick={() => setIsOpen(false)}>
                Ver resultados
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
