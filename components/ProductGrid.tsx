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

      const { data, error } = await request.limit(40)

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
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">

      {products.map((product) => {
        const originalPrice = product.discount
          ? product.price / (1 - product.discount / 100)
          : null

        return (
          <div
            key={product.id}
            className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition hover:shadow-md"
          >
            {/* IMAGE */}
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">

              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute left-2 top-2 rounded-full bg-yellow-400 px-2 py-1 text-[10px] font-semibold text-black">
                Mejor opción
              </div>

              {product.discount ? (
                <div className="absolute right-2 top-2 rounded-full bg-black px-2 py-1 text-[10px] font-semibold text-white">
                  -{product.discount}%
                </div>
              ) : null}

            </div>

            {/* INFO */}
            <div className="space-y-2 p-3">

              <div className="flex items-start justify-between gap-2">

                <div>
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                    {product.brand}
                  </p>

                  <h3 className="line-clamp-2 text-sm font-semibold">
                    {product.name}
                  </h3>
                </div>

                <span className="rounded-full bg-muted px-2 py-1 text-[10px]">
                  {product.store}
                </span>

              </div>

              {/* PRICE */}
              <div className="flex items-end gap-1">

                <p className="text-xl font-bold">
                  ${Math.round(product.price).toLocaleString("es-MX")}
                </p>

                {originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    ${Math.round(originalPrice).toLocaleString("es-MX")}
                  </p>
                )}

              </div>

              {/* BUTTON */}
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-1 rounded-full bg-yellow-400 px-2 py-2 text-xs font-medium text-black hover:brightness-95"
              >
                Ver tienda
                <ExternalLink className="h-3 w-3" />
              </a>

            </div>
          </div>
        )
      })}
    </div>
  )
}