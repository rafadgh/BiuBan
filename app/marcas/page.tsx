import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getBrandsFromDB } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Marcas - BiuBan',
  description:
    'Explora todas las marcas disponibles en BiuBan. Nike, Adidas, Zara, Puma y más.',
}

export default async function MarcasPage() {
  const brands = await getBrandsFromDB()

  const grouped = brands.reduce<Record<string, typeof brands>>(
    (acc, brand) => {
      const letter = brand.nombre[0].toUpperCase()
      if (!acc[letter]) acc[letter] = []
      acc[letter].push(brand)
      return acc
    },
    {}
  )

  const letters = Object.keys(grouped).sort()

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-[#0B0B0B] sm:text-3xl">
              Marcas
            </h1>
            <p className="mt-2 text-[#6B6B6B]">
              {brands.length} marcas disponibles
            </p>
          </div>

          {/* Índice de letras */}
          <div className="mb-8 flex flex-wrap gap-1.5">
            {letters.map((letter) => (
              <Link
                key={letter}
                href={`#letra-${letter}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-xs font-semibold text-[#0B0B0B] transition-colors hover:border-[#586E26] hover:text-[#31470B]"
              >
                {letter}
              </Link>
            ))}
          </div>

          <div className="space-y-10">
            {letters.map((letter) => (
              <section key={letter} id={`letra-${letter}`}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xl font-bold text-[#0B0B0B]">
                    {letter}
                  </span>
                  <div className="h-px flex-1 bg-[#E5E5E5]" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {grouped[letter].map((brand) => (
                    <Link
                      key={brand.nombre}
                      href={`/buscar?marca=${encodeURIComponent(brand.nombre)}`}
                      className="group flex items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 transition-all hover:border-[#586E26] hover:shadow-sm"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5] text-sm font-bold text-[#0B0B0B] transition-colors group-hover:bg-[#31470B] group-hover:text-white">
                        {brand.nombre.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#0B0B0B]">
                          {brand.nombre}
                        </p>
                        <p className="text-xs text-[#6B6B6B]">
                          {brand.total} {brand.total === 1 ? 'producto' : 'productos'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
