// app/api/ml-sync/route.ts
// Sincronización de productos desde Mercado Libre Afiliados → Supabase

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

// Extender timeout de Vercel a 60s (necesario para sync de muchos productos)
export const maxDuration = 60

const AFFILIATE_ID  = 'diezrafa20230122100014'
const ML_SITE       = 'MLM'  // México
const LIMIT_PER_REQ = 50     // Max permitido por ML API
const ML_CLIENT_ID  = process.env.ML_CLIENT_ID!
const ML_CLIENT_SECRET = process.env.ML_CLIENT_SECRET!

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── OAuth: obtener access token de ML ───────────────────────────────────────
let cachedToken: { token: string; expiresAt: number } | null = null

async function getMLToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token
  }
  const res = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     ML_CLIENT_ID,
      client_secret: ML_CLIENT_SECRET,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`ML OAuth error ${res.status}: ${err}`)
  }
  const data = await res.json()
  cachedToken = {
    token:     data.access_token,
    expiresAt: now + (data.expires_in ?? 21600) * 1000,
  }
  return cachedToken.token
}

// ─── Categorías que vamos a jalar ────────────────────────────────────────────
const QUERIES: Array<{
  q: string
  categoria: string
  subcategoria?: string
  genero?: string
  pages: number   // cuántas páginas de 50 productos
}> = [
  // ── Categorías generales ─────────────────────────────────────────────────────
  { q: 'vestido mujer',        categoria: 'Mujer',     subcategoria: 'Vestidos',     genero: 'Mujer',   pages: 3 },
  { q: 'blusa mujer moda',     categoria: 'Mujer',     subcategoria: 'Blusas',       genero: 'Mujer',   pages: 2 },
  { q: 'pantalon mujer',       categoria: 'Mujer',     subcategoria: 'Pantalones',   genero: 'Mujer',   pages: 2 },
  { q: 'falda mujer',          categoria: 'Mujer',     subcategoria: 'Faldas',       genero: 'Mujer',   pages: 1 },
  { q: 'chamarra mujer',       categoria: 'Mujer',     subcategoria: 'Chamarras',    genero: 'Mujer',   pages: 1 },
  { q: 'ropa deportiva mujer', categoria: 'Mujer',     subcategoria: 'Deportivo',    genero: 'Mujer',   pages: 2 },
  { q: 'camisa hombre moda',   categoria: 'Hombre',    subcategoria: 'Camisas',      genero: 'Hombre',  pages: 2 },
  { q: 'pantalon hombre',      categoria: 'Hombre',    subcategoria: 'Pantalones',   genero: 'Hombre',  pages: 2 },
  { q: 'chamarra hombre',      categoria: 'Hombre',    subcategoria: 'Chamarras',    genero: 'Hombre',  pages: 1 },
  { q: 'polo hombre',          categoria: 'Hombre',    subcategoria: 'Polos',        genero: 'Hombre',  pages: 1 },
  { q: 'ropa deportiva hombre',categoria: 'Hombre',    subcategoria: 'Deportivo',    genero: 'Hombre',  pages: 2 },
  { q: 'tenis mujer',          categoria: 'Calzado',   subcategoria: 'Tenis',        genero: 'Mujer',   pages: 2 },
  { q: 'tenis hombre',         categoria: 'Calzado',   subcategoria: 'Tenis',        genero: 'Hombre',  pages: 2 },
  { q: 'botas mujer',          categoria: 'Calzado',   subcategoria: 'Botas',        genero: 'Mujer',   pages: 1 },
  { q: 'bolsa mujer moda',     categoria: 'Accesorios',subcategoria: 'Bolsas',       genero: 'Mujer',   pages: 2 },
  { q: 'lentes sol moda',      categoria: 'Accesorios',subcategoria: 'Lentes',                          pages: 1 },
  { q: 'reloj moda',           categoria: 'Accesorios',subcategoria: 'Relojes',                         pages: 1 },
  { q: 'conjunto deportivo',   categoria: 'Deportes',  subcategoria: 'Conjuntos',                       pages: 2 },
  { q: 'pijama mujer',         categoria: 'Mujer',     subcategoria: 'Pijamas',      genero: 'Mujer',   pages: 1 },
  { q: 'uniforme medico',      categoria: 'Trabajo',   subcategoria: 'Uniformes',                       pages: 1 },

  // ── Nike ─────────────────────────────────────────────────────────────────────
  { q: 'nike tenis hombre',    categoria: 'Calzado',   subcategoria: 'Tenis',        genero: 'Hombre',  pages: 3 },
  { q: 'nike tenis mujer',     categoria: 'Calzado',   subcategoria: 'Tenis',        genero: 'Mujer',   pages: 3 },
  { q: 'nike ropa hombre',     categoria: 'Hombre',    subcategoria: 'Deportivo',    genero: 'Hombre',  pages: 2 },
  { q: 'nike ropa mujer',      categoria: 'Mujer',     subcategoria: 'Deportivo',    genero: 'Mujer',   pages: 2 },
  { q: 'nike sudadera',        categoria: 'Hombre',    subcategoria: 'Sudaderas',                       pages: 2 },
  { q: 'nike mochila',         categoria: 'Accesorios',subcategoria: 'Mochilas',                        pages: 1 },

  // ── Adidas ───────────────────────────────────────────────────────────────────
  { q: 'adidas tenis hombre',  categoria: 'Calzado',   subcategoria: 'Tenis',        genero: 'Hombre',  pages: 3 },
  { q: 'adidas tenis mujer',   categoria: 'Calzado',   subcategoria: 'Tenis',        genero: 'Mujer',   pages: 3 },
  { q: 'adidas ropa hombre',   categoria: 'Hombre',    subcategoria: 'Deportivo',    genero: 'Hombre',  pages: 2 },
  { q: 'adidas ropa mujer',    categoria: 'Mujer',     subcategoria: 'Deportivo',    genero: 'Mujer',   pages: 2 },
  { q: 'adidas sudadera',      categoria: 'Hombre',    subcategoria: 'Sudaderas',                       pages: 1 },

  // ── Zara ─────────────────────────────────────────────────────────────────────
  { q: 'zara vestido mujer',   categoria: 'Mujer',     subcategoria: 'Vestidos',     genero: 'Mujer',   pages: 2 },
  { q: 'zara ropa mujer',      categoria: 'Mujer',     subcategoria: 'Blusas',       genero: 'Mujer',   pages: 2 },
  { q: 'zara pantalon hombre', categoria: 'Hombre',    subcategoria: 'Pantalones',   genero: 'Hombre',  pages: 1 },
  { q: 'zara camisa hombre',   categoria: 'Hombre',    subcategoria: 'Camisas',      genero: 'Hombre',  pages: 1 },

  // ── H&M ──────────────────────────────────────────────────────────────────────
  { q: 'hm ropa mujer',        categoria: 'Mujer',     subcategoria: 'Blusas',       genero: 'Mujer',   pages: 2 },
  { q: 'hm ropa hombre',       categoria: 'Hombre',    subcategoria: 'Camisas',      genero: 'Hombre',  pages: 1 },
  { q: 'hm vestido',           categoria: 'Mujer',     subcategoria: 'Vestidos',     genero: 'Mujer',   pages: 1 },

  // ── Levi's ───────────────────────────────────────────────────────────────────
  { q: 'levis jeans hombre',   categoria: 'Hombre',    subcategoria: 'Jeans',        genero: 'Hombre',  pages: 2 },
  { q: 'levis jeans mujer',    categoria: 'Mujer',     subcategoria: 'Jeans',        genero: 'Mujer',   pages: 2 },

  // ── Tommy Hilfiger ───────────────────────────────────────────────────────────
  { q: 'tommy hilfiger polo',  categoria: 'Hombre',    subcategoria: 'Polos',        genero: 'Hombre',  pages: 1 },
  { q: 'tommy hilfiger mujer', categoria: 'Mujer',     subcategoria: 'Blusas',       genero: 'Mujer',   pages: 1 },

  // ── Under Armour ─────────────────────────────────────────────────────────────
  { q: 'under armour tenis',   categoria: 'Calzado',   subcategoria: 'Tenis',                           pages: 2 },
  { q: 'under armour ropa',    categoria: 'Deportes',  subcategoria: 'Deportivo',                       pages: 2 },

  // ── Puma ─────────────────────────────────────────────────────────────────────
  { q: 'puma tenis hombre',    categoria: 'Calzado',   subcategoria: 'Tenis',        genero: 'Hombre',  pages: 2 },
  { q: 'puma tenis mujer',     categoria: 'Calzado',   subcategoria: 'Tenis',        genero: 'Mujer',   pages: 1 },
  { q: 'puma ropa deportiva',  categoria: 'Deportes',  subcategoria: 'Deportivo',                       pages: 1 },

  // ── New Balance ──────────────────────────────────────────────────────────────
  { q: 'new balance tenis',    categoria: 'Calzado',   subcategoria: 'Tenis',                           pages: 2 },

  // ── Vans ─────────────────────────────────────────────────────────────────────
  { q: 'vans tenis',           categoria: 'Calzado',   subcategoria: 'Tenis',                           pages: 2 },

  // ── Converse ─────────────────────────────────────────────────────────────────
  { q: 'converse tenis',       categoria: 'Calzado',   subcategoria: 'Tenis',                           pages: 2 },

  // ── Guess / Calvin Klein / Michael Kors ──────────────────────────────────────
  { q: 'guess bolsa mujer',    categoria: 'Accesorios',subcategoria: 'Bolsas',       genero: 'Mujer',   pages: 1 },
  { q: 'calvin klein ropa',    categoria: 'Hombre',    subcategoria: 'Camisas',                         pages: 1 },
  { q: 'michael kors bolsa',   categoria: 'Accesorios',subcategoria: 'Bolsas',       genero: 'Mujer',   pages: 1 },
]

// ─── Utilidades ───────────────────────────────────────────────────────────────

/** Convierte el ID de ML (ej. MLM12345) a UUID determinístico para Supabase */
function mlIdToUuid(mlId: string): string {
  const hash = createHash('sha256').update(`ml:${mlId}`).digest('hex')
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    '4' + hash.slice(13, 16),
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join('-')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
}

function betterImage(thumbnail: string): string {
  // ML devuelve imágenes de 90px; subimos a 500px cambiando el parámetro
  return thumbnail
    .replace(/\/\d+-/, '/500-')
    .replace('http://', 'https://')
}

function getAttribute(attributes: MLAttribute[], id: string): string | null {
  const attr = attributes?.find(a => a.id === id)
  return attr?.value_name ?? null
}

function calcDescuento(price: number, originalPrice: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null
  return Math.round((1 - price / originalPrice) * 100)
}

function buildAffiliateUrl(permalink: string): string {
  const sep = permalink.includes('?') ? '&' : '?'
  return `${permalink}${sep}matt_tool=${AFFILIATE_ID}&matt_source=affiliate&matt_campaign=biuban`
}

function mapCategory(mlCategoryId: string): string {
  const map: Record<string, string> = {
    MLM1430: 'Mujer',
    MLM1276: 'Calzado',
    MLM5726: 'Accesorios',
    MLM1168: 'Deportes',
  }
  return map[mlCategoryId] ?? 'Otros'
}

// ─── Tipos de la API de ML ────────────────────────────────────────────────────
interface MLAttribute {
  id:         string
  name:       string
  value_name: string | null
}

interface MLProduct {
  id:              string
  title:           string
  price:           number
  original_price:  number | null
  thumbnail:       string
  permalink:       string
  category_id:     string
  condition:       string
  free_shipping:   boolean
  sold_quantity?:  number
  seller: {
    nickname: string
    id:       number
  }
  attributes:      MLAttribute[]
  shipping: {
    free_shipping: boolean
  }
  tags?: string[]
}

interface MLSearchResponse {
  results:   MLProduct[]
  paging: {
    total:  number
    offset: number
    limit:  number
  }
}

// ─── Fetch de ML ──────────────────────────────────────────────────────────────
async function fetchMLProducts(q: string, offset = 0): Promise<MLSearchResponse> {
  const params = new URLSearchParams({
    q,
    limit:  String(LIMIT_PER_REQ),
    offset: String(offset),
    sort:   'relevance',
  })
  const url = `https://api.mercadolibre.com/sites/${ML_SITE}/search?${params}`

  // Prioridad: 1) User token (más permisos), 2) App token, 3) Sin auth
  const headers: Record<string, string> = { 'User-Agent': 'BiuBan/1.0' }

  const userToken = process.env.ML_USER_TOKEN
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`
  } else if (ML_CLIENT_ID && ML_CLIENT_ID !== 'TU_APP_ID_AQUI') {
    try {
      const token = await getMLToken()
      headers['Authorization'] = `Bearer ${token}`
    } catch {
      console.warn('[ML Sync] No se pudo obtener token')
    }
  }

  const res = await fetch(url, { headers, next: { revalidate: 0 } })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`ML API error ${res.status} for q="${q}" | body: ${body}`)
  }
  return res.json()
}

// ─── Transformar producto ML → fila de Supabase ───────────────────────────────
function transformProduct(
  item:         MLProduct,
  categoria:    string,
  subcategoria?: string,
  genero?:      string,
) {
  const brand     = getAttribute(item.attributes, 'BRAND')
  const color     = getAttribute(item.attributes, 'COLOR')
  const gender    = getAttribute(item.attributes, 'GENDER') ?? genero
  const material  = getAttribute(item.attributes, 'MATERIAL')
  const sizes     = item.attributes
    .filter(a => a.id === 'SIZE' && a.value_name)
    .map(a => a.value_name as string)

  const price         = item.price
  const originalPrice = item.original_price
  const discount      = calcDescuento(price, originalPrice)
  const isFreeShip    = item.shipping?.free_shipping ?? item.free_shipping ?? false
  const isSale        = discount !== null && discount > 0

  const titleSlug = slugify(`${item.title}-${item.id}`)

  return {
    // Identificación
    id:             mlIdToUuid(item.id),   // UUID determinístico generado del ID de ML
    slug:           titleSlug,
    sku:            item.id,               // Guardamos el ID original de ML aquí

    // Nombre y descripción
    name:           item.title,
    brand:          brand ?? 'Sin marca',
    description:    item.title,  // ML no expone descripción en búsqueda

    // Tienda
    store:          item.seller?.nickname ?? 'Mercado Libre',
    store_type:     'mercadolibre',

    // Precios
    price,
    original_price: originalPrice ?? null,
    discount:       discount ?? null,

    // Imagen y link
    image:          betterImage(item.thumbnail),
    url:            buildAffiliateUrl(item.permalink),

    // Categorización
    category:       categoria,
    subcategory:    subcategoria ?? null,
    gender:         gender ?? null,

    // Atributos
    color:          color ?? null,
    material:       material ?? null,
    sizes_available: sizes.length > 0 ? sizes : null,

    // Flags
    available:      true,
    is_new:         item.condition === 'new',
    on_sale:        isSale,
    trending:       (item.sold_quantity ?? 0) > 100,
    best_option:    false,
    free_shipping:  isFreeShip,

    // Extras
    rating:         null,
    review_count:   null,
    additional_images: null,
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Protección básica
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const soloQuery = req.nextUrl.searchParams.get('q')  // para probar una sola búsqueda
  const targets   = soloQuery
    ? QUERIES.filter(q => q.q.includes(soloQuery))
    : QUERIES

  const stats = {
    total_fetched:  0,
    total_inserted: 0,
    total_errors:   0,
    categories:     [] as string[],
    errors_detail:  [] as string[],
  }

  for (const target of targets) {
    console.log(`[ML Sync] Procesando: "${target.q}"`)

    for (let page = 0; page < target.pages; page++) {
      const offset = page * LIMIT_PER_REQ
      try {
        const data = await fetchMLProducts(target.q, offset)
        if (!data.results?.length) {
          console.log(`[ML Sync] 0 resultados para "${target.q}" p${page}`)
          break
        }

        const rows = data.results.map(item =>
          transformProduct(item, target.categoria, target.subcategoria, target.genero)
        )

        stats.total_fetched += rows.length

        // UPSERT — si el producto ya existe, actualiza precio e imagen
        const { error } = await supabase
          .from('products')
          .upsert(rows, {
            onConflict:        'id',
            ignoreDuplicates:  false,
          })

        if (error) {
          const msg = `Supabase "${target.q}": ${error.message} (${error.code})`
          console.error(`[ML Sync] ${msg}`)
          stats.total_errors++
          stats.errors_detail.push(msg)
        } else {
          stats.total_inserted += rows.length
          if (!stats.categories.includes(target.categoria)) {
            stats.categories.push(target.categoria)
          }
        }

        await new Promise(r => setTimeout(r, 200))

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`[ML Sync] Error "${target.q}" p${page}:`, msg)
        stats.total_errors++
        stats.errors_detail.push(`ML "${target.q}": ${msg}`)
      }
    }
  }

  return NextResponse.json({
    ok:      true,
    message: '✅ Sincronización completada',
    stats,
  })
}
