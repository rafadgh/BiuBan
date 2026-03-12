"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

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
          `name.ilike.%${cleanQuery}%,brand.ilike.%${cleanQuery}%`
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
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <a
          key={product.id}
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border rounded-xl p-4 hover:shadow-lg transition"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover mb-3"
          />

          <h3 className="text-sm font-semibold">{product.name}</h3>

          <p className="text-gray-500 text-sm">{product.store}</p>

          <p className="text-xs text-gray-400">{product.brand}</p>

          <p className="font-bold mt-2">${product.price}</p>
        </a>
      ))}
    </div>
  )
}