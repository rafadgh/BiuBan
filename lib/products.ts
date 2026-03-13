// lib/products.ts
import { supabase } from './supabase'
import type { Product } from '@/types/product'

function parseTextArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.map(String)
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return undefined
}

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id ?? ''),
    nombre: String(row.name ?? ''),
    slug: row.slug ? String(row.slug) : undefined,
    marca: String(row.brand ?? ''),
    modelo: row.model ? String(row.model) : undefined,
    descripcion: row.description ? String(row.description) : undefined,
    tienda: String(row.store ?? ''),
    storeTipo: row.store_type ? String(row.store_type) : undefined,
    precio: Number(row.price ?? 0),
    precioOriginal: row.original_price != null ? Number(row.original_price) : undefined,
    descuento: row.discount != null ? Number(row.discount) : undefined,
    imagen: String(row.image ?? ''),
    url: String(row.url ?? ''),
    categoria: String(row.category ?? ''),
    subcategoria: row.subcategory ? String(row.subcategory) : undefined,
    genero: row.gender ? String(row.gender) : undefined,
    grupoEdad: row.age_group ? String(row.age_group) : undefined,
    tallasDisponibles: parseTextArray(row.sizes_available),
    tipoTalla: row.size_type ? String(row.size_type) : undefined,
    color: row.color ? String(row.color) : undefined,
    colorPrimario: row.color_primary ? String(row.color_primary) : undefined,
    colorHex: row.color_hex ? String(row.color_hex) : undefined,
    material: row.material ? String(row.material) : undefined,
    estilo: row.style ? String(row.style) : undefined,
    fit: row.fit ? String(row.fit) : undefined,
    productGroup: row.product_group ? String(row.product_group) : undefined,
    mejorOpcion: Boolean(row.best_option ?? false),
    esNuevo: Boolean(row.is_new ?? false),
    enOferta: Boolean(row.on_sale ?? false),
    trending: Boolean(row.trending ?? false),
    disponible: Boolean(row.available ?? true),
    stockStatus: row.stock_status ? String(row.stock_status) : undefined,
    envioGratis: Boolean(row.free_shipping ?? false),
    tags: parseTextArray(row.tags),
  }
}

function isDiscountedProduct(product: Product): boolean {
  const hasDiscountField = typeof product.descuento === 'number' && product.descuento > 0
  const hasSaleFlag = product.enOferta === true
  const hasLowerPrice =
    typeof product.precioOriginal === 'number' &&
    product.precioOriginal > 0 &&
    product.precio < product.precioOriginal

  return hasDiscountField || hasSaleFlag || hasLowerPrice
}

// Mapa de sinónimos de color para normalizar queries de color en búsqueda libre
const COLOR_SINONIMOS: Record<string, string[]> = {
  blanco:  ['white', 'blanco', 'crema', 'cream', 'off-white'],
  white:   ['blanco', 'white', 'crema'],
  negro:   ['black', 'negro'],
  black:   ['negro', 'black'],
  gris:    ['gray', 'grey', 'gris'],
  gray:    ['gris', 'gray', 'grey'],
  grey:    ['gris', 'gray', 'grey'],
  azul:    ['blue', 'azul', 'navy'],
  blue:    ['azul', 'blue'],
  navy:    ['azul', 'navy', 'marino'],
  rojo:    ['red', 'rojo'],
  red:     ['rojo', 'red'],
  verde:   ['green', 'verde'],
  green:   ['verde', 'green'],
  rosa:    ['pink', 'rosa'],
  pink:    ['rosa', 'pink'],
  morado:  ['purple', 'morado', 'violeta'],
  purple:  ['morado', 'purple'],
  amarillo:['yellow', 'amarillo'],
  yellow:  ['amarillo', 'yellow'],
  naranja: ['orange', 'naranja'],
  orange:  ['naranja', 'orange'],
  cafe:    ['brown', 'café', 'cafe', 'marrón'],
  brown:   ['café', 'brown', 'cafe'],
  beige:   ['beige', 'arena', 'crema'],
}

// Detecta si alguna palabra de la query es un color conocido
function extractColorTermsFromQuery(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/)
  const colorTerms: string[] = []

  for (const word of words) {
    const normalized = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (COLOR_SINONIMOS[normalized]) {
      colorTerms.push(...COLOR_SINONIMOS[normalized])
      colorTerms.push(word)
    }
    // también busca la palabra directamente si tiene acento (café, etc)
    if (COLOR_SINONIMOS[word]) {
      colorTerms.push(...COLOR_SINONIMOS[word])
    }
  }

  return [...new Set(colorTerms)]
}

// Detecta si alguna palabra es un término de color y devuelve las palabras NO-color
function splitQueryColorAndRest(query: string): { mainTerms: string; colorTerms: string[] } {
  const words = query.trim().split(/\s+/)
  const colorWords: string[] = []
  const restWords: string[] = []

  for (const word of words) {
    const normalized = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const isColor = !!(COLOR_SINONIMOS[normalized] || COLOR_SINONIMOS[word.toLowerCase()])
    if (isColor) {
      colorWords.push(word)
    } else {
      restWords.push(word)
    }
  }

  return {
    mainTerms: restWords.join(' '),
    colorTerms: colorWords.length > 0 ? extractColorTermsFromQuery(colorWords.join(' ')) : [],
  }
}

export interface SearchFilters {
  query?: string
  categoria?: string
  marca?: string
  tienda?: string
  color?: string
  talla?: string
  genero?: string
  precioMin?: string
  precioMax?: string
  descuento?: string
  ofertas?: string
  mejor?: string
  ordenar?: string
}

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

  let q = supabase
    .from('products')
    .select('*')
    .eq('available', true)

  // ── Búsqueda de texto ────────────────────────────────────────────────────
  if (query?.trim()) {
    const rawQuery = query.trim()

    // Separar términos de color de los demás términos
    const { mainTerms, colorTerms } = splitQueryColorAndRest(rawQuery)

    if (colorTerms.length > 0 && mainTerms.trim()) {
      // Hay color Y otros términos: buscar productos que coincidan en texto Y en color
      // Primero buscar en nombre/marca/categoría por los términos principales
      const textConds = [
        `name.ilike.%${mainTerms}%`,
        `brand.ilike.%${mainTerms}%`,
        `category.ilike.%${mainTerms}%`,
        `subcategory.ilike.%${mainTerms}%`,
        `description.ilike.%${mainTerms}%`,
        // también buscar la query completa por si el nombre ya incluye el color
        `name.ilike.%${rawQuery}%`,
      ]
      q = q.or(textConds.join(','))

      // Luego filtrar por color como condición AND
      const colorConds = colorTerms.flatMap(c => [
        `color_primary.ilike.%${c}%`,
        `color.ilike.%${c}%`,
        `name.ilike.%${c}%`,
        `description.ilike.%${c}%`,
      ])
      q = q.or(colorConds.join(','))

    } else if (colorTerms.length > 0 && !mainTerms.trim()) {
      // Solo color en la query: buscar por color
      const colorConds = colorTerms.flatMap(c => [
        `color_primary.ilike.%${c}%`,
        `color.ilike.%${c}%`,
        `name.ilike.%${c}%`,
        `description.ilike.%${c}%`,
      ])
      q = q.or(colorConds.join(','))

    } else {
      // Sin color detectado: búsqueda normal en todos los campos de texto
      q = q.or(
        `name.ilike.%${rawQuery}%,brand.ilike.%${rawQuery}%,category.ilike.%${rawQuery}%,subcategory.ilike.%${rawQuery}%,color.ilike.%${rawQuery}%,color_primary.ilike.%${rawQuery}%,description.ilike.%${rawQuery}%`
      )
    }
  }

  // ── Filtros adicionales ─────────────────────────────────────────────────
  if (categoria) {
    const cats = categoria.split(',').map(c => c.trim()).filter(Boolean)
    q =
      cats.length === 1
        ? q.ilike('category', `%${cats[0]}%`)
        : q.or(cats.map(c => `category.ilike.%${c}%`).join(','))
  }

  if (marca) {
    const marcas = marca.split(',').map(m => m.trim()).filter(Boolean)
    q =
      marcas.length === 1
        ? q.ilike('brand', `%${marcas[0]}%`)
        : q.or(marcas.map(m => `brand.ilike.%${m}%`).join(','))
  }

  if (tienda) {
    const tiendas = tienda.split(',').map(t => t.trim()).filter(Boolean)
    q =
      tiendas.length === 1
        ? q.ilike('store', `%${tiendas[0]}%`)
        : q.or(tiendas.map(t => `store.ilike.%${t}%`).join(','))
  }

  if (color) {
    const colores = color.split(',').map(c => c.trim()).filter(Boolean)
    // Para cada color del filtro, también expandir sinónimos
    const expandedColors = colores.flatMap(c => {
      const normalized = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      return [c, ...(COLOR_SINONIMOS[normalized] || []), ...(COLOR_SINONIMOS[c.toLowerCase()] || [])]
    })
    const uniqueColors = [...new Set(expandedColors)]
    const conds = uniqueColors.flatMap(c => [
      `color_primary.ilike.%${c}%`,
      `color.ilike.%${c}%`,
    ])
    q = q.or(conds.join(','))
  }

  if (talla) {
    const tallas = talla.split(',').map(t => t.trim()).filter(Boolean)
    // Buscar talla en el campo sizes_available que puede ser texto o array JSON
    // Usamos múltiples patrones para máxima compatibilidad
    if (tallas.length === 1) {
      const t = tallas[0]
      q = q.or(
        `sizes_available.ilike.%${t}%`
      )
    } else {
      q = q.or(tallas.map(t => `sizes_available.ilike.%${t}%`).join(','))
    }
  }

  if (genero) {
    const generos = genero.split(',').map(g => g.trim()).filter(Boolean)
    if (generos.length === 1) {
      q = q.ilike('gender', `%${generos[0]}%`)
    } else {
      q = q.or(generos.map(g => `gender.ilike.%${g}%`).join(','))
    }
  }

  if (precioMin) q = q.gte('price', Number(precioMin))
  if (precioMax) q = q.lte('price', Number(precioMax))

  if (descuento) {
    const valores = descuento.split(',').map(Number).filter(n => !Number.isNaN(n))
    if (valores.length > 0) {
      q = q.gte('discount', Math.min(...valores))
    }
  }

  if (mejor === '1') q = q.eq('best_option', true)

  switch (ordenar) {
    case 'precio-asc':
      q = q.order('price', { ascending: true })
      break
    case 'precio-desc':
      q = q.order('price', { ascending: false })
      break
    case 'descuento':
      q = q.order('discount', { ascending: false, nullsFirst: false })
      break
    default:
      q = q.order('created_at', { ascending: false })
  }

  const { data, error } = await q.limit(120)

  if (error) {
    console.error('[BiuBan] Error en búsqueda:', error.message)
    return []
  }

  let products = (data ?? []).map(row => mapRow(row as Record<string, unknown>))

  if (ofertas === '1') {
    products = products.filter(isDiscountedProduct)
  }

  if (descuento) {
    const valores = descuento.split(',').map(Number).filter(n => !Number.isNaN(n))
    if (valores.length > 0) {
      const minDescuento = Math.min(...valores)
      products = products.filter(product => {
        if (typeof product.descuento === 'number') return product.descuento >= minDescuento
        if (
          typeof product.precioOriginal === 'number' &&
          product.precioOriginal > 0 &&
          product.precio < product.precioOriginal
        ) {
          const porcentaje = ((product.precioOriginal - product.precio) / product.precioOriginal) * 100
          return porcentaje >= minDescuento
        }
        return false
      })
    }
  }

  if (ordenar === 'descuento') {
    products = products.sort((a, b) => {
      const descuentoA =
        typeof a.descuento === 'number'
          ? a.descuento
          : typeof a.precioOriginal === 'number' && a.precioOriginal > 0 && a.precio < a.precioOriginal
            ? ((a.precioOriginal - a.precio) / a.precioOriginal) * 100
            : 0

      const descuentoB =
        typeof b.descuento === 'number'
          ? b.descuento
          : typeof b.precioOriginal === 'number' && b.precioOriginal > 0 && b.precio < b.precioOriginal
            ? ((b.precioOriginal - b.precio) / b.precioOriginal) * 100
            : 0

      return descuentoB - descuentoA
    })
  }

  return products
}

export async function getDiscountedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('[BiuBan] Error en getDiscountedProducts:', error.message)
    return []
  }

  const discountedProducts = (data ?? [])
    .map(row => mapRow(row as Record<string, unknown>))
    .filter(isDiscountedProduct)
    .sort((a, b) => {
      const descuentoA =
        typeof a.descuento === 'number'
          ? a.descuento
          : typeof a.precioOriginal === 'number' && a.precioOriginal > 0 && a.precio < a.precioOriginal
            ? ((a.precioOriginal - a.precio) / a.precioOriginal) * 100
            : 0

      const descuentoB =
        typeof b.descuento === 'number'
          ? b.descuento
          : typeof b.precioOriginal === 'number' && b.precioOriginal > 0 && b.precio < b.precioOriginal
            ? ((b.precioOriginal - b.precio) / b.precioOriginal) * 100
            : 0

      return descuentoB - descuentoA
    })

  return discountedProducts.slice(0, limit)
}

export async function getProductsByCategory(categoria: string, limit = 24): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .ilike('category', `%${categoria}%`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[BiuBan] Error en getProductsByCategory:', error.message)
    return []
  }

  return (data ?? []).map(row => mapRow(row as Record<string, unknown>))
}

export async function getProductsByBrand(marca: string, limit = 24): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .ilike('brand', `%${marca}%`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[BiuBan] Error en getProductsByBrand:', error.message)
    return []
  }

  return (data ?? []).map(row => mapRow(row as Record<string, unknown>))
}

export async function searchProducts(query: string): Promise<Product[]> {
  return searchProductsFromDB({ query })
}