import { supabase } from './supabase'
import { Product } from '@/types/product'

// ─── Diccionario bilingüe ES ↔ EN ─────────────────────────────────────────────
const SINONIMOS: Record<string, string[]> = {
  // Hoodies / Sudaderas
  sudadera:   ['hoodie', 'hoodies', 'sweatshirt', 'sweater', 'sudaderas'],
  hoodie:     ['sudadera', 'sudaderas', 'hoodies', 'sweatshirt', 'sweater'],
  hoodies:    ['sudadera', 'sudaderas', 'hoodie', 'sweatshirt'],
  sweatshirt: ['sudadera', 'hoodie', 'sweater'],
  sweater:    ['sueter', 'sudadera', 'jersey'],
  sueter:     ['sweater', 'sudadera', 'jersey'],
  // Playeras / T-shirts
  playera:    ['t-shirt', 'tshirt', 'camiseta', 'shirt', 'tee', 'playeras'],
  playeras:   ['t-shirt', 'tshirt', 'camiseta', 'shirt', 'tee', 'playera'],
  camiseta:   ['playera', 't-shirt', 'shirt', 'tee', 'playeras'],
  tshirt:     ['playera', 'camiseta', 'shirt', 'tee'],
  shirt:      ['playera', 'camiseta', 'camisa', 'tshirt'],
  tee:        ['playera', 'camiseta', 't-shirt'],
  camisa:     ['shirt', 'camisas', 'blusa'],
  blusa:      ['blouse', 'top', 'blusas', 'camisa'],
  top:        ['blusa', 'blusas', 'tops'],
  // Chamarras / Jackets
  chamarra:   ['jacket', 'chaqueta', 'chamarras', 'cazadora', 'coat'],
  chamarras:  ['jacket', 'chaqueta', 'chamarra', 'coat'],
  jacket:     ['chamarra', 'chaqueta', 'chamarras'],
  chaqueta:   ['jacket', 'chamarra', 'chamarras'],
  abrigo:     ['coat', 'overcoat', 'chamarra', 'jacket'],
  coat:       ['abrigo', 'chamarra', 'jacket'],
  // Pantalones
  pantalon:   ['pants', 'pantalones', 'trousers'],
  pantalones: ['pants', 'trousers', 'pantalon'],
  pants:      ['pantalon', 'pantalones', 'joggers', 'trousers'],
  joggers:    ['pants', 'pantalones', 'deportivo'],
  trousers:   ['pantalon', 'pantalones', 'pants'],
  // Jeans
  jeans:      ['mezclilla', 'vaqueros', 'denim'],
  mezclilla:  ['jeans', 'denim', 'vaqueros'],
  denim:      ['jeans', 'mezclilla', 'vaqueros'],
  vaqueros:   ['jeans', 'mezclilla', 'denim'],
  // Shorts
  shorts:     ['short', 'bermudas', 'bermuda'],
  short:      ['shorts', 'bermudas', 'bermuda'],
  bermuda:    ['shorts', 'short', 'bermudas'],
  bermudas:   ['shorts', 'short', 'bermuda'],
  // Faldas
  falda:      ['skirt', 'faldas', 'minifalda'],
  faldas:     ['skirt', 'falda', 'minifalda'],
  skirt:      ['falda', 'faldas'],
  // Leggings
  leggings:   ['leggins', 'mallas', 'tights'],
  leggins:    ['leggings', 'mallas', 'tights'],
  mallas:     ['leggings', 'leggins', 'tights'],
  tights:     ['leggings', 'leggins', 'mallas'],
  // Tenis / Sneakers
  tenis:      ['sneakers', 'zapatillas', 'shoes', 'sneaker', 'tennis', 'kicks', 'calzado'],
  tennis:     ['tenis', 'sneakers', 'zapatillas'],
  sneakers:   ['tenis', 'zapatillas', 'tennis', 'kicks', 'shoes'],
  sneaker:    ['tenis', 'zapatillas', 'sneakers'],
  zapatillas: ['tenis', 'sneakers', 'shoes'],
  kicks:      ['tenis', 'sneakers', 'zapatillas'],
  zapatos:    ['shoes', 'calzado', 'zapatillas'],
  shoes:      ['zapatos', 'tenis', 'calzado', 'zapatillas'],
  calzado:    ['shoes', 'zapatos', 'tenis'],
  // Botas
  botas:      ['boots', 'bota', 'botines'],
  bota:       ['boots', 'botas', 'botines'],
  boots:      ['botas', 'bota', 'botines'],
  botines:    ['botas', 'boots', 'ankle boots'],
  // Sandalias
  sandalias:  ['sandals', 'chanclas', 'slides', 'huaraches'],
  sandals:    ['sandalias', 'chanclas', 'slides'],
  chanclas:   ['sandalias', 'slides', 'sandals'],
  slides:     ['chanclas', 'sandalias', 'sandals'],
  // Vestidos
  vestido:    ['dress', 'vestidos'],
  vestidos:   ['dress', 'vestido'],
  dress:      ['vestido', 'vestidos'],
  // Bolsas
  bolso:      ['bag', 'bolsa', 'purse', 'tote', 'bolsos'],
  bolsa:      ['bag', 'bolso', 'purse', 'tote', 'bolsas'],
  bolsas:     ['bag', 'bolso', 'purse', 'tote', 'bolsa'],
  bag:        ['bolsa', 'bolso', 'mochila', 'purse'],
  purse:      ['bolsa', 'bolso', 'cartera'],
  tote:       ['bolsa', 'bolso', 'bag'],
  cartera:    ['wallet', 'bolsa', 'bolso'],
  // Mochilas
  mochila:    ['backpack', 'bag', 'mochilas'],
  mochilas:   ['backpack', 'bag', 'mochila'],
  backpack:   ['mochila', 'mochilas', 'bag'],
  // Deportivo
  deportivo:  ['sport', 'athletic', 'activewear', 'gym', 'fitness', 'training'],
  sport:      ['deportivo', 'athletic', 'activewear'],
  athletic:   ['deportivo', 'sport', 'activewear'],
  activewear: ['deportivo', 'gym', 'fitness', 'athletic'],
  gym:        ['deportivo', 'fitness', 'training', 'activewear'],
  fitness:    ['gym', 'deportivo', 'training', 'activewear'],
  training:   ['entrenamiento', 'gym', 'deportivo'],
  entrenamiento: ['training', 'gym', 'deportivo'],
  running:    ['correr', 'atletismo', 'jogging', 'run'],
  correr:     ['running', 'jogging', 'atletismo'],
  yoga:       ['pilates', 'activewear', 'leggings'],
  // Fit / estilo
  oversize:   ['oversized', 'holgado', 'amplio', 'loose', 'relaxed'],
  oversized:  ['oversize', 'holgado', 'loose'],
  holgado:    ['oversize', 'oversized', 'loose', 'relaxed'],
  slim:       ['ajustado', 'skinny', 'entallado'],
  skinny:     ['slim', 'ajustado', 'entallado'],
  ajustado:   ['slim', 'skinny', 'entallado'],
  // Gorras
  gorra:      ['cap', 'hat', 'gorras', 'cachucha'],
  gorras:     ['cap', 'hat', 'gorra', 'cachucha'],
  cachucha:   ['gorra', 'cap', 'hat'],
  cap:        ['gorra', 'gorras', 'cachucha', 'hat'],
  // Colores EN → ES
  white:      ['blanco', 'crema', 'ivory'],
  blanco:     ['white', 'crema', 'ivory'],
  black:      ['negro'],
  negro:      ['black'],
  gray:       ['gris', 'grey'],
  grey:       ['gris', 'gray'],
  gris:       ['gray', 'grey'],
  blue:       ['azul', 'navy', 'celeste'],
  azul:       ['blue', 'navy', 'celeste'],
  navy:       ['azul marino', 'azul', 'blue'],
  red:        ['rojo'],
  rojo:       ['red'],
  green:      ['verde'],
  verde:      ['green'],
  pink:       ['rosa'],
  rosa:       ['pink'],
  purple:     ['morado', 'violet', 'lila'],
  morado:     ['purple', 'violet', 'lila'],
  yellow:     ['amarillo'],
  amarillo:   ['yellow'],
  orange:     ['naranja'],
  naranja:    ['orange'],
  brown:      ['cafe', 'marron'],
  cafe:       ['brown', 'marron'],
  beige:      ['crema', 'tan', 'nude'],
  crema:      ['beige', 'cream', 'nude'],
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .trim()
}

function expandirTerminos(query: string): string[] {
  const terminos = normalizar(query).split(/\s+/).filter(Boolean)
  const todos = new Set<string>()

  for (const t of terminos) {
    todos.add(t)
    // Sinónimos directos
    const syns = SINONIMOS[t]
    if (syns) syns.forEach(s => todos.add(normalizar(s)))
    // Busca si este término aparece como sinónimo de otra palabra
    for (const [clave, lista] of Object.entries(SINONIMOS)) {
      if (lista.map(normalizar).includes(t)) {
        todos.add(normalizar(clave))
        lista.forEach(s => todos.add(normalizar(s)))
      }
    }
  }

  return Array.from(todos)
}

function mapRow(row: Record<string, unknown>): Product {
  return {
    id:             String(row.id),
    nombre:         String(row.name ?? ''),
    marca:          String(row.brand ?? ''),
    tienda:         String(row.store ?? ''),
    precio:         Number(row.price ?? 0),
    precioOriginal: row.original_price ? Number(row.original_price) : undefined,
    imagen:         String(row.image ?? ''),
    mejorOpcion:    Boolean(row.best_option ?? false),
    categoria:      String(row.category ?? ''),
    color:          row.color ? String(row.color) : undefined,
    url:            String(row.url ?? ''),
    descuento:      row.discount ? Number(row.discount) : undefined,
    disponible:     Boolean(row.available ?? true),
  }
}

export interface SearchFilters {
  query?:    string
  marca?:    string
  tienda?:   string
  precioMax?: string
  ordenar?:  string
}

export async function searchProductsFromDB(filters: SearchFilters): Promise<Product[]> {
  const { query, marca, tienda, precioMax, ordenar } = filters

  let dbQuery = supabase
    .from('products')
    .select('*')
    .eq('available', true)

  // ── Búsqueda de texto bilingüe ──────────────────────────────────────────────
  if (query && query.trim()) {
    const terminos = expandirTerminos(query)

    const orConditions = terminos.flatMap(t => [
      `name.ilike.%${t}%`,
      `brand.ilike.%${t}%`,
      `category.ilike.%${t}%`,
      `color.ilike.%${t}%`,
    ]).join(',')

    dbQuery = dbQuery.or(orConditions)
  }

  // ── Filtros adicionales ─────────────────────────────────────────────────────
  if (marca)    dbQuery = dbQuery.ilike('brand', `%${marca}%`)
  if (tienda)   dbQuery = dbQuery.ilike('store', `%${tienda}%`)
  if (precioMax) dbQuery = dbQuery.lte('price', parseInt(precioMax))

  // ── Ordenamiento ────────────────────────────────────────────────────────────
  if (ordenar === 'precio-asc') {
    dbQuery = dbQuery.order('price', { ascending: true })
  } else if (ordenar === 'precio-desc') {
    dbQuery = dbQuery.order('price', { ascending: false })
  } else {
    dbQuery = dbQuery.order('created_at', { ascending: false })
  }

  const { data, error } = await dbQuery.limit(100)

  if (error) {
    console.error('Error buscando en Supabase:', error.message)
    return []
  }

  return (data ?? []).map(mapRow)
}