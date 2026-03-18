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

// Correcciones de typos para el buscador de sugerencias
const SUGGESTION_MISSPELLINGS: Record<string, string> = {
  hudi: 'hoodie', hudie: 'hoodie', hoodi: 'hoodie',
  oversise: 'oversized', oversize: 'oversized',
  teniz: 'tenis', tenniz: 'tenis', tenes: 'tenis',
  sniker: 'sneaker', snikers: 'sneakers', sneacker: 'sneaker',
  adiddas: 'adidas', adidass: 'adidas', adids: 'adidas', addidas: 'adidas',
  nikey: 'nike', nikee: 'nike',
  rebook: 'reebok', ribok: 'reebok',
  jordam: 'jordan', convers: 'converse',
  chamara: 'chamarra', jaket: 'jacket',
  yins: 'jeans', mezklilla: 'mezclilla',
}

// Términos de producto → términos a buscar en subcategory/category de la DB
// Permite: si el usuario escribe "tenis", buscamos marcas con subcategory ilike tenis|sneaker|shoe
const PRODUCT_TERM_MAP: Record<string, string[]> = {
  tenis:      ['tenis', 'sneaker', 'shoe', 'calzado'],
  sneakers:   ['sneaker', 'tenis', 'shoe'],
  sneaker:    ['sneaker', 'tenis'],
  zapatos:    ['zapato', 'shoe', 'calzado'],
  botas:      ['bota', 'boot'],
  playera:    ['playera', 't-shirt', 'camiseta', 'shirt'],
  playeras:   ['playera', 't-shirt', 'camiseta'],
  camiseta:   ['camiseta', 'playera', 't-shirt'],
  sudadera:   ['sudadera', 'hoodie', 'sweatshirt'],
  hoodie:     ['hoodie', 'sudadera', 'sweatshirt'],
  hoodies:    ['hoodie', 'sudadera'],
  chamarra:   ['chamarra', 'jacket', 'chaqueta'],
  chamarras:  ['chamarra', 'jacket'],
  jacket:     ['jacket', 'chamarra'],
  pantalon:   ['pantalon', 'pant', 'trouser'],
  pantalones: ['pantalon', 'pant'],
  pants:      ['pant', 'pantalon', 'jogger'],
  jeans:      ['jean', 'denim', 'mezclilla'],
  shorts:     ['short', 'bermuda'],
  vestido:    ['vestido', 'dress'],
  dress:      ['dress', 'vestido'],
  mochila:    ['mochila', 'backpack'],
  backpack:   ['backpack', 'mochila'],
  gorra:      ['gorra', 'cap', 'hat'],
  calcetines: ['calcetine', 'sock'],
  ropa:       ['ropa', 'playera', 'chamarra', 'pantalon'],
  calzado:    ['calzado', 'tenis', 'zapato', 'bota'],
  deporte:    ['deporte', 'sport', 'gym', 'running'],
  running:    ['running', 'correr', 'atletismo'],
  gym:        ['gym', 'fitness', 'training'],
}

export async function GET(req: NextRequest) {
  const rawQ = req.nextUrl.searchParams.get('q')?.trim() || ''
  if (rawQ.length < 2) return NextResponse.json([])

  // Corrección de typo si aplica
  const qCorrected = SUGGESTION_MISSPELLINGS[norm(rawQ)] ?? rawQ
  const q  = qCorrected
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

  // ─── 3. Si hay una marca clara, sugerir combinaciones marca + subcategoría ─
  if (brandList.length > 0) {
    const topBrand = brandList[0]
    const { data: catData } = await supabase
      .from('products')
      .select('subcategory, category')
      .eq('available', true)
      .ilike('brand', `%${topBrand}%`)
      .not('subcategory', 'is', null)
      .limit(60)

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

  // ─── 4. Si la query es un término de producto, sugerir marcas top con ese artículo ─
  // Ej: "tenis" → Nike tenis, Adidas tenis, New Balance tenis
  const productTerms = PRODUCT_TERM_MAP[qn]
  if (productTerms && brandList.length === 0) {
    // Construir condición OR para todos los términos del producto
    const catOrConds = productTerms
      .flatMap(t => [`subcategory.ilike.%${t}%`, `category.ilike.%${t}%`])
      .join(',')

    const { data: brandCatData } = await supabase
      .from('products')
      .select('brand, subcategory, category')
      .eq('available', true)
      .or(catOrConds)
      .limit(200)

    // Contar cuántos productos tiene cada marca en esa categoría
    const brandCounts: Record<string, number> = {}
    for (const row of brandCatData || []) {
      const b = (row.brand || '').trim()
      if (b) brandCounts[b] = (brandCounts[b] || 0) + 1
    }

    const topBrandsForCat = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([brand]) => brand)

    // Usar la primera subcategoría como etiqueta amigable
    const firstSub = (brandCatData?.[0]?.subcategory || brandCatData?.[0]?.category || q).trim()
    const displayCat = firstSub.charAt(0).toUpperCase() + firstSub.slice(1)

    for (const brand of topBrandsForCat) {
      const text = `${brand} ${displayCat}`
      const key  = norm(text)
      if (!seen.has(key)) {
        seen.add(key)
        suggestions.push({
          text,
          sub: `${brand}`,
          type: 'busqueda',
          href: `/buscar?q=${encodeURIComponent(text)}`,
        })
      }
    }
  }

  // ─── 5. Categorías del catálogo que coinciden ────────────────────────────
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

  // ─── 6. Siempre ofrecer la búsqueda de texto libre ─────────────────────────
  if (suggestions.length > 0) {
    const key = `busqueda:${qn}`
    if (!seen.has(key)) {
      suggestions.push({
        text: rawQ !== q ? `${rawQ} → ${q}` : q,
        sub: 'Ver todos los resultados',
        type: 'busqueda',
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
