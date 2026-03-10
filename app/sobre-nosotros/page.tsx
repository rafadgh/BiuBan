import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Search, Target, Clock, Store } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nosotros - BiuBan',
  description: 'Conoce más sobre BiuBan, el buscador de moda que te ayuda a comparar precios y encontrar la mejor opción.',
}

const features = [
  {
    icon: Search,
    title: 'Búsqueda unificada',
    description: 'Busca en múltiples tiendas a la vez sin tener que visitar cada sitio por separado.',
  },
  {
    icon: Target,
    title: 'Mejor opción',
    description: 'Te mostramos cuál es la mejor opción basándonos en precio, disponibilidad y confianza de la tienda.',
  },
  {
    icon: Clock,
    title: 'Ahorra tiempo',
    description: 'Compara productos en segundos en lugar de pasar horas navegando diferentes tiendas.',
  },
  {
    icon: Store,
    title: 'Más tiendas pronto',
    description: 'Continuamente agregamos más tiendas y marcas para darte más opciones.',
  },
]

export default function SobreNosotrosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Sobre BiuBan
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
              Un buscador de moda que te ayuda a encontrar la mejor opción 
              entre todas las tiendas de México.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="border-y border-border/50 bg-card py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Nuestra misión
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Simplificar la forma en que las personas compran moda en línea. 
                En lugar de visitar decenas de tiendas, BiuBan te muestra todas 
                las opciones en un solo lugar.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                ¿Cómo funciona?
              </h2>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Note */}
        <section className="bg-muted/50 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-8">
              <h2 className="font-bold text-foreground">
                Importante
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                BiuBan no vende productos directamente. Somos un comparador que te 
                ayuda a encontrar las mejores opciones. Cuando encuentras algo que 
                te gusta, te redirigimos a la tienda original.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              ¿Listo para encontrar tu próxima compra?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Empieza a buscar y descubre las mejores opciones
            </p>
            <div className="mt-6">
              <Button asChild size="default" className="rounded-full px-6">
                <Link href="/buscar">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar ahora
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
