// lib/slug.ts
// Utilidades para convertir nombres a slugs de URL y viceversa

/**
 * Convierte un nombre a slug de URL
 * "Adidas MX"          → "adidas-mx"
 * "H&M"                → "hm"
 * "Levi's"             → "levis"
 * "El Palacio de Hierro" → "el-palacio-de-hierro"
 * "A Bathing Ape"      → "a-bathing-ape"
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // acentos: é→e, ñ→n, ü→u...
    .replace(/[&]/g, '')             // H&M → hm
    .replace(/['''`]/g, '')          // Levi's → levis
    .replace(/[^a-z0-9\s-]/g, '')   // elimina símbolos restantes
    .trim()
    .replace(/\s+/g, '-')           // espacios → guiones
    .replace(/-+/g, '-')            // guiones dobles → uno
}

/**
 * Convierte un slug de vuelta a término de búsqueda
 * "adidas-mx" → "adidas mx"
 * "el-palacio-de-hierro" → "el palacio de hierro"
 */
export function slugToQuery(slug: string): string {
  return slug.replace(/-/g, ' ')
}

// Mapeo de slug de categoría → label para mostrar en UI / SEO
export const CATEGORIA_LABELS: Record<string, string> = {
  tenis:        'Tenis / Sneakers',
  botas:        'Botas / Botines',
  playeras:     'Playeras',
  sudaderas:    'Sudaderas / Hoodies',
  chamarras:    'Chamarras / Jackets',
  jeans:        'Jeans / Pantalones',
  shorts:       'Shorts',
  vestidos:     'Vestidos',
  running:      'Running / Atletismo',
  gym:          'Gym / Fitness',
  futbol:       'Fútbol',
  basketball:   'Basketball',
  golf:         'Golf',
  beisbol:      'Béisbol',
  outdoor:      'Outdoor / Senderismo',
  mochilas:     'Mochilas / Bolsas',
  gorras:       'Gorras / Sombreros',
  calcetines:   'Calcetines',
}
