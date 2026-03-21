/**
 * browser-fetch-images.js
 * ─────────────────────────────────────────────────────────────────────────────
 * INSTRUCCIONES:
 * 1. Abre Chrome y ve a cualquier página (ej. google.com)
 * 2. Abre DevTools → Console (F12 o Cmd+Option+J)
 * 3. Pega TODO este script y presiona Enter
 * 4. Espera ~2 min mientras descarga las imágenes
 * 5. Verás "✅ X imágenes actualizadas" al terminar
 * ─────────────────────────────────────────────────────────────────────────────
 */
(async () => {
  const PRODUCTS = [
    { sku: 'MLM2395817051', url: 'https://articulo.mercadolibre.com.mx/MLM-2395817051-tenis-adidas-tensaur-joven-jp9644-simipiel-ngo-22-25-_JM' },
    { sku: 'MLM3835195154', url: 'https://articulo.mercadolibre.com.mx/MLM-3835195154-tenis-adidas-tensaur-run-joven-jp9641-simipiel-bco-_JM' },
    { sku: 'MLM2119699269', url: 'https://articulo.mercadolibre.com.mx/MLM-2119699269-tenis-adidas-vl-court-30-id8797-adidas-_JM' },
    { sku: 'MLM2417314321', url: 'https://articulo.mercadolibre.com.mx/MLM-2417314321-tenis-adidas-casual-street-talk-hombre-blanco-jp8275-_JM' },
    { sku: 'MLM3835102268', url: 'https://articulo.mercadolibre.com.mx/MLM-3835102268-tenis-urbano-zap-tensaur-run30-el-c-adidas-9643-negro-nino-_JM' },
    { sku: 'MLM1459557671', url: 'https://articulo.mercadolibre.com.mx/MLM-1459557671-tenis-tensaur-sport-training-cierre-por-contacto-adidas-_JM' },
    { sku: 'MLM2202512503', url: 'https://articulo.mercadolibre.com.mx/MLM-2202512503-tenis-adidas-casual-vl-court-30-hombre-blanco-id6285-_JM' },
    { sku: 'MLM2824433914', url: 'https://articulo.mercadolibre.com.mx/MLM-2824433914-tenis-adidas-grand-court-platforma-ie1092-adidas-_JM' },
    { sku: 'MLM3510998772', url: 'https://articulo.mercadolibre.com.mx/MLM-3510998772-tenis-adidas-casual-cloudfoam-comfy-hombre-negro-ih2973-_JM' },
    { sku: 'MLM2128843049', url: 'https://articulo.mercadolibre.com.mx/MLM-2128843049-tenis-break-start-ih7963-adidas-_JM' },
    { sku: 'MLM3377638772', url: 'https://articulo.mercadolibre.com.mx/MLM-3377638772-tenis-adidas-grand-court-20-kids-ih5529-adidas-_JM' },
    { sku: 'MLM1459538436', url: 'https://articulo.mercadolibre.com.mx/MLM-1459538436-tenis-grand-court-para-tenis--blanco-adidas-_JM' },
    { sku: 'MLM1459589141', url: 'https://articulo.mercadolibre.com.mx/MLM-1459589141-tenis-grand-court-lifestyle-para-tenis--negro-adidas-_JM' },
    { sku: 'MLM2417327159', url: 'https://articulo.mercadolibre.com.mx/MLM-2417327159-tenis-adidas-casual-street-talk-hombre-negro-jp8276-_JM' },
    { sku: 'MLM2119631433', url: 'https://articulo.mercadolibre.com.mx/MLM-2119631433-tenis-adidas-grand-court-20-ninos-ie5995-adidas-_JM' },
    { sku: 'MLM3531305206', url: 'https://articulo.mercadolibre.com.mx/MLM-3531305206-tenis-adidas-correr-duramo-speed-2-hombre-negro-ih8201-_JM' },
    { sku: 'MLM3377694630', url: 'https://articulo.mercadolibre.com.mx/MLM-3377694630-tenis-adidas-vl-court-30-id6286-adidas-_JM' },
    { sku: 'MLM2353934757', url: 'https://articulo.mercadolibre.com.mx/MLM-2353934757-tenis-star-wars-grand-court-ji2842-adidas-_JM' },
    { sku: 'MLM3787198202', url: 'https://articulo.mercadolibre.com.mx/MLM-3787198202-jersey-de-local-del-club-america-hombre-2526-jn8612-adidas-_JM' },
    { sku: 'MLM950211934',  url: 'https://articulo.mercadolibre.com.mx/MLM-950211934-sandalias-adilette-aqua-unisex-negro-adidas-_JM' },
    { sku: 'MLM833829361',  url: 'https://articulo.mercadolibre.com.mx/MLM-833829361-sandalias-adilette-aqua-adidas-_JM' },
    { sku: 'MLM3507224498', url: 'https://articulo.mercadolibre.com.mx/MLM-3507224498-jersey-adidas-futbol-tiro-24-ninos-rojo-is1030-_JM' },
  ]

  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const patches = []

  console.log(`🚀 Obteniendo imágenes de ${PRODUCTS.length} productos Adidas...`)

  for (const p of PRODUCTS) {
    try {
      const res  = await fetch(p.url)
      const html = await res.text()
      const og   = html.match(/property="og:image"\s+content="([^"]+)"/) ||
                   html.match(/content="([^"]+)"\s+property="og:image"/)
      const img  = og?.[1]?.replace('http://', 'https://')
      if (img) {
        patches.push({ sku: p.sku, image: img })
        console.log(`✅ ${p.sku}: imagen OK`)
      } else {
        console.log(`⚠️  ${p.sku}: sin og:image`)
      }
    } catch(e) {
      console.log(`❌ ${p.sku}: ${e.message}`)
    }
    await sleep(300)
  }

  if (!patches.length) {
    console.log('❌ No se obtuvo ninguna imagen. ¿Tienes conexión?')
    return
  }

  console.log(`\n📤 Enviando ${patches.length} imágenes a BiuBan...`)

  const resp = await fetch('https://biuban.com/api/patch-images?secret=biuban-sync-2026', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patches }),
  })
  const result = await resp.json()
  console.log(`✅ ${result.updated} imágenes actualizadas en BiuBan!`, result.errors?.length ? result.errors : '')
})()
