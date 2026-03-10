import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import { BestOptionBadge } from './BestOptionBadge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.descuento && product.descuento > 0

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl ${product.mejorOpcion ? 'border-amber-300 ring-1 ring-amber-200' : 'border-border/50 hover:border-border'}`}>
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {product.mejorOpcion && <BestOptionBadge />}
        {hasDiscount && !product.mejorOpcion && (
          <span className="rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background shadow-sm">
            -{product.descuento}%
          </span>
        )}
      </div>

      {/* Discount badge on right if best option */}
      {hasDiscount && product.mejorOpcion && (
        <div className="absolute right-3 top-3 z-10">
          <span className="rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background shadow-sm">
            -{product.descuento}%
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.imagen}
          alt={product.nombre}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Brand & Store */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">
            {product.marca}
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {product.tienda}
          </span>
        </div>

        {/* Name */}
        <h3 className="mb-4 line-clamp-2 flex-1 text-sm font-medium leading-snug text-foreground">
          {product.nombre}
        </h3>

        {/* Price */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            ${product.precio.toLocaleString('es-MX')}
          </span>
          {product.precioOriginal && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.precioOriginal.toLocaleString('es-MX')}
            </span>
          )}
        </div>

        {/* CTA */}
        <Button
          asChild
          size="sm"
          className={`w-full rounded-full font-medium ${product.mejorOpcion ? 'bg-amber-400 text-amber-950 hover:bg-amber-500' : ''}`}
          variant={product.mejorOpcion ? 'default' : 'outline'}
        >
          <a href={product.url} target="_blank" rel="noopener noreferrer">
            Ver tienda
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </article>
  )
}
