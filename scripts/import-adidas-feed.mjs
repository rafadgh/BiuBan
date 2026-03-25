// scripts/import-adidas-feed.mjs
// Lee el datafeed oficial de Awin (Adidas MX), borra lo anterior y sube todo limpio a Supabase

import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { createReadStream } from 'fs'
import zlib from 'zlib'
import { parse } from 'csv-parse'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const FEED_PATH    = process.env.FEED_PATH || '/Users/rafadiez/Downloads/datafeed_2823908.csv.gz'
const BATCH_SIZE   = 200

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Helpers ────────────────────────────────────────────────────────────────
function toUuid(sku) {
  const h = createHash('sha256').update(`adidas-awin:${sku}`).digest('hex')
  return [h.slice(0,8), h.slice(8,12), '4'+h.slice(13,16),
          ((parseInt(h[16],16)&0x3)|0x8).toString(16)+h.slice(17,20),
          h.slice(20,32)].join('-')
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'')
    .trim().replace(/\s+/g,'-').substring(0,80)
}

function baseSku(merchantProductId) {
  // "IN8132-0003_9-10 años" → "IN8132"
  return merchantProductId.split('-')[0].split('_')[0].trim()
}

function mapGender(suitableFor, ageGroup, merchantCategory) {
  const s = (suitableFor || '').toLowerCase()   // "male","female","unisex"
  const a = (ageGroup || '').toLowerCase()       // "kids","adult"
  const c = (merchantCategory || '').toLowerCase()
  if (a.includes('kid') || c.includes('niño') || c.includes('kids') || c.includes('junior')) return 'Niños'
  if (s === 'female' || c.includes('/mujer')) return 'Mujer'
  if (s === 'male' || c.includes('/hombre')) return 'Hombre'
  if (s === 'unisex') return 'Unisex'
  // Fallback to category keywords
  if (c.includes('mujer') || c.includes('women')) return 'Mujer'
  if (c.includes('hombre') || c.includes('men')) return 'Hombre'
  return 'Unisex'
}

function mapCategory(merchantCategory, fashionCategory) {
  const c = (merchantCategory || '').toLowerCase()
  const f = (fashionCategory || '').toLowerCase()
  if (c.includes('calzado') || c.includes('tenis') || c.includes('zapato') || c.includes('sandal') || c.includes('shoes') || c.includes('sneaker') || c.includes('botas') || c.includes('running') || f.includes('calzado')) return 'Tenis'
  if (c.includes('accesorio') || c.includes('bolsa') || c.includes('mochila') || c.includes('gorra') || c.includes('sombrero') || c.includes('bag') || c.includes('accessory')) return 'Accesorios'
  return 'Ropa'
}

function mapSubcategory(merchantCategory) {
  const c = (merchantCategory || '').toLowerCase()
  if (c.includes('camiseta') || c.includes('jersey') || c.includes('shirt')) return 'Camisetas'
  if (c.includes('pantalon') || c.includes('pants') || c.includes('short') || c.includes('legging')) return 'Pantalones'
  if (c.includes('chaqueta') || c.includes('chamarra') || c.includes('jacket') || c.includes('hoodie') || c.includes('sudadera')) return 'Chaquetas'
  if (c.includes('calzado') || c.includes('tenis') || c.includes('zapato') || c.includes('sandal') || c.includes('shoes') || c.includes('sneaker') || c.includes('botas')) return 'Tenis'
  if (c.includes('gorra') || c.includes('sombrero') || c.includes('cap') || c.includes('hat')) return 'Gorras'
  if (c.includes('mochila') || c.includes('bolsa') || c.includes('bag')) return 'Mochilas'
  if (c.includes('accesorio') || c.includes('accessory') || c.includes('calceta') || c.includes('sock') || c.includes('guante') || c.includes('glove')) return 'Accesorios'
  return merchantCategory?.split('/')[0]?.trim() || 'Ropa'
}

// ── Leer y agrupar el feed ─────────────────────────────────────────────────
console.log('📂 Leyendo feed...')

const productMap = new Map() // key = merchant_deep_link (URL base sin query)

await new Promise((resolve, reject) => {
  const stream = createReadStream(FEED_PATH).pipe(zlib.createGunzip())
  const parser = parse({ columns: true, skip_empty_lines: true, relax_quotes: true, trim: true })

  parser.on('readable', () => {
    let row
    while ((row = parser.read()) !== null) {
      const deepLink  = (row.merchant_deep_link || '').split('?')[0].trim()
      if (!deepLink) continue

      const price     = parseFloat(row.search_price) || 0
      const rrp       = parseFloat(row.rrp_price) || 0
      const oldPrice  = parseFloat(row.product_price_old) || 0
      const savePct   = parseFloat(row.savings_percent) || 0
      // Sizes: in merchant_product_id after last "_" (e.g. "IN8132-0003_9-10 años" → "9-10 años")
      const mpid      = (row.merchant_product_id || '')
      const sizeRaw   = mpid.includes('_') ? mpid.split('_').slice(1).join('_').trim() : ''
      const size      = sizeRaw
      // Color: Awin puts it in alternate_image_four for Adidas MX
      const color     = (row.alternate_image_four || '').trim()
      // Gender hint: alternate_image_two = "Male"/"Female"/"Unisex", alternate_image_three = "Kids"/"Adult"
      const genderHint  = (row.alternate_image_two || '').trim()
      const ageHint     = (row.alternate_image_three || '').trim()
      const inStock   = row.in_stock === '1'

      if (!productMap.has(deepLink)) {
        const sku = baseSku(row.merchant_product_id || '')
        productMap.set(deepLink, {
          sku,
          name:         (row.product_name || '').replace(/\s*-\s*(Hombre|Mujer|Niño|Niña|Kids?|Unisex)$/i, '').trim(),
          description:  (row.description || '').substring(0, 1000),
          merchantCategory: row.merchant_category || '',
          fashionCategory:  row['Fashion:suitable_for'] || '',  // sport (Fútbol, Training, etc.)
          suitableFor:  genderHint,   // Male/Female/Unisex
          ageGroup:     ageHint,      // Kids/Adult
          material:     row['Fashion:material']?.startsWith('http') ? '' : (row['Fashion:material'] || ''),
          image:        row.merchant_image_url || row.large_image || '',
          altImages:    new Set(),
          colors:       new Set(),
          sizes:        new Set(),
          price,
          rrp,
          oldPrice,
          savePct,
          deepLink,
          awDeepLink:   row.aw_deep_link || '',
          inStock,
          tags:         new Set(),
        })
      }

      const p = productMap.get(deepLink)
      // Acumular tallas y colores
      if (size) p.sizes.add(size)
      if (color && !color.startsWith('http')) p.colors.add(color)
      if (row['Fashion:category']) p.tags.add(row['Fashion:category'])
      // Imágenes adicionales
      if (row.large_image) p.altImages.add(row.large_image)
      if (row.alternate_image) p.altImages.add(row.alternate_image)
      if (row.alternate_image_two) p.altImages.add(row.alternate_image_two)
      // Precio mínimo (por si hay variantes con distintos precios)
      if (price > 0 && price < p.price) p.price = price
      // Descuento: tomar el mayor % que aparezca
      if (savePct > p.savePct) {
        p.savePct  = savePct
        p.oldPrice = oldPrice || rrp || p.oldPrice
      }
    }
  })

  parser.on('end', resolve)
  parser.on('error', reject)
  stream.pipe(parser)
})

console.log(`✅ ${productMap.size} productos únicos encontrados`)

// ── Transformar a rows de Supabase ─────────────────────────────────────────
const rows = []

for (const [url, p] of productMap) {
  if (!p.name || p.price <= 0) continue

  const gender      = mapGender(p.suitableFor, p.ageGroup, p.merchantCategory)
  const category    = mapCategory(p.merchantCategory, p.fashionCategory)
  const subcategory = mapSubcategory(p.merchantCategory)
  const onSale      = p.savePct > 0 || (p.oldPrice > 0 && p.oldPrice > p.price)
  const discount    = p.savePct > 0 ? Math.round(p.savePct)
                    : (p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : null)
  const origPrice   = onSale ? (p.oldPrice > p.price ? p.oldPrice : null) : null

  // URL de afiliado Awin usando el deeplink ya incluido en el feed
  const affiliateUrl = p.awDeepLink || `https://www.awin1.com/cread.php?awinmid=79918&awinaffid=2823908&ued=${encodeURIComponent(url)}`

  const sizesArr   = p.sizes.size > 0 ? [...p.sizes] : null
  const colorsArr  = p.colors.size > 0 ? [...p.colors] : null
  const mainColor  = colorsArr ? colorsArr[0] : null
  const altImgs    = [...p.altImages].filter(i => i !== p.image).slice(0, 4)

  rows.push({
    id:               toUuid(p.sku),
    slug:             slugify(`${p.name}-${p.sku}`),
    sku:              p.sku,
    name:             p.name.substring(0, 200),
    brand:            'Adidas',
    description:      p.description || p.name.substring(0, 500),
    store:            'Adidas',
    store_type:       'awin',
    price:            p.price,
    original_price:   origPrice,
    discount:         discount,
    image:            (p.image || '').substring(0, 500),
    additional_images: altImgs.length > 0 ? altImgs : null,
    url:              affiliateUrl,
    category:         gender === 'Niños' ? 'Niños' : category,  // categoría principal por gender
    subcategory:      subcategory,
    gender:           gender,
    color:            mainColor ? mainColor.substring(0, 100) : null,
    material:         p.material ? p.material.substring(0, 200) : null,
    sizes_available:  sizesArr,
    available:        p.inStock,
    is_new:           false,
    on_sale:          onSale,
    trending:         false,
    best_option:      false,
    free_shipping:    false,
    rating:           null,
    review_count:     0,
    tags:             p.tags.size > 0 ? [...p.tags] : null,
  })
}

console.log(`📦 ${rows.length} rows listos para subir`)

// ── Borrar Adidas existente ────────────────────────────────────────────────
console.log('🗑️  Borrando productos Adidas existentes...')
const { error: delError } = await supabase
  .from('products')
  .delete()
  .eq('store', 'Adidas')

if (delError) {
  console.error('❌ Error borrando:', delError.message)
  process.exit(1)
}
console.log('✅ Borrado completado')

// ── Insertar en batches ────────────────────────────────────────────────────
let inserted = 0
let errors   = 0

for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE)
  const { error } = await supabase
    .from('products')
    .upsert(batch, { onConflict: 'id', ignoreDuplicates: false })

  if (error) {
    console.error(`\n❌ Batch ${i}-${i+BATCH_SIZE}: ${error.message}`)
    errors++
  } else {
    inserted += batch.length
    process.stdout.write(`\r📤 ${inserted}/${rows.length} productos subidos...`)
  }
}

console.log(`\n\n🎉 ¡Completado! ${inserted} productos insertados, ${errors} errores`)
if (errors > 0) console.log('   Revisa los errores arriba ↑')
