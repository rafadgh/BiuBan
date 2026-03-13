import { supabase } from './supabase'
import { Product } from '@/types/product'

function mapRow(row: Record<string, unknown>): Product {
  return {
    id:                 String(row.id ?? ''),
    nombre:             String(row.name ?? ''),
    slug:               row.slug            ? String(row.slug)            : undefined,
    marca:              String(row.brand ?? ''),
    modelo:             row.model           ? String(row.model)           : undefined,
    descripcion:        row.description     ? String(row.description)     : undefined,
    tienda:             String(row.store ?? ''),
    storeTipo:          row.store_type      ? String(row.store_type)      : undefined,
    precio:             Number(row.price ?? 0),
    precioOriginal:     row.original_price  ? Number(row.original_price)  : undefined,
    descuento:          row.discount        ? Number(row.discount)        : undefined,
    imagen:             String(row.image ?? ''),
    url:                String(row.url ?? ''),
    categoria:          String(row.category ?? ''),
    subcategoria:       row.subcategory     ? String(row.subcategory)     : undefined,
    genero:             row.gender          ? String(row.gender)          : undefined,
    grupoEdad:          row.age_group       ? String(row.age_group)       : undefined,
    tallasDisponibles:  Array.isArray(row.sizes_available) ? (row.sizes_available as string[]) : undefined,
    tipoTalla:          row.size_type       ? String(row.size_type)       : undefined,
    color:              row.color           ? String(row.color)           : undefined,
    colorPrimario:      row.color_primary   ? String(row.color_primary)   : undefined,
    colorHex:           row.color_hex       ? String(row.color_hex)       : undefined,
    material:           row.material        ? String(row.material)        : undefined,
    estilo:             row.style           ? String(row.style)           : undefined,
    fit:                row.fit             ? String(row.fit)             : undefined,
    productGroup:       row.product_group   ? String(row.product_group)   : undefined,
    mejorOpcion:        Boolean(row.best_option  ?? false),
    esNuevo:            Boolean(row.is_new        ?? false),
    enOferta:           Boolean(row.on_sale       ?? false),
    trending:           Boolean(row.trending      ?? false),
    disponible:         Boolean(row.available     ?? true),
    stockStatus:        row.stock_status    ? String(row.stock_status)    : undefined,
    envioGratis:        Boolean(row.free_shipping ?? false),
    tags:               Array.isArray(row.tags) ? (row.tags as string[])  : undefined,
  }
}

export interface SearchFilters {
  query?:     string
  categoria?: string
  marca?:     string
  tienda?:    string
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
  const { query, categoria, marca, tienda, color, talla,
          precioMin, precioMax, descuento, ofertas, mejor, ordenar } = filters

  let q = supabase.from('products').select('*').eq('available', true)

  if (query?.trim()) {
    const t = query.trim()
    q = q.or(`name.ilike.%${t}%,brand.ilike.%${t}%,category.ilike.%${t}%,color.ilike.%${t}%,description.ilike.%${t}%`)
  }

  if (categoria) {
    const cats = categoria.split(',').filter(Boolean)
    q = cats.length === 1
      ? q.ilike('category', `%${cats[0]}%`)
      : q.or(cats.map(c => `category.ilike.%${c}%`).join(','))
  }

  if (marca) {
    const marcas = marca.split(',').filter(Boolean)
    q = marcas.length === 1
      ? q.ilike('brand', `%${marcas[0]}%`)
      : q.or(marcas.map(m => `brand.ilike.%${m}%`).join(','))
  }

  if (tienda) {
    const tiendas = tienda.split(',').filter(Boolean)
    q = tiendas.length === 1
      ? q.ilike('store', `%${tiendas[0]}%`)
      : q.or(tiendas.map(t => `store.ilike.%${t}%`).join(','))
  }

  if (color) {
    const colores = color.split(',').filter(Boolean)
    const conds = colores.flatMap(c => [`color_primary.ilike.%${c}%`, `color.ilike.%${c}%`])
    q = q.or(conds.join(','))
  }

  if (talla) {
    const tallas = talla.split(',').filter(Boolean)
    q = q.contains('sizes_available', tallas)
  }

  if (precioMin) q = q.gte('price', Number(precioMin))
  if (precioMax) q = q.lte('price', Number(precioMax))
  if (descuento) q = q.gte('discount', Math.min(...descuento.split(',').map(Number)))
  if (ofertas === '1') q = q.gt('discount', 0)
  if (mejor === '1')   q = q.eq('best_option', true)

  switch (ordenar) {
    case 'precio-asc':  q = q.order('price',    { ascending: true  }); break
    case 'precio-desc': q = q.order('price',    { ascending: false }); break
    case 'descuento':   q = q.order('discount', { ascending: false }); break
    default:            q = q.order('created_at', { ascending: false })
  }

  const { data, error } = await q.limit(120)

  if (error) {
    console.error('[BiuBan] Supabase error:', error.message)
    return []
  }

  return (data ?? []).map(mapRow)
}

// Estas funciones las usan otros componentes — las dejamos para no romper nada
export function getProductsByCategory(categoria: string): Product[] { return [] }
export function getProductsByBrand(marca: string): Product[] { return [] }
export function getDiscountedProducts(): Product[] { return [] }
export function searchProducts(query: string): Product[] { return [] }