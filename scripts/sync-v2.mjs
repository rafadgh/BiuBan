/**
 * sync-v2.mjs — Scraper de páginas de ML (no usa el API de búsqueda bloqueado)
 * Estrategia: Trending keywords → scrape de páginas de listado → insertar en Supabase
 *
 * Uso: node scripts/sync-v2.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(join(__dir, '../.env.local'), 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const [k, ...v] = line.split('=')
  if (k && v.length) env[k.trim()] = v.join('=').trim()
}

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])
const USER_TOKEN  = env['ML_USER_TOKEN']
const AFFILIATE   = 'diezrafa20230122100014'

// ─── Headers de browser para scraping ────────────────────────────────────────
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Referer': 'https://www.mercadolibre.com.mx/',
  'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Upgrade-Insecure-Requests': '1',
}

// ─── Búsquedas objetivo (keywords de moda que queremos) ──────────────────────
const FASHION_QUERIES = [
  { q: 'tenis nike hombre',     categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Hombre' },
  { q: 'tenis nike mujer',      categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Mujer'  },
  { q: 'tenis adidas hombre',   categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Hombre' },
  { q: 'tenis adidas mujer',    categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Mujer'  },
  { q: 'tenis puma',            categoria: 'Calzado',    subcategoria: 'Tenis',      genero: null     },
  { q: 'tenis vans',            categoria: 'Calzado',    subcategoria: 'Tenis',      genero: null     },
  { q: 'tenis converse',        categoria: 'Calzado',    subcategoria: 'Tenis',      genero: null     },
  { q: 'tenis new balance',     categoria: 'Calzado',    subcategoria: 'Tenis',      genero: null     },
  { q: 'vestido mujer',         categoria: 'Mujer',      subcategoria: 'Vestidos',   genero: 'Mujer'  },
  { q: 'blusa mujer',           categoria: 'Mujer',      subcategoria: 'Blusas',     genero: 'Mujer'  },
  { q: 'jeans levis mujer',     categoria: 'Mujer',      subcategoria: 'Jeans',      genero: 'Mujer'  },
  { q: 'jeans levis hombre',    categoria: 'Hombre',     subcategoria: 'Jeans',      genero: 'Hombre' },
  { q: 'sudadera nike hombre',  categoria: 'Hombre',     subcategoria: 'Sudaderas',  genero: 'Hombre' },
  { q: 'chamarra hombre moda',  categoria: 'Hombre',     subcategoria: 'Chamarras',  genero: 'Hombre' },
  { q: 'polo tommy hilfiger',   categoria: 'Hombre',     subcategoria: 'Polos',      genero: 'Hombre' },
  { q: 'bolsa mujer guess',     categoria: 'Accesorios', subcategoria: 'Bolsas',     genero: 'Mujer'  },
  { q: 'ropa deportiva mujer',  categoria: 'Mujer',      subcategoria: 'Deportivo',  genero: 'Mujer'  },
  { q: 'conjunto deportivo',    categoria: 'Deportes',   subcategoria: 'Conjuntos',  genero: null     },
  { q: 'playera hombre moda',   categoria: 'Hombre',     subcategoria: 'Playeras',   genero: 'Hombre' },
  { q: 'pantalon mujer moda',   categoria: 'Mujer',      subcategoria: 'Pantalones', genero: 'Mujer'  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function mlIdToUuid(id) {
  const h = createHash('sha256').update(`ml:${id}`).digest('hex')
  return [h.slice(0,8),h.slice(8,12),'4'+h.slice(13,16),((parseInt(h[16],16)&3)|8).toString(16)+h.slice(17,20),h.slice(20,32)].join('-')
}
function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,80)
}
function affiliateUrl(url) {
  return url + (url.includes('?') ? '&' : '?') + `matt_tool=${AFFILIATE}&matt_source=affiliate&matt_campaign=biuban`
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── Scraper de página de listado de ML ──────────────────────────────────────
async function scrapeMLListing(query) {
  // Construir URL de búsqueda de ML
  const q = encodeURIComponent(query)
  const url = `https://listado.mercadolibre.com.mx/${q.replace(/%20/g, '-')}#D[A:${q}]`
  const url2 = `https://www.mercadolibre.com.mx/buscar?q=${q}&noIndex=true`

  for (const searchUrl of [url2, url]) {
    try {
      const res = await fetch(searchUrl, { headers: BROWSER_HEADERS })
      if (!res.ok) continue
      const html = await res.text()

      // Extraer JSON de Next.js / script tags
      const products = extractProductsFromHTML(html)
      if (products.length > 0) return products
    } catch(e) {
      // Silently continue to next URL
    }
  }
  return []
}

function extractProductsFromHTML(html) {
  const products = []

  // Patrón 1: JSON embebido en script tags (Next.js __NEXT_DATA__)
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (nextDataMatch) {
    try {
      const nextData = JSON.parse(nextDataMatch[1])
      const items = findItemsInObject(nextData)
      products.push(...items)
    } catch {}
  }

  // Patrón 2: window.__PRELOADED_STATE__ o similar
  const stateMatch = html.match(/window\.__(?:PRELOADED_STATE|INITIAL_STATE|state)__\s*=\s*({[\s\S]*?});?\s*<\/script>/)
  if (stateMatch) {
    try {
      const state = JSON.parse(stateMatch[1])
      const items = findItemsInObject(state)
      products.push(...items)
    } catch {}
  }

  // Patrón 3: JSON-LD schema
  const schemaMatches = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
  for (const m of schemaMatches) {
    try {
      const schema = JSON.parse(m[1])
      if (schema['@type'] === 'Product' || schema.offers) {
        products.push(normalizeSchemaProduct(schema))
      }
      if (schema.itemListElement) {
        for (const el of schema.itemListElement) {
          if (el.item) products.push(normalizeSchemaProduct(el.item))
        }
      }
    } catch {}
  }

  // Patrón 4: Buscar objetos de producto en cualquier script
  const scriptMatches = html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)
  for (const m of scriptMatches) {
    const content = m[1]
    if (content.includes('"price"') && content.includes('"title"') && content.includes('mercadolibre')) {
      const jsonMatches = content.matchAll(/\{[^{}]*?"price"\s*:\s*\d+[^{}]*?"title"[^{}]*?\}/g)
      for (const jm of jsonMatches) {
        try {
          const obj = JSON.parse(jm[0])
          if (obj.price && obj.title) products.push(obj)
        } catch {}
      }
    }
  }

  return products.filter(p => p && p.id && p.price && p.title)
}

function findItemsInObject(obj, depth = 0) {
  if (depth > 10 || !obj || typeof obj !== 'object') return []
  const results = []

  // Si este objeto parece un producto de ML
  if (obj.id && typeof obj.id === 'string' && obj.id.startsWith('MLM') && obj.price && obj.title) {
    results.push(obj)
    return results
  }

  // Si es un array, revisar cada elemento
  if (Array.isArray(obj)) {
    for (const item of obj) {
      results.push(...findItemsInObject(item, depth + 1))
    }
    return results
  }

  // Si es un objeto, revisar claves relevantes
  const relevantKeys = ['results', 'items', 'products', 'listings', 'itemList', 'data', 'payload', 'initialState']
  for (const key of relevantKeys) {
    if (obj[key]) results.push(...findItemsInObject(obj[key], depth + 1))
  }

  return results
}

function normalizeSchemaProduct(schema) {
  return {
    id: schema['@id'] || schema.productID || null,
    title: schema.name || '',
    price: schema.offers?.price || schema.price || 0,
    original_price: null,
    thumbnail: schema.image?.[0] || schema.image || '',
    permalink: schema.offers?.url || schema.url || '',
    condition: 'new',
    free_shipping: false,
    sold_quantity: 0,
    seller: { nickname: 'Mercado Libre' },
    attributes: [],
    shipping: { free_shipping: false },
    tags: [],
  }
}

// ─── Transformar producto a fila de Supabase ──────────────────────────────────
function transform(item, categoria, subcategoria, genero) {
  const price    = Number(item.price) || 0
  const origP    = item.original_price ? Number(item.original_price) : null
  const discount = origP && origP > price ? Math.round((1 - price/origP) * 100) : null
  const img      = (item.thumbnail || item.pictures?.[0]?.url || '').replace(/\/\d+-\//, '/500-/').replace('http://', 'https://')
  const link     = item.permalink || ''
  const brand    = item.attributes?.find(a => a.id === 'BRAND')?.value_name || null
  const color    = item.attributes?.find(a => a.id === 'COLOR')?.value_name || null
  const id       = item.id || item.sku || ''

  if (!id || !price || price < 10) return null

  return {
    id:              mlIdToUuid(id),
    slug:            slugify(`${item.title}-${id}`),
    sku:             id,
    name:            item.title,
    brand:           brand || 'Sin marca',
    description:     item.title,
    store:           item.seller?.nickname || 'Mercado Libre',
    store_type:      'mercadolibre',
    price,
    original_price:  origP,
    discount,
    image:           img,
    url:             affiliateUrl(link),
    category:        categoria,
    subcategory:     subcategoria || null,
    gender:          item.attributes?.find(a => a.id === 'GENDER')?.value_name || genero || null,
    color,
    material:        item.attributes?.find(a => a.id === 'MATERIAL')?.value_name || null,
    sizes_available: item.attributes?.filter(a => a.id === 'SIZE' && a.value_name).map(a => a.value_name) || null,
    available:       true,
    is_new:          item.condition === 'new',
    on_sale:         discount !== null && discount > 0,
    trending:        (item.sold_quantity || 0) > 100,
    best_option:     false,
    free_shipping:   item.shipping?.free_shipping || false,
    rating:          null,
    review_count:    null,
    additional_images: null,
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log('\n🚀 BiuBan Sync v2 — scraping ML listings\n')

let totalFound = 0, totalInserted = 0, totalErrors = 0

for (const target of FASHION_QUERIES) {
  process.stdout.write(`⏳ "${target.q}" ... `)
  try {
    const rawProducts = await scrapeMLListing(target.q)

    if (rawProducts.length === 0) {
      console.log('⚠️  0 productos extraídos del HTML')
      continue
    }

    const rows = rawProducts.map(p => transform(p, target.categoria, target.subcategoria, target.genero)).filter(Boolean)
    totalFound += rows.length

    if (rows.length === 0) {
      console.log('⚠️  0 filas válidas')
      continue
    }

    const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id', ignoreDuplicates: false })
    if (error) {
      console.log(`❌ Supabase: ${error.message}`)
      totalErrors++
    } else {
      totalInserted += rows.length
      console.log(`✅ ${rows.length} productos`)
    }
  } catch(e) {
    console.log(`💥 ${e.message.slice(0, 80)}`)
    totalErrors++
  }
  await sleep(800 + Math.random() * 400)
}

console.log(`\n📊 Resumen:`)
console.log(`   Productos encontrados: ${totalFound}`)
console.log(`   Insertados/actualizados: ${totalInserted}`)
console.log(`   Errores: ${totalErrors}`)
console.log()
