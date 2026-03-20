// test-ml2.mjs — Prueba con headers de browser real
const TESTS = [
  // Con headers de Chrome
  {
    label: 'Search con headers de Chrome',
    url: 'https://api.mercadolibre.com/sites/MLM/search?q=tenis&limit=2',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-MX,es;q=0.9',
      'Origin': 'https://www.mercadolibre.com.mx',
      'Referer': 'https://www.mercadolibre.com.mx/',
      'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    }
  },
  // Endpoint alternativo: highlights (featured products)
  {
    label: 'Featured deals (sin auth)',
    url: 'https://api.mercadolibre.com/sites/MLM/featured_deals',
    headers: { 'User-Agent': 'Mozilla/5.0' }
  },
  // Trending en categoría calzado
  {
    label: 'Trending calzado',
    url: 'https://api.mercadolibre.com/trends/MLM/MLM1276',
    headers: { 'User-Agent': 'Mozilla/5.0' }
  },
  // Trending general
  {
    label: 'Trending general',
    url: 'https://api.mercadolibre.com/trends/MLM',
    headers: { 'User-Agent': 'Mozilla/5.0' }
  },
  // Items por categoría directo
  {
    label: 'Items por categoría (Calzado)',
    url: 'https://api.mercadolibre.com/sites/MLM/search?category=MLM1276&limit=2',
    headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.mercadolibre.com.mx/' }
  },
]

for (const t of TESTS) {
  process.stdout.write(`🧪 ${t.label}... `)
  try {
    const r = await fetch(t.url, { headers: t.headers })
    const body = await r.text()
    if (r.ok) {
      const d = JSON.parse(body)
      const count = Array.isArray(d) ? d.length : (d.results?.length ?? '?')
      console.log(`✅ ${r.status} — ${count} items`)
      if (Array.isArray(d) && d.length > 0) console.log('   Ejemplo:', JSON.stringify(d[0]).slice(0, 100))
      if (d.results?.[0]) console.log('   Ejemplo:', d.results[0].title?.slice(0, 60), '| $', d.results[0].price)
    } else {
      console.log(`❌ ${r.status} — ${body.slice(0, 80)}`)
    }
  } catch(e) {
    console.log(`💥 Error: ${e.message}`)
  }
}
