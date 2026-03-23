// scripts/scrape-levis.mjs
// Scraper de Levi's México via API pública VTEX → Supabase
// Uso: node scripts/scrape-levis.mjs
//
// El sitio real de Levi's MX es www.levi.com.mx (VTEX, API pública)
// No requiere Playwright ni proxies.

import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ─── Config — lee .env.local automáticamente ──────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
try {
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length && !process.env[k.trim()]) {
      process.env[k.trim()] = v.join('=').trim()
    }
  })
} catch { /* .env.local opcional */ }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local')
  process.exit(1)
}
const ADMITAD_BASE = 'https://heqgr.com/g/31ueucbr2o674ad4a8071cdb375fa2/'
const LEVIS_BASE   = 'https://www.levi.com.mx'
const PAGE_SIZE    = 50  // VTEX soporta hasta 50 por request

// Categorías VTEX de Levi's México (IDs reales del árbol de categorías)
const CATEGORIES = [
  // Hombre
  { query: 'Hombre/Bottoms/Jeans',              categoria: 'Hombre', subcategoria: 'Jeans',         genero: 'Hombre' },
  { query: 'Hombre/Bottoms/Pantalones y Shorts', categoria: 'Hombre', subcategoria: 'Pantalones',    genero: 'Hombre' },
  { query: 'Hombre/Tops/Camisas y Playeras',    categoria: 'Hombre', subcategoria: 'Camisas',        genero: 'Hombre' },
  { query: 'Hombre/Tops/Chamarras y Outerwear', categoria: 'Hombre', subcategoria: 'Chamarras',      genero: 'Hombre' },
  { query: 'Hombre/Tops/Sudaderas y Sweaters',  categoria: 'Hombre', subcategoria: 'Sudaderas',      genero: 'Hombre' },
  { query: 'Hombre/Accesorios',                 categoria: 'Hombre', subcategoria: 'Accesorios',     genero: 'Hombre' },
  // Mujer
  { query: 'Mujer/Bottoms/Jeans',               categoria: 'Mujer',  subcategoria: 'Jeans',         genero: 'Mujer'  },
  { query: 'Mujer/Bottoms/Pantalones',          categoria: 'Mujer',  subcategoria: 'Pantalones',    genero: 'Mujer'  },
  { query: 'Mujer/Bottoms/Shorts y Faldas',     categoria: 'Mujer',  subcategoria: 'Shorts',        genero: 'Mujer'  },
  { query: 'Mujer/Tops/Blusas y Playeras',      categoria: 'Mujer',  subcategoria: 'Blusas',        genero: 'Mujer'  },
  { query: 'Mujer/Tops/Chamarras y Outerwear',  categoria: 'Mujer',  subcategoria: 'Chamarras',     genero: 'Mujer'  },
  { query: 'Mujer/Tops/Sudaderas y Sweaters',   categoria: 'Mujer',  subcategoria: 'Sudaderas',     genero: 'Mujer'  },
  { query: 'Mujer/Tops/Vestidos y One Pieces',  categoria: 'Mujer',  subcategoria: 'Vestidos',      genero: 'Mujer'  },
  { query: 'Mujer/Accesorios',                  categoria: 'Mujer',  subcategoria: 'Accesorios',    genero: 'Mujer'  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function levisIdToUuid(id) {
  const hash = createHash('sha256').update(`levis:${id}`).digest('hex')
  return [
    hash.slice(0, 8), hash.slice(8, 12),
    '4' + hash.slice(13, 16),
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join('-')
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').substring(0, 80)
}

function buildAffiliateUrl(url) {
  return `${ADMITAD_BASE}?ulp=${encodeURIComponent(url)}`
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

/**
 * Extrae solo la talla limpia del nombre completo de un SKU VTEX.
 * Levi's MX incluye nombre + SKU + talla en item.name. Ejemplos reales:
 *   "555® Relaxed Straight Jeans Levi's® 33x30"       → "33x30"
 *   "501® Original Fit 00501-0660 40x32"              → "40x32"
 *   "Short Sleeve Classic Pocket Tee 19342-0161 XL"   → "XL"
 *   "High-Waisted Mom Shorts A1965-0001 27"           → "27"
 *   "501® Jeans 00501-0193 36 34"                     → "36x34"
 */
function extractSize(itemName) {
  if (!itemName) return null
  const s = itemName.trim()

  // 1. Pantalones/Jeans: WxL al final, waist realista 24-50, largo 26-36
  //    Excluye patrones de SKU como "0001 27" donde el primer número empieza en 0
  const jeansX = s.match(/\b([2-4]\d)[x]([2-3]\d)\s*$/i)
  if (jeansX) return `${jeansX[1]}x${jeansX[2]}`

  // 2. Pantalones: "W L" (espacio) al final — waist 24-50, largo 26-36
  //    CUIDADO: solo si el primer número NO está precedido de 0 (evitar SKUs como 0001)
  const jeansSpace = s.match(/(?<![0-9])([2-4]\d)\s([2-3]\d)\s*$/)
  if (jeansSpace) return `${jeansSpace[1]}x${jeansSpace[2]}`

  // 3. Ropa: XS/S/M/L/XL/XXL etc. al final (precedida de espacio o inicio)
  const ropaMatch = s.match(/(?<=\s)(3XL|XXL|2XL|XL|XXS|XS|[SMLG])\s*$/i)
  if (ropaMatch) return ropaMatch[1].toUpperCase()

  // 4. Talla numérica al final (shorts mujer 24-36, calzado 22-32)
  //    Solo si el número NO está pegado a un código SKU tipo "0001 27" → sí queremos "27"
  //    pero no "0001" en sí mismo
  const numMatch = s.match(/(?<=[\s-])([2-3]\d(?:\.\d)?)\s*$/)
  if (numMatch) return numMatch[1]

  return null
}

// ─── Fetch VTEX API ───────────────────────────────────────────────────────────

async function fetchVtexProducts(categoryQuery, from = 0) {
  // VTEX permite buscar por path de categoría con map=c,c,c
  const categoryParts = categoryQuery.split('/')
  const map = categoryParts.map(() => 'c').join(',')
  const q = categoryParts.join('/')

  const url = `${LEVIS_BASE}/api/catalog_system/pub/products/search/${encodeURIComponent(q)}` +
    `?map=${map}&_from=${from}&_to=${from + PAGE_SIZE - 1}&O=OrderByScoreDESC`

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; BiuBan affiliate aggregator)',
    },
  })

  if (!res.ok) {
    // Intentar con búsqueda por fullText como fallback
    const fallbackUrl = `${LEVIS_BASE}/api/catalog_system/pub/products/search` +
      `?q=${encodeURIComponent(categoryParts[categoryParts.length - 1])}` +
      `&_from=${from}&_to=${from + PAGE_SIZE - 1}&O=OrderByScoreDESC`
    const res2 = await fetch(fallbackUrl, { headers: { 'Accept': 'application/json' } })
    if (!res2.ok) throw new Error(`HTTP ${res2.status} para ${categoryQuery}`)
    return res2.json()
  }

  return res.json()
}

// ─── Transformar producto VTEX → fila Supabase ────────────────────────────────

function transformVtexProduct(vtex, categoria, subcategoria, genero) {
  const name = vtex.productName?.trim() ?? ''
  if (!name) return null

  // Precio: tomar el menor precio disponible entre todos los SKUs
  let price = Infinity
  let originalPrice = null
  let image = ''
  let sizes = []
  let color = null
  let available = false
  const additionalImages = []

  for (const item of vtex.items ?? []) {
    const seller = item.sellers?.[0]
    const offer  = seller?.commertialOffer

    if (!offer) continue

    const itemPrice = offer.Price ?? 0
    const listPrice = offer.ListPrice ?? null
    const inStock   = (offer.AvailableQuantity ?? 0) > 0

    if (inStock && itemPrice > 0 && itemPrice < price) {
      price = itemPrice
      originalPrice = listPrice && listPrice > itemPrice ? listPrice : null
      available = true
    }

    // Tallas — extraer talla limpia + guardar waist por separado para filtros
    const cleanSize = extractSize(item.name)
    if (cleanSize && inStock) {
      if (!sizes.includes(cleanSize)) sizes.push(cleanSize)
      // Para jeans (28x32): también guardar el waist "28" suelto
      // así el filtro de cintura funciona con overlaps exacto en BD
      if (cleanSize.includes('x')) {
        const waist = cleanSize.split('x')[0]
        if (!sizes.includes(waist)) sizes.push(waist)
      }
    }

    // Color
    if (!color && item.variations) {
      for (const v of item.variations) {
        if (v.toLowerCase().includes('color') || v.toLowerCase().includes('colour')) {
          color = item.variationValues?.[v]?.[0] ?? null
          break
        }
      }
    }

    // Imagen (solo del primer SKU)
    if (!image && item.images?.length) {
      image = item.images[0].imageUrl ?? ''
      // Imágenes adicionales
      for (const img of item.images.slice(1, 5)) {
        if (img.imageUrl) additionalImages.push(img.imageUrl)
      }
    }
  }

  if (price === Infinity || price === 0) return null

  const productUrl = vtex.link ?? `${LEVIS_BASE}/${vtex.linkText}/p`
  const discount = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : null

  // Dimensiones para categoría más precisa
  const catPath = vtex.categories?.[0] ?? ''

  return {
    id:               levisIdToUuid(vtex.productId),
    slug:             slugify(`${name}-${vtex.productId}`),
    sku:              vtex.productReference ?? vtex.productId,
    name,
    brand:            vtex.brand ?? "Levi's",
    description:      vtex.description?.replace(/<[^>]+>/g, '').trim() || name,
    store:            "Levi's",
    store_type:       'admitad',
    price,
    original_price:   originalPrice,
    discount:         discount ?? null,
    image:            image.replace(/-\d+x\d+\./, '.'), // quitar sufijo de tamaño
    url:              buildAffiliateUrl(productUrl),
    category:         categoria,
    subcategory:      subcategoria,
    gender:           genero,
    color,
    material:         null,
    sizes_available:  sizes.length ? [...new Set(sizes)] : null,
    available,
    is_new:           false,
    on_sale:          (discount ?? 0) > 0,
    trending:         false,
    best_option:      false,
    free_shipping:    false,
    rating:           null,
    review_count:     0,
    additional_images: additionalImages.length ? additionalImages : null,
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Scraper Levi's MX — VTEX API pública (sin proxies, 100% legal)\n")

  const stats = { total_fetched: 0, total_inserted: 0, total_skipped: 0, total_errors: 0, errors: [] }
  const seenIds = new Set()

  for (const cat of CATEGORIES) {
    console.log(`\n📂 ${cat.genero} › ${cat.subcategoria}`)
    let from = 0
    let keepFetching = true

    while (keepFetching) {
      try {
        const products = await fetchVtexProducts(cat.query, from)

        if (!Array.isArray(products) || products.length === 0) {
          keepFetching = false
          break
        }

        console.log(`   📄 offset ${from}: ${products.length} productos`)

        const rows = []
        for (const p of products) {
          if (seenIds.has(p.productId)) { stats.total_skipped++; continue }
          seenIds.add(p.productId)

          const row = transformVtexProduct(p, cat.categoria, cat.subcategoria, cat.genero)
          if (row) rows.push(row)
        }

        if (rows.length > 0) {
          const { error } = await supabase
            .from('products')
            .upsert(rows, { onConflict: 'id', ignoreDuplicates: false })

          if (error) {
            console.error(`   ❌ Supabase: ${error.message}`)
            stats.total_errors++
            stats.errors.push(`${cat.query} @${from}: ${error.message}`)
          } else {
            stats.total_fetched  += products.length
            stats.total_inserted += rows.length
            console.log(`   ✅ ${rows.length} insertados`)
          }
        }

        // Si devolvió menos del PAGE_SIZE, no hay más
        if (products.length < PAGE_SIZE) {
          keepFetching = false
        } else {
          from += PAGE_SIZE
          await delay(300) // respetar rate limit
        }

      } catch (err) {
        console.error(`   ❌ ${err.message}`)
        stats.total_errors++
        stats.errors.push(`${cat.query} @${from}: ${err.message}`)
        keepFetching = false
      }
    }
  }

  console.log('\n' + '═'.repeat(55))
  console.log('📊 RESUMEN FINAL:')
  console.log(`   Productos extraídos:   ${stats.total_fetched}`)
  console.log(`   Insertados en BD:      ${stats.total_inserted}`)
  console.log(`   Duplicados saltados:   ${stats.total_skipped}`)
  console.log(`   Errores:               ${stats.total_errors}`)
  if (stats.errors.length) {
    console.log('\n   Errores:')
    stats.errors.forEach(e => console.log(`   - ${e}`))
  }
  console.log('═'.repeat(55))
  console.log('✅ Listo!\n')
}

main().catch(console.error)
