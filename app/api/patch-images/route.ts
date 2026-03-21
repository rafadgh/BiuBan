// app/api/patch-images/route.ts
// Recibe pares { sku, image } desde el browser y actualiza la DB

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { patches } = await req.json() as { patches: { sku: string; image: string }[] }
  if (!patches?.length) return NextResponse.json({ error: 'Sin datos' }, { status: 400 })

  let updated = 0
  const errors: string[] = []

  for (const { sku, image } of patches) {
    if (!sku || !image) continue
    const { error } = await supabase
      .from('products')
      .update({ image })
      .eq('sku', sku)
    if (error) errors.push(`${sku}: ${error.message}`)
    else updated++
  }

  return NextResponse.json({ ok: true, updated, errors })
}
