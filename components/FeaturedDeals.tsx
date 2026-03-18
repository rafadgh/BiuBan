import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getDiscountedProducts } from '@/lib/products'
import { ProductCard } from './ProductCard'

export async function FeaturedDeals() {
  const dealsData = await getDiscountedProducts()
  const deals = Array.isArray(dealsData) ? dealsData.slice(0, 4) : []

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Ofertas destacadas
          </h2>

          <Link
            href="/ofertas"
            className="flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-foreground/70 transition-all hover:border-[#586E26] hover:bg-[#F0F5E8] hover:text-[#31470B]"
          >
            Ver todas
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
