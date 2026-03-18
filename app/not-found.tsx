import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BackButton } from '@/components/BackButton'
import { Search, Home, Tag } from 'lucide-react'

const quickLinks = [
  { href: '/buscar',  icon: Search, label: 'Buscar productos' },
  { href: '/',        icon: Home,   label: 'Ir al inicio'     },
  { href: '/ofertas', icon: Tag,    label: 'Ver ofertas'      },
]

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9F9F9]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-lg text-center">

          {/* Big 404 */}
          <div className="mb-6 select-none">
            <span className="text-[120px] font-bold leading-none tracking-tight text-[#E5E5E5] sm:text-[160px]">
              404
            </span>
          </div>

          {/* Message */}
          <h1 className="mb-3 text-2xl font-bold text-[#0B0B0B] sm:text-3xl">
            Esta página no existe
          </h1>
          <p className="mb-10 text-[#6B6B6B]">
            El link que seguiste está roto, la página fue movida o simplemente nunca existió.
            Pero los precios siguen aquí.
          </p>

          {/* Quick links */}
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm font-medium text-[#0B0B0B] transition-all hover:border-[#31470B] hover:shadow-sm"
              >
                <link.icon className="h-4 w-4 text-[#778C43]" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Back button */}
          <BackButton />
        </div>
      </main>

      <Footer />
    </div>
  )
}
