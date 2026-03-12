import { supabase } from './supabase'
import { Product } from '@/types/product'

const SINONIMOS: Record<string, string[]> = {
  sudadera:   ['hoodie', 'hoodies', 'sweatshirt', 'sweater', 'sudaderas'],
  hoodie:     ['sudadera', 'sudaderas', 'hoodies', 'sweatshirt', 'sweater'],
  hoodies:    ['sudadera', 'sudaderas', 'hoodie', 'sweatshirt'],
  playera:    ['t-shirt', 'tshirt', 'camiseta', 'shirt', 'tee', 'playeras'],
  playeras:   ['t-shirt', 'tshirt', 'camiseta', 'shirt', 'tee', 'playera'],
  camiseta:   ['playera', 't-shirt', 'shirt', 'tee'],
  tshirt:     ['playera', 'camiseta', 'shirt', 'tee'],
  camisa:     ['shirt', 'camisas', 'blusa'],
  blusa:      ['blouse', 'top', 'blusas', 'camisa'],
  chamarra:   ['jacket', 'chaqueta', 'chamarras', 'coat'],
  chamarras:  ['jacket', 'chaqueta', 'chamarra', 'coat'],
  jacket:     ['chamarra', 'chaqueta', 'chamarras'],
  abrigo:     ['coat', 'chamarra', 'jacket'],
  pantalon:   ['pants', 'pantalones', 'trousers'],
  pantalones: ['pants', 'trousers', 'pantalon'],
  pants:      ['pantalon', 'pantalones', 'joggers'],
  jeans:      ['mezclilla', 'vaqueros', 'denim'],
  mezclilla:  ['jeans', 'denim', 'vaqueros'],
  denim:      ['jeans', 'mezclilla', 'vaqueros'],
  shorts:     ['short', 'bermudas', 'bermuda'],
  short:      ['shorts', 'bermudas'],
  falda:      ['skirt', 'faldas'],
  skirt:      ['falda', 'faldas'],
  leggings:   ['leggins', 'mallas', 'tights'],
  leggins:    ['leggings', 'mallas'],
  tenis:      ['sneakers', 'zapatillas', 'shoes', 'sneaker', 'tennis', 'kicks'],
  tennis:     ['tenis', 'sneakers', 'zapatillas'],
  sneakers:   ['tenis', 'zapatillas', 'tennis', 'kicks', 'shoes'],
  sneaker:    ['tenis', 'zapatillas', 'sneakers'],
  zapatos:    ['shoes', 'calzado', 'zapatillas'],
  shoes:      ['zapatos', 'tenis', 'calzado'],
  botas:      ['boots', 'bota', 'botines'],
  boots:      ['botas', 'bota', 'botines'],
  sandalias:  ['sandals', 'chanclas', 'slides'],
  chanclas:   ['sandalias', 'slides', 'sandals'],
  vestido:    ['dress', 'vestidos'],
  dress:      ['vestido', 'vestidos'],
  bolso:      ['bag', 'bolsa', 'purse', 'tote'],
  bolsa:      ['bag', 'bolso', 'purse', 'tote'],
  bag:        ['bolsa', 'bolso', 'mochila'],
  mochila:    ['backpack', 'bag', 'mochilas'],
  backpack:   ['mochila', 'mochilas', 'bag'],
  deportivo:  ['sport', 'athletic', 'activewear', 'gym', 'fitness'],
  gym:        ['deportivo', 'fitness', 'training', 'activewear'],
  running:    ['correr', 'atletismo', 'jogging'],
  oversize:   ['oversized', 'holgado', 'loose', 'relaxed'],
  oversized:  ['oversize', 'holgado', 'loose'],
  slim:       ['ajustado', 'skinny'],
  skinny:     ['slim', 'ajustado'],
  gorra:      ['cap', 'hat', 'gorras', 'cachucha'],
  cap:        ['gorra', 'gorras', 'hat'],
  white:  ['blanco', 'crema'],
  blanco: ['white', 'crema'],
  black:  ['negro'],
  negro:  ['black'],
  gray:   ['gris', 'grey'],
  grey:   ['gris', 'gray'],
  gris:   ['gray', 'grey'],
  blue:   ['azul', 'navy'],
  azul:   ['blue', 'navy'],
  red:    ['rojo'],
  rojo:   ['red'],
  green:  ['verde'],
  verde:  ['green'],
  pink:   ['rosa'],
  rosa:   ['pink'],
  purple: ['morado'],
  morado: ['purple'],
  brown:  ['cafe', 'marron'],
  cafe:   ['brown', 'marron'],
  beige:  ['crema', 'tan'],
  crema:  ['beige', 'cream'],
}

function normalizar(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

function expandirTerminos(query: string): string[] {
  const terminos = normalizar(query).split(/\s+/).filter(Boolean)
  const todos = new Set<string>()
  for (const t of terminos) {
    todos.add(t)
    const syns = SINONIMOS[t]
    if (syns) syns.forEach(s => todos.add(normalizar(s)))
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
  query?:     string
  marca?:     string
  tienda?:    string
  categoria?: string
  color?:     string
  talla?:     string
  precioMin?: string
  precioMax?: string
  descuento?: string
  ofertas?:   string
  mejor?:     string
  ordenar?:   string
}

export async function searchProductsFromDB(filters: SearchFilters): Promise<Product[]> {
  const { query, marca, tienda, categoria, color, talla,
          precioMin, precioMax, descuento, ofertas, mejor, ordenar } = filters

  let dbQuery = supabase.from('products').select('*').eq('available', true)

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

  if (marca)     dbQuery = dbQuery.ilike('brand', `%${marca}%`)
  if (tienda)    dbQuery = dbQuery.ilike('store', `%${tienda}%`)
  if (categoria) dbQuery = dbQuery.ilike('category', `%${categoria}%`)
  if (color)     dbQuery = dbQuery.ilike('color', `%${color}%`)
  if (talla)     dbQuery = dbQuery.ilike('size', `%${talla}%`)
  if (precioMin) dbQuery = dbQuery.gte('price', parseInt(precioMin))
  if (precioMax) dbQuery = dbQuery.lte('price', parseInt(precioMax))
  if (descuento) dbQuery = dbQuery.gte('discount', parseInt(descuento))
  if (ofertas === '1') dbQuery = dbQuery.gt('discount', 0)
  if (mejor === '1')   dbQuery = dbQuery.eq('best_option', true)

  if (ordenar === 'precio-asc')  dbQuery = dbQuery.order('price', { ascending: true })
  else if (ordenar === 'precio-desc') dbQuery = dbQuery.order('price', { ascending: false })
  else if (ordenar === 'descuento')   dbQuery = dbQuery.order('discount', { ascending: false })
  else dbQuery = dbQuery.order('created_at', { ascending: false })

  const { data, error } = await dbQuery.limit(100)
  if (error) { console.error('Supabase error:', error.message); return [] }
  return (data ?? []).map(mapRow)
}