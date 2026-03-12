"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  const query = searchParams.get("q") || ""

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)

      let request = supabase
        .from("products")
        .select("*")

      if (query.trim()) {
        request = request.or(
          `name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%,color.ilike.%${query}%,store.ilike.%${query}%`
        )
      }

      const { data, error } = await request.limit(24)

      if (error) {
        console.error(error)
        setProducts([])
        setLoading(false)
        return
      }

      setProducts(data || [])
      setLoading(false)
    }

    loadProducts()
  }, [query])

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

          <p className="font-bold mt-2">${product.price}</p>
        </a>
      ))}
    </div>
  )
}