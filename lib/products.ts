// lib/products.ts
import { supabase } from './supabase'
import type { Product } from '@/types/product'

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades de parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseTextArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map(i => i.trim()).filter(Boolean)
  }
  return undefined
}

function mapRow(row: Record<string, unknown>): Product {
  return {
    id:                 String(row.id ?? ''),
    nombre:             String(row.name ?? ''),
    slug:               row.slug ? String(row.slug) : undefined,
    marca:              String(row.brand ?? ''),
    modelo:             row.model ? String(row.model) : undefined,
    descripcion:        row.description ? String(row.description) : undefined,
    tienda:             String(row.store ?? ''),
    storeTipo:          row.store_type ? String(row.store_type) : undefined,
    precio:             Number(row.price ?? 0),
    precioOriginal:     row.original_price != null ? Number(row.original_price) : undefined,
    descuento:          row.discount != null ? Number(row.discount) : undefined,
    imagen:             row.image ? String(row.image) : undefined,
    url:                String(row.url ?? ''),
    categoria:          String(row.category ?? ''),
    subcategoria:       row.subcategory ? String(row.subcategory) : undefined,
    genero:             row.gender ? String(row.gender) : undefined,
    grupoEdad:          row.age_group ? String(row.age_group) : undefined,
    tallasDisponibles:  parseTextArray(row.sizes_available),
    tipoTalla:          row.size_type ? String(row.size_type) : undefined,
    color:              row.color ? String(row.color) : undefined,
    colorPrimario:      row.color_primary ? String(row.color_primary) : undefined,
    colorHex:           row.color_hex ? String(row.color_hex) : undefined,
    material:           row.material ? String(row.material) : undefined,
    estilo:             row.style ? String(row.style) : undefined,
    fit:                row.fit ? String(row.fit) : undefined,
    productGroup:       row.product_group ? String(row.product_group) : undefined,
    mejorOpcion:        Boolean(row.best_option ?? false),
    esNuevo:            Boolean(row.is_new ?? false),
    enOferta:           Boolean(row.on_sale ?? false),
    trending:           Boolean(row.trending ?? false),
    disponible:         Boolean(row.available ?? true),
    stockStatus:        row.stock_status ? String(row.stock_status) : undefined,
    envioGratis:        Boolean(row.free_shipping ?? false),
    tags:               parseTextArray(row.tags),
    // Catalogación extendida
    sku:                row.sku ? String(row.sku) : undefined,
    ocasion:            row.occasion ? String(row.occasion) : undefined,
    temporada:          row.season ? String(row.season) : undefined,
    coleccion:          row.collection ? String(row.collection) : undefined,
    instruccionesCuido: row.care_instructions ? String(row.care_instructions) : undefined,
    paisOrigen:         row.country_of_origin ? String(row.country_of_origin) : undefined,
    esSustentable:      Boolean(row.is_sustainable ?? false),
    caracteristicas:    parseTextArray(row.features),
    collab:             row.collab ? String(row.collab) : undefined,
    calificacion:       row.rating != null ? Number(row.rating) : undefined,
    numResenas:         row.review_count != null ? Number(row.review_count) : undefined,
    imagenesAdicionales: parseTextArray(row.additional_images),
  }
}

function isDiscountedProduct(p: Product): boolean {
  return (
    (typeof p.descuento === 'number' && p.descuento > 0) ||
    p.enOferta === true ||
    (typeof p.precioOriginal === 'number' && p.precioOriginal > 0 && p.precio < p.precioOriginal)
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Paginación automática — obtiene TODOS los resultados de Supabase
// Supabase PostgREST limita a 1000 rows por request; esta función los pagina
// ─────────────────────────────────────────────────────────────────────────────

const DB_PAGE_SIZE = 1000

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function paginateAll(buildQ: () => any): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = []
  let offset = 0
  while (true) {
    const { data, error } = await buildQ().range(offset, offset + DB_PAGE_SIZE - 1)
    if (error) { throw new Error(`[BiuBan] Supabase error: ${error.message}`) }
    if (!data || data.length === 0) break
    all.push(...(data as Record<string, unknown>[]))
    if (data.length < DB_PAGE_SIZE) break
    offset += DB_PAGE_SIZE
  }
  return all
}

// ─────────────────────────────────────────────────────────────────────────────
// Corrección de errores tipográficos y deletreo común
// Los términos aquí mapean a su forma correcta; en expandMainTerms se agregan
// AMBOS (el original y la corrección) para maximizar resultados.
// ─────────────────────────────────────────────────────────────────────────────

const MISSPELLINGS: Record<string, string> = {
  // Hoodies / Sudaderas
  hudi:          'hoodie',    hudie:        'hoodie',    hudis:       'hoodies',
  huddie:        'hoodie',    hoodi:        'hoodie',    soudadera:   'sudadera',
  sudader:       'sudadera',
  // Oversize
  oversise:      'oversized', oversaiz:     'oversized', overse:      'oversized',
  oversize:      'oversized',
  // Tenis / Sneakers
  teniz:         'tenis',     tenniz:       'tenis',     tenes:       'tenis',
  sniker:        'sneaker',   snikers:      'sneakers',  sneacker:    'sneaker',
  sneackers:     'sneakers',  sneekers:     'sneakers',  sneiker:     'sneaker',
  // Playera / Camiseta
  plyera:        'playera',   camizeta:     'camiseta',
  tshirt:        't-shirt',   tshirts:      't-shirt',
  // Chamarra / Jacket
  chamara:       'chamarra',  jaket:        'jacket',    jakets:      'jacket',
  // Jeans / Pantalón
  yins:          'jeans',     gin:          'jeans',     gins:        'jeans',
  mezklilla:     'mezclilla', mezcilla:     'mezclilla',
  // Running / Deporte
  runnig:        'running',   runnin:       'running',   runin:       'running',
  // Calzado
  calsado:       'calzado',   zapatila:     'zapatillas',
  // Accesorios
  cachucha:      'gorra',     cachuchas:    'gorras',    goras:       'gorras',
  mochilla:      'mochila',   mochillas:    'mochilas',
  // Shorts / Calcetines
  shoort:        'short',     shors:        'shorts',    bermuda:     'bermudas',
  calsetines:    'calcetines', calcetine:   'calcetines',
  // Marcas
  adiddas:       'adidas',    adidass:      'adidas',    adids:       'adidas',
  addidas:       'adidas',    adidaas:      'adidas',
  nikey:         'nike',      nikee:        'nike',      nkee:        'nike',
  rebook:        'reebok',    ribok:        'reebok',    rebok:       'reebok',
  jordam:        'jordan',    convers:      'converse',  converce:    'converse',
  newbalance:    'new balance', vanz:       'vans',
  // Colores
  blaco:         'blanco',    asul:         'azul',      griss:       'gris',
  // Deporte
  basquetbol:    'basketball', basquet:     'basketball', soccer:     'futbol',
}

// ─────────────────────────────────────────────────────────────────────────────
// Sinónimos de términos generales (ropa, calzado, etc.)
// ─────────────────────────────────────────────────────────────────────────────

const SINONIMOS: Record<string, string[]> = {
  tenis:      ['sneakers', 'zapatillas', 'sneaker', 'tennis', 'kicks', 'shoe', 'shoes'],
  sneakers:   ['tenis', 'zapatillas', 'tennis', 'kicks', 'shoes'],
  sneaker:    ['tenis', 'zapatillas', 'sneakers'],
  zapatos:    ['shoes', 'calzado', 'zapatillas'],
  shoes:      ['zapatos', 'tenis', 'calzado'],
  botas:      ['boots', 'bota', 'botines'],
  boots:      ['botas', 'bota', 'botines'],
  playera:    ['t-shirt', 'tshirt', 'camiseta', 'shirt', 'tee', 'playeras'],
  playeras:   ['t-shirt', 'tshirt', 'camiseta', 'shirt', 'tee', 'playera'],
  camiseta:   ['playera', 't-shirt', 'shirt', 'tee'],
  sudadera:   ['hoodie', 'hoodies', 'sweatshirt', 'sweater', 'sudaderas'],
  hoodie:     ['sudadera', 'sudaderas', 'hoodies', 'sweatshirt', 'sweater'],
  hoodies:    ['sudadera', 'sudaderas', 'hoodie', 'sweatshirt'],
  chamarra:   ['jacket', 'chaqueta', 'chamarras', 'coat'],
  chamarras:  ['jacket', 'chaqueta', 'chamarra', 'coat'],
  jacket:     ['chamarra', 'chaqueta', 'chamarras'],
  pantalon:   ['pants', 'pantalones', 'trousers'],
  pantalones: ['pants', 'trousers', 'pantalon'],
  pants:      ['pantalon', 'pantalones', 'joggers'],
  jeans:      ['mezclilla', 'vaqueros', 'denim'],
  shorts:     ['short', 'bermudas'],
  vestido:    ['dress', 'vestidos'],
  dress:      ['vestido', 'vestidos'],
  mochila:    ['backpack', 'bag', 'mochilas'],
  backpack:   ['mochila', 'mochilas', 'bag'],
  deportivo:  ['sport', 'athletic', 'activewear', 'gym', 'fitness'],
  gym:        ['deportivo', 'fitness', 'training', 'activewear'],
  running:    ['correr', 'atletismo', 'jogging'],
  gorra:      ['cap', 'hat', 'gorras', 'cachucha'],
}

// ─────────────────────────────────────────────────────────────────────────────
// Sinónimos de COLOR (para filtrar en memoria sobre el nombre del producto)
// ─────────────────────────────────────────────────────────────────────────────

const COLOR_SINONIMOS: Record<string, string[]> = {
  blanco:   ['blanco', 'white', 'blanc', 'crema', 'cream', 'off-white', 'beige', 'ivory', 'marfil'],
  white:    ['white', 'blanco', 'blanc', 'crema', 'cream', 'off-white'],
  negro:    ['negro', 'black', 'noir', 'negra'],
  black:    ['black', 'negro', 'noir'],
  gris:     ['gris', 'gray', 'grey', 'charcoal', 'ash', 'smoke'],
  gray:     ['gray', 'grey', 'gris', 'charcoal'],
  grey:     ['grey', 'gray', 'gris', 'charcoal'],
  azul:     ['azul', 'blue', 'navy', 'marino', 'celeste', 'cobalt', 'royal'],
  blue:     ['blue', 'azul', 'navy', 'celeste', 'cobalt'],
  navy:     ['navy', 'azul', 'marino', 'dark blue'],
  rojo:     ['rojo', 'red', 'crimson', 'scarlet', 'carmesi', 'coral'],
  red:      ['red', 'rojo', 'crimson', 'scarlet'],
  verde:    ['verde', 'green', 'olive', 'oliva', 'lime', 'mint', 'menta', 'forest'],
  green:    ['green', 'verde', 'olive', 'lime', 'mint'],
  rosa:     ['rosa', 'pink', 'rose', 'blush', 'coral', 'fucsia', 'fuchsia'],
  pink:     ['pink', 'rosa', 'rose', 'blush'],
  morado:   ['morado', 'purple', 'violet', 'violeta', 'lavender', 'lavanda', 'lilac'],
  purple:   ['purple', 'morado', 'violet'],
  amarillo: ['amarillo', 'yellow', 'gold', 'dorado', 'mustard', 'mostaza'],
  yellow:   ['yellow', 'amarillo', 'gold', 'mustard'],
  naranja:  ['naranja', 'orange', 'amber', 'ambar'],
  orange:   ['orange', 'naranja', 'amber'],
  cafe:     ['cafe', 'café', 'brown', 'marron', 'marrón', 'chocolate', 'camel', 'tan', 'mocha'],
  brown:    ['brown', 'cafe', 'café', 'chocolate', 'camel', 'tan'],
  beige:    ['beige', 'crema', 'cream', 'sand', 'arena', 'tan', 'khaki', 'caqui'],
  dorado:   ['dorado', 'gold', 'golden', 'champagne'],
  plateado: ['plateado', 'silver', 'plata'],
  multicolor: ['multicolor', 'multi', 'colorful', 'estampado', 'printed'],
}

// Normaliza texto: minúsculas, sin acentos
function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

// Términos de género para detectarlos en la query
const GENDER_TERMS: Record<string, string> = {
  hombre:    'hombre',
  hombres:   'hombre',
  masculino: 'hombre',
  masculina: 'hombre',
  male:      'hombre',
  men:       'hombre',
  man:       'hombre',
  mens:      'hombre',
  mujer:     'mujer',
  mujeres:   'mujer',
  femenino:  'mujer',
  femenina:  'mujer',
  female:    'mujer',
  women:     'mujer',
  woman:     'mujer',
  womens:    'mujer',
  dama:      'mujer',
  damas:     'mujer',
  nino:      'nino',
  ninos:     'nino',
  nina:      'nina',
  ninas:     'nina',
  kids:      'nino',
  kid:       'nino',
  infantil:  'nino',
  junior:    'nino',
  unisex:    'unisex',
}

// Resuelve un término de color (incluyendo plurales/femeninos en español)
// Devuelve la clave canónica de COLOR_SINONIMOS o null si no es un color
function resolveColorTerm(word: string): string | null {
  const t = norm(word)

  // Coincidencia directa con clave
  if (COLOR_SINONIMOS[t]) return t

  // Coincidencia como sinónimo
  for (const [key, syns] of Object.entries(COLOR_SINONIMOS)) {
    if (syns.map(norm).includes(t)) return key
  }

  // Intentar formas plurales y femeninas del español:
  // blancos → blanco, negras → negro, azules → azul, morada → morado, blanca → blanco
  const variants: string[] = []
  if (t.endsWith('es'))   variants.push(t.slice(0, -2))           // azules→azul, verdes→verde
  if (t.endsWith('os'))   variants.push(t.slice(0, -1))           // blancos→blanco, negros→negro
  if (t.endsWith('as'))   variants.push(t.slice(0, -1), t.slice(0, -2) + 'o') // blancas→blanca,blanco
  if (t.endsWith('s') && !t.endsWith('es') && !t.endsWith('os') && !t.endsWith('as'))
    variants.push(t.slice(0, -1))  // grays→gray
  // Femenino singular: morada→morado, blanca→blanco, amarilla→amarillo, dorada→dorado
  if (!t.endsWith('s') && t.endsWith('a') && t.length > 3)
    variants.push(t.slice(0, -1) + 'o')

  for (const v of variants) {
    if (COLOR_SINONIMOS[v]) return v
    for (const [key, syns] of Object.entries(COLOR_SINONIMOS)) {
      if (syns.map(norm).includes(v)) return key
    }
  }

  return null
}

// Dado un término, devuelve todos sus sinónimos de color
function getColorSynonyms(term: string): string[] {
  const result = new Set<string>()
  const canonical = resolveColorTerm(term)
  if (!canonical) return []

  result.add(canonical)
  result.add(norm(term))

  // Todos los sinónimos de la clave canónica
  COLOR_SINONIMOS[canonical]?.forEach(s => result.add(norm(s)))

  // Claves donde canonical aparece como sinónimo
  for (const [key, syns] of Object.entries(COLOR_SINONIMOS)) {
    if (syns.map(norm).includes(canonical)) {
      result.add(norm(key))
      syns.forEach(s => result.add(norm(s)))
    }
  }

  return Array.from(result)
}

// Detecta si una palabra es un color conocido (incluyendo plurales)
function isColorTerm(word: string): boolean {
  return resolveColorTerm(word) !== null
}

// Detecta si una palabra es un término de género
function isGenderTerm(word: string): boolean {
  return norm(word) in GENDER_TERMS
}

// Separa la query en palabras de color, género y palabras normales
function splitQuery(query: string): {
  mainWords: string[]
  colorWords: string[]
  genderWords: string[]
} {
  const words = query.trim().split(/\s+/).filter(Boolean)
  const mainWords: string[] = []
  const colorWords: string[] = []
  const genderWords: string[] = []

  for (const w of words) {
    if (isColorTerm(w)) {
      colorWords.push(w)
    } else if (isGenderTerm(w)) {
      genderWords.push(GENDER_TERMS[norm(w)])
    } else {
      mainWords.push(w)
    }
  }

  return { mainWords, colorWords, genderWords }
}

// Expande palabras principales usando sinónimos + corrección de typos
function expandMainTerms(words: string[]): string[] {
  const all = new Set<string>()

  for (const w of words) {
    const t = norm(w)
    all.add(t)

    // Corrección de deletreo: si hay una versión correcta, la agrega TAMBIÉN
    const corrected = MISSPELLINGS[t]
    if (corrected) {
      all.add(norm(corrected))
      // Expande sinónimos de la forma corregida también
      const corrSyns = SINONIMOS[norm(corrected)]
      if (corrSyns) corrSyns.forEach(s => all.add(norm(s)))
    }

    // Sinónimos del término original
    const syns = SINONIMOS[t]
    if (syns) syns.forEach(s => all.add(norm(s)))

    for (const [key, list] of Object.entries(SINONIMOS)) {
      if (list.map(norm).includes(t)) {
        all.add(norm(key))
        list.forEach(s => all.add(norm(s)))
      }
    }
  }

  return Array.from(all)
}

// Verifica si un producto coincide con los colores dados
// SOLO busca en nombre y campos de color (NO en descripcion — Adidas menciona todos los colores disponibles en la descripcion)
function productMatchesColor(product: Product, colorWords: string[]): boolean {
  if (colorWords.length === 0) return true

  // Separa colores compuestos "Negro/Blanco" en partes individuales para match exacto
  const colorParts = [
    ...(product.color ?? '').split('/').map(c => norm(c.trim())),
    ...(product.colorPrimario ?? '').split('/').map(c => norm(c.trim())),
  ].filter(Boolean)

  const nameText = norm(product.nombre)

  return colorWords.every(cw => {
    const synonyms = getColorSynonyms(cw)
    // Primero: match contra campos de color (exacto por parte)
    if (colorParts.length > 0) {
      return synonyms.some(s => colorParts.some(part => part.includes(s) || s.includes(part)))
    }
    // Fallback: busca en el nombre del producto (NO descripcion)
    return synonyms.some(s => nameText.includes(s))
  })
}

// Verifica si un producto coincide con las tallas dadas
// Busca en el campo sizes_available Y en el nombre del producto
function productMatchesTalla(product: Product, tallas: string[]): boolean {
  if (tallas.length === 0) return true

  const searchText = norm([
    product.nombre,
    product.descripcion ?? '',
    product.tallasDisponibles?.join(' ') ?? '',
    product.tags?.join(' ') ?? '',
  ].join(' '))

  return tallas.some(talla => {
    const t = norm(talla)
    // Busca la talla como palabra completa o con espacios/guiones alrededor
    // Esto evita que talla "S" coincida con "Shoes"
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(^|\\s|-|/)${escaped}($|\\s|-|/|\\d)`, 'i')
    return regex.test(searchText) || searchText.includes(` ${t} `) || searchText.endsWith(` ${t}`)
  })
}

// Verifica si un producto coincide con el género dado
// Canonicaliza un término de filtro de género al valor que guarda la DB
function canonicalGender(g: string): string {
  const n = norm(g)
  if (['hombre', 'hombres', 'masculino', 'masculina', 'male', 'men', 'man', 'mens'].includes(n)) return 'hombre'
  if (['mujer', 'mujeres', 'femenino', 'femenina', 'female', 'women', 'woman', 'womens', 'dama', 'damas'].includes(n)) return 'mujer'
  if (['nino', 'niño', 'ninos', 'niños', 'boy', 'boys', 'kids', 'kid', 'child', 'children', 'infantil', 'junior'].includes(n)) return 'nino'
  if (['nina', 'niña', 'ninas', 'niñas', 'girl', 'girls'].includes(n)) return 'nina'
  if (n === 'unisex') return 'unisex'
  return n
}

function productMatchesGenero(product: Product, generos: string[]): boolean {
  if (generos.length === 0) return true

  // Usar el campo genero de la DB directamente (más fiable que buscar en el nombre)
  if (product.genero) {
    const productGender = canonicalGender(product.genero)
    return generos.some(g => canonicalGender(g) === productGender)
  }

  // Fallback: buscar en nombre con word boundaries para evitar "men" dentro de "women"
  const nameText = norm(product.nombre + ' ' + (product.descripcion ?? ''))
  return generos.some(g => {
    const canonical = canonicalGender(g)
    const patterns: Record<string, RegExp> = {
      hombre:  /\b(hombre|masculino|male|man)\b/,
      mujer:   /\b(mujer|femenina|female|woman|dama)\b/,
      nino:    /\b(nino|niño|boy|kids|infantil)\b/,
      nina:    /\b(nina|niña|girl|kids|infantil)\b/,
      unisex:  /\bunisex\b/,
    }
    return (patterns[canonical] ?? new RegExp(`\\b${canonical}\\b`)).test(nameText)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Interfaz pública
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchFilters {
  query?:     string
  categoria?: string
  marca?:     string
  tienda?:    string
  color?:     string
  talla?:     string
  genero?:    string
  precioMin?: string
  precioMax?: string
  descuento?: string
  ofertas?:   string
  mejor?:     string
  ordenar?:   string
}

// ─────────────────────────────────────────────────────────────────────────────
// Algoritmo "Mejor Opción" dinámico
// Agrupa por subcategoría, puntúa precio + descuento y marca los mejores
// ─────────────────────────────────────────────────────────────────────────────

function computeMejorOpcion(products: Product[]): Product[] {
  if (products.length === 0) return products

  // Agrupar por subcategoría (o categoría si no hay subcategoría)
  const groups = new Map<string, Product[]>()
  for (const p of products) {
    const key = (p.subcategoria || p.categoria || 'otros').toLowerCase().trim()
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(p)
  }

  // Calcular score de valor por grupo
  const scores = new Map<string, number>() // id → score

  for (const [, group] of groups) {
    if (group.length < 2) continue // grupo de 1: no hay con qué comparar

    const prices = group.map(p => p.precio).filter(v => v > 0)
    if (prices.length === 0) continue

    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    for (const p of group) {
      // Precio normalizado: 0 = más caro, 100 = más barato
      const priceScore = priceRange > 0
        ? ((maxPrice - p.precio) / priceRange) * 50
        : 50

      // Descuento: % directo o calculado desde precio original
      const discountPct = typeof p.descuento === 'number' && p.descuento > 0
        ? p.descuento
        : (typeof p.precioOriginal === 'number' && p.precioOriginal > p.precio && p.precioOriginal > 0)
          ? ((p.precioOriginal - p.precio) / p.precioOriginal) * 100
          : 0

      const discountScore = Math.min(discountPct, 80) * (50 / 80) // cap a 50 puntos

      scores.set(p.id, priceScore + discountScore)
    }
  }

  // Determinar el umbral: top ~15% o mínimo score de 55/100
  const allScores = Array.from(scores.values()).sort((a, b) => b - a)
  const topN = Math.max(1, Math.ceil(allScores.length * 0.15))
  const threshold = allScores[topN - 1] ?? 55

  // Re-mapear mejorOpcion dinámicamente
  return products.map(p => ({
    ...p,
    mejorOpcion: (scores.get(p.id) ?? 0) >= threshold && (scores.get(p.id) ?? 0) >= 40,
  }))
}

// ─────────────────────────────────────────────────────────────────────────────
// Función principal de búsqueda
// ─────────────────────────────────────────────────────────────────────────────

export async function searchProductsFromDB(filters: SearchFilters): Promise<Product[]> {
  const {
    query,
    categoria,
    marca,
    tienda,
    color,
    talla,
    genero,
    precioMin,
    precioMax,
    descuento,
    ofertas,
    mejor,
    ordenar,
  } = filters

  // ── Búsqueda de texto ────────────────────────────────────────────────────
  if (query?.trim()) {
    const { mainWords, colorWords: queryColorWords, genderWords: queryGenderWords } = splitQuery(query.trim())

    // Filtrar palabras de 1 carácter (artículos como "a", "e") para evitar %a% que devuelve todo
    const filteredMainWords = mainWords.filter(w => w.length > 1)

    if (filteredMainWords.length > 0) {
      // Una condición OR por palabra → chained .or() = AND entre palabras, OR dentro de sinónimos
      // "adidas tenis" → .or(adidas...).or(tenis|sneakers|...) = sólo productos que tienen AMBAS palabras
      const wordConditions = filteredMainWords.map(word => {
        const terms = expandMainTerms([word])
        return terms.flatMap(t => [
          `name.ilike.%${t}%`,
          `brand.ilike.%${t}%`,
          `category.ilike.%${t}%`,
          `subcategory.ilike.%${t}%`,
        ]).join(',')
      })

      // Factory function: reconstruye la query idéntica en cada llamada (para paginación)
      const buildQ = () => {
        let q = supabase.from('products').select('*').eq('available', true)
        for (const cond of wordConditions) q = q.or(cond)

        if (categoria) {
          const cats = categoria.split(',').map(c => c.trim()).filter(Boolean)
          const catConds = cats.flatMap(c => [`category.ilike.%${c}%`, `subcategory.ilike.%${c}%`])
          q = q.or(catConds.join(','))
        }
        if (marca) {
          const marcas = marca.split(',').map(m => m.trim()).filter(Boolean)
          q = marcas.length === 1
            ? q.ilike('brand', `%${marcas[0]}%`)
            : q.or(marcas.map(m => `brand.ilike.%${m}%`).join(','))
        }
        if (tienda) {
          const tiendas = tienda.split(',').map(t2 => t2.trim()).filter(Boolean)
          q = tiendas.length === 1
            ? q.ilike('store', `%${tiendas[0]}%`)
            : q.or(tiendas.map(t2 => `store.ilike.%${t2}%`).join(','))
        }
        if (precioMin) q = q.gte('price', Number(precioMin))
        if (precioMax) q = q.lte('price', Number(precioMax))
        if (descuento) q = q.gte('discount', Math.min(...descuento.split(',').map(Number).filter(n => !isNaN(n))))
        if (mejor === '1') q = q.eq('best_option', true)

        switch (ordenar) {
          case 'precio-asc':  q = q.order('price', { ascending: true }); break
          case 'precio-desc': q = q.order('price', { ascending: false }); break
          case 'descuento':   q = q.order('discount', { ascending: false, nullsFirst: false }); break
          default:            q = q.order('created_at', { ascending: false })
        }
        return q
      }

      const rawData = await paginateAll(buildQ)
      let products = rawData.map(row => mapRow(row))

      // ── Filtros en memoria ───────────────────────────────────────────────
      const allColorWords = [
        ...queryColorWords,
        ...(color ? color.split(',').map(c => c.trim()).filter(Boolean) : []),
      ]
      if (allColorWords.length > 0) {
        products = products.filter(p => productMatchesColor(p, allColorWords))
      }

      if (talla) {
        const tallas = talla.split(',').map(t2 => t2.trim()).filter(Boolean)
        products = products.filter(p => productMatchesTalla(p, tallas))
      }

      const allGenderWords = [
        ...queryGenderWords,
        ...(genero ? genero.split(',').map(g => g.trim()).filter(Boolean) : []),
      ]
      if (allGenderWords.length > 0) {
        products = products.filter(p => productMatchesGenero(p, allGenderWords))
      }

      if (ofertas === '1') {
        products = products.filter(isDiscountedProduct)
      }

      if (ordenar === 'descuento') {
        products = products.sort((a, b) => {
          const da = typeof a.descuento === 'number' ? a.descuento
            : (typeof a.precioOriginal === 'number' && a.precioOriginal > a.precio)
              ? ((a.precioOriginal - a.precio) / a.precioOriginal) * 100 : 0
          const db2 = typeof b.descuento === 'number' ? b.descuento
            : (typeof b.precioOriginal === 'number' && b.precioOriginal > b.precio)
              ? ((b.precioOriginal - b.precio) / b.precioOriginal) * 100 : 0
          return db2 - da
        })
      }

      return computeMejorOpcion(products)

    } else if (queryColorWords.length > 0 || queryGenderWords.length > 0) {
      // La query es SOLO colores/género (ej: "blanco", "hombre") → traer todo y filtrar en memoria
      // No aplicar filtro de texto en Supabase — fall-through intencional al código de abajo
    }
  }

  // ── Modo sin query de texto: aplicar filtros directamente en DB ──────────
  const buildQNoText = () => {
    let q = supabase.from('products').select('*').eq('available', true)

    if (categoria) {
      const cats = categoria.split(',').map(c => c.trim()).filter(Boolean)
      const catConds = cats.flatMap(c => [`category.ilike.%${c}%`, `subcategory.ilike.%${c}%`])
      q = q.or(catConds.join(','))
    }
    if (marca) {
      const marcas = marca.split(',').map(m => m.trim()).filter(Boolean)
      q = marcas.length === 1
        ? q.ilike('brand', `%${marcas[0]}%`)
        : q.or(marcas.map(m => `brand.ilike.%${m}%`).join(','))
    }
    if (tienda) {
      const tiendas = tienda.split(',').map(t2 => t2.trim()).filter(Boolean)
      q = tiendas.length === 1
        ? q.ilike('store', `%${tiendas[0]}%`)
        : q.or(tiendas.map(t2 => `store.ilike.%${t2}%`).join(','))
    }
    // Filtro de género directo en DB (evita traer todos y filtrar en memoria)
    if (genero) {
      const generos = genero.split(',').map(g => g.trim()).filter(Boolean)
      const dbGenders = [...new Set(generos.map(g => {
        const c = canonicalGender(g)
        if (c === 'hombre') return 'Hombre'
        if (c === 'mujer') return 'Mujer'
        if (c === 'nino') return 'Nino'
        if (c === 'nina') return 'Nina'
        if (c === 'unisex') return 'Unisex'
        return g
      }))]
      if (dbGenders.length === 1) {
        q = q.eq('gender', dbGenders[0])
      } else {
        q = q.or(dbGenders.map(g => `gender.eq.${g}`).join(','))
      }
    }
    // Color: filtrar en DB usando columna color (color_primary puede ser null)
    if (color) {
      const colors = color.split(',').map(c => c.trim()).filter(Boolean)
      if (colors.length > 0) {
        const colorConds = colors.flatMap(c => [
          `color.ilike.%${c}%`,
          `color_primary.ilike.%${c}%`,
        ]).join(',')
        q = q.or(colorConds)
      }
    }
    if (talla) {
      const tallas = talla.split(',').map(t => t.trim()).filter(Boolean)
      if (tallas.length > 0) q = q.overlaps('sizes_available', tallas)
    }
    if (precioMin) q = q.gte('price', Number(precioMin))
    if (precioMax) q = q.lte('price', Number(precioMax))
    if (descuento) {
      const vals = descuento.split(',').map(Number).filter(n => !isNaN(n))
      if (vals.length > 0) q = q.gte('discount', Math.min(...vals))
    }
    if (mejor === '1') q = q.eq('best_option', true)

    switch (ordenar) {
      case 'precio-asc':  q = q.order('price', { ascending: true }); break
      case 'precio-desc': q = q.order('price', { ascending: false }); break
      case 'descuento':   q = q.order('discount', { ascending: false, nullsFirst: false }); break
      default:            q = q.order('created_at', { ascending: false })
    }
    return q
  }

  const rawData = await paginateAll(buildQNoText)
  let products = rawData.map(row => mapRow(row))

  // Filtros en memoria para color, talla y género (sin query de texto)
  if (color) {
    const colores = color.split(',').map(c => c.trim()).filter(Boolean)
    products = products.filter(p => productMatchesColor(p, colores))
  }

  // Si la query era solo colores/género, también filtramos aquí
  const queryColorWords2 = query?.trim() ? splitQuery(query.trim()).colorWords : []
  const queryGenderWords2 = query?.trim() ? splitQuery(query.trim()).genderWords : []

  if (queryColorWords2.length > 0) {
    products = products.filter(p => productMatchesColor(p, queryColorWords2))
  }

  if (talla) {
    const tallas = talla.split(',').map(t2 => t2.trim()).filter(Boolean)
    products = products.filter(p => productMatchesTalla(p, tallas))
  }

  const allGenderWords2 = [
    ...queryGenderWords2,
    ...(genero ? genero.split(',').map(g => g.trim()).filter(Boolean) : []),
  ]
  if (allGenderWords2.length > 0) {
    products = products.filter(p => productMatchesGenero(p, allGenderWords2))
  }

  if (ofertas === '1') {
    products = products.filter(isDiscountedProduct)
  }

  if (ordenar === 'descuento') {
    products = products.sort((a, b) => {
      const da = typeof a.descuento === 'number' ? a.descuento
        : (typeof a.precioOriginal === 'number' && a.precioOriginal > a.precio)
          ? ((a.precioOriginal - a.precio) / a.precioOriginal) * 100 : 0
      const db2 = typeof b.descuento === 'number' ? b.descuento
        : (typeof b.precioOriginal === 'number' && b.precioOriginal > b.precio)
          ? ((b.precioOriginal - b.precio) / b.precioOriginal) * 100 : 0
      return db2 - da
    })
  }

  return computeMejorOpcion(products)
}

// ─────────────────────────────────────────────────────────────────────────────
// Expansión de meta-categorías → términos que se buscan en category/subcategory
const CATEGORIA_EXPANSION: Record<string, string[]> = {
  accesorios: ['accesorio', 'mochila', 'bolsa', 'bolso', 'gorra', 'sombrero',
               'calcetin', 'calcetín', 'cinturon', 'cinturón', 'cartera',
               'billetera', 'lente', 'gafa', 'bufanda', 'gorro', 'guante'],
  mochilas:   ['mochila', 'bolsa', 'bolso'],
  gorras:     ['gorra', 'sombrero'],
  calcetines: ['calcetin', 'calcetín', 'sock'],
  cinturones: ['cinturon', 'cinturón', 'belt'],
  carteras:   ['cartera', 'billetera', 'wallet'],
  bufandas:   ['bufanda', 'gorro', 'scarf'],
  lentes:     ['lente', 'gafa', 'sunglass', 'anteojos'],
  // Ropa interior
  'ropa-interior': ['ropa interior', 'boxer', 'bóxer', 'calzoncillo', 'brasier',
                    'sujetador', 'faja', 'moldeador', 'panty', 'media', 'panti'],
  boxers:          ['boxer', 'bóxer', 'calzoncillo', 'calzon', 'calzón'],
  brasieres:       ['brasier', 'bra', 'sujetador', 'top interior'],
  fajas:           ['faja', 'moldeador', 'body reductor', 'panty faja'],
  medias:          ['media', 'pantimedia', 'panti', 'calcetin largo', 'calcetín largo'],
}

function expandCategoria(slug: string): string[] {
  return CATEGORIA_EXPANSION[slug] ?? [slug]
}

// Helper: aplica filtros base a una query de Supabase (sin género, eso va en memoria)
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBaseFilters(q: any, filters: Pick<SearchFilters, 'query' | 'categoria' | 'marca' | 'tienda'>): any {
  if (filters.categoria) {
    const cats = filters.categoria.split(',').map(c => c.trim()).filter(Boolean)
    const expanded = cats.flatMap(expandCategoria)
    const catConds = expanded.flatMap(c => [`category.ilike.%${c}%`, `subcategory.ilike.%${c}%`])
    q = q.or(catConds.join(','))
  }
  if (filters.marca) {
    const marcas = filters.marca.split(',').map(m => m.trim()).filter(Boolean)
    q = marcas.length === 1 ? q.ilike('brand', `%${marcas[0]}%`) : q.or(marcas.map((m: string) => `brand.ilike.%${m}%`).join(','))
  }
  if (filters.tienda) {
    const tiendas = filters.tienda.split(',').map(t => t.trim()).filter(Boolean)
    q = tiendas.length === 1 ? q.ilike('store', `%${tiendas[0]}%`) : q.or(tiendas.map((t: string) => `store.ilike.%${t}%`).join(','))
  }
  if (filters.query?.trim()) {
    const { mainWords } = splitQuery(filters.query.trim())
    const filteredWords = mainWords.filter(w => w.length > 1)
    if (filteredWords.length > 0) {
      // AND entre palabras: cada palabra es un .or() separado
      for (const word of filteredWords) {
        const terms = expandMainTerms([word])
        const orConds = terms.flatMap(t => [
          `name.ilike.%${t}%`, `brand.ilike.%${t}%`,
          `category.ilike.%${t}%`, `subcategory.ilike.%${t}%`,
        ]).join(',')
        q = q.or(orConds)
      }
    }
  }
  return q
}

// ─────────────────────────────────────────────────────────────────────────────
// Facetas dinámicas para los filtros del sidebar
// Una sola query (sin loop de paginación) — mucho más rápido
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchFacets {
  colores:          string[]
  generos:          string[]
  tallas:           string[]
  subcategorias:    string[]
  marcas:           string[]
  tiendas:          string[]
  tieneDescuentos:  boolean
}

const FACET_GENDER_TERMS: Record<string, string[]> = {
  hombre: ['hombre', 'male', 'men', 'man', 'masculino'],
  mujer:  ['mujer', 'female', 'women', 'woman', 'femenino', 'dama'],
  nino:   ['nino', 'niño', 'boy', 'kids', 'kid', 'infantil', 'junior'],
  nina:   ['nina', 'niña', 'girl', 'kids', 'kid', 'infantil'],
  unisex: ['unisex'],
}

type FacetRow = { color_primary: string | null; gender: string | null; sizes_available: string[] | null; subcategory: string | null; brand: string | null; store: string | null; discount: number | null; on_sale: boolean | null }

function computeFacetsFromRows(rows: FacetRow[], generoFilter?: string, queryGenero?: string[]): SearchFacets {
  const allGenderWords = [
    ...(queryGenero ?? []),
    ...(generoFilter ? generoFilter.split(',').map(g => g.trim()).filter(Boolean) : []),
  ]

  let filtered = rows
  if (allGenderWords.length > 0) {
    filtered = rows.filter(r => {
      if (!r.gender) return false
      const g = norm(r.gender)
      return allGenderWords.some(gw => {
        const terms = FACET_GENDER_TERMS[norm(gw)] ?? [norm(gw)]
        return terms.some(t => g === t || g.includes(t))
      })
    })
  }

  // Tallas: extraer de TODOS los rows (no filtrados por género)
  // para que al buscar "jeans hombre" sigan apareciendo todas las tallas
  // disponibles en los resultados completos, no solo las del género seleccionado.
  return {
    colores:          [...new Set(filtered.map(r => r.color_primary).filter(Boolean) as string[])].map(norm),
    generos:          [...new Set(rows.map(r => r.gender).filter(Boolean) as string[])].map(norm),
    tallas:           [...new Set(rows.flatMap(r => r.sizes_available ?? []))],
    subcategorias:    [...new Set(filtered.map(r => r.subcategory).filter(Boolean) as string[])].map(norm),
    marcas:           [...new Set(filtered.map(r => r.brand).filter(Boolean) as string[])].sort(),
    tiendas:          [...new Set(filtered.map(r => r.store).filter(Boolean) as string[])].sort(),
    tieneDescuentos:  filtered.some(r => (r.discount != null && Number(r.discount) > 0) || r.on_sale === true),
  }
}

const EMPTY_FACETS: SearchFacets = { colores: [], generos: [], tallas: [], subcategorias: [], marcas: [], tiendas: [], tieneDescuentos: false }

export async function getSearchFacets(
  filters: Pick<SearchFilters, 'query' | 'categoria' | 'marca' | 'tienda' | 'genero'>
): Promise<SearchFacets> {
  const mkBase = () => supabase
    .from('products')
    .select('color_primary, gender, sizes_available, subcategory, brand, store, discount, on_sale')
    .eq('available', true)

  // Dos queries en paralelo:
  // 1. Con todos los filtros → para colores, tallas, subcategorias, descuentos
  // 2. Sin marca NI tienda → para las listas de marcas/tiendas disponibles,
  //    así el usuario puede seleccionar MÚLTIPLES marcas/vendedores sin que
  //    la lista se quede vacía después de elegir el primero
  const filtersForLists = { query: filters.query, categoria: filters.categoria }

  // Paginamos ambas queries para no perdernos productos cuando hay >1000 en total
  const [data, listData] = await Promise.all([
    paginateAll(() => applyBaseFilters(mkBase(), filters)),
    paginateAll(() => applyBaseFilters(mkBase(), filtersForLists)),
  ])

  if (!data || data.length === 0) return EMPTY_FACETS
  const error = null // paginateAll maneja errores internamente

  const queryGenderWords = filters.query?.trim() ? splitQuery(filters.query.trim()).genderWords : []
  const facets = computeFacetsFromRows(data as unknown as FacetRow[], filters.genero, queryGenderWords)

  // Sobreescribir marcas y tiendas con la lista sin filtro de marca/tienda
  const listRows = (listData ?? []) as unknown as FacetRow[]
  const allMarcas = [...new Set(listRows.map((r: FacetRow) => r.brand).filter(Boolean) as string[])].sort()
  const allTiendas = [...new Set(listRows.map((r: FacetRow) => r.store).filter(Boolean) as string[])].sort()

  return { ...facets, marcas: allMarcas, tiendas: allTiendas }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rango de precio dinámico — totalmente basado en los filtros activos
// Aplica query + categoria + marca + tienda + genero + color + talla + descuento + mejor
// para que el slider refleje exactamente los productos que se están viendo.
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyAllFiltersForPrice(q: any, filters: Pick<SearchFilters, 'query' | 'categoria' | 'marca' | 'tienda' | 'genero' | 'color' | 'talla' | 'descuento' | 'mejor'>): any {
  q = applyBaseFilters(q, filters)

  // Género: buscar términos equivalentes en columna gender
  if (filters.genero) {
    const generos = filters.genero.split(',').map(g => g.trim()).filter(Boolean)
    const genConds = generos.flatMap(g => {
      const terms = FACET_GENDER_TERMS[norm(g)] ?? [norm(g)]
      return terms.map(t => `gender.ilike.%${t}%`)
    }).join(',')
    if (genConds) q = q.or(genConds)
  }

  // Color: buscar en color_primary
  if (filters.color) {
    const colors = filters.color.split(',').map(c => c.trim()).filter(Boolean)
    if (colors.length > 0) {
      const colorConds = colors.map(c => `color_primary.ilike.%${c}%`).join(',')
      q = q.or(colorConds)
    }
  }

  // Talla: overlap en array sizes_available
  if (filters.talla) {
    const tallas = filters.talla.split(',').map(t => t.trim()).filter(Boolean)
    if (tallas.length > 0) q = q.overlaps('sizes_available', tallas)
  }

  // Descuento mínimo
  if (filters.descuento) {
    const vals = filters.descuento.split(',').map(Number).filter(n => !isNaN(n))
    if (vals.length > 0) q = q.gte('discount', Math.min(...vals))
  }

  // Solo mejor opción
  if (filters.mejor === '1') q = q.eq('best_option', true)

  return q
}

function roundPriceRange(rawMin: number, rawMax: number): { min: number; max: number } {
  const range = rawMax - rawMin
  // Redondeo adaptativo según el rango real: no aplanar rangos pequeños
  const roundTo = range <= 20 ? 1 : range <= 200 ? 5 : range <= 1000 ? 10 : range <= 5000 ? 50 : 100
  return {
    min: Math.floor(rawMin / roundTo) * roundTo,
    max: Math.ceil(rawMax / roundTo) * roundTo,
  }
}

export async function getPriceRange(
  filters: Pick<SearchFilters, 'query' | 'categoria' | 'marca' | 'tienda' | 'genero' | 'color' | 'talla' | 'descuento' | 'mejor'>
): Promise<{ min: number; max: number }> {
  const makeQ = () => applyAllFiltersForPrice(
    supabase.from('products').select('price').eq('available', true),
    filters
  )

  const [{ data: minData }, { data: maxData }] = await Promise.all([
    makeQ().order('price', { ascending: true }).limit(1),
    makeQ().order('price', { ascending: false }).limit(1),
  ])

  const rawMin = Number(minData?.[0]?.price ?? 0)
  const rawMax = Number(maxData?.[0]?.price ?? 10000)
  return roundPriceRange(rawMin, rawMax)
}

// ─────────────────────────────────────────────────────────────────────────────
// Ofertas — búsqueda completa con filtros dentro de productos con descuento
// ─────────────────────────────────────────────────────────────────────────────

export async function searchOffersFromDB(filters: SearchFilters): Promise<Product[]> {
  const { query, categoria, marca, tienda, color, talla, genero, precioMin, precioMax, descuento, mejor, ordenar } = filters

  const buildQ = () => {
    // Pre-filtrar en DB a productos con descuento o en oferta
    let q = supabase.from('products').select('*').eq('available', true).or('on_sale.eq.true,discount.gt.0')

    if (query?.trim()) {
      const { mainWords } = splitQuery(query.trim())
      const filteredMainWordsOffers = mainWords.filter(w => w.length > 1)
      if (filteredMainWordsOffers.length > 0) {
        // AND entre palabras: cada palabra como .or() separado
        for (const word of filteredMainWordsOffers) {
          const terms = expandMainTerms([word])
          const orConds = terms.flatMap(t => [
            `name.ilike.%${t}%`,
            `brand.ilike.%${t}%`,
            `category.ilike.%${t}%`,
            `subcategory.ilike.%${t}%`,
          ]).join(',')
          q = q.or(orConds)
        }
      }
    }
    if (categoria) {
      const cats = categoria.split(',').map(c => c.trim()).filter(Boolean)
      const catConds = cats.flatMap(c => [`category.ilike.%${c}%`, `subcategory.ilike.%${c}%`])
      q = q.or(catConds.join(','))
    }
    if (marca) {
      const marcas = marca.split(',').map(m => m.trim()).filter(Boolean)
      q = marcas.length === 1 ? q.ilike('brand', `%${marcas[0]}%`) : q.or(marcas.map(m => `brand.ilike.%${m}%`).join(','))
    }
    if (tienda) {
      const tiendas = tienda.split(',').map(t2 => t2.trim()).filter(Boolean)
      q = tiendas.length === 1 ? q.ilike('store', `%${tiendas[0]}%`) : q.or(tiendas.map(t2 => `store.ilike.%${t2}%`).join(','))
    }
    if (precioMin) q = q.gte('price', Number(precioMin))
    if (precioMax) q = q.lte('price', Number(precioMax))
    if (descuento) {
      const vals = descuento.split(',').map(Number).filter(n => !isNaN(n))
      if (vals.length > 0) q = q.gte('discount', Math.min(...vals))
    }
    if (mejor === '1') q = q.eq('best_option', true)

    switch (ordenar) {
      case 'precio-asc':  q = q.order('price', { ascending: true }); break
      case 'precio-desc': q = q.order('price', { ascending: false }); break
      default:            q = q.order('discount', { ascending: false, nullsFirst: false })
    }
    return q
  }

  const rawData = await paginateAll(buildQ)
  let products = rawData.map(row => mapRow(row)).filter(isDiscountedProduct)

  const queryColorWords = query?.trim() ? splitQuery(query.trim()).colorWords : []
  const queryGenderWords = query?.trim() ? splitQuery(query.trim()).genderWords : []
  const allColorWords = [...queryColorWords, ...(color ? color.split(',').map(c => c.trim()).filter(Boolean) : [])]
  const allGenderWords = [...queryGenderWords, ...(genero ? genero.split(',').map(g => g.trim()).filter(Boolean) : [])]

  if (allColorWords.length > 0) products = products.filter(p => productMatchesColor(p, allColorWords))
  if (talla) {
    const tallas = talla.split(',').map(t2 => t2.trim()).filter(Boolean)
    products = products.filter(p => productMatchesTalla(p, tallas))
  }
  if (allGenderWords.length > 0) products = products.filter(p => productMatchesGenero(p, allGenderWords))

  if (ordenar === 'precio-asc' || ordenar === 'precio-desc') return products

  // Por defecto: ordenar por mayor descuento (en memoria para incluir precio < precioOriginal)
  return products.sort((a, b) => {
    const da = typeof a.descuento === 'number' ? a.descuento
      : (typeof a.precioOriginal === 'number' && a.precioOriginal > a.precio)
        ? ((a.precioOriginal - a.precio) / a.precioOriginal) * 100 : 0
    const db2 = typeof b.descuento === 'number' ? b.descuento
      : (typeof b.precioOriginal === 'number' && b.precioOriginal > b.precio)
        ? ((b.precioOriginal - b.precio) / b.precioOriginal) * 100 : 0
    return db2 - da
  })
}

export async function getOffersFacets(
  filters: Pick<SearchFilters, 'query' | 'categoria' | 'marca' | 'tienda' | 'genero'>
): Promise<SearchFacets> {
  const mkBase = () => supabase
    .from('products')
    .select('color_primary, gender, sizes_available, subcategory, brand, store, discount, on_sale')
    .eq('available', true)
    .or('on_sale.eq.true,discount.gt.0')

  const filtersForLists = { query: filters.query, categoria: filters.categoria }

  // Paginamos para no perdernos tiendas/marcas cuando hay >1000 productos
  const [data, listData] = await Promise.all([
    paginateAll(() => applyBaseFilters(mkBase(), filters)),
    paginateAll(() => applyBaseFilters(mkBase(), filtersForLists)),
  ])

  if (!data || data.length === 0) return EMPTY_FACETS

  const queryGenderWords = filters.query?.trim() ? splitQuery(filters.query.trim()).genderWords : []
  const facets = computeFacetsFromRows(data as FacetRow[], filters.genero, queryGenderWords)

  const listRows = (listData ?? []) as FacetRow[]
  const allMarcas = [...new Set(listRows.map(r => r.brand).filter(Boolean) as string[])].sort()
  const allTiendas = [...new Set(listRows.map(r => r.store).filter(Boolean) as string[])].sort()

  return { ...facets, marcas: allMarcas, tiendas: allTiendas }
}

export async function getOffersPriceRange(
  filters: Pick<SearchFilters, 'query' | 'categoria' | 'marca' | 'tienda' | 'genero' | 'color' | 'talla' | 'descuento' | 'mejor'>
): Promise<{ min: number; max: number }> {
  const makeQ = () => applyAllFiltersForPrice(
    supabase.from('products').select('price').eq('available', true).or('on_sale.eq.true,discount.gt.0'),
    filters
  )

  const [{ data: minData }, { data: maxData }] = await Promise.all([
    makeQ().order('price', { ascending: true }).limit(1),
    makeQ().order('price', { ascending: false }).limit(1),
  ])

  const rawMin = Number(minData?.[0]?.price ?? 0)
  const rawMax = Number(maxData?.[0]?.price ?? 10000)
  return roundPriceRange(rawMin, rawMax)
}

// ─────────────────────────────────────────────────────────────────────────────
// Otras funciones de la app
// ─────────────────────────────────────────────────────────────────────────────

export async function getDiscountedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .or('on_sale.eq.true,discount.gt.0')
    .order('discount', { ascending: false, nullsFirst: false })
    .limit(100)

  if (error) { console.error('[BiuBan] getDiscountedProducts:', error.message); return [] }

  return (data ?? [])
    .map(row => mapRow(row as Record<string, unknown>))
    .filter(isDiscountedProduct)
    .sort((a, b) => {
      const da = typeof a.descuento === 'number' ? a.descuento
        : (typeof a.precioOriginal === 'number' && a.precioOriginal > a.precio)
          ? ((a.precioOriginal - a.precio) / a.precioOriginal) * 100 : 0
      const db2 = typeof b.descuento === 'number' ? b.descuento
        : (typeof b.precioOriginal === 'number' && b.precioOriginal > b.precio)
          ? ((b.precioOriginal - b.precio) / b.precioOriginal) * 100 : 0
      return db2 - da
    })
    .slice(0, limit)
}

export async function getProductsByCategory(categoria: string, limit = 24): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products').select('*').eq('available', true)
    .ilike('category', `%${categoria}%`)
    .order('created_at', { ascending: false }).limit(limit)

  if (error) { console.error('[BiuBan] getProductsByCategory:', error.message); return [] }
  return (data ?? []).map(row => mapRow(row as Record<string, unknown>))
}

export async function getProductsByBrand(marca: string, limit = 24): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products').select('*').eq('available', true)
    .ilike('brand', `%${marca}%`)
    .order('created_at', { ascending: false }).limit(limit)

  if (error) { console.error('[BiuBan] getProductsByBrand:', error.message); return [] }
  return (data ?? []).map(row => mapRow(row as Record<string, unknown>))
}

export async function searchProducts(query: string): Promise<Product[]> {
  return searchProductsFromDB({ query })
}

// ─────────────────────────────────────────────────────────────────────────────
// Marcas reales desde la base de datos (con conteo de productos)
// ─────────────────────────────────────────────────────────────────────────────

export interface BrandInfo {
  nombre: string
  total: number
}

export async function getBrandsFromDB(): Promise<BrandInfo[]> {
  // Paginar para obtener TODOS los productos (Supabase limita a 1000 por request)
  const PAGE = 1000
  const counts: Record<string, number> = {}
  let offset = 0

  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .eq('available', true)
      .range(offset, offset + PAGE - 1)

    if (error) { console.error('[BiuBan] getBrandsFromDB:', error.message); break }
    if (!data || data.length === 0) break

    for (const row of data) {
      const b = String((row as Record<string, unknown>).brand ?? '').trim()
      if (b) counts[b] = (counts[b] ?? 0) + 1
    }

    if (data.length < PAGE) break
    offset += PAGE
  }

  return Object.entries(counts)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }))
}

// ─────────────────────────────────────────────────────────────────────────────
// Obtener productos por IDs (para comparador)
// ─────────────────────────────────────────────────────────────────────────────

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids)

  if (error || !data) return []

  // Mantener el orden original de los IDs
  const map = new Map<string, Product>()
  for (const row of data) {
    const p = mapRow(row as Record<string, unknown>)
    map.set(p.id, p)
  }

  return ids.map(id => map.get(id)).filter(Boolean) as Product[]
}
