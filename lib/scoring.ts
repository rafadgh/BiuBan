import { Product } from '@/types/product'

/**
 * Scoring system for determining the "Mejor opción" (Best option)
 * This is a placeholder implementation that can be expanded later
 * with more sophisticated logic like:
 * - Price comparison across same products
 * - Shipping costs
 * - Delivery time
 * - Store reliability scores
 * - User reviews
 */

export interface ScoringFactors {
  precio: number
  descuento: number
  disponibilidad: number
  tiendaConfianza: number
}

const TIENDA_CONFIANZA: Record<string, number> = {
  'Nike': 95,
  'Adidas': 95,
  'Zara': 90,
  'H&M': 85,
  'Liverpool': 90,
  'Amazon México': 88,
  'Mercado Libre': 80,
  'Palacio de Hierro': 92,
  "Levi's": 90,
  'Lacoste': 92,
  'New Balance': 90,
  'Abercrombie & Fitch': 88,
  'Puma': 90,
  'Converse': 88,
  'Vans': 88,
}

export function calculateScore(product: Product): number {
  const precioScore = Math.max(0, 100 - (product.precio / 50))
  const descuentoScore = (product.descuento || 0) * 2
  const disponibilidadScore = product.disponible ? 20 : 0
  const tiendaScore = (TIENDA_CONFIANZA[product.tienda] || 75) / 5

  return precioScore + descuentoScore + disponibilidadScore + tiendaScore
}

export function getBestOption(products: Product[]): Product | null {
  if (products.length === 0) return null

  // First check if any product is already marked as mejorOpcion
  const markedBest = products.find(p => p.mejorOpcion)
  if (markedBest) return markedBest

  // Otherwise calculate scores and return the highest
  let bestProduct = products[0]
  let bestScore = calculateScore(bestProduct)

  for (const product of products) {
    const score = calculateScore(product)
    if (score > bestScore) {
      bestScore = score
      bestProduct = product
    }
  }

  return bestProduct
}

export function groupProductsByName(products: Product[]): Map<string, Product[]> {
  const groups = new Map<string, Product[]>()
  
  for (const product of products) {
    const key = `${product.nombre}-${product.marca}`.toLowerCase()
    const existing = groups.get(key) || []
    existing.push(product)
    groups.set(key, existing)
  }
  
  return groups
}

export function findCheapestOption(products: Product[]): Product | null {
  if (products.length === 0) return null
  return products.reduce((cheapest, current) => 
    current.precio < cheapest.precio ? current : cheapest
  )
}
