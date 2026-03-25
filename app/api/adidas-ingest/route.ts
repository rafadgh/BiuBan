// app/api/adidas-ingest/route.ts
// Endpoint temporal: recibe array de productos raw desde el browser y los upserta en Supabase
// Solo funciona con el secret correcto

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

const AWIN_MID   = '79918'
const AWIN_AFFID = '2823908'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function awinIdToUuid(id: string): string {
  const hash = createHash('sha256').update(`adidas-awin:${id}`).digest('hex')
  return [
    hash.slice(0, 8), hash.slice(8, 12),
    '4' + hash.slice(13, 16),
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join('-')
}

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').substring(0, 80)
}

function buildAwinDeeplink(productUrl: string): string {
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_MID}&awinaffid=${AWIN_AFFID}&ued=${encodeURIComponent(productUrl)}`
}

// CORS headers para permitir peticiones desde cualquier origen (solo dev)
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401, headers: CORS })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400, headers: CORS })
  }

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Se esperaba un array' }, { status: 400, headers: CORS })
  }

  const rows = body.map((p: Record<string, unknown>) => {
    const id       = String(p.id ?? '')
    const name     = String(p.name ?? '').substring(0, 200)
    const price    = Number(p.price) || 0
    const origPrice = Number(p.op) || 0
    const discount = origPrice > price ? Math.round((1 - price / origPrice) * 100) : null
    const image    = String(p.img ?? '').substring(0, 500)
    const rawUrl   = String(p.ru ?? '')
    const categoria    = String(p.cat ?? 'Hombre')
    const subcategoria = String(p.sub ?? 'Tenis')
    const genero       = String(p.gen ?? 'Hombre')
    const subtitle     = p.tag ? String(p.tag) : null

    if (!id || !name || price <= 0) return null

    const productUrl = rawUrl.startsWith('http') ? rawUrl : `https://www.adidas.mx${rawUrl}`

    return {
      id:               awinIdToUuid(id),
      slug:             slugify(`${name}-${id}`),
      sku:              id,
      name,
      brand:            'Adidas',
      description:      name,
      store:            'Adidas',
      store_type:       'awin',
      price,
      original_price:   origPrice > price ? origPrice : null,
      discount,
      image,
      url:              buildAwinDeeplink(productUrl),
      category:         categoria,
      subcategory:      subcategoria,
      gender:           genero,
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
      tags:             subtitle ? [subtitle] : null,
    }
  }).filter(Boolean)

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0 }, { headers: CORS })
  }

  const { error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })
  }

  return NextResponse.json({ ok: true, inserted: rows.length }, { headers: CORS })
}
