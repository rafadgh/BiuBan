/**
 * fix-missing-images.mjs
 * Reintenta obtener imágenes para productos sin imagen en Supabase.
 */

import { createClient } from '@supabase/supabase-js'
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

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchOgImage(url) {
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'es-MX,es;q=0.9',
      'Referer': 'https://www.mercadolibre.com.mx/',
    },
    signal: AbortSignal.timeout(12000),
  })
  if (!r.ok) return null
  const html = await r.text()
  const og = html.match(/property="og:image"\s+content="([^"]+)"/) ||
             html.match(/content="([^"]+)"\s+property="og:image"/)
  return og?.[1]?.replace('http://','https://') || null
}

// Obtener productos sin imagen
const { data: products, error } = await supabase
  .from('products')
  .select('id, sku, name, url, image')
  .is('image', null)
  .eq('store_type', 'mercadolibre')

if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

console.log(`\n🔍 ${products.length} productos sin imagen. Reintentando...\n`)

let fixed = 0

for (const prod of products) {
  // Usar URL del producto sin los params de afiliado
  const mlUrl = prod.url.split('?')[0]
  process.stdout.write(`⏳ ${prod.sku} — ${prod.name.slice(0, 40)}... `)

  try {
    const image = await fetchOgImage(mlUrl)
    if (image) {
      const { error: upErr } = await supabase
        .from('products')
        .update({ image })
        .eq('id', prod.id)

      if (upErr) {
        console.log(`❌ DB: ${upErr.message}`)
      } else {
        console.log(`✅ imagen obtenida`)
        fixed++
      }
    } else {
      console.log(`⚠️  sin og:image`)
    }
  } catch(e) {
    console.log(`❌ ${e.message.slice(0, 50)}`)
  }

  // Espera más larga para evitar rate limit
  await sleep(800 + Math.random() * 400)
}

console.log(`\n✅ ${fixed}/${products.length} imágenes recuperadas\n`)
