import { Brand } from '@/types/store'

export const brands: Brand[] = [
  {
    id: 'nike',
    nombre: 'Nike',
    slug: 'nike',
    descripcion: 'Ropa y calzado deportivo de alto rendimiento',
  },
  {
    id: 'adidas',
    nombre: 'Adidas',
    slug: 'adidas',
    descripcion: 'Moda deportiva y lifestyle',
  },
  {
    id: 'zara',
    nombre: 'Zara',
    slug: 'zara',
    descripcion: 'Moda rápida con estilo europeo',
  },
  {
    id: 'hm',
    nombre: 'H&M',
    slug: 'hm',
    descripcion: 'Moda accesible para toda la familia',
  },
  {
    id: 'liverpool',
    nombre: 'Liverpool',
    slug: 'liverpool',
    descripcion: 'Tienda departamental con variedad de marcas',
  },
  {
    id: 'amazon-mx',
    nombre: 'Amazon México',
    slug: 'amazon-mx',
    descripcion: 'Marketplace con envío rápido',
  },
  {
    id: 'mercado-libre',
    nombre: 'Mercado Libre',
    slug: 'mercado-libre',
    descripcion: 'El marketplace más grande de Latinoamérica',
  },
  {
    id: 'lacoste',
    nombre: 'Lacoste',
    slug: 'lacoste',
    descripcion: 'Elegancia deportiva francesa',
  },
  {
    id: 'levis',
    nombre: "Levi's",
    slug: 'levis',
    descripcion: 'El original en jeans desde 1853',
  },
  {
    id: 'new-balance',
    nombre: 'New Balance',
    slug: 'new-balance',
    descripcion: 'Calzado deportivo de calidad',
  },
  {
    id: 'abercrombie',
    nombre: 'Abercrombie & Fitch',
    slug: 'abercrombie',
    descripcion: 'Moda casual americana',
  },
  {
    id: 'palacio',
    nombre: 'Palacio de Hierro',
    slug: 'palacio',
    descripcion: 'Lujo y exclusividad en México',
  },
  {
    id: 'puma',
    nombre: 'Puma',
    slug: 'puma',
    descripcion: 'Deporte y estilo de vida',
  },
  {
    id: 'converse',
    nombre: 'Converse',
    slug: 'converse',
    descripcion: 'Clásicos que nunca pasan de moda',
  },
  {
    id: 'vans',
    nombre: 'Vans',
    slug: 'vans',
    descripcion: 'Cultura skate y street style',
  },
]

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find(brand => brand.slug === slug)
}

export function getBrandById(id: string): Brand | undefined {
  return brands.find(brand => brand.id === id)
}
