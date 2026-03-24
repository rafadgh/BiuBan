// app/api/adidas-sync/route.ts
// Sincronización de productos Adidas México → Supabase
// Estrategia: Playwright DOM scraping con selectores correctos de adidas.mx
//             + Awin deeplinks (mid=79918, affid=2823908)
// Cron: cada 24 horas vía vercel.json

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

export const maxDuration = 60

// ─── Constantes ───────────────────────────────────────────────────────────────

const AWIN_MID    = '79918'    // Programme ID de Adidas MX en Awin
const AWIN_AFFID  = '2823908'  // Publisher ID de BiuBan en Awin
const BATCH_SIZE  = 50
const ADIDAS_BASE = 'https://www.adidas.mx'

const CATEGORIES = [
  // Calzado
  { url: `${ADIDAS_BASE}/calzado-hombre`,   categoria: 'Hombre', subcategoria: 'Tenis',      genero: 'Hombre' },
  { url: `${ADIDAS_BASE}/calzado-mujer`,    categoria: 'Mujer',  subcategoria: 'Tenis',      genero: 'Mujer'  },
  { url: `${ADIDAS_BASE}/calzado-ninos`,    categoria: 'Niños',  subcategoria: 'Tenis',      genero: 'Unisex' },
  { url: `${ADIDAS_BASE}/calzado-unisex`,   categoria: 'Unisex', subcategoria: 'Tenis',      genero: 'Unisex' },
  // Ropa
  { url: `${ADIDAS_BASE}/ropa-hombre`,      categoria: 'Hombre', subcategoria: 'Ropa',       genero: 'Hombre' },
  { url: `${ADIDAS_BASE}/ropa-mujer`,       categoria: 'Mujer',  subcategoria: 'Ropa',       genero: 'Mujer'  },
  { url: `${ADIDAS_BASE}/ropa-ninos`,       categoria: 'Niños',  subcategoria: 'Ropa',       genero: 'Unisex' },
  // Accesorios
  { url: `${ADIDAS_BASE}/accesorios-hombre`, categoria: 'Hombre', subcategoria: 'Accesorios', genero: 'Hombre' },
  { url: `${ADIDAS_BASE}/accesorios-mujer`,  categoria: 'Mujer',  subcategoria: 'Accesorios', genero: 'Mujer'  },
]

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function awinIdToUuid(id: string): string {
  const hash = createHash('sha256').update(`adidas-awin:${id}`).digest('hex')
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

function buildAwinDeeplink(productUrl: string): string {
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_MID}&awinaffid=${AWIN_AFFID}&ued=${encodeURIComponent(productUrl)}`
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AdidasProduct {
  id:             string
  name:           string
  subtitle:       string
  url:            string
  price:          number
  originalPrice?: number
  image:          string
  color?:         string
}

interface AdidasProductDetail {
  sizes:         string[]
  additionalImages: string[]
  color:         string
  description:   string
}

// ─── Scrape listing page con infinite scroll ──────────────────────────────────

async function scrapeListingPage(
  page: import('playwright').Page,
  categoryUrl: string,
  maxScrolls = 30,
): Promise<AdidasProduct[]> {
  await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await delay(3000)

  const products: AdidasProduct[] = []
  const seenIds = new Set<string>()

  // Scroll hasta cargar todos los productos
  for (let scroll = 0; scroll < maxScrolls; scroll++) {
    // Extraer productos visibles actualmente
    const batch = await page.evaluate((base: string) => {
      const results: AdidasProduct[] = []
      const cards = document.querySelectorAll('article[data-testid="plp-product-card"]')

      cards.forEach((card) => {
        // Link y URL del producto
        const linkEl = card.querySelector<HTMLAnchorElement>(
          '[data-testid="product-card-image-link"], a[href*="/"]'
        )
        const href = linkEl?.href ?? ''
        if (!href) return

        // Extraer ID del URL: /tenis-samba-og/B75807.html → B75807
        const idMatch = href.match(/\/([A-Z0-9]{5,10})\.html/) ?? href.match(/\/([A-Z0-9]{5,10})\/?$/)
        const id = idMatch?.[1] ?? ''
        if (!id) return

        // Nombre
        const titleEl = card.querySelector('[data-testid="product-card-title"]')
        const name = titleEl?.textContent?.trim() ?? ''
        if (!name) return

        // Subtítulo (Sport/Originals)
        const subtitleEl = card.querySelector('[data-testid="product-card-subtitle"]')
        const subtitle = subtitleEl?.textContent?.trim() ?? ''

        // Precio sale (con descuento) o precio normal
        const salePriceEl = card.querySelector('[data-testid="sale-price"]')
        const mainPriceEl = card.querySelector('[data-testid="main-price"]')

        const priceText = (salePriceEl ?? mainPriceEl)?.textContent?.replace(/[^0-9.]/g, '') ?? '0'
        const origText = salePriceEl ? (mainPriceEl?.textContent?.replace(/[^0-9.]/g, '') ?? '0') : '0'

        const price = parseFloat(priceText) || 0
        const original = parseFloat(origText) || 0
        if (price <= 0) return

        // Imagen principal
        const imgEl = card.querySelector<HTMLImageElement>(
          '[data-testid="product-card-primary-image"] img, img[src*="adidas"], img[src*="assets"]'
        )
        const image = imgEl?.src ?? imgEl?.getAttribute('data-src') ?? ''

        // Color (badge o texto)
        const colorEl = card.querySelector('[data-testid="product-card-color-count"], [class*="color"]')
        const color = colorEl?.textContent?.trim() ?? ''

        results.push({
          id,
          name,
          subtitle,
          url: href.startsWith('http') ? href : `${base}${href}`,
          price,
          originalPrice: original > price ? original : undefined,
          image,
          color: color || undefined,
        })
      })

      return results
    }, ADIDAS_BASE) as AdidasProduct[]

    // Agregar solo los nuevos
    for (const p of batch) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id)
        products.push(p)
      }
    }

    // Verificar si hay botón "Ver más" o si seguimos scrolleando
    const loadMoreBtn = await page.$('[data-testid="plp-pagination-load-more-button"]')
    if (loadMoreBtn) {
      try {
        await loadMoreBtn.click()
        await delay(2500)
      } catch {
        // Si falla el click, intentar scroll
        await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight))
        await delay(2500)
      }
    } else {
      // Scroll al fondo para trigger lazy load
      const prevCount = products.length
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await delay(2500)

      // Extraer de nuevo para ver si cargaron más
      const afterBatch = await page.evaluate((base: string) => {
        const results: { id: string }[] = []
        document.querySelectorAll('article[data-testid="plp-product-card"]').forEach((card) => {
          const linkEl = card.querySelector<HTMLAnchorElement>('a[href*="/"]')
          const href = linkEl?.href ?? ''
          const idMatch = href.match(/\/([A-Z0-9]{5,10})\.html/)
          const id = idMatch?.[1] ?? ''
          if (id) results.push({ id })
        })
        return results
      }, ADIDAS_BASE) as { id: string }[]

      // Si no cargaron más productos, terminamos
      const newCount = afterBatch.filter(p => !seenIds.has(p.id)).length
      if (newCount === 0 && scroll > 2) break
    }
  }

  return products
}

// ─── Scrape detalle de producto (tallas, imágenes extra, descripción) ─────────

async function scrapeProductDetail(
  page: import('playwright').Page,
  productUrl: string,
): Promise<AdidasProductDetail> {
  try {
    await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 25_000 })
    await delay(2000)

    return await page.evaluate(() => {
      const result: AdidasProductDetail = {
        sizes: [],
        additionalImages: [],
        color: '',
        description: '',
      }

      // Tallas disponibles
      const sizeButtons = document.querySelectorAll(
        '[data-testid="size-selector-sizes-container"] button:not([disabled]):not([aria-disabled="true"]), ' +
        '[data-testid="size-selector"] button:not([disabled]), ' +
        'button[data-auto-id="size-btn"]:not([disabled])'
      )
      sizeButtons.forEach((btn) => {
        const size = btn.textContent?.trim()
        if (size && size.length < 10 && !result.sizes.includes(size)) {
          result.sizes.push(size)
        }
      })

      // Imágenes adicionales
      const imgEls = document.querySelectorAll<HTMLImageElement>(
        '[data-testid="product-page-images-carousel"] img, ' +
        '[data-testid="pdp-image"] img, ' +
        '.pdp-image img'
      )
      imgEls.forEach((img) => {
        const src = img.src ?? img.getAttribute('data-src') ?? ''
        if (src && src.includes('adidas') && !result.additionalImages.includes(src)) {
          result.additionalImages.push(src)
        }
      })

      // Color
      const colorEl = document.querySelector(
        '[data-testid="color-description"], [data-auto-id="color-description"]'
      )
      result.color = colorEl?.textContent?.trim() ?? ''

      // Descripción
      const descEl = document.querySelector(
        '[data-testid="description-content"], [data-auto-id="description-text"], .product-description'
      )
      result.description = descEl?.textContent?.trim().substring(0, 500) ?? ''

      return result
    }) as AdidasProductDetail
  } catch {
    return { sizes: [], additionalImages: [], color: '', description: '' }
  }
}

// ─── Transformar → Supabase ───────────────────────────────────────────────────

function transformProduct(
  raw: AdidasProduct,
  detail: AdidasProductDetail,
  categoria: string,
  subcategoria: string,
  genero: string,
) {
  const discount = raw.originalPrice && raw.originalPrice > raw.price
    ? Math.round((1 - raw.price / raw.originalPrice) * 100)
    : null

  const productUrl = raw.url.startsWith('http') ? raw.url : `${ADIDAS_BASE}${raw.url}`

  return {
    id:               awinIdToUuid(raw.id),
    slug:             slugify(`${raw.name}-${raw.id}`),
    sku:              raw.id,
    name:             raw.name,
    brand:            'Adidas',
    description:      detail.description || raw.name,
    store:            'Adidas',
    store_type:       'awin',
    price:            raw.price,
    original_price:   raw.originalPrice ?? null,
    discount:         discount ?? null,
    image:            raw.image,
    url:              buildAwinDeeplink(productUrl),
    category:         categoria,
    subcategory:      subcategoria,
    gender:           genero,
    color:            detail.color || raw.color || null,
    material:         null,
    sizes_available:  detail.sizes.length > 0 ? detail.sizes : null,
    available:        true,
    is_new:           false,
    on_sale:          (discount ?? 0) > 0,
    trending:         false,
    best_option:      false,
    free_shipping:    false,
    rating:           null,
    review_count:     0,
    additional_images: detail.additionalImages.length > 0 ? detail.additionalImages.slice(0, 6) : null,
    tags:             raw.subtitle ? [raw.subtitle] : null,
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret')
    if (process.env.NODE_ENV === 'production' && secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Parámetros opcionales
    const soloCategoria  = req.nextUrl.searchParams.get('categoria')
    const fetchDetails   = req.nextUrl.searchParams.get('details') !== 'false' // default true
    const maxProductsCat = parseInt(req.nextUrl.searchParams.get('max') ?? '200', 10)

    const targets = soloCategoria
      ? CATEGORIES.filter(c => c.url.includes(soloCategoria) || c.categoria.toLowerCase().includes(soloCategoria.toLowerCase()))
      : CATEGORIES

    const stats = {
      total_fetched:  0,
      total_inserted: 0,
      total_skipped:  0,
      total_errors:   0,
      categories_done: [] as string[],
      errors_detail:  [] as string[],
    }

    const globalSeenIds = new Set<string>()

    // Importar playwright dinámicamente (evita bundling con Turbopack)
    const { chromium } = await import('playwright-extra')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    chromium.use(StealthPlugin())

    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })

    // Medir tiempo DESPUÉS del launch (launch puede tardar 10-20s en frío)
    const startTime = Date.now()
    const TIME_LIMIT_MS = 50_000

    try {
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        locale: 'es-MX',
        viewport: { width: 1440, height: 900 },
        extraHTTPHeaders: { 'Accept-Language': 'es-MX,es;q=0.9' },
      })

      for (const cat of targets) {
        if (Date.now() - startTime > TIME_LIMIT_MS) {
          stats.errors_detail.push('⏱ Límite de tiempo — usar ?categoria= para sync por partes')
          break
        }

        const listPage = await context.newPage()

        try {
          // ── 1. Obtener listado de productos ──
          const maxScrolls = Math.ceil(maxProductsCat / 48) + 2
          const rawProducts = await scrapeListingPage(listPage, cat.url, maxScrolls)

          const newProducts = rawProducts.filter(p => {
            if (globalSeenIds.has(p.id)) return false
            globalSeenIds.add(p.id)
            return true
          }).slice(0, maxProductsCat)

          stats.total_fetched += newProducts.length

          if (newProducts.length === 0) {
            stats.errors_detail.push(`${cat.url}: 0 productos encontrados`)
            continue
          }

          // ── 2. Obtener detalles de cada producto (tallas, imágenes extra) ──
          const rows = []

          for (const raw of newProducts) {
            if (Date.now() - startTime > TIME_LIMIT_MS) break

            let detail: AdidasProductDetail = { sizes: [], additionalImages: [], color: '', description: '' }

            if (fetchDetails) {
              const detailPage = await context.newPage()
              try {
                detail = await scrapeProductDetail(detailPage, raw.url)
              } finally {
                await detailPage.close()
              }
              await delay(300) // cortesía
            }

            rows.push(transformProduct(raw, detail, cat.categoria, cat.subcategoria, cat.genero))
          }

          stats.total_skipped += newProducts.length - rows.length

          // ── 3. Upsert en batches ──
          for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE)
            const { error } = await supabase
              .from('products')
              .upsert(batch, { onConflict: 'id', ignoreDuplicates: false })

            if (error) {
              stats.total_errors++
              stats.errors_detail.push(`${cat.categoria}/${cat.subcategoria}: ${error.message}`)
            } else {
              stats.total_inserted += batch.length
            }
          }

          stats.categories_done.push(`${cat.categoria}/${cat.subcategoria} (${rows.length})`)

        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err)
          stats.errors_detail.push(`${cat.url}: ${msg}`)
          stats.total_errors++
        } finally {
          await listPage.close()
        }
      }

    } finally {
      await browser.close()
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000)

    return NextResponse.json({
      ok:      true,
      message: `✅ Sync Adidas completado en ${elapsed}s`,
      stats,
    })

  } catch (topErr: unknown) {
    const msg   = topErr instanceof Error ? topErr.message : String(topErr)
    const stack = topErr instanceof Error ? topErr.stack : ''
    return NextResponse.json({ ok: false, error: msg, stack }, { status: 500 })
  }
}
