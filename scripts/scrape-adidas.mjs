// scripts/scrape-adidas.mjs
// Playwright + stealth → extrae todos los productos de adidas.mx → Supabase con deeplinks Awin
// Uso: node scripts/scrape-adidas.mjs [categoria]

import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

chromium.use(StealthPlugin())

const AWIN_MID   = '79918'
const AWIN_AFFID = '2823908'
const BASE       = 'https://www.adidas.mx'
const BATCH_SIZE = 100

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CATEGORIES = [
  { path: 'calzado-mujer',     cat: 'Mujer',  sub: 'Tenis',      gen: 'Mujer'  },
  { path: 'calzado-ninos',     cat: 'Niños',  sub: 'Tenis',      gen: 'Unisex' },
  { path: 'calzado-unisex',    cat: 'Unisex', sub: 'Tenis',      gen: 'Unisex' },
  { path: 'ropa-hombre',       cat: 'Hombre', sub: 'Ropa',       gen: 'Hombre' },
  { path: 'ropa-mujer',        cat: 'Mujer',  sub: 'Ropa',       gen: 'Mujer'  },
  { path: 'ropa-ninos',        cat: 'Niños',  sub: 'Ropa',       gen: 'Unisex' },
  { path: 'accesorios-hombre', cat: 'Hombre', sub: 'Accesorios', gen: 'Hombre' },
  { path: 'accesorios-mujer',  cat: 'Mujer',  sub: 'Accesorios', gen: 'Mujer'  },
]

// Filtrar por argumento CLI si se pasa
const filterArg = process.argv[2]?.toLowerCase()
const targets = filterArg
  ? CATEGORIES.filter(c => c.path.includes(filterArg) || c.cat.toLowerCase().includes(filterArg))
  : CATEGORIES

function awinIdToUuid(id) {
  const hash = createHash('sha256').update(`adidas-awin:${id}`).digest('hex')
  return [hash.slice(0,8), hash.slice(8,12), '4'+hash.slice(13,16),
    ((parseInt(hash[16],16)&0x3)|0x8).toString(16)+hash.slice(17,20), hash.slice(20,32)].join('-')
}

function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').substring(0,80)
}

function buildAwinUrl(url) {
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_MID}&awinaffid=${AWIN_AFFID}&ued=${encodeURIComponent(url)}`
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

async function extractPageProducts(page) {
  const base = BASE
  return page.evaluate((base) => {
    const products = []
    const cards = document.querySelectorAll('article[data-testid="plp-product-card"]')
    cards.forEach(card => {
      const href = card.querySelector('a[href*="/"]')?.getAttribute('href') ?? ''
      const idMatch = href.match(/\/([A-Z0-9]{5,10})\.html/)
      const id = idMatch?.[1] ?? ''; if (!id) return
      const name = card.querySelector('[data-testid="product-card-title"]')?.textContent?.trim() ?? ''
      const sp = card.querySelector('[data-testid="sale-price"]')
      const mp = card.querySelector('[data-testid="main-price"]')
      const price = parseInt((sp ?? mp)?.textContent?.replace(/[^0-9]/g,'') || '0') || 0
      const origPrice = parseInt(sp ? (mp?.textContent?.replace(/[^0-9]/g,'') || '0') : '0') || 0
      const image = card.querySelector('img')?.getAttribute('src') ?? card.querySelector('img')?.getAttribute('data-src') ?? ''
      const subtitle = card.querySelector('[data-testid="product-card-subtitle"]')?.textContent?.trim() ?? ''
      const productUrl = href.startsWith('http') ? href : `${base}${href}`
      if (name && price > 0) {
        products.push({ id, name, subtitle, price, originalPrice: origPrice > price ? origPrice : null, image, url: productUrl })
      }
    })
    return products
  }, base)
}

async function getTotalPages(page) {
  return page.evaluate(() => {
    const pagEl = document.querySelector('[data-testid*="pagination"]')
    const match = pagEl?.textContent?.match(/(\d+)\s*$/)
    return match ? parseInt(match[1]) : 1
  })
}

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu']
})

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  locale: 'es-MX',
  viewport: { width: 1440, height: 900 },
  extraHTTPHeaders: { 'Accept-Language': 'es-MX,es;q=0.9' }
})

let grandTotal = 0

for (const catDef of targets) {
  console.log(`\n🔍 ${catDef.path}`)
  const allProducts = new Map()

  const firstPage = await context.newPage()
  await firstPage.goto(`${BASE}/${catDef.path}`, { waitUntil: 'networkidle', timeout: 30000 })
  // Esperar a que carguen los productos
  try {
    await firstPage.waitForSelector('article[data-testid="plp-product-card"]', { timeout: 15000 })
  } catch { /* no encontró productos */ }
  await delay(1500)

  const totalPages = await getTotalPages(firstPage)
  console.log(`  ${totalPages} páginas`)

  // Extraer primera página
  const firstBatch = await extractPageProducts(firstPage)
  firstBatch.forEach(p => allProducts.set(p.id, {...p, ...catDef}))
  await firstPage.close()

  // Páginas restantes
  for (let pageNum = 1; pageNum < totalPages; pageNum++) {
    const start = pageNum * 48
    process.stdout.write(`\r  Página ${pageNum+1}/${totalPages} | ${allProducts.size} productos`)

    const p = await context.newPage()
    try {
      await p.goto(`${BASE}/${catDef.path}?start=${start}`, { waitUntil: 'networkidle', timeout: 25000 })
      try { await p.waitForSelector('article[data-testid="plp-product-card"]', { timeout: 10000 }) } catch {}
      await delay(800)
      const batch = await extractPageProducts(p)
      batch.forEach(pr => { if (!allProducts.has(pr.id)) allProducts.set(pr.id, {...pr, ...catDef}) })
    } catch (e) {
      // si falla una página, continuar
    } finally {
      await p.close()
    }
  }

  // Transformar y subir
  const rows = [...allProducts.values()].map(p => {
    const discount = p.originalPrice && p.originalPrice > p.price
      ? Math.round((1 - p.price / p.originalPrice) * 100) : null
    return {
      id:               awinIdToUuid(p.id),
      slug:             slugify(`${p.name}-${p.id}`),
      sku:              p.id,
      name:             p.name.substring(0, 200),
      brand:            'Adidas',
      description:      p.name.substring(0, 500),
      store:            'Adidas',
      store_type:       'awin',
      price:            p.price,
      original_price:   p.originalPrice ?? null,
      discount,
      image:            (p.image || '').substring(0, 500),
      url:              buildAwinUrl(p.url),
      category:         p.cat,
      subcategory:      p.sub,
      gender:           p.gen,
      color:            null, material: null, sizes_available: null,
      available:        true, is_new: false,
      on_sale:          (discount ?? 0) > 0,
      trending:         false, best_option: false, free_shipping: false,
      rating:           null, review_count: 0,
      additional_images: null,
      tags:             p.subtitle ? [p.subtitle] : null,
    }
  })

  let catInserted = 0
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const { error } = await supabase.from('products')
      .upsert(rows.slice(i, i + BATCH_SIZE), { onConflict: 'id', ignoreDuplicates: false })
    if (error) console.error(`\n  ❌ ${error.message}`)
    else catInserted += Math.min(BATCH_SIZE, rows.length - i)
  }

  grandTotal += catInserted
  console.log(`\n  ✅ ${catInserted} subidos a Supabase`)
}

await browser.close()
console.log(`\n🎉 TOTAL: ${grandTotal} productos subidos`)
