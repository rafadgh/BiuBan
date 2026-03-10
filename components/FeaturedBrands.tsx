import Link from 'next/link'

const featuredBrands = [
  { name: 'Nike', slug: 'nike' },
  { name: 'Adidas', slug: 'adidas' },
  { name: 'Zara', slug: 'zara' },
  { name: 'H&M', slug: 'hm' },
  { name: 'Liverpool', slug: 'liverpool' },
  { name: 'Amazon México', slug: 'amazon-mx' },
  { name: 'Mercado Libre', slug: 'mercado-libre' },
  { name: 'Lacoste', slug: 'lacoste' },
  { name: "Levi's", slug: 'levis' },
  { name: 'New Balance', slug: 'new-balance' },
]

export function FeaturedBrands() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Tiendas disponibles
          </h2>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {featuredBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/buscar?q=${encodeURIComponent(brand.name)}`}
              className="rounded-full border border-border/50 bg-card px-4 py-2 text-sm text-foreground transition-all hover:border-foreground/30 hover:bg-muted"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
