import Link from 'next/link'

const footerLinks = {
  navegacion: [
    { href: '/',              label: 'Inicio' },
    { href: '/buscar',        label: 'Buscar' },
    { href: '/ofertas',       label: 'Ofertas' },
    { href: '/marcas',        label: 'Marcas' },
  ],
  empresa: [
    { href: '/sobre-nosotros', label: 'Sobre nosotros' },
    { href: '/contacto',       label: 'Contacto' },
  ],
  legal: [
    { href: '#', label: 'Términos de uso' },
    { href: '#', label: 'Privacidad' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-[#1F1F1F] bg-[#0B0B0B]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-lg font-bold tracking-tight text-white">
                Biu<span className="text-[#22C55E]">Ban</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#6B6B6B]">
              Compara precios de moda en México. Encuentra la mejor opción entre todas las tiendas.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
              Navegación
            </h3>
            <ul className="space-y-2">
              {footerLinks.navegacion.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-[#6B6B6B] transition-colors hover:text-[#22C55E]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
              Empresa
            </h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-[#6B6B6B] transition-colors hover:text-[#22C55E]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-[#6B6B6B] transition-colors hover:text-[#22C55E]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-[#1F1F1F] pt-6">
          <p className="text-center text-xs text-[#6B6B6B]">
            © {new Date().getFullYear()} BiuBan. No vendemos productos directamente.
          </p>
        </div>
      </div>
    </footer>
  )
}