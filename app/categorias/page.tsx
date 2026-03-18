// app/categorias/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Categorías — BiuBan',
  description: 'Explora todas las categorías de ropa, tenis y accesorios. Compara precios en las mejores tiendas de México.',
}

// Todas las categorías con imagen y descripción
const allCategories = [
  // ── Principales (mismas que CategoryGrid) ──────────────────────────────────
  {
    name:   'Tenis',
    slug:   'tenis',
    desc:   'Sneakers, running y lifestyle',
    image:  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    main:   true,
  },
  {
    name:   'Playeras',
    slug:   'playeras',
    desc:   'T-shirts, camisetas y básicos',
    image:  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    main:   true,
  },
  {
    name:   'Sudaderas',
    slug:   'sudaderas',
    desc:   'Hoodies, sweatshirts y oversized',
    image:  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
    main:   true,
  },
  {
    name:   'Jeans',
    slug:   'jeans',
    desc:   'Denim, mezclilla y pantalones',
    image:  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
    main:   true,
  },
  {
    name:   'Chamarras',
    slug:   'chamarras',
    desc:   'Jackets, abrigos y outerwear',
    image:  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
    main:   true,
  },
  {
    name:   'Gorras',
    slug:   'gorras',
    desc:   'Caps, sombreros y headwear',
    image:  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
    main:   true,
  },
  // ── Más categorías ─────────────────────────────────────────────────────────
  {
    name:   'Botas',
    slug:   'botas',
    desc:   'Botas y botines para hombre y mujer',
    image:  'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Shorts',
    slug:   'shorts',
    desc:   'Shorts y bermudas deportivos y casuales',
    image:  'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Vestidos',
    slug:   'vestidos',
    desc:   'Vestidos casuales y de ocasión',
    image:  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Running',
    slug:   'running',
    desc:   'Ropa y tenis para correr y atletismo',
    image:  'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Gym',
    slug:   'gym',
    desc:   'Ropa de entrenamiento, fitness y crossfit',
    image:  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Fútbol',
    slug:   'futbol',
    desc:   'Jerseys, tenis y accesorios de fútbol',
    image:  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Basketball',
    slug:   'basketball',
    desc:   'Ropa y tenis de basketball',
    image:  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Golf',
    slug:   'golf',
    desc:   'Polos, pantalones y accesorios de golf',
    image:  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Béisbol',
    slug:   'beisbol',
    desc:   'Jerseys y accesorios de béisbol',
    image:  'https://images.unsplash.com/photo-1529768167801-9173d94c2a42?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Outdoor',
    slug:   'outdoor',
    desc:   'Ropa y calzado para senderismo y aventura',
    image:  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Mochilas',
    slug:   'mochilas',
    desc:   'Mochilas, bolsas y backpacks',
    image:  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    main:   false,
  },
  {
    name:   'Calcetines',
    slug:   'calcetines',
    desc:   'Calcetines deportivos y de moda',
    image:  'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=600&fit=crop',
    main:   false,
  },
]

const mainCategories  = allCategories.filter(c => c.main)
const extraCategories = allCategories.filter(c => !c.main)

export default function CategoriasPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

        {/* Encabezado */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-[#0B0B0B] sm:text-3xl">
            Todas las categorías
          </h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Explora por tipo de ropa, calzado y accesorios
          </p>
        </div>

        {/* Categorías principales */}
        <section className="mb-12">
          <h2 className="mb-5 text-base font-semibold text-[#0B0B0B]">
            Principales
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {mainCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Más categorías */}
        <section>
          <h2 className="mb-5 text-base font-semibold text-[#0B0B0B]">
            Más categorías
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {extraCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white transition-all hover:border-[#586E26] hover:shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[#0B0B0B] group-hover:text-[#31470B]">
                    {cat.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#6B6B6B] line-clamp-1">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
