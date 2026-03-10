"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Producto = {
  id: string;
  name: string;
  brand: string;
  category: string;
  color: string;
  price: number;
  store: string;
  image: string;
  url: string;
  product_group: string;
  discount: number;
  available: boolean;
};

export default function BuscarClient({ query }: { query: string }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductos() {
      if (!query.trim()) {
        setProductos([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,store.ilike.%${query}%`)
        .order("price", { ascending: true });

      if (error) {
        console.error("Error cargando productos:", error);
        setProductos([]);
      } else {
        setProductos((data as Producto[]) || []);
      }

      setLoading(false);
    }

    fetchProductos();
  }, [query]);

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold">Resultados de búsqueda</h1>
        <p className="mb-8 text-gray-600">
          {query
            ? `Mostrando resultados para "${query}"`
            : "Escribe algo para buscar"}
        </p>

        {loading ? (
          <p className="text-gray-500">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-gray-500">No encontramos productos.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto) => (
              <article
                key={producto.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <img
                  src={producto.image}
                  alt={producto.name}
                  className="h-72 w-full object-cover"
                />

                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      {producto.brand}
                    </p>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      {producto.store}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold">{producto.name}</h2>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-2xl font-bold">
                      ${Number(producto.price).toLocaleString("es-MX")}
                    </span>

                    {Number(producto.discount) > 0 && (
                      <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
                        -{producto.discount}%
                      </span>
                    )}
                  </div>

                  <a
                    href={producto.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 block rounded-xl bg-black px-4 py-3 text-center text-white transition hover:bg-gray-800"
                  >
                    Ver tienda
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}