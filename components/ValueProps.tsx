import { Search, Star, ShoppingBag } from 'lucide-react'

const valueProps = [
  {
    icon: Search,
    title: 'Busca en varios vendedores a la vez',
    description: 'Encuentra productos de Nike, Adidas, Zara, Liverpool, Amazon y muchos más en un solo lugar.',
  },
  {
    icon: Star,
    title: 'Encuentra la mejor opción',
    description: 'Te mostramos cuál es la mejor opción basándonos en precio, disponibilidad y vendedor.',
  },
  {
    icon: ShoppingBag,
    title: 'Compara precios rápido',
    description: 'Ahorra tiempo comparando precios sin tener que visitar cada vendedor por separado.',
  },
]

export function ValueProps() {
  return (
    <section className="border-y border-border/50 bg-card py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {valueProps.map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                <prop.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                {prop.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
