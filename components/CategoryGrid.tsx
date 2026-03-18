import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name:  'Tenis',
    href:  '/categoria/tenis',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  },
  {
    name:  'Playeras',
    href:  '/categoria/playeras',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  },
  {
    name:  'Sudaderas',
    href:  '/categoria/sudaderas',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
  },
  {
    name:  'Jeans',
    href:  '/categoria/jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
  },
  {
    name:  'Chamarras',
    href:  '/categoria/chamarras',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
  },
  {
    name:  'Accesorios',
    // Busca en múltiples subcategorías de accesorios
    href:  '/buscar?categoria=gorras,mochilas,calcetines,accesorios',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
  },
]

export function CategoryGrid() {
  return (
    <section className="bg-muted/50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Explora por categoría
          </h2>
          <Link
            href="/categorias"
            className="flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-foreground/70 transition-all hover:border-[#586E26] hover:bg-[#F0F5E8] hover:text-[#31470B]"
          >
            Ver todas
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-square overflow-hidden rounded-xl bg-card transition-all hover:shadow-lg"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-sm font-medium text-background">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
