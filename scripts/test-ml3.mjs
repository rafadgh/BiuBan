// test-ml3.mjs — Prueba trending con token + endpoints alternativos
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(join(__dir, '../.env.local'), 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const [k, ...v] = line.split('=')
  if (k && v.length) env[k.trim()] = v.join('=').trim()
}

const USER_TOKEN = env['ML_USER_TOKEN']

// Renovar token con client_credentials
const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: env['ML_CLIENT_ID'],
    client_secret: env['ML_CLIENT_SECRET']
  })
})
const tokenData = await tokenRes.json()
const APP_TOKEN = tokenData.access_token
console.log('App token scope:', tokenData.scope?.slice(0, 80))
console.log()

const tests = [
  // Trending con user token
  { label: 'Trending MLM con USER token', url: 'https://api.mercadolibre.com/trends/MLM', token: USER_TOKEN },
  { label: 'Trending MLM con APP token',  url: 'https://api.mercadolibre.com/trends/MLM', token: APP_TOKEN },
  // Trending por categorías de moda
  { label: 'Trending Ropa Mujer con USER', url: 'https://api.mercadolibre.com/trends/MLM/MLM1430', token: USER_TOKEN },
  { label: 'Trending Calzado con USER',    url: 'https://api.mercadolibre.com/trends/MLM/MLM1276', token: USER_TOKEN },
  // Search con access_token en query param
  { label: 'Search ?access_token=USER',   url: `https://api.mercadolibre.com/sites/MLM/search?q=tenis&limit=2&access_token=${USER_TOKEN}`, token: null },
  // Highlights / homepage items
  { label: 'Highlights home',             url: 'https://api.mercadolibre.com/homes/MLM', token: USER_TOKEN },
  // Category items
  { label: 'Category search Ropa',        url: 'https://api.mercadolibre.com/sites/MLM/search?category=MLM1430&limit=3', token: USER_TOKEN },
]

for (const t of tests) {
  process.stdout.write(`🧪 ${t.label}... `)
  const headers = { 'User-Agent': 'BiuBan/1.0' }
  if (t.token) headers['Authorization'] = `Bearer ${t.token}`
  try {
    const r = await fetch(t.url, { headers })
    const body = await r.text()
    if (r.ok) {
      try {
        const d = JSON.parse(body)
        const count = Array.isArray(d) ? d.length : (d.results?.length ?? '?')
        console.log(`✅ ${r.status} — ${count} resultados`)
        if (Array.isArray(d) && d[0]) {
          console.log('   Primero:', typeof d[0] === 'string' ? d[0] : JSON.stringify(d[0]).slice(0,80))
        }
        if (d.results?.[0]) {
          console.log('   Primero:', d.results[0].title?.slice(0,60), '| $', d.results[0].price)
        }
      } catch { console.log(`✅ ${r.status} — (no JSON)`) }
    } else {
      console.log(`❌ ${r.status} — ${body.slice(0, 100)}`)
    }
  } catch(e) { console.log(`💥 ${e.message}`) }
}
