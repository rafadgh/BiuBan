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
    imagen:             String(row.image ?? ''),
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
  // blancos → blanco, negras → negra/negro, azules → azul, grises → gris
  const variants: string[] = []
  if (t.endsWith('es'))   variants.push(t.slice(0, -2))           // azules→azul, verdes→verde
  if (t.endsWith('os'))   variants.push(t.slice(0, -1))           // blancos→blanco, negros→negro
  if (t.endsWith('as'))   variants.push(t.slice(0, -1), t.slice(0, -2) + 'o') // blancas→blanca,blanco
  if (t.endsWith('s') && !t.endsWith('es') && !t.endsWith('os') && !t.endsWith('as'))
    variants.push(t.slice(0, -1))  // grays→gray

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

// Expande palabras principales usando sinónimos de producto
function expandMainTerms(words: string[]): string[] {
  const all = new Set<string>()

  for (const w of words) {
    const t = norm(w)
    all.add(t)

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

// Verifica si un producto coincide con los colores dados (busca en nombre, desc, color)
function productMatchesColor(product: Product, colorWords: string[]): boolean {
  if (colorWords.length === 0) return true

  const searchText = norm([
    product.nombre,
    product.descripcion ?? '',
    product.color ?? '',
    product.colorPrimario ?? '',
    product.tags?.join(' ') ?? '',
  ].join(' '))

  return colorWords.every(cw => {
    const synonyms = getColorSynonyms(cw)
    return synonyms.some(s => searchText.includes(s))
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
function productMatchesGenero(product: Product, generos: string[]): boolean {
  if (generos.length === 0) return true

  const genderMap: Record<string, string[]> = {
    hombre:  ['hombre', 'male', 'men', 'man', 'masculino', 'masculina', 'mens', "men's"],
    mujer:   ['mujer', 'female', 'women', 'woman', 'femenino', 'femenina', 'womens', "women's", 'dama', 'damas'],
    nino:    ['nino', 'niño', 'boy', 'boys', 'kids', 'kid', 'child', 'children', 'infantil', 'junior'],
    nina:    ['nina', 'niña', 'girl', 'girls', 'kids', 'kid', 'child', 'children', 'infantil', 'junior'],
    unisex:  ['unisex'],
  }

  const searchText = norm([
    product.nombre,
    product.genero ?? '',
    product.descripcion ?? '',
    product.grupoEdad ?? '',
    product.tags?.join(' ') ?? '',
  ].join(' '))

  return generos.some(g => {
    const gNorm = norm(g)
    const terms = genderMap[gNorm] ?? [gNorm]
    return terms.some(t => searchText.includes(t))
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

  let q = supabase.from('products').select('*').eq('available', true)

  // ── Búsqueda de texto ────────────────────────────────────────────────────
  // ESTRATEGIA: separar palabras de color de palabras de producto.
  // Las palabras de producto van a Supabase (OR con sinónimos).
  // Las palabras de color se filtran en memoria buscando en el nombre.
  if (query?.trim()) {
    const { mainWords, colorWords: queryColorWords, genderWords: queryGenderWords } = splitQuery(query.trim())

    if (mainWords.length > 0) {
      // Expande sinónimos de producto y busca en Supabase
      const expandedTerms = expandMainTerms(mainWords)

      // Trae un volumen mayor si hay colores o género que filtrar después
      const limit = (queryColorWords.length > 0 || queryGenderWords.length > 0) ? 500 : 200

      const orConditions = expandedTerms.flatMap(t => [
        `name.ilike.%${t}%`,
        `brand.ilike.%${t}%`,
        `category.ilike.%${t}%`,
        `subcategory.ilike.%${t}%`,
      ]).join(',')

      q = q.or(orConditions)

      // Aplicar filtros de DB antes de ordenar
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

      const { data, error } = await q.limit(limit)
      if (error) { console.error('[BiuBan]', error.message); return [] }

      let products = (data ?? []).map(row => mapRow(row as Record<string, unknown>))

      // ── Filtros en memoria ───────────────────────────────────────────────
      // Color: puede venir de la query o del filtro sidebar
      const allColorWords = [
        ...queryColorWords,
        ...(color ? color.split(',').map(c => c.trim()).filter(Boolean) : []),
      ]
      if (allColorWords.length > 0) {
        products = products.filter(p => productMatchesColor(p, allColorWords))
      }

      // Talla: siempre en memoria (sizes_available puede estar vacío en DB)
      if (talla) {
        const tallas = talla.split(',').map(t2 => t2.trim()).filter(Boolean)
        products = products.filter(p => productMatchesTalla(p, tallas))
      }

      // Género: combinar términos de la query con el filtro sidebar
      const allGenderWords = [
        ...queryGenderWords,
        ...(genero ? genero.split(',').map(g => g.trim()).filter(Boolean) : []),
      ]
      if (allGenderWords.length > 0) {
        products = products.filter(p => productMatchesGenero(p, allGenderWords))
      }

      // Solo ofertas
      if (ofertas === '1') {
        products = products.filter(isDiscountedProduct)
      }

      // Re-ordenar por descuento en memoria si aplica
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

      return products

    } else if (queryColorWords.length > 0 || queryGenderWords.length > 0) {
      // La query es SOLO colores/género (ej: "blanco", "hombre") → traer todo y filtrar en memoria
      // No aplicar filtro de texto en Supabase
    }
  }

  // ── Modo sin query de texto: aplicar filtros directamente en DB ──────────
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

  const { data, error } = await q.limit(500)
  if (error) { console.error('[BiuBan]', error.message); return [] }

  let products = (data ?? []).map(row => mapRow(row as Record<string, unknown>))

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

  // Género: mezclar términos de la query con el filtro sidebar
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

  return products
}

// ─────────────────────────────────────────────────────────────────────────────
// Rango de precio dinámico para el slider del sidebar
// ─────────────────────────────────────────────────────────────────────────────

export async function getPriceRange(
  filters: Pick<SearchFilters, 'query' | 'categoria' | 'marca' | 'tienda' | 'genero'>
): Promise<{ min: number; max: number }> {
  let q = supabase.from('products').select('price').eq('available', true)

  if (filters.categoria) {
    const cats = filters.categoria.split(',').map(c => c.trim()).filter(Boolean)
    const catConds = cats.flatMap(c => [`category.ilike.%${c}%`, `subcategory.ilike.%${c}%`])
    q = q.or(catConds.join(','))
  }
  if (filters.marca) {
    const marcas = filters.marca.split(',').map(m => m.trim()).filter(Boolean)
    q = marcas.length === 1
      ? q.ilike('brand', `%${marcas[0]}%`)
      : q.or(marcas.map(m => `brand.ilike.%${m}%`).join(','))
  }
  if (filters.tienda) {
    const tiendas = filters.tienda.split(',').map(t => t.trim()).filter(Boolean)
    q = tiendas.length === 1
      ? q.ilike('store', `%${tiendas[0]}%`)
      : q.or(tiendas.map(t => `store.ilike.%${t}%`).join(','))
  }
  if (filters.query?.trim()) {
    const { mainWords } = splitQuery(filters.query.trim())
    if (mainWords.length > 0) {
      const terms = expandMainTerms(mainWords)
      const orConds = terms.flatMap(t => [
        `name.ilike.%${t}%`,
        `brand.ilike.%${t}%`,
        `category.ilike.%${t}%`,
        `subcategory.ilike.%${t}%`,
      ]).join(',')
      q = q.or(orConds)
    }
  }

  const { data } = await q.limit(500)
  if (!data || data.length === 0) return { min: 0, max: 10000 }

  const prices = (data as { price: number }[])
    .map(r => Number(r.price))
    .filter(p => !isNaN(p) && p > 0)
  if (prices.length === 0) return { min: 0, max: 10000 }

  const rawMin = Math.min(...prices)
  const rawMax = Math.max(...prices)
  return {
    min: Math.floor(rawMin / 100) * 100,
    max: Math.ceil(rawMax / 100) * 100,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Otras funciones de la app
// ─────────────────────────────────────────────────────────────────────────────

export async function getDiscountedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(300)

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