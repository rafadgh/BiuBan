import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { getDiscountedProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Ofertas - BiuBan',
  description: 'Descubre las mejores ofertas y descuentos en ropa, tenis y accesorios. Compara precios y ahorra.',
}

export default function OfertasPage() {
  const deals = getDiscountedProducts()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Ofertas
              </h1>
              <p className="mt-2 text-muted-foreground">
                {deals.length} productos con descuento
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
