"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ExternalLink } from "lucide-react"

type Product = {
  id: string
  name: string
  brand: string
  category: string
  color: string
  price: number
  store: string
  image: string
  url: string
  discount?: number
}

interface ProductGridProps {
  query?: string
}

export default function ProductGrid({ query = "" }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const cleanQuery = query.trim()

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)

      let request = supabase
        .from("products")
        .select("*")

      if (cleanQuery) {
        request = request.or(
          `name.ilike.%${cleanQuery}%,brand.ilike.%${cleanQuery}%,category.ilike.%${cleanQuery}%`
        )
      }

      const { data, error } = await request.limit(24)

      if (error) {
        console.error(error)
        setProducts([])
        setLoading(false)
        return
      }

      setProducts((data as Product[]) || [])
      setLoading(false)
    }

    loadProducts()
  }, [cleanQuery])

  if (loading) {
    return <p className="text-center">Cargando productos...</p>
  }

  if (!products.length) {
    return <p className="text-center">No se encontraron productos.</p>
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const originalPrice = product.discount
          ? product.price / (1 - product.discount / 100)
          : null

        return (
          <div
            key={product.id}
            className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
                Mejor opción
              </div>

              {product.discount ? (
                <div className="absolute right-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  -{product.discount}%
                </div>
              ) : null}
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {product.brand}
                  </p>
                  <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
                    {product.name}
                  </h3>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {product.store}
                </span>
              </div>

              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  ${Math.round(product.price).toLocaleString("es-MX")}
                </p>

                {originalPrice ? (
                  <p className="text-base text-muted-foreground line-through">
                    ${Math.round(originalPrice).toLocaleString("es-MX")}
                  </p>
                ) : null}
              </div>

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-4 py-3 font-medium text-black transition hover:brightness-95"
              >
                Ver tienda
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}