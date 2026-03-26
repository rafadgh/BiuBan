import Image from 'next/image'
import { SearchBar } from './SearchBar'
import { SearchSuggestions } from './SearchSuggestions'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-36">

      {/* ── Logo watermark ────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <Image
          src="/BiuBan_logo_transparent.png"
          alt=""
          width={900}
          height={900}
          className="w-[420px] sm:w-[580px] lg:w-[780px] opacity-[0.18]"
          priority
        />
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Encuentra la mejor opción
            <span className="mt-1 block text-muted-foreground">entre todas las tiendas</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            Busca ropa, tenis y accesorios en un solo lugar. Compara precios y elige mejor.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <SearchBar size="large" />
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm text-muted-foreground">Prueba buscar:</p>
            <SearchSuggestions />
          </div>
        </div>
      </div>
    </section>
  )
}
