// test-ml.mjs — Diagnóstico rápido de ML API
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

const USER_TOKEN    = env['ML_USER_TOKEN']
const CLIENT_ID     = env['ML_CLIENT_ID']
const CLIENT_SECRET = env['ML_CLIENT_SECRET']

console.log('Client ID:', CLIENT_ID)
console.log('User token (primeros 30):', USER_TOKEN?.slice(0, 30))
console.log()

// Test 1: /users/me con user token
console.log('1️⃣  /users/me con USER_TOKEN...')
const r1 = await fetch('https://api.mercadolibre.com/users/me', {
  headers: { Authorization: `Bearer ${USER_TOKEN}` }
})
console.log('   Status:', r1.status)
if (r1.ok) {
  const d = await r1.json()
  console.log('   Usuario:', d.nickname, '| Site:', d.site_id)
}

// Test 2: search SIN token
console.log('\n2️⃣  Search SIN token...')
const r2 = await fetch('https://api.mercadolibre.com/sites/MLM/search?q=tenis&limit=1')
console.log('   Status:', r2.status)
const b2 = await r2.text()
console.log('   Body:', b2.slice(0, 150))

// Test 3: search CON user token
console.log('\n3️⃣  Search CON USER_TOKEN...')
const r3 = await fetch('https://api.mercadolibre.com/sites/MLM/search?q=tenis&limit=1', {
  headers: { Authorization: `Bearer ${USER_TOKEN}`, 'User-Agent': 'BiuBan/1.0' }
})
console.log('   Status:', r3.status)
const b3 = await r3.text()
console.log('   Body:', b3.slice(0, 200))

// Test 4: client_credentials token
console.log('\n4️⃣  Generando client_credentials token...')
const r4 = await fetch('https://api.mercadolibre.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET })
})
console.log('   Status:', r4.status)
const d4 = await r4.json()
console.log('   Response:', JSON.stringify(d4).slice(0, 200))

if (d4.access_token) {
  console.log('\n5️⃣  Search CON app token (client_credentials)...')
  const r5 = await fetch('https://api.mercadolibre.com/sites/MLM/search?q=tenis&limit=1', {
    headers: { Authorization: `Bearer ${d4.access_token}`, 'User-Agent': 'BiuBan/1.0' }
  })
  console.log('   Status:', r5.status)
  const b5 = await r5.text()
  console.log('   Body:', b5.slice(0, 200))
}
