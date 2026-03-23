// scripts/debug-levis.mjs — Muestra el HTML real de Levi's para entender su estructura
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const LEVIS_BASE   = 'https://www.levi.com'
const LEVIS_LOCALE = 'es-MX'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    locale: 'es-MX',
    viewport: { width: 1440, height: 900 },
    extraHTTPHeaders: { 'Accept-Language': 'es-MX,es;q=0.9' },
  })

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
    window.chrome = { runtime: {} }
  })

  const page = await context.newPage()

  // Capturar todas las respuestas de red para ver si hay llamadas AJAX con JSON
  const jsonResponses = []
  page.on('response', async res => {
    const ct = res.headers()['content-type'] || ''
    if (ct.includes('json') && res.url().includes('levi')) {
      try {
        const body = await res.text()
        if (body.length > 100 && body.length < 500000) {
          jsonResponses.push({ url: res.url(), body: body.substring(0, 2000) })
        }
      } catch {}
    }
  })

  console.log('Cargando homepage...')
  await page.goto(`${LEVIS_BASE}/${LEVIS_LOCALE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2000)

  console.log('Navegando a mens-jeans...')
  await page.goto(`${LEVIS_BASE}/${LEVIS_LOCALE}/c/mens-jeans/?sz=60`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  }).catch(() => {})

  await page.waitForTimeout(3000)

  // Screenshot
  await page.screenshot({ path: 'scripts/levis-debug.png', fullPage: false })
  console.log('📸 Screenshot guardado en scripts/levis-debug.png')

  // HTML completo
  const html = await page.content()
  writeFileSync('scripts/levis-debug.html', html)
  console.log(`📄 HTML guardado (${html.length} chars)`)

  // Analizar el HTML
  const analysis = await page.evaluate(() => {
    const info = {
      title: document.title,
      url: location.href,
      selectors: {},
      scriptTypes: [],
      dataAttrs: [],
    }

    // Qué selectores existen
    const toCheck = [
      '[data-pid]', '[data-product]', '.product-tile', '.c-product-tile',
      '.product-grid', '.product-listing', '.search-result-content',
      '.product-card', '[data-product-id]', '.tile-body', '.pdp-link',
      '[class*="product"]', '[class*="tile"]', '[class*="grid"]',
    ]
    toCheck.forEach(sel => {
      const count = document.querySelectorAll(sel).length
      if (count > 0) info.selectors[sel] = count
    })

    // Scripts con JSON
    document.querySelectorAll('script').forEach((s, i) => {
      const type = s.getAttribute('type') || 'text/javascript'
      const src = s.getAttribute('src') || ''
      const content = s.textContent.trim().substring(0, 200)
      if (type.includes('json') || content.includes('productSearch') || content.includes('products')) {
        info.scriptTypes.push({ i, type, src, content })
      }
    })

    // data-* attributes únicos en el body
    const attrs = new Set()
    document.querySelectorAll('*').forEach(el => {
      for (const attr of el.attributes) {
        if (attr.name.startsWith('data-')) attrs.add(attr.name)
      }
    })
    info.dataAttrs = [...attrs]

    // First 500 chars of body text
    info.bodyStart = document.body.innerHTML.substring(0, 500)

    return info
  })

  console.log('\n📊 ANÁLISIS DE LA PÁGINA:')
  console.log('URL:', analysis.url)
  console.log('Título:', analysis.title)
  console.log('\nSelectores encontrados:', analysis.selectors)
  console.log('\nData-attrs en el DOM:', analysis.dataAttrs.slice(0, 20))
  console.log('\nScripts con JSON/products:')
  analysis.scriptTypes.slice(0, 5).forEach(s => console.log(' -', JSON.stringify(s).substring(0, 200)))
  console.log('\nPrimeros 500 chars del body:', analysis.bodyStart)

  console.log('\n🌐 Respuestas JSON interceptadas:')
  jsonResponses.slice(0, 10).forEach(r => {
    console.log('\n URL:', r.url)
    console.log(' Body:', r.body.substring(0, 300))
  })

  await browser.close()
}

main().catch(console.error)
