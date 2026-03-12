import { Product } from '@/types/product'

export const products: Product[] = [
  // Nike Air Force 1 - Multiple stores
  {
    id: 'nike-af1-nike',
    nombre: "Nike Air Force 1 '07",
    marca: 'Nike',
    tienda: 'Nike',
    precio: 2299,
    precioOriginal: 2699,
    imagen: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop',
    mejorOpcion: true,
    categoria: 'tenis',
    color: 'Blanco',
    url: 'https://nike.com.mx',
    descuento: 15,
    disponible: true,
  },
  {
    id: 'nike-af1-liverpool',
    nombre: "Nike Air Force 1 '07",
    marca: 'Nike',
    tienda: 'Liverpool',
    precio: 2499,
    imagen: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Blanco',
    url: 'https://liverpool.com.mx',
    disponible: true,
  },
  {
    id: 'nike-af1-amazon',
    nombre: "Nike Air Force 1 '07",
    marca: 'Nike',
    tienda: 'Amazon México',
    precio: 2599,
    precioOriginal: 2699,
    imagen: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Blanco',
    url: 'https://amazon.com.mx',
    descuento: 4,
    disponible: true,
  },
  // Adidas Samba - Multiple stores
  {
    id: 'adidas-samba-adidas',
    nombre: 'Adidas Samba OG',
    marca: 'Adidas',
    tienda: 'Adidas',
    precio: 2199,
    imagen: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
    mejorOpcion: true,
    categoria: 'tenis',
    color: 'Blanco/Negro',
    url: 'https://adidas.com.mx',
    disponible: true,
  },
  {
    id: 'adidas-samba-liverpool',
    nombre: 'Adidas Samba OG',
    marca: 'Adidas',
    tienda: 'Liverpool',
    precio: 2399,
    imagen: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Blanco/Negro',
    url: 'https://liverpool.com.mx',
    disponible: true,
  },
  // Hoodie Oversize
  {
    id: 'hoodie-zara',
    nombre: 'Sudadera Oversize con Capucha',
    marca: 'Zara',
    tienda: 'Zara',
    precio: 899,
    precioOriginal: 1299,
    imagen: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    mejorOpcion: true,
    categoria: 'hoodies',
    color: 'Negro',
    url: 'https://zara.com/mx',
    descuento: 31,
    disponible: true,
  },
  {
    id: 'hoodie-hm',
    nombre: 'Hoodie Relaxed Fit',
    marca: 'H&M',
    tienda: 'H&M',
    precio: 699,
    imagen: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    categoria: 'hoodies',
    color: 'Negro',
    url: 'https://hm.com/mx',
    disponible: true,
  },
  // Playera Blanca
  {
    id: 'playera-abercrombie',
    nombre: 'Playera Essential Slim Fit',
    marca: 'Abercrombie & Fitch',
    tienda: 'Abercrombie & Fitch',
    precio: 599,
    precioOriginal: 799,
    imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    mejorOpcion: true,
    categoria: 'playeras',
    color: 'Blanco',
    url: 'https://abercrombie.com',
    descuento: 25,
    disponible: true,
  },
  {
    id: 'playera-hm',
    nombre: 'Playera Regular Fit',
    marca: 'H&M',
    tienda: 'H&M',
    precio: 199,
    imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    categoria: 'playeras',
    color: 'Blanco',
    url: 'https://hm.com/mx',
    disponible: true,
  },
  {
    id: 'playera-zara',
    nombre: 'Camiseta Básica',
    marca: 'Zara',
    tienda: 'Zara',
    precio: 349,
    imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    categoria: 'playeras',
    color: 'Blanco',
    url: 'https://zara.com/mx',
    disponible: true,
  },
  // Jeans
  {
    id: 'jeans-levis-501',
    nombre: "Jeans 501 Original Fit",
    marca: "Levi's",
    tienda: "Levi's",
    precio: 1299,
    precioOriginal: 1699,
    imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    mejorOpcion: true,
    categoria: 'jeans',
    color: 'Azul Medio',
    url: 'https://levis.com.mx',
    descuento: 24,
    disponible: true,
  },
  {
    id: 'jeans-zara',
    nombre: 'Jeans Straight Fit',
    marca: 'Zara',
    tienda: 'Zara',
    precio: 799,
    imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    categoria: 'jeans',
    color: 'Azul Medio',
    url: 'https://zara.com/mx',
    disponible: true,
  },
  // New Balance Running
  {
    id: 'nb-freshfoam',
    nombre: 'Fresh Foam X 1080v13',
    marca: 'New Balance',
    tienda: 'New Balance',
    precio: 3499,
    precioOriginal: 3999,
    imagen: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Gris',
    url: 'https://newbalance.com.mx',
    descuento: 13,
    disponible: true,
  },
  {
    id: 'nb-freshfoam-liverpool',
    nombre: 'Fresh Foam X 1080v13',
    marca: 'New Balance',
    tienda: 'Liverpool',
    precio: 3699,
    imagen: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Gris',
    url: 'https://liverpool.com.mx',
    disponible: true,
  },
  // Hoodie Essential
  {
    id: 'hoodie-nike',
    nombre: 'Nike Sportswear Club Fleece',
    marca: 'Nike',
    tienda: 'Nike',
    precio: 1299,
    imagen: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
    categoria: 'hoodies',
    color: 'Gris',
    url: 'https://nike.com.mx',
    disponible: true,
  },
  // Chamarra deportiva
  {
    id: 'chamarra-adidas',
    nombre: 'Chamarra Essentials 3 Stripes',
    marca: 'Adidas',
    tienda: 'Adidas',
    precio: 1499,
    precioOriginal: 1899,
    imagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    mejorOpcion: true,
    categoria: 'chamarras',
    color: 'Negro',
    url: 'https://adidas.com.mx',
    descuento: 21,
    disponible: true,
  },
  // Converse
  {
    id: 'converse-classic',
    nombre: 'Chuck Taylor All Star Classic',
    marca: 'Converse',
    tienda: 'Converse',
    precio: 1299,
    imagen: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Negro',
    url: 'https://converse.com.mx',
    disponible: true,
  },
  {
    id: 'converse-classic-palacio',
    nombre: 'Chuck Taylor All Star Classic',
    marca: 'Converse',
    tienda: 'Palacio de Hierro',
    precio: 1399,
    precioOriginal: 1499,
    imagen: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Negro',
    url: 'https://elpalaciodehierro.com',
    descuento: 7,
    disponible: true,
  },
  // Bolsa
  {
    id: 'bolsa-zara',
    nombre: 'Bolso Shopper Minimalista',
    marca: 'Zara',
    tienda: 'Zara',
    precio: 699,
    precioOriginal: 999,
    imagen: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    categoria: 'accesorios',
    color: 'Beige',
    url: 'https://zara.com/mx',
    descuento: 30,
    disponible: true,
  },
  // Polo Lacoste
  {
    id: 'polo-lacoste',
    nombre: 'Polo Classic Fit L.12.12',
    marca: 'Lacoste',
    tienda: 'Lacoste',
    precio: 2199,
    imagen: 'https://images.unsplash.com/photo-1625910513413-5fc50b18a578?w=400&h=400&fit=crop',
    categoria: 'playeras',
    color: 'Verde',
    url: 'https://lacoste.com.mx',
    disponible: true,
  },
  {
    id: 'polo-lacoste-palacio',
    nombre: 'Polo Classic Fit L.12.12',
    marca: 'Lacoste',
    tienda: 'Palacio de Hierro',
    precio: 2399,
    precioOriginal: 2599,
    imagen: 'https://images.unsplash.com/photo-1625910513413-5fc50b18a578?w=400&h=400&fit=crop',
    categoria: 'playeras',
    color: 'Verde',
    url: 'https://elpalaciodehierro.com',
    descuento: 8,
    disponible: true,
  },
  // Vans
  {
    id: 'vans-oldskool',
    nombre: 'Old Skool Classic',
    marca: 'Vans',
    tienda: 'Vans',
    precio: 1599,
    imagen: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Negro/Blanco',
    url: 'https://vans.com.mx',
    disponible: true,
  },
  // Nike Dunks
  {
    id: 'nike-dunk-low',
    nombre: 'Nike Dunk Low Retro',
    marca: 'Nike',
    tienda: 'Nike',
    precio: 2499,
    imagen: 'https://images.unsplash.com/photo-1612902456551-333ac5afa26e?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Blanco/Negro',
    url: 'https://nike.com.mx',
    disponible: true,
  },
  {
    id: 'nike-dunk-low-ml',
    nombre: 'Nike Dunk Low Retro',
    marca: 'Nike',
    tienda: 'Mercado Libre',
    precio: 2799,
    precioOriginal: 2999,
    imagen: 'https://images.unsplash.com/photo-1612902456551-333ac5afa26e?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Blanco/Negro',
    url: 'https://mercadolibre.com.mx',
    descuento: 7,
    disponible: true,
  },
  // Vestido
  {
    id: 'vestido-zara',
    nombre: 'Vestido Midi Elegante',
    marca: 'Zara',
    tienda: 'Zara',
    precio: 1299,
    precioOriginal: 1799,
    imagen: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    categoria: 'vestidos',
    color: 'Negro',
    url: 'https://zara.com/mx',
    descuento: 28,
    disponible: true,
  },
  // Puma
  {
    id: 'puma-suede',
    nombre: 'Suede Classic XXI',
    marca: 'Puma',
    tienda: 'Puma',
    precio: 1699,
    precioOriginal: 1999,
    imagen: 'https://images.unsplash.com/photo-1608379743498-63d0e7251c0e?w=400&h=400&fit=crop',
    categoria: 'tenis',
    color: 'Negro',
    url: 'https://puma.com/mx',
    descuento: 15,
    disponible: true,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

export function getProductsByCategory(categoria: string): Product[] {
  return products.filter(product => product.categoria === categoria)
}

export function getProductsByBrand(marca: string): Product[] {
  return products.filter(product => product.marca.toLowerCase() === marca.toLowerCase())
}

export function getProductsByStore(tienda: string): Product[] {
  return products.filter(product => product.tienda.toLowerCase() === tienda.toLowerCase())
}

export function getDiscountedProducts(): Product[] {
  return products.filter(product => product.descuento && product.descuento > 0)
}

// ─── Búsqueda bilingüe ES ↔ EN ────────────────────────────────────────────────

const SINONIMOS: Record<string, string[]> = {
  // Ropa superior
  sudadera:  ['hoodie', 'hoodies', 'sweatshirt', 'sweater', 'sudaderas'],
  hoodie:    ['sudadera', 'sudaderas', 'hoodies', 'sweatshirt', 'sweater'],
  hoodies:   ['sudadera', 'sudaderas', 'hoodie', 'sweatshirt'],
  sweatshirt:['sudadera', 'hoodie', 'sweater'],
  sweater:   ['suéter', 'sueter', 'sudadera', 'jersey'],
  'suéter':  ['sweater', 'sueter', 'jersey', 'sudadera'],
  sueter:    ['sweater', 'suéter', 'jersey'],
  playera:   ['t-shirt', 'tshirt', 'camiseta', 'shirt', 'tee', 'playeras', 'remera'],
  camiseta:  ['playera', 't-shirt', 'shirt', 'tee', 'playeras'],
  'tshirt':  ['playera', 'camiseta', 'shirt', 'tee'],
  'tee':     ['playera', 'camiseta', 't-shirt'],
  camisa:    ['shirt', 'camisas', 'blusa', 'button-up', 'button up'],
  blusa:     ['blouse', 'top', 'blusas', 'camisa'],
  top:       ['blusa', 'crop top', 'blusas', 'tops'],
  chamarra:  ['jacket', 'chaqueta', 'chamarras', 'cazadora', 'coat', 'abrigo'],
  jacket:    ['chamarra', 'chaqueta', 'chamarras', 'cazadora'],
  chaqueta:  ['jacket', 'chamarra', 'chamarras'],
  abrigo:    ['coat', 'overcoat', 'chamarra', 'jacket', 'abrigos'],
  coat:      ['abrigo', 'chamarra', 'jacket'],

  // Ropa inferior
  pantalón:  ['pants', 'pantalones', 'pantalon', 'trousers', 'slacks'],
  pantalon:  ['pants', 'pantalones', 'pantalón', 'trousers'],
  pantalones:['pants', 'trousers', 'pantalon', 'pantalón'],
  pants:     ['pantalón', 'pantalones', 'pantalon', 'joggers', 'trousers'],
  jeans:     ['mezclilla', 'vaqueros', 'denim', 'pantalón de mezclilla'],
  mezclilla: ['jeans', 'denim', 'vaqueros'],
  denim:     ['jeans', 'mezclilla', 'vaqueros'],
  shorts:    ['short', 'bermudas', 'bermuda', 'pantalón corto'],
  short:     ['shorts', 'bermudas', 'bermuda'],
  bermuda:   ['shorts', 'short', 'bermudas'],
  falda:     ['skirt', 'faldas', 'minifalda'],
  skirt:     ['falda', 'faldas', 'minifalda'],
  leggings:  ['leggins', 'mallas', 'legging', 'tights'],
  leggins:   ['leggings', 'mallas', 'tights'],
  mallas:    ['leggings', 'leggins', 'tights'],

  // Calzado
  tenis:     ['sneakers', 'zapatillas', 'shoes', 'sneaker', 'tennis', 'kicks', 'calzado deportivo'],
  sneakers:  ['tenis', 'zapatillas', 'tennis', 'kicks', 'shoes'],
  sneaker:   ['tenis', 'zapatillas', 'sneakers'],
  zapatillas:['tenis', 'sneakers', 'shoes'],
  zapatos:   ['shoes', 'calzado', 'footwear', 'zapatillas'],
  shoes:     ['zapatos', 'tenis', 'calzado', 'zapatillas'],
  calzado:   ['shoes', 'zapatos', 'tenis', 'footwear'],
  botas:     ['boots', 'bota', 'botines'],
  boots:     ['botas', 'bota', 'botines'],
  botines:   ['botas', 'boots', 'ankle boots'],
  sandalias: ['sandals', 'chanclas', 'slides', 'huaraches'],
  sandals:   ['sandalias', 'chanclas', 'slides'],
  chanclas:  ['sandalias', 'slides', 'flip flops', 'flip-flops'],
  slides:    ['chanclas', 'sandalias', 'sliders'],

  // Tipos de prenda
  vestido:   ['dress', 'vestidos'],
  dress:     ['vestido', 'vestidos'],
  polo:      ['polo shirt', 'playera polo', 'polo tee'],
  bolso:     ['bag', 'bolsa', 'purse', 'tote', 'cartera'],
  bolsa:     ['bag', 'bolso', 'purse', 'tote', 'cartera'],
  bag:       ['bolsa', 'bolso', 'mochila', 'cartera'],
  mochila:   ['backpack', 'bag', 'mochilas'],
  backpack:  ['mochila', 'mochilas', 'bag'],
  conjunto:  ['set', 'outfit', 'conjuntos', 'coordinado', 'look'],
  outfit:    ['conjunto', 'look', 'atuendo', 'coordinado'],

  // Deportivo / uso
  deportivo: ['sport', 'athletic', 'activewear', 'gym', 'fitness', 'training'],
  gym:       ['deportivo', 'fitness', 'training', 'entrenamiento', 'activewear'],
  running:   ['correr', 'atletismo', 'jogging', 'run'],
  training:  ['entrenamiento', 'gym', 'deportivo', 'fitness'],
  yoga:      ['pilates', 'activewear', 'leggings', 'deportivo'],
  casual:    ['everyday', 'diario', 'básico', 'basico'],

  // Tallas y fit
  oversize:  ['oversized', 'holgado', 'amplio', 'loose', 'relaxed'],
  oversized: ['oversize', 'holgado', 'loose'],
  slim:      ['slim fit', 'ajustado', 'entallado', 'skinny'],
  skinny:    ['slim', 'ajustado', 'entallado'],

  // Colores EN → ES
  white:     ['blanco', 'crema', 'ivory'],
  blanco:    ['white', 'crema', 'ivory'],
  black:     ['negro', 'dark'],
  negro:     ['black', 'dark'],
  gray:      ['gris', 'grey'],
  grey:      ['gris', 'gray'],
  gris:      ['gray', 'grey'],
  blue:      ['azul', 'navy', 'celeste'],
  azul:      ['blue', 'navy', 'celeste'],
  navy:      ['azul marino', 'azul', 'blue'],
  red:       ['rojo', 'crimson'],
  rojo:      ['red', 'crimson'],
  green:     ['verde', 'olive'],
  verde:     ['green', 'olive'],
  pink:      ['rosa', 'rose'],
  rosa:      ['pink', 'rose'],
  purple:    ['morado', 'violet', 'lila'],
  morado:    ['purple', 'violet', 'lila'],
  yellow:    ['amarillo', 'gold'],
  amarillo:  ['yellow', 'gold'],
  orange:    ['naranja'],
  naranja:   ['orange'],
  brown:     ['café', 'cafe', 'marrón', 'marron'],
  café:      ['brown', 'cafe', 'marrón'],
  cafe:      ['brown', 'café', 'marrón'],
  beige:     ['crema', 'tan', 'nude', 'arena'],
  crema:     ['beige', 'cream', 'nude', 'ivory'],
}

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .trim()
}

function expandirTerminos(query: string): string[] {
  const terminos = normalizarTexto(query).split(/\s+/).filter(Boolean)
  const todos = new Set<string>()

  for (const termino of terminos) {
    todos.add(termino)

    // Sinónimos directos
    const sinonimos = SINONIMOS[termino]
    if (sinonimos) {
      sinonimos.forEach(s => todos.add(normalizarTexto(s)))
    }

    // Busca si el término aparece como valor en alguna entrada
    for (const [clave, lista] of Object.entries(SINONIMOS)) {
      const listaNorm = lista.map(normalizarTexto)
      if (listaNorm.includes(termino)) {
        todos.add(normalizarTexto(clave))
        listaNorm.forEach(s => todos.add(s))
      }
    }
  }

  return Array.from(todos)
}

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return products

  const terminos = expandirTerminos(query)

  // Puntúa cada producto según cuántos términos coinciden y en qué campo
  const scored = products.map(product => {
    const campos = {
      nombre:    normalizarTexto(product.nombre),
      marca:     normalizarTexto(product.marca),
      categoria: normalizarTexto(product.categoria),
      color:     normalizarTexto(product.color || ''),
      tienda:    normalizarTexto(product.tienda),
    }

    let score = 0
    for (const termino of terminos) {
      if (campos.nombre.includes(termino))    score += 4  // nombre pesa más
      if (campos.marca.includes(termino))     score += 3
      if (campos.categoria.includes(termino)) score += 2
      if (campos.color.includes(termino))     score += 1
      if (campos.tienda.includes(termino))    score += 1
    }

    return { product, score }
  })

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)   // mejores coincidencias primero
    .map(({ product }) => product)
}