// app/categorias/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Categorías — BiuBan',
  description: 'Explora toda la moda: ropa, calzado, deporte y accesorios. Compara precios entre las mejores tiendas de México.',
}

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface CategoryItem {
  name:  string
  desc:  string
  href:  string
  image: string
}

interface CategorySection {
  id:         string
  title:      string
  subtitle:   string
  items:      CategoryItem[]
  layout:     'large' | 'medium' | 'small' | 'featured'
}

// ── Datos ─────────────────────────────────────────────────────────────────────
const sections: CategorySection[] = [
  // ────────────────────────────────────────────────────────────────────────────
  {
    id:       'calzado',
    title:    'Calzado',
    subtitle: 'Tenis, botas, sandalias y más',
    layout:   'large',
    items: [
      {
        name:  'Tenis / Sneakers',
        desc:  'Lifestyle, running y basketball',
        href:  '/categoria/tenis',
        image: '/categorias/tenis.jpg',
      },
      {
        name:  'Botas / Botines',
        desc:  'Cuero, combat y chelsea boots',
        href:  '/categoria/botas',
        image: '/categorias/botas.jpg',
      },
      {
        name:  'Sandalias',
        desc:  'Slides, flats y sandalias de verano',
        href:  '/categoria/sandalias',
        image: '/categorias/sandalias.jpg',
      },
      {
        name:  'Zapatos formales',
        desc:  'Oxford, loafers y mocasines',
        href:  '/categoria/zapatos',
        image: '/categorias/zapatos.jpg',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────────────────
  {
    id:       'ropa-basica',
    title:    'Ropa',
    subtitle: 'De lo más casual a lo más sofisticado',
    layout:   'medium',
    items: [
      {
        name:  'Playeras',
        desc:  'T-shirts, camisetas y básicos',
        href:  '/categoria/playeras',
        image: '/categorias/playeras.jpg',
      },
      {
        name:  'Camisas / Blusas',
        desc:  'Camisas, blusas y tops formales',
        href:  '/categoria/camisas',
        image: '/categorias/blusas.jpg',
      },
      {
        name:  'Camisas de Vestir',
        desc:  'Dress shirts, Oxford y camisas de vestir',
        href:  '/categoria/camisas-formales',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&h=500&fit=crop',
      },
      {
        name:  'Crop Tops',
        desc:  'Tops cortos y diseños atrevidos',
        href:  '/categoria/crop-tops',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
      },
      {
        name:  'Sudaderas / Hoodies',
        desc:  'Oversized, zip-up y pullover',
        href:  '/categoria/sudaderas',
        image: '/categorias/sudaderas.jpg',
      },
      {
        name:  'Chamarras / Jackets',
        desc:  'Bomber, denim y puffer jackets',
        href:  '/categoria/chamarras',
        image: '/categorias/chamarras.jpg',
      },
      {
        name:  'Abrigos',
        desc:  'Trench coats, overcoats y parkas',
        href:  '/categoria/abrigos',
        image: '/categorias/abrigos.jpg',
      },
      {
        name:  'Sacos / Blazers',
        desc:  'Blazers casuales y formales',
        href:  '/categoria/sacos',
        image: '/categorias/sacos.jpg',
      },
      {
        name:  'Jeans / Mezclilla',
        desc:  'Skinny, wide leg, straight y baggy',
        href:  '/categoria/jeans',
        image: '/categorias/jeans.jpg',
      },
      {
        name:  'Pantalones',
        desc:  'Chinos, joggers y pantalones de vestir',
        href:  '/categoria/pantalones',
        image: '/categorias/pantalones.jpg',
      },
      {
        name:  'Shorts / Bermudas',
        desc:  'Casuales, deportivos y de baño',
        href:  '/categoria/shorts',
        image: '/categorias/shorts.jpg',
      },
      {
        name:  'Faldas',
        desc:  'Mini, midi, maxi y plisadas',
        href:  '/categoria/faldas',
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=500&fit=crop',
      },
      {
        name:  'Vestidos',
        desc:  'Casuales, de fiesta y de noche',
        href:  '/categoria/vestidos',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop',
      },
      {
        name:  'Leggings / Mallas',
        desc:  'Deportivos, casuales y térmicos',
        href:  '/categoria/leggings',
        image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&h=500&fit=crop',
      },
      {
        name:  'Conjuntos / Sets',
        desc:  'Looks coordinados en un solo clic',
        href:  '/categoria/conjuntos',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop',
      },
      {
        name:  'Pijamas / Loungewear',
        desc:  'Ropa cómoda para estar en casa',
        href:  '/categoria/pijamas',
        image: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=500&h=500&fit=crop',
      },
      {
        name:  'Trajes de baño',
        desc:  'Bikinis, bañadores y coverups',
        href:  '/categoria/trajes-de-bano',
        image: 'https://images.unsplash.com/photo-1559163499-413811fb2344?w=500&h=500&fit=crop',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────────────────
  {
    id:       'deporte',
    title:    'Deporte',
    subtitle: 'Ropa técnica para cada disciplina',
    layout:   'small',
    items: [
      {
        name:  'Running',
        desc:  'Tenis y ropa de correr',
        href:  '/categoria/running',
        image: 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=400&h=400&fit=crop',
      },
      {
        name:  'Gym / Fitness',
        desc:  'Entrenamiento, crossfit y yoga',
        href:  '/categoria/gym',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      },
      {
        name:  'Fútbol',
        desc:  'Jerseys, tenis y accesorios',
        href:  '/categoria/futbol',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop',
      },
      {
        name:  'Basketball',
        desc:  'Jerseys, shorts y tenis',
        href:  '/categoria/basketball',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
      },
      {
        name:  'Outdoor',
        desc:  'Senderismo, camping y aventura',
        href:  '/categoria/outdoor',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop',
      },
      {
        name:  'Golf',
        desc:  'Polos, pantalones y calzado',
        href:  '/categoria/golf',
        image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=400&fit=crop',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────────────────
  {
    id:       'accesorios',
    title:    'Accesorios',
    subtitle: 'Gorras, mochilas, bolsos, calcetines y más — en un solo lugar',
    layout:   'featured',
    items: [
      {
        name:  'Accesorios',
        desc:  'Gorras, mochilas, bolsos, calcetines y más',
        href:  '/buscar?categoria=gorras,mochilas,calcetines,accesorios',
        image: '/categorias/accesorios.jpg',
      },
    ],
  },
]

// ── Componente de card ─────────────────────────────────────────────────────────
function CategoryCard({ item, size }: { item: CategoryItem; size: 'lg' | 'md' | 'sm' }) {
  const aspectClass = size === 'lg' ? 'aspect-[3/4]' : size === 'md' ? 'aspect-square' : 'aspect-[4/3]'

  return (
    <Link
      href={item.href}
      className="group relative overflow-hidden rounded-2xl bg-[#EBEBEB] transition-all hover:shadow-lg"
    >
      <div className={`relative ${aspectClass} overflow-hidden`}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/75 via-[#0B0B0B]/10 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-sm font-semibold leading-tight text-white">{item.name}</p>
        <p className="mt-0.5 text-[11px] text-white/70 line-clamp-1">{item.desc}</p>
      </div>
    </Link>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function CategoriasPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

        {/* Encabezado */}
        <div className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-[#586E26]">
            Explorar
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0B0B0B] sm:text-3xl">
            Todas las categorías
          </h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Desde lo más casual hasta lo más sofisticado — compara precios en un solo lugar.
          </p>
        </div>

        {/* Secciones */}
        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.id}>
              {/* Título de sección */}
              <div className="mb-5 flex items-end justify-between border-b border-[#E5E5E5] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0B0B0B]">{section.title}</h2>
                  <p className="text-xs text-[#6B6B6B]">{section.subtitle}</p>
                </div>
              </div>

              {/* Grid adaptado al layout */}
              {section.layout === 'large' && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {section.items.map((item) => (
                    <CategoryCard key={item.name} item={item} size="lg" />
                  ))}
                </div>
              )}

              {section.layout === 'medium' && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                  {section.items.map((item) => (
                    <CategoryCard key={item.name} item={item} size="md" />
                  ))}
                </div>
              )}

              {section.layout === 'small' && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {section.items.map((item) => (
                    <CategoryCard key={item.name} item={item} size="sm" />
                  ))}
                </div>
              )}

              {section.layout === 'featured' && section.items[0] && (
                <Link
                  href={section.items[0].href}
                  className="group relative block overflow-hidden rounded-2xl bg-[#EBEBEB] transition-all hover:shadow-xl"
                >
                  <div className="relative aspect-[21/6] overflow-hidden sm:aspect-[21/7]">
                    <Image
                      src={section.items[0].image}
                      alt={section.items[0].name}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/70 via-[#0B0B0B]/30 to-transparent" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
                    <p className="text-xs font-medium uppercase tracking-widest text-white/70">Explorar</p>
                    <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">{section.items[0].name}</p>
                    <p className="mt-1 text-sm text-white/80">{section.items[0].desc}</p>
                    <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-all group-hover:bg-white/20">
                      Ver todos →
                    </span>
                  </div>
                </Link>
              )}
            </section>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  )
}
