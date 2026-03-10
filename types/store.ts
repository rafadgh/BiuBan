export interface Store {
  id: string
  nombre: string
  slug: string
  pais: string
  tipo: 'marketplace' | 'marca' | 'departamental' | 'fast-fashion'
  logo?: string
}

export interface Brand {
  id: string
  nombre: string
  slug: string
  logo?: string
  descripcion?: string
}
