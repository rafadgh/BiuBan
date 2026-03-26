import { SearchBar } from './SearchBar'
import { SearchSuggestions } from './SearchSuggestions'

export function HeroSection() {
  return (
    <section className="bg-[#0B0B0B] py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Encuentra la mejor opción
          </h1>
          <p className="mt-3 text-2xl font-light tracking-tight text-[#586E26] sm:text-3xl lg:text-4xl">
            entre todas las tiendas
          </p>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#6B6B6B] sm:text-lg">
            Busca ropa, tenis y accesorios en un solo lugar. Compara precios y elige mejor.
          </p>

          {/* Divider */}
          <div className="mx-auto mt-10 h-px w-16 bg-[#2A2A2A]" />

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-xl">
            <SearchBar size="large" />
          </div>

          {/* Search Suggestions */}
          <div className="mt-6">
            <p className="mb-3 text-xs uppercase tracking-widest text-[#3A3A3A]">Prueba buscar</p>
            <SearchSuggestions />
          </div>
        </div>
      </div>
    </section>
  )
}
