// scripts/upload-adidas.mjs
// Lee adidas_products.json y hace upsert en Supabase con deeplinks Awin

import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const AWIN_MID   = '79918'
const AWIN_AFFID = '2823908'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function awinIdToUuid(id) {
  const hash = createHash('sha256').update(`adidas-awin:${id}`).digest('hex')
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

function buildAwinDeeplink(productUrl) {
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_MID}&awinaffid=${AWIN_AFFID}&ued=${encodeURIComponent(productUrl)}`
}

const raw = JSON.parse(readFileSync('/Users/rafadiez/Downloads/adidas_products.json', 'utf8'))
console.log(`📦 ${raw.length} productos leídos`)

const rows = raw
  .filter(p => p.id && p.name && p.price > 0)
  .map(p => {
    const price     = Number(p.price) || 0
    const origPrice = Number(p.op)    || 0
    const discount  = origPrice > price ? Math.round((1 - price / origPrice) * 100) : null
    const productUrl = p.ru.startsWith('http') ? p.ru : `https://www.adidas.mx${p.ru}`

    return {
      id:               awinIdToUuid(p.id),
      slug:             slugify(`${p.name}-${p.id}`),
      sku:              p.id,
      name:             p.name.substring(0, 200),
      brand:            'Adidas',
      description:      p.name.substring(0, 500),
      store:            'Adidas',
      store_type:       'awin',
      price,
      original_price:   origPrice > price ? origPrice : null,
      discount,
      image:            (p.img || '').substring(0, 500),
      url:              buildAwinDeeplink(productUrl),
      category:         p.cat || 'Hombre',
      subcategory:      p.sub || 'Tenis',
      gender:           p.gen || 'Hombre',
      color:            null,
      material:         null,
      sizes_available:  null,
      available:        true,
      is_new:           false,
      on_sale:          (discount ?? 0) > 0,
      trending:         false,
      best_option:      false,
      free_shipping:    false,
      rating:           null,
      review_count:     0,
      additional_images: null,
      tags:             p.tag ? [p.tag] : null,
    }
  })

console.log(`✅ ${rows.length} rows válidos`)

const BATCH = 100
let inserted = 0
let errors = 0

for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH)
  const { error } = await supabase
    .from('products')
    .upsert(batch, { onConflict: 'id', ignoreDuplicates: false })

  if (error) {
    console.error(`❌ Batch ${i}-${i+BATCH}: ${error.message}`)
    errors++
  } else {
    inserted += batch.length
    process.stdout.write(`\r📤 ${inserted}/${rows.length}`)
  }
}

console.log(`\n\n🎉 Completado: ${inserted} insertados, ${errors} errores`)
