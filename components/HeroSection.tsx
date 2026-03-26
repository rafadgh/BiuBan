import Image from 'next/image'
import { SearchBar } from './SearchBar'
import { SearchSuggestions } from './SearchSuggestions'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B0B0B] py-20 sm:py-28 lg:py-36">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(49,71,11,0.35) 0%, transparent 70%)',
        }}
      />

      {/* Faint grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(to right, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/BiuBan_logo.png"
              alt="BiuBan"
              width={140}
              height={44}
              className="h-10 w-auto sm:h-12 object-contain"
              priority
            />
          </div>

          {/* Headline */}
          <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Encuentra la mejor opción
            <span className="mt-2 block bg-gradient-to-r from-[#778C43] to-[#A8C464] bg-clip-text text-transparent">
              entre todas las tiendas
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[#9A9A9A] sm:text-lg md:text-xl">
            Busca ropa, tenis y accesorios en un solo lugar. Compara precios y elige mejor.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-xl">
            <SearchBar size="large" />
          </div>

          {/* Search Suggestions */}
          <div className="mt-8">
            <p className="mb-3 text-sm text-[#6B6B6B]">Prueba buscar:</p>
            <SearchSuggestions />
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { label: 'Nike' },
              { label: 'Adidas' },
              { label: 'Zara' },
              { label: 'Liverpool' },
              { label: 'Amazon' },
            ].map((brand) => (
              <span key={brand.label} className="text-xs font-semibold uppercase tracking-widest text-[#3A3A3A]">
                {brand.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
