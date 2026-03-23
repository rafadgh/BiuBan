import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Search, GitCompareArrows, TrendingDown, Bell, ShieldCheck, Zap, Instagram, Facebook } from 'lucide-react'

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Sobre Nosotros — BiuBan',
  description: 'BiuBan es el comparador de precios de moda más completo de México. Conoce nuestra historia, cómo funciona y por qué lo hicimos.',
  alternates: { canonical: 'https://biuban.com/sobre-nosotros' },
}

const howItWorks = [
  {
    step: '01',
    icon: Search,
    title: 'Buscas',
    description: 'Escribe lo que buscas — "tenis blancos Nike", "sudadera oversize" — o sube una foto directamente.',
  },
  {
    step: '02',
    icon: GitCompareArrows,
    title: 'Comparamos',
    description: 'Rastreamos precios en tiempo real entre múltiples tiendas y te mostramos todas las opciones juntas.',
  },
  {
    step: '03',
    icon: TrendingDown,
    title: 'Encuentras el mejor precio',
    description: 'Identificamos automáticamente cuál es la mejor opción considerando precio, descuento y envío.',
  },
  {
    step: '04',
    icon: Bell,
    title: 'Próximamente: alertas',
    description: 'Pronto podrás guardar productos y recibir notificaciones cuando el precio baje.',
  },
]

const values = [
  {
    icon: ShieldCheck,
    title: 'Transparencia total',
    description: 'Cuando haces clic en un link y compras, podemos recibir una comisión. Siempre lo dejamos claro y nunca afecta el orden ni los precios que mostramos.',
  },
  {
    icon: Zap,
    title: 'Sin cuenta necesaria',
    description: 'Puedes usar BiuBan al 100% sin registrarte. Sin spam, sin suscripciones, sin trucos.',
  },
  {
    icon: Search,
    title: 'Independientes',
    description: 'No somos dueños ni tenemos acuerdos exclusivos con ninguna tienda. Mostramos los mejores precios sin importar de dónde vengan.',
  },
]

const socialLinks = [
  { icon: Instagram,  label: 'Instagram', handle: '@BiuBan_mx', href: 'https://instagram.com/BiuBan_mx', color: 'hover:text-pink-500' },
  { icon: XIcon,      label: 'X',         handle: '@BiuBan_mx', href: 'https://x.com/BiuBan_mx',         color: 'hover:text-foreground' },
  { icon: TikTokIcon, label: 'TikTok',    handle: '@biubanmx',  href: 'https://tiktok.com/@biubanmx',    color: 'hover:text-foreground' },
  { icon: Facebook,   label: 'Facebook',  handle: 'BiuBan MX',  href: 'https://facebook.com/BiuBanMX',   color: 'hover:text-blue-500' },
]

export default function SobreNosotrosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <span className="mb-4 inline-block rounded-full bg-[#F0F5E8] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#31470B]">
              Hecho en México 🇲🇽
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Comprar moda no debería ser un trabajo de tiempo completo
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              BiuBan nació de una frustración simple: buscar unos tenis o una chamarra y tener que revisar
              diez tiendas distintas para saber si estás pagando un precio justo. Lo automatizamos.
            </p>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="border-y border-border/50 bg-muted/30 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">¿Cómo funciona?</h2>
              <p className="mt-3 text-muted-foreground">Simple. Sin registro. Sin costo.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item) => (
                <div key={item.step}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-4xl font-bold text-[#E5E5E5]">{item.step}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F5E8]">
                      <item.icon className="h-5 w-5 text-[#31470B]" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nuestra historia */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">Nuestra historia</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                BiuBan empezó como un proyecto personal. La pregunta era simple:
                <strong className="text-foreground"> ¿por qué no existe un comparador masivo de precios de moda en México?</strong>
              </p>
              <p>
                En otros países ya existen comparadores de precios de moda bien hechos. En México, no.
                Las opciones que había estaban desactualizadas, llenas de anuncios o simplemente no funcionaban bien en móvil.
              </p>
              <p>
                Entonces lo construimos. BiuBan rastrea precios automáticamente, los compara en tiempo real
                y te muestra todo en una sola pantalla. Sin registro, sin suscripción, sin trampa.
              </p>
              <p>
                Estamos en versión beta — seguimos mejorando activamente, agregando tiendas y escuchando
                el feedback de quienes lo usan. Si tienes una sugerencia,{' '}
                <Link href="/contacto" className="font-medium text-foreground underline underline-offset-4 hover:text-[#31470B]">
                  escríbenos
                </Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="border-t border-border/50 bg-muted/30 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Lo que nos importa</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F5E8]">
                    <v.icon className="h-5 w-5 text-[#31470B]" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Redes sociales */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">Síguenos</h2>
            <p className="mb-10 text-muted-foreground">
              Compartimos deals, novedades y tips de moda. Únete a la comunidad.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 rounded-xl border border-border/50 bg-card px-5 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-[#31470B] hover:shadow-sm ${social.color}`}
                >
                  <social.icon className="h-4 w-4" />
                  {social.handle}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/50 bg-[#0B0B0B] py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              ¿Listo para encontrar el mejor precio?
            </h2>
            <p className="mt-3 text-[#6B6B6B]">
              Sin registro. Sin costo. Sin vuelta.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/buscar"
                className="flex items-center gap-2 rounded-full bg-[#31470B] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d5a0e]"
              >
                <Search className="h-4 w-4" />
                Buscar ahora
              </Link>
              <Link
                href="/contacto"
                className="flex items-center gap-2 rounded-full border border-[#333] px-8 py-3 text-sm font-semibold text-[#AAAAAA] transition-colors hover:border-[#555] hover:text-white"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
