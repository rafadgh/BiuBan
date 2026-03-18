import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Mail, Instagram, Twitter, Facebook, MapPin, Clock } from 'lucide-react'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Contacto - BiuBan',
  description: 'Contáctanos para dudas, sugerencias o reportar algún problema con BiuBan.',
}

const contactInfo = [
  {
    icon: Mail,
    label: 'Correo electrónico',
    value: 'contacto@biuban.com',
    href: 'mailto:contacto@biuban.com',
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Ciudad de México, México',
    href: null,
  },
  {
    icon: Clock,
    label: 'Horario de atención',
    value: 'Lunes a viernes, 9:00 – 18:00 hrs',
    href: null,
  },
]

const socialLinks = [
  {
    icon: Instagram,
    label: 'Instagram',
    handle: '@BiuBan_mx',
    href: 'https://instagram.com/BiuBan_mx',
    color: 'hover:text-pink-500',
  },
  {
    icon: Twitter,
    label: 'X (Twitter)',
    handle: '@BiuBan_mx',
    href: 'https://x.com/BiuBan_mx',
    color: 'hover:text-foreground',
  },
  {
    icon: Facebook,
    label: 'Facebook',
    handle: 'BiuBan MX',
    href: 'https://facebook.com/BiuBanMX',
    color: 'hover:text-blue-500',
  },
  {
    icon: TikTokIcon,
    label: 'TikTok',
    handle: '@biubanmx',
    href: 'https://tiktok.com/@biubanmx',
    color: 'hover:text-foreground',
  },
]

export default function ContactoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Contáctanos
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">
              ¿Tienes dudas, sugerencias o encontraste algo raro? Escríbenos, respondemos rápido.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-8">
                <h2 className="mb-6 text-lg font-bold text-foreground">Información de contacto</h2>
                <ul className="space-y-5">
                  {contactInfo.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <item.icon className="h-4 w-4 text-foreground" />
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm font-medium text-foreground hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground">{item.value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-8">
                <h2 className="mb-6 text-lg font-bold text-foreground">Redes sociales</h2>
                <ul className="space-y-3">
                  {socialLinks.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted ${social.color}`}
                      >
                        <social.icon className="h-5 w-5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">{social.label}</p>
                          <p className="text-sm font-medium">{social.handle}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border/50 bg-muted/40 p-5 text-center">
              <p className="text-sm text-muted-foreground">
                Para reportar un producto incorrecto o un precio desactualizado, escríbenos a{' '}
                <a
                  href="mailto:reportes@biuban.com"
                  className="font-medium text-foreground hover:underline"
                >
                  reportes@biuban.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
