// app/api/awin-adidas-sync/route.ts
// Descarga el datafeed oficial de Awin (Adidas MX), parsea el gzip CSV y
// hace upsert en Supabase. Se ejecuta diario via cron en vercel.json.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import * as zlib from 'zlib'
import { parse } from 'csv-parse'
import { Readable } from 'stream'

export const maxDuration = 300

const BATCH_SIZE = 200

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toUuid(sku: string): string {
  const h = createHash('sha256').update(`adidas-awin:${sku}`).digest('hex')
  return [h.slice(0,8), h.slice(8,12), '4'+h.slice(13,16),
          ((parseInt(h[16],16)&0x3)|0x8).toString(16)+h.slice(17,20),
          h.slice(20,32)].join('-')
}

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'')
    .trim().replace(/\s+/g,'-').substring(0,80)
}

function baseSku(merchantProductId: string): string {
  return merchantProductId.split('-')[0].split('_')[0].trim()
}

function mapGender(suitableFor: string, ageGroup: string, merchantCategory: string): string {
  const s = suitableFor.toLowerCase()
  const a = ageGroup.toLowerCase()
  const c = merchantCategory.toLowerCase()
  if (a.includes('kid') || c.includes('niño') || c.includes('kids') || c.includes('junior')) return 'Niños'
  if (s === 'female' || c.includes('/mujer')) return 'Mujer'
  if (s === 'male'   || c.includes('/hombre')) return 'Hombre'
  if (c.includes('mujer') || c.includes('women')) return 'Mujer'
  if (c.includes('hombre') || c.includes('men')) return 'Hombre'
  return 'Unisex'
}

function mapCategory(merchantCategory: string): string {
  const c = merchantCategory.toLowerCase()
  if (c.includes('calzado') || c.includes('tenis') || c.includes('zapato') ||
      c.includes('sandal')  || c.includes('shoes') || c.includes('sneaker') ||
      c.includes('botas')   || c.includes('running')) return 'Tenis'
  if (c.includes('accesorio') || c.includes('bolsa') || c.includes('mochila') ||
      c.includes('gorra')     || c.includes('bag')   || c.includes('accessory')) return 'Accesorios'
  return 'Ropa'
}

function mapSubcategory(merchantCategory: string): string {
  const c = merchantCategory.toLowerCase()
  if (c.includes('camiseta') || c.includes('jersey') || c.includes('shirt')) return 'Camisetas'
  if (c.includes('pantalon') || c.includes('pants')  || c.includes('short') || c.includes('legging')) return 'Pantalones'
  if (c.includes('chaqueta') || c.includes('chamarra')|| c.includes('jacket')|| c.includes('hoodie') || c.includes('sudadera')) return 'Chaquetas'
  if (c.includes('calzado')  || c.includes('tenis')  || c.includes('zapato') ||
      c.includes('sandal')   || c.includes('shoes')  || c.includes('sneaker') || c.includes('botas')) return 'Tenis'
  if (c.includes('gorra')    || c.includes('sombrero')|| c.includes('cap')   || c.includes('hat')) return 'Gorras'
  if (c.includes('mochila')  || c.includes('bolsa')  || c.includes('bag')) return 'Mochilas'
  if (c.includes('accesorio')|| c.includes('accessory')|| c.includes('calceta')|| c.includes('sock')) return 'Accesorios'
  return merchantCategory.split('/')[0]?.trim() || 'Ropa'
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (process.env.NODE_ENV === 'production' && secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const feedUrl = process.env.AWIN_FEED_URL
  if (!feedUrl) {
    return NextResponse.json({ error: 'AWIN_FEED_URL no configurada' }, { status: 500 })
  }

  // 1. Descargar el feed gzip
  const feedRes = await fetch(feedUrl, { signal: AbortSignal.timeout(120_000) })
  if (!feedRes.ok) {
    return NextResponse.json({ error: `Awin devolvió ${feedRes.status}` }, { status: 502 })
  }

  const gzipBuffer = Buffer.from(await feedRes.arrayBuffer())
  const csvBuffer  = zlib.gunzipSync(gzipBuffer)

  // 2. Parsear CSV y agrupar por URL de producto
  const productMap = new Map<string, {
    sku: string; name: string; description: string
    merchantCategory: string; suitableFor: string; ageGroup: string
    material: string; image: string; altImages: Set<string>
    colors: Set<string>; sizes: Set<string>; tags: Set<string>
    price: number; rrp: number; oldPrice: number; savePct: number
    deepLink: string; awDeepLink: string; inStock: boolean
  }>()

  await new Promise<void>((resolve, reject) => {
    const readable = Readable.from(csvBuffer.toString('utf8'))
    const parser   = parse({ columns: true, skip_empty_lines: true, trim: true, relax_column_count: true })

    parser.on('readable', () => {
      let row: Record<string, string>
      while ((row = parser.read()) !== null) {
        const deepLink = (row.merchant_deep_link || '').split('?')[0].trim()
        if (!deepLink) continue

        const price    = parseFloat(row.search_price)   || 0
        const rrp      = parseFloat(row.rrp_price)      || 0
        const oldPrice = parseFloat(row.product_price_old) || 0
        const savePct  = parseFloat(row.savings_percent) || 0

        // Talla: parte tras el último "_" en merchant_product_id
        const mpid  = row.merchant_product_id || ''
        const size  = mpid.includes('_') ? mpid.split('_').slice(1).join('_').trim() : ''

        // Color real está en alternate_image_four para Adidas MX
        const color = (row.alternate_image_four || '').trim()

        // Género: alternate_image_two=Male/Female/Unisex, alternate_image_three=Kids/Adult
        const genderHint = (row.alternate_image_two   || '').trim()
        const ageHint    = (row.alternate_image_three || '').trim()

        if (!productMap.has(deepLink)) {
          productMap.set(deepLink, {
            sku:             baseSku(mpid),
            name:            (row.product_name || '').replace(/\s*-\s*(Hombre|Mujer|Niño|Niña|Kids?|Unisex)$/i, '').trim(),
            description:     (row.description  || '').substring(0, 1000),
            merchantCategory: row.merchant_category || '',
            suitableFor:     genderHint,
            ageGroup:        ageHint,
            material:        (!row['Fashion:material'] || row['Fashion:material'].startsWith('http')) ? '' : row['Fashion:material'],
            image:           row.merchant_image_url || row.large_image || '',
            altImages:       new Set<string>(),
            colors:          new Set<string>(),
            sizes:           new Set<string>(),
            tags:            new Set<string>(),
            price, rrp, oldPrice, savePct,
            deepLink,
            awDeepLink:      row.aw_deep_link || '',
            inStock:         row.in_stock === '1',
          })
        }

        const p = productMap.get(deepLink)!
        if (size && !size.startsWith('http'))                   p.sizes.add(size)
        if (color && !color.startsWith('http'))                 p.colors.add(color)
        if (row['Fashion:suitable_for'])                        p.tags.add(row['Fashion:suitable_for'])
        if (row.alternate_image)                                p.altImages.add(row.alternate_image)
        if (row.large_image)                                    p.altImages.add(row.large_image)
        if (price > 0 && price < p.price)                      p.price    = price
        if (savePct > p.savePct) { p.savePct = savePct; p.oldPrice = oldPrice || rrp || p.oldPrice }
      }
    })

    parser.on('end',   resolve)
    parser.on('error', reject)
    readable.pipe(parser)
  })

  // 3. Transformar a rows de Supabase
  const rows = []
  for (const p of Array.from(productMap.values())) {
    if (!p.name || p.price <= 0) continue

    const gender      = mapGender(p.suitableFor, p.ageGroup, p.merchantCategory)
    const category    = gender === 'Niños' ? 'Niños' : mapCategory(p.merchantCategory)
    const subcategory = mapSubcategory(p.merchantCategory)
    const onSale      = p.savePct > 0 || (p.oldPrice > 0 && p.oldPrice > p.price)
    const discount    = p.savePct > 0 ? Math.round(p.savePct)
                      : (p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : null)
    const origPrice   = onSale && p.oldPrice > p.price ? p.oldPrice : null
    const affiliateUrl = p.awDeepLink ||
      `https://www.awin1.com/cread.php?awinmid=79918&awinaffid=2823908&ued=${encodeURIComponent(p.deepLink)}`
    const sizesArr  = p.sizes.size  > 0 ? Array.from(p.sizes)  : null
    const colorsArr = p.colors.size > 0 ? Array.from(p.colors) : null
    const altImgs   = Array.from(p.altImages).filter(i => i !== p.image).slice(0, 4)

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
      discount,
      image:            (p.image || '').substring(0, 500),
      url:              affiliateUrl,
      category,
      subcategory,
      gender,
      color:            colorsArr ? colorsArr[0].substring(0, 100) : null,
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
      additional_images: altImgs.length > 0 ? altImgs : null,
      tags:             p.tags.size > 0 ? Array.from(p.tags) : null,
    })
  }

  // 4. Borrar existentes e insertar nuevos
  // Validar que el feed tiene datos suficientes antes de borrar
  if (rows.length < 100) {
    return NextResponse.json({
      error: `Feed inválido o vacío: solo ${rows.length} productos válidos. Se canceló el sync para evitar borrar el catálogo.`,
    }, { status: 422 })
  }

  const { error: delError } = await supabase
    .from('products').delete().eq('store', 'Adidas')
  if (delError) {
    return NextResponse.json({ error: `Error borrando: ${delError.message}` }, { status: 500 })
  }

  let inserted = 0
  let errors   = 0
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const { error } = await supabase
      .from('products')
      .upsert(rows.slice(i, i + BATCH_SIZE), { onConflict: 'id', ignoreDuplicates: false })
    if (error) errors++
    else inserted += Math.min(BATCH_SIZE, rows.length - i)
  }

  return NextResponse.json({
    ok: true,
    total_productos: rows.length,
    insertados: inserted,
    errores: errors,
  })
}
