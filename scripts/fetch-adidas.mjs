// scripts/fetch-adidas.mjs
// Fetcha adidas.mx directamente desde Node y upserta en Supabase con deeplinks Awin

import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const AWIN_MID   = '79918'
const AWIN_AFFID = '2823908'
const BASE       = 'https://www.adidas.mx'
const BATCH_SIZE = 100

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CATEGORIES = [
  { path: 'calzado-mujer',      cat: 'Mujer',  sub: 'Tenis',      gen: 'Mujer'  },
  { path: 'calzado-ninos',      cat: 'Niños',  sub: 'Tenis',      gen: 'Unisex' },
  { path: 'calzado-unisex',     cat: 'Unisex', sub: 'Tenis',      gen: 'Unisex' },
  { path: 'ropa-hombre',        cat: 'Hombre', sub: 'Ropa',       gen: 'Hombre' },
  { path: 'ropa-mujer',         cat: 'Mujer',  sub: 'Ropa',       gen: 'Mujer'  },
  { path: 'ropa-ninos',         cat: 'Niños',  sub: 'Ropa',       gen: 'Unisex' },
  { path: 'accesorios-hombre',  cat: 'Hombre', sub: 'Accesorios', gen: 'Hombre' },
  { path: 'accesorios-mujer',   cat: 'Mujer',  sub: 'Accesorios', gen: 'Mujer'  },
]

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

function awinIdToUuid(id) {
  const hash = createHash('sha256').update(`adidas-awin:${id}`).digest('hex')
  return [hash.slice(0,8), hash.slice(8,12), '4'+hash.slice(13,16),
    ((parseInt(hash[16],16)&0x3)|0x8).toString(16)+hash.slice(17,20), hash.slice(20,32)].join('-')
}

function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').substring(0,80)
}

function buildAwinUrl(productUrl) {
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_MID}&awinaffid=${AWIN_AFFID}&ued=${encodeURIComponent(productUrl)}`
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

// Extrae productos del HTML con regex — más rápido que jsdom
function extractFromHtml(html, catDef) {
  const products = []
  const seen = new Set()

  // Extraer bloques de producto del HTML
  // adidas.mx usa data attributes que aparecen en el HTML SSR
  // Buscar URLs de producto: /nombre-producto/ID.html
  const urlPattern = /href="(\/[a-z0-9\-]+\/([A-Z0-9]{5,10})\.html)"/g
  const urls = new Map()
  let m
  while ((m = urlPattern.exec(html)) !== null) {
    const path = m[1], id = m[2]
    if (!urls.has(id)) urls.set(id, path)
  }

  // Buscar datos de productos en el JSON embebido (Next.js __NEXT_DATA__)
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)
  if (nextDataMatch) {
    try {
      const nextData = JSON.parse(nextDataMatch[1])
      // Buscar productos en el árbol de datos de Next.js
      const findProducts = (obj) => {
        if (!obj || typeof obj !== 'object') return
        if (Array.isArray(obj)) { obj.forEach(findProducts); return }

        // Detectar objeto de producto
        if (obj.modelId || obj.productId || (obj.name && (obj.price !== undefined || obj.salePrice !== undefined))) {
          const id = String(obj.modelId ?? obj.productId ?? obj.id ?? '')
          const name = String(obj.displayName ?? obj.name ?? obj.title ?? '').trim()
          if (!id || !name || seen.has(id)) return
          seen.add(id)

          const priceObj = obj.price ?? {}
          const currentPrice = Number(priceObj.currentPrice ?? priceObj.value ?? obj.salePrice ?? obj.currentPrice ?? 0)
          const listPrice   = Number(priceObj.originalPrice ?? priceObj.standardPrice ?? obj.standardPrice ?? 0)

          const imgObj = obj.image ?? {}
          const image  = String(imgObj.src ?? imgObj.url ?? obj.imageUrl ?? obj.image ?? '')

          const productPath = String(obj.url ?? obj.link ?? obj.modelHref ?? urls.get(id) ?? '')
          const productUrl  = productPath.startsWith('http') ? productPath : `${BASE}${productPath}`

          const subtitle = String(obj.productType ?? obj.category ?? obj.division ?? '').trim()

          if (currentPrice > 0) {
            products.push({ id, name, subtitle, price: currentPrice,
              originalPrice: listPrice > currentPrice ? listPrice : null,
              image, url: productUrl, ...catDef })
          }
          return
        }

        Object.values(obj).forEach(findProducts)
      }
      findProducts(nextData)
    } catch { /* ignore parse errors */ }
  }

  // Fallback: extraer precios del HTML si no encontramos en __NEXT_DATA__
  if (products.length === 0 && urls.size > 0) {
    // Intentar extraer de bloques de producto en el HTML
    const cardPattern = /data-testid="plp-product-card"[\s\S]{0,2000}?href="(\/[^"]+\.html)"/g
    let cardMatch
    while ((cardMatch = cardPattern.exec(html)) !== null) {
      const href = cardMatch[1]
      const idM = href.match(/\/([A-Z0-9]{5,10})\.html/)
      if (!idM || seen.has(idM[1])) continue
      seen.add(idM[1])
      // No tenemos precio/nombre en esta extracción
    }
  }

  return products
}

async function fetchPage(path, start) {
  const url = `${BASE}/${path}?start=${start}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'es-MX,es;q=0.9',
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

async function upsertBatch(rows) {
  const { error } = await supabase.from('products')
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: false })
  if (error) throw new Error(error.message)
}

let totalInserted = 0

for (const catDef of CATEGORIES) {
  console.log(`\n🔍 ${catDef.path}...`)
  const allProducts = new Map()
  let page = 0
  let maxPages = 50 // actualizado tras primera página

  while (page < maxPages) {
    const start = page * 48
    try {
      const html = await fetchPage(catDef.path, start)

      // Detectar total de páginas desde el HTML
      if (page === 0) {
        const pagMatch = html.match(/Página:\s*1\s*de\s*(\d+)/)
        if (pagMatch) {
          maxPages = parseInt(pagMatch[1])
          console.log(`  ${maxPages} páginas`)
        }
      }

      const products = extractFromHtml(html, catDef)
      let newCount = 0
      for (const p of products) {
        if (!allProducts.has(p.id)) { allProducts.set(p.id, p); newCount++ }
      }

      process.stdout.write(`\r  Página ${page+1}/${maxPages} | +${newCount} | Total: ${allProducts.size}   `)

      if (products.length === 0 && page > 2) break // dejar de paginar si no hay más

    } catch (err) {
      console.error(`\n  Error página ${page}: ${err.message}`)
    }

    page++
    await delay(300)
  }

  // Subir a Supabase
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

  if (rows.length === 0) { console.log('\n  ⚠️  Sin productos'); continue }

  let catInserted = 0
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    try {
      await upsertBatch(rows.slice(i, i + BATCH_SIZE))
      catInserted += Math.min(BATCH_SIZE, rows.length - i)
    } catch (e) {
      console.error(`\n  Error upsert: ${e.message}`)
    }
  }

  totalInserted += catInserted
  console.log(`\n  ✅ ${catInserted} subidos`)
}

console.log(`\n🎉 Total insertado: ${totalInserted}`)
