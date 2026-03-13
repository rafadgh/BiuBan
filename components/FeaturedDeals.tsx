import Link from 'next/link'
import { getDiscountedProducts } from '@/lib/products'
import { ProductCard } from './ProductCard'

export async function FeaturedDeals() {
  const deals = await getDiscountedProducts(4)

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Ofertas destacadas
          </h2>
          <Link
            href="/ofertas"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Ver todas →
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}