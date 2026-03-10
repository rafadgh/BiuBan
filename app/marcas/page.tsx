import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { brands } from '@/lib/brands'

export const metadata: Metadata = {
  title: 'Marcas y Tiendas - BiuBan',
  description: 'Explora todas las marcas y tiendas disponibles en BiuBan. Nike, Adidas, Zara, Liverpool, Amazon México y más.',
}

export default function MarcasPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Marcas y Tiendas
            </h1>
            <p className="mt-2 text-muted-foreground">
              {brands.length} marcas disponibles para comparar
            </p>
          </div>

          {/* Brands Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/buscar?q=${encodeURIComponent(brand.nombre)}`}
                className="group flex flex-col rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-border hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-lg font-bold text-foreground">
                  {brand.nombre.charAt(0)}
                </div>
                <h2 className="mt-3 font-semibold text-foreground">
                  {brand.nombre}
                </h2>
                {brand.descripcion && (
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground line-clamp-2">
                    {brand.descripcion}
                  </p>
                )}
                <span className="mt-3 text-sm font-medium text-foreground/70 group-hover:text-foreground">
                  Ver productos →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
