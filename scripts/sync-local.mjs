/**
 * sync-local.mjs — Corre desde tu Mac en México
 * Jala productos de ML y los mete a Supabase
 *
 * Uso: node scripts/sync-local.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// ─── Leer .env.local manualmente ─────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '../.env.local')
const envVars = {}
try {
  const envContent = readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) envVars[key.trim()] = rest.join('=').trim()
  }
} catch {
  console.error('❌ No se pudo leer .env.local')
  process.exit(1)
}

const SUPABASE_URL    = envVars['NEXT_PUBLIC_SUPABASE_URL']
const SUPABASE_KEY    = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
const ML_CLIENT_ID    = envVars['ML_CLIENT_ID']
const ML_CLIENT_SECRET = envVars['ML_CLIENT_SECRET']
const ML_USER_TOKEN   = envVars['ML_USER_TOKEN']
const AFFILIATE_ID    = 'diezrafa20230122100014'
const ML_SITE         = 'MLM'
const LIMIT           = 50

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Token ────────────────────────────────────────────────────────────────────
let cachedToken = null

async function getToken() {
  if (ML_USER_TOKEN) return ML_USER_TOKEN
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token
  const res = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: ML_CLIENT_ID, client_secret: ML_CLIENT_SECRET }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Token error: ${JSON.stringify(data)}`)
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return cachedToken.token
}

// ─── Utilidades ───────────────────────────────────────────────────────────────
function mlIdToUuid(mlId) {
  const hash = createHash('sha256').update(`ml:${mlId}`).digest('hex')
  return [hash.slice(0,8), hash.slice(8,12), '4'+hash.slice(13,16),
    ((parseInt(hash[16],16)&0x3)|0x8).toString(16)+hash.slice(17,20), hash.slice(20,32)].join('-')
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').substring(0,80)
}

function betterImage(thumbnail) {
  return thumbnail.replace(/\/\d+-/, '/500-').replace('http://', 'https://')
}

function getAttribute(attributes, id) {
  return attributes?.find(a => a.id === id)?.value_name ?? null
}

function buildAffiliateUrl(permalink) {
  const sep = permalink.includes('?') ? '&' : '?'
  return `${permalink}${sep}matt_tool=${AFFILIATE_ID}&matt_source=affiliate&matt_campaign=biuban`
}

// ─── Queries ──────────────────────────────────────────────────────────────────
const QUERIES = [
  // Categorías generales
  { q: 'vestido mujer',         categoria: 'Mujer',      subcategoria: 'Vestidos',   genero: 'Mujer',  pages: 3 },
  { q: 'blusa mujer moda',      categoria: 'Mujer',      subcategoria: 'Blusas',     genero: 'Mujer',  pages: 2 },
  { q: 'pantalon mujer',        categoria: 'Mujer',      subcategoria: 'Pantalones', genero: 'Mujer',  pages: 2 },
  { q: 'falda mujer',           categoria: 'Mujer',      subcategoria: 'Faldas',     genero: 'Mujer',  pages: 1 },
  { q: 'chamarra mujer',        categoria: 'Mujer',      subcategoria: 'Chamarras',  genero: 'Mujer',  pages: 1 },
  { q: 'ropa deportiva mujer',  categoria: 'Mujer',      subcategoria: 'Deportivo',  genero: 'Mujer',  pages: 2 },
  { q: 'camisa hombre moda',    categoria: 'Hombre',     subcategoria: 'Camisas',    genero: 'Hombre', pages: 2 },
  { q: 'pantalon hombre',       categoria: 'Hombre',     subcategoria: 'Pantalones', genero: 'Hombre', pages: 2 },
  { q: 'chamarra hombre',       categoria: 'Hombre',     subcategoria: 'Chamarras',  genero: 'Hombre', pages: 1 },
  { q: 'polo hombre',           categoria: 'Hombre',     subcategoria: 'Polos',      genero: 'Hombre', pages: 1 },
  { q: 'ropa deportiva hombre', categoria: 'Hombre',     subcategoria: 'Deportivo',  genero: 'Hombre', pages: 2 },
  { q: 'tenis mujer',           categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Mujer',  pages: 2 },
  { q: 'tenis hombre',          categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Hombre', pages: 2 },
  { q: 'botas mujer',           categoria: 'Calzado',    subcategoria: 'Botas',      genero: 'Mujer',  pages: 1 },
  { q: 'bolsa mujer moda',      categoria: 'Accesorios', subcategoria: 'Bolsas',     genero: 'Mujer',  pages: 2 },
  { q: 'lentes sol moda',       categoria: 'Accesorios', subcategoria: 'Lentes',                       pages: 1 },
  { q: 'reloj moda',            categoria: 'Accesorios', subcategoria: 'Relojes',                      pages: 1 },
  { q: 'conjunto deportivo',    categoria: 'Deportes',   subcategoria: 'Conjuntos',                    pages: 2 },
  // Marcas
  { q: 'nike tenis hombre',     categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Hombre', pages: 3 },
  { q: 'nike tenis mujer',      categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Mujer',  pages: 3 },
  { q: 'nike ropa hombre',      categoria: 'Hombre',     subcategoria: 'Deportivo',  genero: 'Hombre', pages: 2 },
  { q: 'nike ropa mujer',       categoria: 'Mujer',      subcategoria: 'Deportivo',  genero: 'Mujer',  pages: 2 },
  { q: 'nike sudadera',         categoria: 'Hombre',     subcategoria: 'Sudaderas',                    pages: 2 },
  { q: 'adidas tenis hombre',   categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Hombre', pages: 3 },
  { q: 'adidas tenis mujer',    categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Mujer',  pages: 3 },
  { q: 'adidas ropa hombre',    categoria: 'Hombre',     subcategoria: 'Deportivo',  genero: 'Hombre', pages: 2 },
  { q: 'adidas ropa mujer',     categoria: 'Mujer',      subcategoria: 'Deportivo',  genero: 'Mujer',  pages: 2 },
  { q: 'zara vestido mujer',    categoria: 'Mujer',      subcategoria: 'Vestidos',   genero: 'Mujer',  pages: 2 },
  { q: 'zara ropa mujer',       categoria: 'Mujer',      subcategoria: 'Blusas',     genero: 'Mujer',  pages: 2 },
  { q: 'levis jeans hombre',    categoria: 'Hombre',     subcategoria: 'Jeans',      genero: 'Hombre', pages: 2 },
  { q: 'levis jeans mujer',     categoria: 'Mujer',      subcategoria: 'Jeans',      genero: 'Mujer',  pages: 2 },
  { q: 'puma tenis hombre',     categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Hombre', pages: 2 },
  { q: 'puma tenis mujer',      categoria: 'Calzado',    subcategoria: 'Tenis',      genero: 'Mujer',  pages: 1 },
  { q: 'new balance tenis',     categoria: 'Calzado',    subcategoria: 'Tenis',                        pages: 2 },
  { q: 'vans tenis',            categoria: 'Calzado',    subcategoria: 'Tenis',                        pages: 2 },
  { q: 'converse tenis',        categoria: 'Calzado',    subcategoria: 'Tenis',                        pages: 2 },
  { q: 'under armour tenis',    categoria: 'Calzado',    subcategoria: 'Tenis',                        pages: 2 },
  { q: 'tommy hilfiger polo',   categoria: 'Hombre',     subcategoria: 'Polos',      genero: 'Hombre', pages: 1 },
  { q: 'calvin klein ropa',     categoria: 'Hombre',     subcategoria: 'Camisas',                      pages: 1 },
  { q: 'guess bolsa mujer',     categoria: 'Accesorios', subcategoria: 'Bolsas',     genero: 'Mujer',  pages: 1 },
]

// ─── Fetch ML ─────────────────────────────────────────────────────────────────
async function fetchML(q, offset = 0) {
  const token = await getToken()
  const params = new URLSearchParams({ q, limit: String(LIMIT), offset: String(offset), sort: 'relevance' })
  const res = await fetch(`https://api.mercadolibre.com/sites/${ML_SITE}/search?${params}`, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'BiuBan/1.0' },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`ML ${res.status} for "${q}": ${body.substring(0, 100)}`)
  }
  return res.json()
}

// ─── Transformar ──────────────────────────────────────────────────────────────
function transform(item, categoria, subcategoria, genero) {
  const brand    = getAttribute(item.attributes, 'BRAND')
  const color    = getAttribute(item.attributes, 'COLOR')
  const gender   = getAttribute(item.attributes, 'GENDER') ?? genero
  const material = getAttribute(item.attributes, 'MATERIAL')
  const sizes    = item.attributes.filter(a => a.id === 'SIZE' && a.value_name).map(a => a.value_name)
  const price    = item.price
  const origP    = item.original_price
  const discount = origP && origP > price ? Math.round((1 - price / origP) * 100) : null
  return {
    id:             mlIdToUuid(item.id),
    slug:           slugify(`${item.title}-${item.id}`),
    sku:            item.id,
    name:           item.title,
    brand:          brand ?? 'Sin marca',
    description:    item.title,
    store:          item.seller?.nickname ?? 'Mercado Libre',
    store_type:     'mercadolibre',
    price,
    original_price: origP ?? null,
    discount:       discount ?? null,
    image:          betterImage(item.thumbnail),
    url:            buildAffiliateUrl(item.permalink),
    category:       categoria,
    subcategory:    subcategoria ?? null,
    gender:         gender ?? null,
    color:          color ?? null,
    material:       material ?? null,
    sizes_available: sizes.length > 0 ? sizes : null,
    available:      true,
    is_new:         item.condition === 'new',
    on_sale:        discount !== null && discount > 0,
    trending:       (item.sold_quantity ?? 0) > 100,
    best_option:    false,
    free_shipping:  item.shipping?.free_shipping ?? false,
    rating:         null,
    review_count:   null,
    additional_images: null,
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
let totalFetched = 0
let totalInserted = 0
let totalErrors = 0

console.log(`\n🚀 BiuBan ML Sync — ${QUERIES.length} queries\n`)

for (const target of QUERIES) {
  process.stdout.write(`⏳ "${target.q}" `)
  for (let page = 0; page < target.pages; page++) {
    try {
      const data = await fetchML(target.q, page * LIMIT)
      if (!data.results?.length) break
      const rows = data.results.map(item => transform(item, target.categoria, target.subcategoria, target.genero))
      totalFetched += rows.length
      const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id', ignoreDuplicates: false })
      if (error) {
        process.stdout.write(`❌`)
        totalErrors++
        console.error(`\n  Error Supabase: ${error.message}`)
      } else {
        totalInserted += rows.length
        process.stdout.write(`✅`)
      }
      await new Promise(r => setTimeout(r, 300))
    } catch (err) {
      process.stdout.write(`❌`)
      totalErrors++
      console.error(`\n  Error: ${err.message}`)
    }
  }
  console.log()
}

console.log(`\n📊 Resumen:`)
console.log(`   Productos obtenidos: ${totalFetched}`)
console.log(`   Insertados/actualizados: ${totalInserted}`)
console.log(`   Errores: ${totalErrors}`)
console.log(`\n✅ ¡Listo! Abre biuban.com para ver los productos.\n`)
