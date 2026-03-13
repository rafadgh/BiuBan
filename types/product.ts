export interface Product {
  id:              string
  nombre:          string
  slug?:           string
  marca:           string
  modelo?:         string
  descripcion?:    string
  tienda:          string
  storeTipo?:      string
  precio:          number
  precioOriginal?: number
  descuento?:      number
  imagen:          string
  url:             string
  categoria:       string
  subcategoria?:   string
  genero?:         string
  grupoEdad?:      string
  tallasDisponibles?: string[]
  tipoTalla?:      string
  color?:          string
  colorPrimario?:  string
  colorHex?:       string
  material?:       string
  estilo?:         string
  fit?:            string
  productGroup?:   string
  mejorOpcion:     boolean
  esNuevo:         boolean
  enOferta:        boolean
  trending:        boolean
  disponible:      boolean
  stockStatus?:    string
  envioGratis:     boolean
  tags?:           string[]
}

export type SortOption =
  | 'relevancia'
  | 'precio-asc'
  | 'precio-desc'
  | 'descuento'