'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ChevronLeft } from 'lucide-react'

const navLinks = [
  { href: '/ofertas',        label: 'Ofertas' },
  { href: '/marcas',         label: 'Marcas' },
  { href: '/sobre-nosotros', label: 'Sobre nosotros' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1A1A1A] bg-[#0B0B0B]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">

        {/* Izquierda */}
        <div className="flex items-center gap-2">
          {!isHome && (
            <Link
              href="/"
              className="mr-1 flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-[#6B6B6B] transition-colors hover:text-[#778C43]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          )}
          <Link href="/" className="flex items-center">
            <span className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              BiuBan
            </span>
          </Link>
        </div>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-[#778C43]'
                  : 'text-[#6B6B6B] hover:text-[#778C43]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA desktop — amarillo solo aquí */}
        <div className="hidden md:block">
          <Link
            href="/buscar"
            className="flex items-center gap-2 rounded-full bg-[#EAB308] px-4 py-2 text-sm font-semibold text-[#0B0B0B] transition-colors hover:bg-[#CA8A04]"
          >
            <Search className="h-4 w-4" />
            Buscar
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-white transition-colors hover:text-[#778C43] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-[#1A1A1A] bg-[#0B0B0B] md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:text-[#778C43] ${
                  pathname === link.href ? 'text-[#778C43]' : 'text-[#6B6B6B]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 px-3 pb-1">
              <Link
                href="/buscar"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#EAB308] py-2.5 text-sm font-semibold text-[#0B0B0B] transition-colors hover:bg-[#CA8A04]"
              >
                <Search className="h-4 w-4" />
                Buscar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}