import type { MetadataRoute } from 'next'
import { getBrandsFromDB } from '@/lib/products'
import { CATEGORIA_LABELS, toSlug } from '@/lib/slug'

const BASE = 'https://biuban.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Rutas estáticas ────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                   priority: 1.0, changeFrequency: 'daily'  },
    { url: `${BASE}/buscar`,       priority: 0.9, changeFrequency: 'daily'  },
    { url: `${BASE}/ofertas`,      priority: 0.8, changeFrequency: 'daily'  },
    { url: `${BASE}/categorias`,   priority: 0.7, changeFrequency: 'weekly' },
    { url: `${BASE}/marcas`,       priority: 0.7, changeFrequency: 'weekly' },
    { url: `${BASE}/sobre-nosotros`, priority: 0.4, changeFrequency: 'monthly' },
    { url: `${BASE}/contacto`,     priority: 0.4, changeFrequency: 'monthly' },
    { url: `${BASE}/privacidad`,   priority: 0.3, changeFrequency: 'monthly' },
    { url: `${BASE}/terminos`,     priority: 0.3, changeFrequency: 'monthly' },
  ]

  // ── Categorías (estáticas desde slug.ts) ──────────────────────────────────
  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(CATEGORIA_LABELS).map(slug => ({
    url: `${BASE}/categoria/${slug}`,
    priority: 0.7,
    changeFrequency: 'weekly',
  }))

  // ── Marcas (dinámicas desde Supabase) ─────────────────────────────────────
  let brandRoutes: MetadataRoute.Sitemap = []
  try {
    const brands = await getBrandsFromDB()
    brandRoutes = brands.map(b => ({
      url: `${BASE}/marca/${toSlug(b.nombre)}`,
      priority: 0.6,
      changeFrequency: 'weekly',
    }))
  } catch {
    // Si Supabase falla, el sitemap igual funciona sin marcas
  }

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes]
}
