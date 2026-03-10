import { Store } from '@/types/store'

export const stores: Store[] = [
  {
    id: 'nike',
    nombre: 'Nike',
    slug: 'nike',
    pais: 'México',
    tipo: 'marca',
  },
  {
    id: 'adidas',
    nombre: 'Adidas',
    slug: 'adidas',
    pais: 'México',
    tipo: 'marca',
  },
  {
    id: 'zara',
    nombre: 'Zara',
    slug: 'zara',
    pais: 'México',
    tipo: 'fast-fashion',
  },
  {
    id: 'hm',
    nombre: 'H&M',
    slug: 'hm',
    pais: 'México',
    tipo: 'fast-fashion',
  },
  {
    id: 'liverpool',
    nombre: 'Liverpool',
    slug: 'liverpool',
    pais: 'México',
    tipo: 'departamental',
  },
  {
    id: 'amazon-mx',
    nombre: 'Amazon México',
    slug: 'amazon-mx',
    pais: 'México',
    tipo: 'marketplace',
  },
  {
    id: 'mercado-libre',
    nombre: 'Mercado Libre',
    slug: 'mercado-libre',
    pais: 'México',
    tipo: 'marketplace',
  },
  {
    id: 'palacio',
    nombre: 'Palacio de Hierro',
    slug: 'palacio',
    pais: 'México',
    tipo: 'departamental',
  },
  {
    id: 'levis',
    nombre: "Levi's",
    slug: 'levis',
    pais: 'México',
    tipo: 'marca',
  },
  {
    id: 'lacoste',
    nombre: 'Lacoste',
    slug: 'lacoste',
    pais: 'México',
    tipo: 'marca',
  },
  {
    id: 'new-balance',
    nombre: 'New Balance',
    slug: 'new-balance',
    pais: 'México',
    tipo: 'marca',
  },
  {
    id: 'abercrombie',
    nombre: 'Abercrombie & Fitch',
    slug: 'abercrombie',
    pais: 'México',
    tipo: 'marca',
  },
  {
    id: 'puma',
    nombre: 'Puma',
    slug: 'puma',
    pais: 'México',
    tipo: 'marca',
  },
  {
    id: 'converse',
    nombre: 'Converse',
    slug: 'converse',
    pais: 'México',
    tipo: 'marca',
  },
  {
    id: 'vans',
    nombre: 'Vans',
    slug: 'vans',
    pais: 'México',
    tipo: 'marca',
  },
]

export function getStoreBySlug(slug: string): Store | undefined {
  return stores.find(store => store.slug === slug)
}

export function getStoreById(id: string): Store | undefined {
  return stores.find(store => store.id === id)
}
