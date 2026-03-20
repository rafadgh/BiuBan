/**
 * insert-adidas.mjs — Productos Adidas del hub de afiliados
 */

import { createClient } from '@supabase/supabase-js'
import { createHash }   from 'crypto'
import { readFileSync }  from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync }      from 'child_process'

const __dir = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(join(__dir, '../.env.local'), 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const [k, ...v] = line.split('=')
  if (k && v.length) env[k.trim()] = v.join('=').trim()
}

const supabase  = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])
const AFFILIATE = 'diezrafa20230122100014'

function mlIdToUuid(id) {
  const h = createHash('sha256').update(`ml:${id}`).digest('hex')
  return [h.slice(0,8),h.slice(8,12),'4'+h.slice(13,16),((parseInt(h[16],16)&3)|8).toString(16)+h.slice(17,20),h.slice(20,32)].join('-')
}
function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,80)
}
function affUrl(url) {
  return url.split('?')[0] + `?matt_tool=${AFFILIATE}&matt_source=affiliate&matt_campaign=biuban`
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const ITEMS = [
  {"item_id":"MLM2395817051","title":"Tenis adidas Tensaur Joven Jp9644 Simipiel Ngo 22-25","url":"https://articulo.mercadolibre.com.mx/MLM-2395817051-tenis-adidas-tensaur-joven-jp9644-simipiel-ngo-22-25-_JM","price_numeric":699},
  {"item_id":"MLM3835195154","title":"Tenis adidas Tensaur Run Joven Jp9641 Simipiel Bco","url":"https://articulo.mercadolibre.com.mx/MLM-3835195154-tenis-adidas-tensaur-run-joven-jp9641-simipiel-bco-_JM","price_numeric":699},
  {"item_id":"MLM2119699269","title":"Tenis adidas Vl Court 3.0 Id8797 adidas","url":"https://articulo.mercadolibre.com.mx/MLM-2119699269-tenis-adidas-vl-court-30-id8797-adidas-_JM","price_numeric":1549},
  {"item_id":"MLM2417314321","title":"Tenis adidas Casual Street Talk Hombre Blanco Jp8275","url":"https://articulo.mercadolibre.com.mx/MLM-2417314321-tenis-adidas-casual-street-talk-hombre-blanco-jp8275-_JM","price_numeric":1349},
  {"item_id":"MLM3835102268","title":"Tenis Urbano Zap Tensaur Run3.0 El C adidas 9643 Negro Niño","url":"https://articulo.mercadolibre.com.mx/MLM-3835102268-tenis-urbano-zap-tensaur-run30-el-c-adidas-9643-negro-nino-_JM","price_numeric":699},
  {"item_id":"MLM1459557671","title":"Tenis Tensaur Sport Training Cierre Por Contacto adidas","url":"https://articulo.mercadolibre.com.mx/MLM-1459557671-tenis-tensaur-sport-training-cierre-por-contacto-adidas-_JM","price_numeric":577},
  {"item_id":"MLM2202512503","title":"Tenis adidas Casual Vl Court 3.0 Hombre Blanco Id6285","url":"https://articulo.mercadolibre.com.mx/MLM-2202512503-tenis-adidas-casual-vl-court-30-hombre-blanco-id6285-_JM","price_numeric":1599},
  {"item_id":"MLM2824433914","title":"Tenis adidas Grand Court Platforma Ie1092 adidas","url":"https://articulo.mercadolibre.com.mx/MLM-2824433914-tenis-adidas-grand-court-platforma-ie1092-adidas-_JM","price_numeric":1799},
  {"item_id":"MLM3510998772","title":"Tenis adidas Casual Cloudfoam Comfy Hombre Negro Ih2973","url":"https://articulo.mercadolibre.com.mx/MLM-3510998772-tenis-adidas-casual-cloudfoam-comfy-hombre-negro-ih2973-_JM","price_numeric":1399},
  {"item_id":"MLM2128843049","title":"Tenis Break Start Ih7963 adidas","url":"https://articulo.mercadolibre.com.mx/MLM-2128843049-tenis-break-start-ih7963-adidas-_JM","price_numeric":1299},
  {"item_id":"MLM3377638772","title":"Tenis adidas Grand Court 2.0 Kids Ih5529 adidas","url":"https://articulo.mercadolibre.com.mx/MLM-3377638772-tenis-adidas-grand-court-20-kids-ih5529-adidas-_JM","price_numeric":765},
  {"item_id":"MLM1459538436","title":"Tenis Grand Court Para Tenis -blanco adidas","url":"https://articulo.mercadolibre.com.mx/MLM-1459538436-tenis-grand-court-para-tenis--blanco-adidas-_JM","price_numeric":862},
  {"item_id":"MLM1459589141","title":"Tenis Grand Court Lifestyle Para Tenis - Negro adidas","url":"https://articulo.mercadolibre.com.mx/MLM-1459589141-tenis-grand-court-lifestyle-para-tenis--negro-adidas-_JM","price_numeric":1249},
  {"item_id":"MLM2417327159","title":"Tenis adidas Casual Street Talk Hombre Negro Jp8276","url":"https://articulo.mercadolibre.com.mx/MLM-2417327159-tenis-adidas-casual-street-talk-hombre-negro-jp8276-_JM","price_numeric":1349},
  {"item_id":"MLM2119631433","title":"Tenis adidas Grand Court 2.0 Niños Ie5995 adidas","url":"https://articulo.mercadolibre.com.mx/MLM-2119631433-tenis-adidas-grand-court-20-ninos-ie5995-adidas-_JM","price_numeric":814},
  {"item_id":"MLM3531305206","title":"Tenis adidas Correr Duramo Speed 2 Hombre Negro Ih8201","url":"https://articulo.mercadolibre.com.mx/MLM-3531305206-tenis-adidas-correr-duramo-speed-2-hombre-negro-ih8201-_JM","price_numeric":2299},
  {"item_id":"MLM3377694630","title":"Tenis adidas Vl Court 3.0 Id6286 adidas","url":"https://articulo.mercadolibre.com.mx/MLM-3377694630-tenis-adidas-vl-court-30-id6286-adidas-_JM","price_numeric":1599},
  {"item_id":"MLM2353934757","title":"Tenis Star Wars Grand Court Ji2842 adidas","url":"https://articulo.mercadolibre.com.mx/MLM-2353934757-tenis-star-wars-grand-court-ji2842-adidas-_JM","price_numeric":972},
  {"item_id":"MLM3787198202","title":"Jersey De Local Del Club América Hombre 25/26 Jn8612 adidas","url":"https://articulo.mercadolibre.com.mx/MLM-3787198202-jersey-de-local-del-club-america-hombre-2526-jn8612-adidas-_JM","price_numeric":1103},
  {"item_id":"MLM950211934","title":"Sandalias Adilette Aqua (unisex) Negro adidas","url":"https://articulo.mercadolibre.com.mx/MLM-950211934-sandalias-adilette-aqua-unisex-negro-adidas-_JM","price_numeric":599},
  {"item_id":"MLM833829361","title":"Sandalias Adilette Aqua adidas","url":"https://articulo.mercadolibre.com.mx/MLM-833829361-sandalias-adilette-aqua-adidas-_JM","price_numeric":599},
  {"item_id":"MLM3507224498","title":"Jersey adidas Fútbol Tiro 24 Niños Rojo Is1030","url":"https://articulo.mercadolibre.com.mx/MLM-3507224498-jersey-adidas-futbol-tiro-24-ninos-rojo-is1030-_JM","price_numeric":285},
]

function detectMeta(title) {
  const t = title.toLowerCase()
  // Género
  let gender = null
  if (t.includes('hombre') || t.includes('men')) gender = 'Hombre'
  else if (t.includes('mujer') || t.includes('women')) gender = 'Mujer'
  else if (t.includes('niño') || t.includes('nino') || t.includes('niños') || t.includes('kids') || t.includes('joven') || t.includes('star wars')) gender = 'Kids'
  else if (t.includes('unisex')) gender = null

  // Categoría / subcategoría
  let cat = 'Calzado', sub = 'Tenis'
  if (t.includes('sandalia') || t.includes('adilette') || t.includes('slide')) {
    cat = 'Calzado'; sub = 'Sandalias'
  } else if (t.includes('jersey') || t.includes('fútbol') || t.includes('futbol')) {
    cat = 'Deportes'; sub = 'Fútbol'
    if (!gender) gender = t.includes('niños') || t.includes('ninos') ? 'Kids' : 'Hombre'
  }

  return { cat, sub, gender }
}

function fetchOgImage(url) {
  try {
    const html = execSync(
      `curl -s -L --max-time 12 -A "Googlebot/2.1 (+http://www.google.com/bot.html)" "${url}"`,
      { encoding: 'utf8', timeout: 14000 }
    )
    const og = html.match(/og:image[^>]+content="([^"]+)"/) ||
               html.match(/content="([^"]+)"[^>]+og:image/)
    return og?.[1]?.replace('http://','https://') || null
  } catch {
    return null
  }
}

console.log(`\n🚀 Procesando ${ITEMS.length} productos Adidas...\n`)

const rows = []

for (const item of ITEMS) {
  process.stdout.write(`⏳ ${item.item_id} — ${item.title.slice(0, 50)}... `)
  try {
    const image = fetchOgImage(item.url)
    const { cat, sub, gender } = detectMeta(item.title)

    rows.push({
      id:              mlIdToUuid(item.item_id),
      slug:            slugify(`${item.title}-${item.item_id}`),
      sku:             item.item_id,
      name:            item.title,
      brand:           'Adidas',
      description:     item.title,
      store:           'Mercado Libre',
      store_type:      'mercadolibre',
      price:           item.price_numeric,
      original_price:  null,
      discount:        null,
      image,
      url:             affUrl(item.url),
      category:        cat,
      subcategory:     sub,
      gender,
      color:           null,
      material:        null,
      sizes_available: null,
      available:       true,
      is_new:          true,
      on_sale:         false,
      trending:        false,
      best_option:     false,
      free_shipping:   false,
      rating:          0,
      review_count:    0,
      additional_images: null,
    })

    console.log(image ? `✅ imagen OK` : `⚠️  sin imagen`)
  } catch(e) {
    console.log(`❌ ${e.message.slice(0,60)}`)
  }
  await sleep(400)
}

const withImage    = rows.filter(r => r.image)
const withoutImage = rows.filter(r => !r.image)
console.log(`\n📊 Con imagen: ${withImage.length} | Sin imagen: ${withoutImage.length}`)

if (!rows.length) { console.log('❌ Sin productos. Abortando.\n'); process.exit(0) }

console.log(`\n💾 Insertando ${rows.length} productos en Supabase (con y sin imagen)...`)

const BATCH = 20
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH)
  const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id', ignoreDuplicates: false })
  if (error) console.error(`❌ Batch: ${error.message}`)
  else console.log(`✅ Batch ${Math.floor(i/BATCH)+1}: ${batch.length} insertados`)
}

if (withoutImage.length) {
  console.log(`\n⚠️  ${withoutImage.length} productos sin imagen. Corre 'node scripts/fix-missing-images.mjs' en unas horas.`)
}
console.log(`\n🎉 ¡Listo! ${rows.length} productos Adidas en BiuBan\n`)
