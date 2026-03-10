export interface Product {
  id: string
  nombre: string
  marca: string
  tienda: string
  precio: number
  precioOriginal?: number
  imagen: string
  mejorOpcion?: boolean
  categoria: string
  color?: string
  url: string
  descuento?: number
  disponible: boolean
}

export type Categoria = 
  | 'tenis'
  | 'playeras'
  | 'hoodies'
  | 'jeans'
  | 'chamarras'
  | 'accesorios'
  | 'vestidos'
  | 'sudaderas'

export type SortOption = 
  | 'relevancia'
  | 'precio-asc'
  | 'precio-desc'

export interface FilterState {
  marca?: string
  tienda?: string
  precioMax?: number
  ordenar?: SortOption
}
