// app/api/suggestions/route.ts
// Endpoint de autocompletado — llamado en cada keystroke desde SearchBar
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { toSlug, CATEGORIA_LABELS } from '@/lib/slug'

export interface Suggestion {
  text:  string
  sub?:  string                           // línea secundaria (ej. "Marca", "Categoría")
  type:  'marca' | 'categoria' | 'busqueda'
  href:  string
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() || ''
  if (q.length < 2) return NextResponse.json([])

  const qn = norm(q)
  const suggestions: Suggestion[] = []
  const seen = new Set<string>()

  // ─── 1. Marcas que empiezan con la query (mayor relevancia) ────────────────
  // ─── 2. Marcas que contienen la query   ────────────────────────────────────
  const [{ data: brandsStart }, { data: brandsContain }] = await Promise.all([
    supabase.from('products').select('brand').eq('available', true)
      .ilike('brand', `${q}%`).limit(4),
    supabase.from('products').select('brand').eq('available', true)
      .ilike('brand', `%${q}%`).limit(5),
  ])

  // Deduplicar: empieza-con primero, luego contiene
  const brandList = [
    ...new Set([
      ...(brandsStart  || []).map((d: {brand: string}) => d.brand),
      ...(brandsContain || []).map((d: {brand: string}) => d.brand),
    ].filter(Boolean)),
  ].slice(0, 3)

  for (const brand of brandList) {
    const key = norm(brand)
    if (seen.has(key)) continue
    seen.add(key)
    suggestions.push({ text: brand, sub: 'Marca', type: 'marca', href: `/marca/${toSlug(brand)}` })
  }

  // ─── 3. Si hay una marca clara, sugerir combinaciones marca + categoría ────
  if (brandList.length > 0) {
    const topBrand = brandList[0]
    const { data: catData } = await supabase
      .from('products')
      .select('subcategory, category')
      .eq('available', true)
      .ilike('brand', `%${topBrand}%`)
      .not('subcategory', 'is', null)
      .limit(60)

    // Contar subcategorías para mostrar las más frecuentes
    const counts: Record<string, number> = {}
    for (const d of catData || []) {
      const c = (d.subcategory || d.category || '').trim()
      if (c) counts[c] = (counts[c] || 0) + 1
    }
    const topCats = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([cat]) => cat)

    for (const cat of topCats) {
      const text = `${topBrand} ${cat}`
      const key  = norm(text)
      if (!seen.has(key)) {
        seen.add(key)
        suggestions.push({
          text, sub: 'Búsqueda', type: 'busqueda',
          href: `/buscar?q=${encodeURIComponent(text)}`,
        })
      }
    }
  }

  // ─── 4. Categorías del catálogo que coinciden ────────────────────────────
  for (const [slug, label] of Object.entries(CATEGORIA_LABELS)) {
    const labelNorm = norm(label)
    if (labelNorm.includes(qn) || slug.includes(qn)) {
      const displayLabel = label.split(' / ')[0]   // "Tenis / Sneakers" → "Tenis"
      const key = norm(displayLabel)
      if (!seen.has(key)) {
        seen.add(key)
        suggestions.push({ text: displayLabel, sub: 'Categoría', type: 'categoria', href: `/categoria/${slug}` })
      }
    }
    if (suggestions.length >= 7) break
  }

  // ─── 5. Siempre ofrecer la búsqueda de texto libre ─────────────────────────
  if (suggestions.length > 0) {
    const key = `busqueda:${qn}`
    if (!seen.has(key)) {
      suggestions.push({
        text: q, sub: 'Ver todos los resultados', type: 'busqueda',
        href: `/buscar?q=${encodeURIComponent(q)}`,
      })
    }
  }

  return NextResponse.json(suggestions.slice(0, 7), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
