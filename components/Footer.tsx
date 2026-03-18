import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )
}

const footerLinks = {
  navegacion: [
    { href: '/',            label: 'Inicio' },
    { href: '/buscar',      label: 'Buscar' },
    { href: '/ofertas',     label: 'Ofertas' },
    { href: '/categorias',  label: 'Categorías' },
    { href: '/marcas',      label: 'Marcas' },
  ],
  empresa: [
    { href: '/sobre-nosotros', label: 'Sobre nosotros' },
    { href: '/contacto',       label: 'Contacto' },
  ],
  legal: [
    { href: '/terminos',   label: 'Términos de uso' },
    { href: '/privacidad', label: 'Privacidad' },
  ],
}

const socialLinks = [
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://instagram.com/BiuBan_mx',
    color: 'hover:text-pink-400',
  },
  {
    icon: Twitter,
    label: 'X',
    href: 'https://x.com/BiuBan_mx',
    color: 'hover:text-white',
  },
  {
    icon: Facebook,
    label: 'Facebook',
    href: 'https://facebook.com/BiuBanMX',
    color: 'hover:text-blue-400',
  },
  {
    icon: TikTokIcon,
    label: 'TikTok',
    href: 'https://tiktok.com/@biubanmx',
    color: 'hover:text-white',
  },
]

export function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A] bg-[#0B0B0B]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-lg font-semibold tracking-tight text-white">BiuBan</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#6B6B6B]">
              Compara precios de moda en México. Encuentra la mejor opción entre todas las tiendas.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-[#1A1A1A] ${social.color}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#E5E5E5]">
              Navegación
            </h3>
            <ul className="space-y-2">
              {footerLinks.navegacion.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-[#6B6B6B] transition-colors hover:text-[#778C43]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#E5E5E5]">
              Empresa
            </h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-[#6B6B6B] transition-colors hover:text-[#778C43]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#E5E5E5]">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-[#6B6B6B] transition-colors hover:text-[#778C43]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#1A1A1A] pt-6">
          <p className="text-center text-xs text-[#6B6B6B]">
            © {new Date().getFullYear()} BiuBan. No vendemos productos directamente.
          </p>
        </div>
      </div>
    </footer>
  )
}
