/**
 * insert-affiliate-items.mjs
 * Toma los items del hub de afiliados de ML (con IDs reales),
 * los enriquece con imágenes via /items/{id} y los inserta en Supabase.
 */

import { createClient } from '@supabase/supabase-js'
import { createHash }   from 'crypto'
import { readFileSync }  from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(join(__dir, '../.env.local'), 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const [k, ...v] = line.split('=')
  if (k && v.length) env[k.trim()] = v.join('=').trim()
}

const supabase  = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])
const TOKEN     = env['ML_USER_TOKEN']
const AFFILIATE = 'diezrafa20230122100014'

function mlIdToUuid(id) {
  const h = createHash('sha256').update(`ml:${id}`).digest('hex')
  return [h.slice(0,8),h.slice(8,12),'4'+h.slice(13,16),((parseInt(h[16],16)&3)|8).toString(16)+h.slice(17,20),h.slice(20,32)].join('-')
}
function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,80)
}
function affUrl(url) {
  return url + (url.includes('?') ? '&' : '?') + `matt_tool=${AFFILIATE}&matt_source=affiliate&matt_campaign=biuban`
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── Los productos del hub de afiliados ──────────────────────────────────────
const AFFILIATE_ITEMS = [
  {"item_id":"MLM1310989364","title":"Tenis Para Hombre Nike Court Royale","url":"https://articulo.mercadolibre.com.mx/MLM-1310989364-tenis-para-hombre-nike-court-royale-_JM","price_numeric":899.4,"brand":"Nike"},
  {"item_id":"MLM3488709256","title":"Tenis Para Hombre Nike Air Force 1 '07 Cw2288-111","url":"https://articulo.mercadolibre.com.mx/MLM-3488709256-tenis-para-hombre-nike-air-force-1-07-cw2288-111-_JM","price_numeric":2599,"brand":"Nike"},
  {"item_id":"MLM1402410801","title":"Tenis Para Hombre Nike Court Vision Low Next Nature","url":"https://articulo.mercadolibre.com.mx/MLM-1402410801-tenis-para-hombre-nike-court-vision-low-next-nature-_JM","price_numeric":1457,"brand":"Nike"},
  {"item_id":"MLM3737082250","title":"Tenis Para Correr Hombre Nike Revolution 8 Negro Hj9198-003","url":"https://articulo.mercadolibre.com.mx/MLM-3737082250-tenis-para-correr-hombre-nike-revolution-8-negro-hj9198-003-_JM","price_numeric":1376,"brand":"Nike"},
  {"item_id":"MLM1456737041","title":"Tenis Para Mujer Nike Court Legacy Lift","url":"https://articulo.mercadolibre.com.mx/MLM-1456737041-tenis-para-mujer-nike-court-legacy-lift-_JM","price_numeric":1293,"brand":"Nike"},
  {"item_id":"MLM1535528501","title":"Tenis Training Hombre Nike Legend Essential3 Next Nature","url":"https://articulo.mercadolibre.com.mx/MLM-1535528501-tenis-training-hombre-nike-legend-essential3-next-nature-_JM","price_numeric":1189,"brand":"Nike"},
  {"item_id":"MLM2715339162","title":"Tenis Para Niños Infantil Nike Court Borough Low Blanco","url":"https://articulo.mercadolibre.com.mx/MLM-2715339162-tenis-para-ninos-infantil-nike-court-borough-low-blanco-_JM","price_numeric":971.19,"brand":"Nike"},
  {"item_id":"MLM1402417597","title":"Tenis Para Mujer Nike Court Vision Low Next Nature","url":"https://articulo.mercadolibre.com.mx/MLM-1402417597-tenis-para-mujer-nike-court-vision-low-next-nature-_JM","price_numeric":1457,"brand":"Nike"},
  {"item_id":"MLM1953469971","title":"Tenis Para Niños Talla Grande Nike Court Borough Mid 2","url":"https://articulo.mercadolibre.com.mx/MLM-1953469971-tenis-para-ninos-talla-grande-nike-court-borough-mid-2-_JM","price_numeric":1236,"brand":"Nike"},
  {"item_id":"MLM1402398156","title":"Tenis Para Mujer Nike Court Legacy Next Nature","url":"https://articulo.mercadolibre.com.mx/MLM-1402398156-tenis-para-mujer-nike-court-legacy-next-nature-_JM","price_numeric":1019,"brand":"Nike"},
  {"item_id":"MLM1905776927","title":"Tenis Para Niños Grandes Nike Court Borough Low Recraft Rojo","url":"https://articulo.mercadolibre.com.mx/MLM-1905776927-tenis-para-ninos-grandes-nike-court-borough-low-recraft-rojo-_JM","price_numeric":1161,"brand":"Nike"},
  {"item_id":"MLM3740433278","title":"Tenis Para Correr De Niños Nike Cosmic Runner Hm4402-001","url":"https://articulo.mercadolibre.com.mx/MLM-3740433278-tenis-para-correr-de-ninos-nike-cosmic-runner-hm4402-001-_JM","price_numeric":974.25,"brand":"Nike"},
  {"item_id":"MLM1988952481","title":"Tenis Para Niños De Preescolar Nike Court Borough Low","url":"https://articulo.mercadolibre.com.mx/MLM-1988952481-tenis-para-ninos-de-preescolar-nike-court-borough-low-_JM","price_numeric":1146,"brand":"Nike"},
  {"item_id":"MLM3785497720","title":"Tenis Para Niños Nike Court Borough Low Recraft Dv5456-131","url":"https://articulo.mercadolibre.com.mx/MLM-3785497720-tenis-para-ninos-nike-court-borough-low-recraft-dv5456-131-_JM","price_numeric":1394,"brand":"Nike"},
  {"item_id":"MLM2337637297","title":"Tenis Para Hombre Nike Court Shot Blanco Fq8146-111","url":"https://articulo.mercadolibre.com.mx/MLM-2337637297-tenis-para-hombre-nike-court-shot-blanco-fq8146-111-_JM","price_numeric":1079,"brand":"Nike"},
  {"item_id":"MLM3355387972","title":"Tenis Para Hombre Nike Court Vision Low Negro Hm9862-001","url":"https://articulo.mercadolibre.com.mx/MLM-3355387972-tenis-para-hombre-nike-court-vision-low-negro-hm9862-001-_JM","price_numeric":1457,"brand":"Nike"},
  {"item_id":"MLM2452108283","title":"Nike Revolution 8 Tenis Negros De Correr Para Hombre","url":"https://articulo.mercadolibre.com.mx/MLM-2452108283-nike-revolution-8-tenis-negros-de-correr-para-hombre-_JM","price_numeric":1699,"brand":"Nike"},
  {"item_id":"MLM1317019316","title":"Tenis Para Hombre Nike Ebernon Low","url":"https://articulo.mercadolibre.com.mx/MLM-1317019316-tenis-para-hombre-nike-ebernon-low-_JM","price_numeric":1039,"brand":"Nike"},
  {"item_id":"MLM2262864656","title":"Tenis Para Hombre Nike Air Max Correlate","url":"https://articulo.mercadolibre.com.mx/MLM-2262864656-tenis-para-hombre-nike-air-max-correlate-_JM","price_numeric":2299,"brand":"Nike"},
  {"item_id":"MLM2957685420","title":"Tenis Para Hombre Nike Flight Legacy Blanco","url":"https://articulo.mercadolibre.com.mx/MLM-2957685420-tenis-para-hombre-nike-flight-legacy-blanco-_JM","price_numeric":1889,"brand":"Nike"},
  {"item_id":"MLM1402498382","title":"Tenis Para Hombre Nike Court Vision Mid Next Nature","url":"https://articulo.mercadolibre.com.mx/MLM-1402498382-tenis-para-hombre-nike-court-vision-mid-next-nature-_JM","price_numeric":1329,"brand":"Nike"},
  {"item_id":"MLM2148424315","title":"Tenis Para Mujer Nike Air Max Axis Negro Aa2168-002","url":"https://articulo.mercadolibre.com.mx/MLM-2148424315-tenis-para-mujer-nike-air-max-axis-negro-aa2168-002-_JM","price_numeric":1700,"brand":"Nike"},
  {"item_id":"MLM2487725175","title":"Nike Cortez Leather Tenis Rosas Para Mujer","url":"https://articulo.mercadolibre.com.mx/MLM-2487725175-nike-cortez-leather-tenis-rosas-para-mujer-_JM","price_numeric":1700,"brand":"Nike"},
  {"item_id":"MLM1990716688","title":"Tenis Para Mujer Nike Gamma Force","url":"https://articulo.mercadolibre.com.mx/MLM-1990716688-tenis-para-mujer-nike-gamma-force-_JM","price_numeric":2299,"brand":"Nike"},
  {"item_id":"MLM942668610","title":"Tenis Para Hombre Nike Court Vision Low Next Nature","url":"https://articulo.mercadolibre.com.mx/MLM-942668610-tenis-para-hombre-nike-court-vision-low-next-nature-_JM","price_numeric":1457,"brand":"Nike"},
  {"item_id":"MLM2262762926","title":"Tenis Para Hombre Nike Flight Legacy Azul/naranja","url":"https://articulo.mercadolibre.com.mx/MLM-2262762926-tenis-para-hombre-nike-flight-legacy-azulnaranja-_JM","price_numeric":1700,"brand":"Nike"},
  {"item_id":"MLM1986583183","title":"Tenis De Skateboarding Nike Sb Heritage Vulc Blanco/rojo","url":"https://articulo.mercadolibre.com.mx/MLM-1986583183-tenis-de-skateboarding-nike-sb-heritage-vulc-blancorojo-_JM","price_numeric":1259,"brand":"Nike"},
  {"item_id":"MLM1905775181","title":"Tenis Para Niños Grandes Nike Court Borough Low Recraft","url":"https://articulo.mercadolibre.com.mx/MLM-1905775181-tenis-para-ninos-grandes-nike-court-borough-low-recraft-_JM","price_numeric":1394,"brand":"Nike"},
]

// ─── Fetch imagen real de ML items API ────────────────────────────────────────
async function fetchItemDetails(itemId) {
  const id = itemId.replace('MLM-', 'MLM')
  const res = await fetch(`https://api.mercadolibre.com/items/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'User-Agent': 'BiuBan/1.0',
    }
  })
  if (!res.ok) return null
  return res.json()
}

// ─── Detectar género del título ───────────────────────────────────────────────
function detectGender(title) {
  const t = title.toLowerCase()
  if (t.includes('mujer') || t.includes('woman') || t.includes('niña')) return 'Mujer'
  if (t.includes('hombre') || t.includes('man') || t.includes('niño') || t.includes('nino')) return 'Hombre'
  if (t.includes('niños') || t.includes('ninos') || t.includes('infantil') || t.includes('preescolar')) return 'Kids'
  return null
}

// ─── Detectar categoría del título ────────────────────────────────────────────
function detectCategory(title) {
  const t = title.toLowerCase()
  if (t.includes('tenis') || t.includes('bota') || t.includes('sandalia') || t.includes('zapato')) return { cat: 'Calzado', sub: 'Tenis' }
  if (t.includes('chamarra') || t.includes('jacket')) return { cat: 'Hombre', sub: 'Chamarras' }
  if (t.includes('sudadera') || t.includes('hoodie')) return { cat: 'Hombre', sub: 'Sudaderas' }
  if (t.includes('vestido')) return { cat: 'Mujer', sub: 'Vestidos' }
  if (t.includes('bolsa') || t.includes('mochila')) return { cat: 'Accesorios', sub: 'Bolsas' }
  return { cat: 'Calzado', sub: 'Tenis' }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`\n🚀 Procesando ${AFFILIATE_ITEMS.length} productos del hub de afiliados...\n`)

const rows = []

for (const item of AFFILIATE_ITEMS) {
  process.stdout.write(`⏳ ${item.item_id} — ${item.title.slice(0, 40)}... `)
  try {
    const details = await fetchItemDetails(item.item_id)
    const img = details?.pictures?.[0]?.url?.replace('http://','https://').replace(/\/\d+x\d+\//,'/500x500/')
      || details?.thumbnail?.replace('http://','https://').replace(/\/\d+-/,'/500-')
      || null

    const { cat, sub } = detectCategory(item.title)
    const gen          = detectGender(item.title)
    const price        = item.price_numeric
    const origP        = details?.original_price || null
    const discount     = origP && origP > price ? Math.round((1 - price/origP)*100) : null

    rows.push({
      id:              mlIdToUuid(item.item_id),
      slug:            slugify(`${item.title}-${item.item_id}`),
      sku:             item.item_id,
      name:            item.title,
      brand:           item.brand || 'Sin marca',
      description:     item.title,
      store:           details?.seller_address?.city?.name || 'Mercado Libre',
      store_type:      'mercadolibre',
      price,
      original_price:  origP,
      discount,
      image:           img,
      url:             affUrl(item.url),
      category:        cat,
      subcategory:     sub,
      gender:          gen,
      color:           details?.attributes?.find(a => a.id === 'COLOR')?.value_name || null,
      material:        null,
      sizes_available: details?.variations?.map(v => v.attribute_combinations?.find(a => a.id === 'SIZE')?.value_name).filter(Boolean) || null,
      available:       true,
      is_new:          details?.condition === 'new',
      on_sale:         discount !== null && discount > 0,
      trending:        (details?.sold_quantity || 0) > 100,
      best_option:     false,
      free_shipping:   details?.shipping?.free_shipping || false,
      rating:          0,
      review_count:    0,
      additional_images: details?.pictures?.slice(1,4).map(p => p.url?.replace('http://','https://')) || null,
    })

    console.log(img ? `✅ con imagen` : `✅ sin imagen`)
  } catch(e) {
    console.log(`❌ ${e.message.slice(0,50)}`)
  }
  await sleep(250)
}

console.log(`\n💾 Insertando ${rows.length} productos en Supabase...`)

const BATCH = 20
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH)
  const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id', ignoreDuplicates: false })
  if (error) console.error(`❌ Batch: ${error.message}`)
  else console.log(`✅ Batch ${Math.floor(i/BATCH)+1}: ${batch.length} insertados`)
}

console.log(`\n🎉 ¡Listo! Abre https://biuban.com\n`)
