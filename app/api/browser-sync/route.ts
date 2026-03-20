// app/api/browser-sync/route.ts
// Recibe productos enviados desde el browser (donde ML sí responde)
// y los inserta en Supabase

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const AFFILIATE_ID = 'diezrafa20230122100014'

function mlIdToUuid(mlId: string): string {
  const hash = createHash('sha256').update(`ml:${mlId}`).digest('hex')
  return [hash.slice(0,8),hash.slice(8,12),'4'+hash.slice(13,16),((parseInt(hash[16],16)&0x3)|0x8).toString(16)+hash.slice(17,20),hash.slice(20,32)].join('-')
}

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').substring(0,80)
}

function buildAffiliateUrl(permalink: string): string {
  const sep = permalink.includes('?') ? '&' : '?'
  return `${permalink}${sep}matt_tool=${AFFILIATE_ID}&matt_source=affiliate&matt_campaign=biuban`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformItem(item: any, meta: { categoria: string; subcategoria?: string; genero?: string }) {
  const brand    = item.attributes?.find((a: any) => a.id === 'BRAND')?.value_name ?? null
  const color    = item.attributes?.find((a: any) => a.id === 'COLOR')?.value_name ?? null
  const gender   = item.attributes?.find((a: any) => a.id === 'GENDER')?.value_name ?? meta.genero ?? null
  const material = item.attributes?.find((a: any) => a.id === 'MATERIAL')?.value_name ?? null
  const sizes    = item.attributes?.filter((a: any) => a.id === 'SIZE' && a.value_name).map((a: any) => a.value_name) ?? []
  const price    = Number(item.price) || 0
  const origP    = item.original_price ? Number(item.original_price) : null
  const discount = origP && origP > price ? Math.round((1 - price / origP) * 100) : null
  const img      = (item.thumbnail || '').replace(/\/\d+-/, '/500-').replace('http://', 'https://')

  if (!item.id || price < 10) return null

  return {
    id:              mlIdToUuid(item.id),
    slug:            slugify(`${item.title}-${item.id}`),
    sku:             item.id,
    name:            item.title,
    brand:           brand ?? 'Sin marca',
    description:     item.title,
    store:           item.seller?.nickname ?? 'Mercado Libre',
    store_type:      'mercadolibre',
    price,
    original_price:  origP,
    discount,
    image:           img,
    url:             buildAffiliateUrl(item.permalink || ''),
    category:        meta.categoria,
    subcategory:     meta.subcategoria ?? null,
    gender,
    color,
    material,
    sizes_available: sizes.length > 0 ? sizes : null,
    available:       true,
    is_new:          item.condition === 'new',
    on_sale:         discount !== null && discount > 0,
    trending:        (item.sold_quantity ?? 0) > 100,
    best_option:     false,
    free_shipping:   item.shipping?.free_shipping ?? false,
    rating:          null,
    review_count:    null,
    additional_images: null,
  }
}

export async function POST(req: NextRequest) {
  // Verificar secret
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { items, meta } = body

  if (!items?.length || !meta?.categoria) {
    return NextResponse.json({ error: 'Faltan items o meta' }, { status: 400 })
  }

  const rows = items.map((item: any) => transformItem(item, meta)).filter(Boolean)

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0, message: 'Sin filas válidas' })
  }

  const { error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, inserted: rows.length })
}
