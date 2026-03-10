import { SearchBar } from './SearchBar'
import { SearchSuggestions } from './SearchSuggestions'

export function HeroSection() {
  return (
    <section className="bg-background py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Encuentra la mejor opción
            <span className="mt-1 block text-muted-foreground">entre todas las tiendas</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            Busca ropa, tenis y accesorios en un solo lugar. Compara precios y elige mejor.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-xl">
            <SearchBar size="large" />
          </div>

          {/* Search Suggestions */}
          <div className="mt-8">
            <p className="mb-3 text-sm text-muted-foreground">Prueba buscar:</p>
            <SearchSuggestions />
          </div>
        </div>
      </div>
    </section>
  )
}
