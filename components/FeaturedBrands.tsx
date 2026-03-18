// components/FeaturedBrands.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const featuredBrands = [
  { name: 'Nike',        slug: 'nike' },
  { name: 'Adidas',      slug: 'adidas' },
  { name: 'Zara',        slug: 'zara' },
  { name: 'H&M',         slug: 'hm' },
  { name: 'Lacoste',     slug: 'lacoste' },
  { name: "Levi's",      slug: 'levis' },
  { name: 'New Balance', slug: 'new-balance' },
  { name: 'Puma',        slug: 'puma' },
  { name: 'Tommy Hilfiger', slug: 'tommy-hilfiger' },
  { name: 'Calvin Klein', slug: 'calvin-klein' },
]

export function FeaturedBrands() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Marcas disponibles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Comparamos precios en más de 25 marcas
            </p>
          </div>
          <Link
            href="/marcas"
            className="flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-foreground/70 transition-all hover:border-[#586E26] hover:bg-[#F0F5E8] hover:text-[#31470B]"
          >
            Ver todas
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {featuredBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marca/${brand.slug}`}
              className="rounded-full border border-border/50 bg-card px-4 py-2 text-sm text-foreground transition-all hover:border-[#586E26] hover:bg-[#F0F5E8] hover:text-[#31470B]"
            >
              {brand.name}
            </Link>
          ))}

          {/* Chip "y muchas más" → /marcas */}
          <Link
            href="/marcas"
            className="flex items-center gap-1.5 rounded-full border border-dashed border-border/60 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-[#586E26] hover:bg-[#F0F5E8] hover:text-[#31470B]"
          >
            y muchas más
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </section>
  )
}
