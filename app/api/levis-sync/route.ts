// app/api/levis-sync/route.ts
// Sincronización de productos Levi's México → Supabase
// Fuente: API pública VTEX de www.levi.com.mx (sin scraping, sin proxies)
// Cron: cada 12 horas vía vercel.json

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

export const maxDuration = 60

// ─── Constantes ───────────────────────────────────────────────────────────────

const ADMITAD_BASE = 'https://heqgr.com/g/31ueucbr2o674ad4a8071cdb375fa2/'
const LEVIS_BASE   = 'https://www.levi.com.mx'
const PAGE_SIZE    = 50

const CATEGORIES = [
  // Hombre
  { query: 'Hombre/Bottoms/Jeans',               categoria: 'Hombre', subcategoria: 'Jeans',      genero: 'Hombre' },
  { query: 'Hombre/Bottoms/Pantalones y Shorts',  categoria: 'Hombre', subcategoria: 'Pantalones', genero: 'Hombre' },
  { query: 'Hombre/Tops/Camisas y Playeras',      categoria: 'Hombre', subcategoria: 'Camisas',    genero: 'Hombre' },
  { query: 'Hombre/Tops/Chamarras y Outerwear',   categoria: 'Hombre', subcategoria: 'Chamarras',  genero: 'Hombre' },
  { query: 'Hombre/Tops/Sudaderas y Sweaters',    categoria: 'Hombre', subcategoria: 'Sudaderas',  genero: 'Hombre' },
  { query: 'Hombre/Accesorios',                   categoria: 'Hombre', subcategoria: 'Accesorios', genero: 'Hombre' },
  // Mujer
  { query: 'Mujer/Bottoms/Jeans',                 categoria: 'Mujer',  subcategoria: 'Jeans',      genero: 'Mujer'  },
  { query: 'Mujer/Bottoms/Pantalones',            categoria: 'Mujer',  subcategoria: 'Pantalones', genero: 'Mujer'  },
  { query: 'Mujer/Bottoms/Shorts y Faldas',       categoria: 'Mujer',  subcategoria: 'Shorts',     genero: 'Mujer'  },
  { query: 'Mujer/Tops/Blusas y Playeras',        categoria: 'Mujer',  subcategoria: 'Blusas',     genero: 'Mujer'  },
  { query: 'Mujer/Tops/Chamarras y Outerwear',    categoria: 'Mujer',  subcategoria: 'Chamarras',  genero: 'Mujer'  },
  { query: 'Mujer/Tops/Sudaderas y Sweaters',     categoria: 'Mujer',  subcategoria: 'Sudaderas',  genero: 'Mujer'  },
  { query: 'Mujer/Tops/Vestidos y One Pieces',    categoria: 'Mujer',  subcategoria: 'Vestidos',   genero: 'Mujer'  },
  { query: 'Mujer/Accesorios',                    categoria: 'Mujer',  subcategoria: 'Accesorios', genero: 'Mujer'  },
]

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function levisIdToUuid(id: string): string {
  const hash = createHash('sha256').update(`levis:${id}`).digest('hex')
  return [
    hash.slice(0, 8), hash.slice(8, 12),
    '4' + hash.slice(13, 16),
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join('-')
}

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').substring(0, 80)
}

function buildAffiliateUrl(url: string): string {
  return `${ADMITAD_BASE}?ulp=${encodeURIComponent(url)}`
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * Extrae solo la talla limpia del nombre completo de un SKU VTEX.
 * Levi's MX incluye el nombre del producto en item.name, ej:
 *   "555® Relaxed Straight Jeans 33x30"  → "33x30"
 *   "501® Original Fit 00501-0660 40x32" → "40x32"
 *   "Short Sleeve Tee M"                 → "M"
 */
function extractSize(itemName: string): string | null {
  if (!itemName) return null
  const s = itemName.trim()
  // 1. Pantalones: WxL al final, waist 24-50, largo 26-36
  const jeansX = s.match(/\b([2-4]\d)[x]([2-3]\d)\s*$/i)
  if (jeansX) return `${jeansX[1]}x${jeansX[2]}`
  // 2. Pantalones: "W L" con espacio, waist no precedido de 0 (evita SKUs)
  const jeansSpace = s.match(/(?<![0-9])([2-4]\d)\s([2-3]\d)\s*$/)
  if (jeansSpace) return `${jeansSpace[1]}x${jeansSpace[2]}`
  // 3. Ropa: XS/S/M/L/XL/XXL precedida de espacio
  const ropaMatch = s.match(/(?<=\s)(3XL|XXL|2XL|XL|XXS|XS|[SMLG])\s*$/i)
  if (ropaMatch) return ropaMatch[1].toUpperCase()
  // 4. Numérico al final precedido de espacio/guión (shorts, calzado 24-39)
  const numMatch = s.match(/(?<=[\s-])([2-3]\d(?:\.\d)?)\s*$/)
  if (numMatch) return numMatch[1]
  return null
}

// ─── Fetch VTEX API ───────────────────────────────────────────────────────────

async function fetchVtexProducts(categoryQuery: string, from: number): Promise<VtexProduct[]> {
  const parts = categoryQuery.split('/')
  const map   = parts.map(() => 'c').join(',')
  const path  = parts.join('/')

  const url = `${LEVIS_BASE}/api/catalog_system/pub/products/search/${encodeURIComponent(path)}`
    + `?map=${map}&_from=${from}&_to=${from + PAGE_SIZE - 1}&O=OrderByScoreDESC`

  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'BiuBan/1.0' },
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`VTEX HTTP ${res.status} para ${categoryQuery}`)
  return res.json() as Promise<VtexProduct[]>
}

// ─── Tipos VTEX ───────────────────────────────────────────────────────────────

interface VtexOffer {
  Price:              number
  ListPrice:          number
  AvailableQuantity:  number
}

interface VtexImage {
  imageUrl:   string
  imageLabel: string
}

interface VtexItem {
  name:       string
  images:     VtexImage[]
  sellers:    Array<{ commertialOffer: VtexOffer }>
  variations?: string[]
}

interface VtexProduct {
  productId:         string
  productName:       string
  productReference:  string
  brand:             string
  description:       string
  link:              string
  linkText:          string
  categories:        string[]
  items:             VtexItem[]
}

// ─── Transformar VTEX → Supabase ──────────────────────────────────────────────

function transformProduct(
  vtex: VtexProduct,
  categoria: string,
  subcategoria: string,
  genero: string,
) {
  const name = vtex.productName?.trim() ?? ''
  if (!name) return null

  let price        = Infinity
  let originalPrice: number | null = null
  let image        = ''
  let available    = false
  const sizes: string[]  = []
  const extraImages: string[] = []

  for (const item of vtex.items ?? []) {
    const offer    = item.sellers?.[0]?.commertialOffer
    if (!offer) continue

    const itemPrice = offer.Price ?? 0
    const listPrice = offer.ListPrice ?? 0
    const inStock   = (offer.AvailableQuantity ?? 0) > 0

    if (inStock && itemPrice > 0 && itemPrice < price) {
      price         = itemPrice
      originalPrice = listPrice > itemPrice ? listPrice : null
      available     = true
    }

    // Tallas — extraer talla limpia + guardar waist por separado para filtros
    const cleanSize = extractSize(item.name)
    if (cleanSize && inStock) {
      if (!sizes.includes(cleanSize)) sizes.push(cleanSize)
      // Para jeans (28x32): también guardar el waist "28" suelto
      if (cleanSize.includes('x')) {
        const waist = cleanSize.split('x')[0]
        if (!sizes.includes(waist)) sizes.push(waist)
      }
    }

    // Imagen principal (primer SKU)
    if (!image && item.images?.length) {
      image = item.images[0].imageUrl ?? ''
      for (const img of item.images.slice(1, 5)) {
        if (img.imageUrl && !extraImages.includes(img.imageUrl)) {
          extraImages.push(img.imageUrl)
        }
      }
    }
  }

  if (price === Infinity || price === 0) return null

  const productUrl = vtex.link ?? `${LEVIS_BASE}/${vtex.linkText}/p`
  const discount   = originalPrice ? Math.round((1 - price / originalPrice) * 100) : null

  // Limpiar descripción de HTML
  const description = vtex.description
    ? vtex.description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    : name

  return {
    id:               levisIdToUuid(vtex.productId),
    slug:             slugify(`${name}-${vtex.productId}`),
    sku:              vtex.productReference ?? vtex.productId,
    name,
    brand:            vtex.brand ?? "Levi's",
    description:      description.substring(0, 500),
    store:            "Levi's",
    store_type:       'admitad',
    price,
    original_price:   originalPrice,
    discount:         discount ?? null,
    image:            image.replace(/-\d+x\d+\./, '.'), // quitar tamaño del sufijo
    url:              buildAffiliateUrl(productUrl),
    category:         categoria,
    subcategory:      subcategoria,
    gender:           genero,
    color:            null,   // VTEX no lo expone de forma estándar en search
    material:         null,   // Disponible solo en la página de detalle
    sizes_available:  sizes.length ? [...new Set(sizes)] : null,
    available,
    is_new:           false,
    on_sale:          (discount ?? 0) > 0,
    trending:         false,
    best_option:      false,
    free_shipping:    false,
    rating:           null,   // No disponible en VTEX search API
    review_count:     0,
    additional_images: extraImages.length ? extraImages : null,
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Autenticación — omitir en desarrollo local
  const secret = req.nextUrl.searchParams.get('secret')
  if (process.env.NODE_ENV === 'production' && secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Opcionalmente filtrar por categoría para sync incremental
  const soloCategoria = req.nextUrl.searchParams.get('categoria')
  const targets = soloCategoria
    ? CATEGORIES.filter(c => c.query.toLowerCase().includes(soloCategoria.toLowerCase()))
    : CATEGORIES

  const stats = {
    total_fetched:  0,
    total_inserted: 0,
    total_errors:   0,
    categories:     [] as string[],
    errors_detail:  [] as string[],
  }

  const seenIds = new Set<string>()
  const startTime = Date.now()
  const TIME_LIMIT_MS = 55_000 // dejar 5s de margen antes del timeout de Vercel

  for (const cat of targets) {
    // Cortar si nos acercamos al límite de tiempo
    if (Date.now() - startTime > TIME_LIMIT_MS) {
      stats.errors_detail.push('⏱ Límite de tiempo alcanzado — usar ?categoria= para sync incremental')
      break
    }

    let from = 0
    let keepFetching = true

    while (keepFetching) {
      if (Date.now() - startTime > TIME_LIMIT_MS) { keepFetching = false; break }

      try {
        const products = await fetchVtexProducts(cat.query, from)

        if (!Array.isArray(products) || products.length === 0) { keepFetching = false; break }

        const rows = products
          .filter(p => !seenIds.has(p.productId) && (() => { seenIds.add(p.productId); return true })())
          .map(p => transformProduct(p, cat.categoria, cat.subcategoria, cat.genero))
          .filter(Boolean) as ReturnType<typeof transformProduct>[]

        stats.total_fetched += products.length

        if (rows.length > 0) {
          const { error } = await supabase
            .from('products')
            .upsert(rows, { onConflict: 'id', ignoreDuplicates: false })

          if (error) {
            stats.total_errors++
            stats.errors_detail.push(`${cat.query}: ${error.message}`)
          } else {
            stats.total_inserted += rows.length
            if (!stats.categories.includes(cat.categoria)) stats.categories.push(cat.categoria)
          }
        }

        keepFetching = products.length >= PAGE_SIZE
        if (keepFetching) { from += PAGE_SIZE; await delay(200) }

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        stats.total_errors++
        stats.errors_detail.push(`${cat.query} @${from}: ${msg}`)
        keepFetching = false
      }
    }
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000)

  return NextResponse.json({
    ok:      true,
    message: `✅ Sync Levi's completado en ${elapsed}s`,
    stats,
  })
}
