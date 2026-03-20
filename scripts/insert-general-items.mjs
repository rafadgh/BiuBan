/**
 * insert-general-items.mjs
 * Inserta productos generales del hub de afiliados de ML en Supabase.
 * Detecta categoría, subcategoría, género y marca del título.
 */

import { createClient } from '@supabase/supabase-js'
import { createHash }   from 'crypto'
import { readFileSync }  from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(join(__dir, '../.env.local'), 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const [k, ...v] = line.split('=')
  if (k && v.length) env[k.trim()] = v.join('=').trim()
}

const supabase  = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])
const AFFILIATE = 'diezrafa20230122100014'

function mlIdToUuid(id) {
  const h = createHash('sha256').update(`ml:${id}`).digest('hex')
  return [h.slice(0,8),h.slice(8,12),'4'+h.slice(13,16),((parseInt(h[16],16)&3)|8).toString(16)+h.slice(17,20),h.slice(20,32)].join('-')
}
function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,80)
}
function affUrl(url) {
  // Remove existing params that conflict, add affiliate params
  const base = url.split('?')[0]
  return base + `?matt_tool=${AFFILIATE}&matt_source=affiliate&matt_campaign=biuban`
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── Productos del hub de afiliados ───────────────────────────────────────────
const ITEMS = [
  {"item_id":"MLM1439568176","title":"Pants Jogger Deportivo Slim Fit Súper Calidad Elástico","url":"https://articulo.mercadolibre.com.mx/MLM-1439568176-pants-jogger-deportivo-slim-fit-super-calidad-elastico-_JM","price_numeric":148.99},
  {"item_id":"MLM3313865500","title":"Botas De Seguridad Zapatos Industrial Trabajo Tenis Nieion","url":"https://articulo.mercadolibre.com.mx/MLM-3313865500-botas-de-seguridad-zapatos-industrial-trabajo-tenis-nieion-_JM","price_numeric":487.28},
  {"item_id":"MLM1473947656","title":"Camisa Polo Hombre Slim Fit Manga Corta Casual 16 Colores","url":"https://articulo.mercadolibre.com.mx/MLM-1473947656-camisa-polo-hombre-slim-fit-manga-corta-casual-16-colores-_JM","price_numeric":119.99},
  {"item_id":"MLM2440199137","title":"5pzs Bóxer Elástico Algodón Hombre Pack Ropa Interior Calzón","url":"https://articulo.mercadolibre.com.mx/MLM-2440199137-5pzs-boxer-elastico-algodon-hombre-pack-ropa-interior-calzon-_JM","price_numeric":97.65},
  {"item_id":"MLM1487398508","title":"Mangas Protectoras Para Brazos Protección Solar Uv,3 Pares","url":"https://articulo.mercadolibre.com.mx/MLM-1487398508-mangas-protectoras-para-brazos-proteccion-solar-uv3-pares-_JM","price_numeric":96.14},
  {"item_id":"MLM2301219347","title":"3pcs Panty Faja Body Calzón Reductora Moldeadora Sexy","url":"https://articulo.mercadolibre.com.mx/MLM-2301219347-3pcs-panty-faja-body-calzon-reductora-moldeadora-sexy-_JM","price_numeric":198},
  {"item_id":"MLM2995920488","title":"Gimnasio Short Con Licra Deportiva 2 En 1 Hombre Correr","url":"https://articulo.mercadolibre.com.mx/MLM-2995920488-gimnasio-short-con-licra-deportiva-2-en-1-hombre-correr-_JM","price_numeric":125.63},
  {"item_id":"MLM2032840557","title":"Lonchera Térmica Bolsa Trabajo Escolares Gran Capacidad 10l","url":"https://articulo.mercadolibre.com.mx/MLM-2032840557-lonchera-termica-bolsa-trabajo-escolares-gran-capacidad-10l-_JM","price_numeric":116.98},
  {"item_id":"MLM2162965855","title":"Camisa Slim Fit Manga Larga Para Hombre Casual","url":"https://articulo.mercadolibre.com.mx/MLM-2162965855-camisa-slim-fit-manga-larga-para-hombre-casual-_JM","price_numeric":238},
  {"item_id":"MLM826311737","title":"Leggins Deportivos Dama De Licra Con Bolsa Celular  Gym","url":"https://articulo.mercadolibre.com.mx/MLM-826311737-leggins-deportivos-dama-de-licra-con-bolsa-celular-gym-_JM","price_numeric":138.99},
  {"item_id":"MLM1397028379","title":"Zapato Medico Salud Chef Cocina Suela Con Antiderrapante","url":"https://articulo.mercadolibre.com.mx/MLM-1397028379-zapato-medico-salud-chef-cocina-suela-con-antiderrapante-_JM","price_numeric":221.62},
  {"item_id":"MLM1610564301","title":"Chaqueta De Mezclilla Delgada Negro Slim Para Hombre","url":"https://articulo.mercadolibre.com.mx/MLM-1610564301-chaqueta-de-mezclilla-delgada-negro-slim-para-hombre-_JM","price_numeric":298.80},
  {"item_id":"MLM2916868668","title":"2pcs Bra Brasier Strapless Calientito Fondo Sin Tirantes","url":"https://articulo.mercadolibre.com.mx/MLM-2916868668-2pcs-bra-brasier-strapless-calientito-fondo-sin-tirantes-_JM","price_numeric":138.99},
  {"item_id":"MLM2488617956","title":"Pantalon Mezclilla Hombre Slim Fit Stretch 5 Bolsas","url":"https://articulo.mercadolibre.com.mx/MLM-2488617956-pantalon-mezclilla-hombre-slim-fit-stretch-5-bolsas-_JM","price_numeric":249},
  {"item_id":"MLM1560474090","title":"Playera Licra Deportiva Correr Compresión Manga Larga","url":"https://articulo.mercadolibre.com.mx/MLM-1560474090-playera-licra-deportiva-correr-compresion-manga-larga-_JM","price_numeric":139.99},
  {"item_id":"MLM3553655553","title":"Pantalón Táctico Militar Impermeable Y Cortavientos","url":"https://articulo.mercadolibre.com.mx/MLM-3553655553-pantalon-tactico-militar-impermeable-y-cortavientos-_JM","price_numeric":279.99},
  {"item_id":"MLM3513777905","title":"Tenis Hombre Aire Correr Originales Cómodos Transpirables S7","url":"https://articulo.mercadolibre.com.mx/MLM-3513777905-tenis-hombre-aire-correr-originales-comodos-transpirables-s7-_JM","price_numeric":249.99},
  {"item_id":"MLM3584714449","title":"Getac Sandalia Chancla Pantunfla Eva Plataforma 4cm Confort","url":"https://articulo.mercadolibre.com.mx/MLM-3584714449-getac-sandalia-chancla-pantunfla-eva-plataforma-4cm-confort-_JM","price_numeric":192.37},
  {"item_id":"MLM3636225461","title":"Calcetines Cortos Hombres Dama Unisex Cómodo 12 Pares","url":"https://articulo.mercadolibre.com.mx/MLM-3636225461-calcetines-cortos-hombres-dama-unisex-comodo-12-pares-_JM","price_numeric":62.99},
  {"item_id":"MLM3775046695","title":"U Bárbara Pijama Quirúrgica Corte Recto Con Bolsas Uniforme","url":"https://articulo.mercadolibre.com.mx/MLM-3775046695-u-barbara-pijama-quirurgica-corte-recto-con-bolsas-uniforme-_JM","price_numeric":284.99},
  {"item_id":"MLM3696116023","title":"Mochila Hombre Mujer Escolar Viaje Porta Laptop Impermeable","url":"https://articulo.mercadolibre.com.mx/MLM-3696116023-mochila-hombre-mujer-escolar-viaje-porta-laptop-impermeable-_JM","price_numeric":299.99},
  {"item_id":"MLM2879736524","title":"Reloj Mujer Moda Casual Elegante Acero Inox Impermeable","url":"https://articulo.mercadolibre.com.mx/MLM-2879736524-reloj-mujer-moda-casual-elegante-acero-inox-impermeable-_JM","price_numeric":199.99},
  {"item_id":"MLM1458375685","title":"Conjunto Deportivo Para Mujer Con Sudadera Y Pants","url":"https://articulo.mercadolibre.com.mx/MLM-1458375685-conjunto-deportivo-para-mujer-con-sudadera-y-pants-_JM","price_numeric":269},
  {"item_id":"MLM1398040694","title":"Bolsa Para Mujer Mochila Escolar Antirrobo Con Puerto Usb","url":"https://articulo.mercadolibre.com.mx/MLM-1398040694-bolsa-para-mujer-mochila-escolar-antirrobo-con-puerto-usb-_JM","price_numeric":249},
  {"item_id":"MLM1600041143","title":"Bolsa Bandolera Correa Cadena Mujer Lujo Elegante","url":"https://articulo.mercadolibre.com.mx/MLM-1600041143-bolsa-bandolera-correa-cadena-mujer-lujo-elegante-_JM","price_numeric":449},
  {"item_id":"MLM1540773497","title":"Chaleco Acolchado Inflable Ultraligero Hombre Y Mujer","url":"https://articulo.mercadolibre.com.mx/MLM-1540773497-chaleco-acolchado-inflable-ultraligero-hombre-y-mujer-_JM","price_numeric":329},
  {"item_id":"MLM2050447716","title":"Calcetines Hombre Premium 12 Pares Algodón Colores","url":"https://articulo.mercadolibre.com.mx/MLM-2050447716-calcetines-hombre-premium-12-pares-algodon-colores-_JM","price_numeric":139.99},
  {"item_id":"MLM2278855050","title":"Mochila Antirrobo De Viaje 40l Hombre Deporte Escolar","url":"https://articulo.mercadolibre.com.mx/MLM-2278855050-mochila-antirrobo-de-viaje-40l-hombre-deporte-escolar-_JM","price_numeric":449},
  {"item_id":"MLM2454394866","title":"Pack 3 Pares De Calcetines Largos Térmicos Para Mujer Y Hombre","url":"https://articulo.mercadolibre.com.mx/MLM-2454394866-pack-3-pares-de-calcetines-largos-termicos-para-mujer-y-hombre-_JM","price_numeric":109.99},
  {"item_id":"MLM2553038050","title":"Mochila Hombre Mujer Para Laptop 15.6 Puerto De Carga Usb","url":"https://articulo.mercadolibre.com.mx/MLM-2553038050-mochila-hombre-mujer-para-laptop-156-puerto-de-carga-usb-_JM","price_numeric":389},
  {"item_id":"MLM3081038990","title":"Pants Jogger Cargo Con Bolsas Laterales Hombre Y Mujer","url":"https://articulo.mercadolibre.com.mx/MLM-3081038990-pants-jogger-cargo-con-bolsas-laterales-hombre-y-mujer-_JM","price_numeric":219},
  {"item_id":"MLM2694267044","title":"Playera De Algodón Para Hombre Cuello Redondo Básica","url":"https://articulo.mercadolibre.com.mx/MLM-2694267044-playera-de-algodon-para-hombre-cuello-redondo-basica-_JM","price_numeric":89.99},
  {"item_id":"MLM2746826649","title":"Conjunto Deportivo Mujer 2 Piezas Leggins Y Top Deportivo","url":"https://articulo.mercadolibre.com.mx/MLM-2746826649-conjunto-deportivo-mujer-2-piezas-leggins-y-top-deportivo-_JM","price_numeric":149.99},
  {"item_id":"MLM3014165406","title":"Bolsa Para Mujer Piel Genuina Elegante Hombro Bandolera","url":"https://articulo.mercadolibre.com.mx/MLM-3014165406-bolsa-para-mujer-piel-genuina-elegante-hombro-bandolera-_JM","price_numeric":399},
  {"item_id":"MLM3261855220","title":"Vestido Casual Mujer Verano Floral Manga Corta Midi","url":"https://articulo.mercadolibre.com.mx/MLM-3261855220-vestido-casual-mujer-verano-floral-manga-corta-midi-_JM","price_numeric":199.99},
  {"item_id":"MLM2788394791","title":"Tenis Mujer Casual Cómodos Ligeros Para Caminar","url":"https://articulo.mercadolibre.com.mx/MLM-2788394791-tenis-mujer-casual-comodos-ligeros-para-caminar-_JM","price_numeric":199.99},
  {"item_id":"MLM3354432393","title":"Short Deportivo Hombre Ligero Secado Rápido Gym","url":"https://articulo.mercadolibre.com.mx/MLM-3354432393-short-deportivo-hombre-ligero-secado-rapido-gym-_JM","price_numeric":99.99},
  {"item_id":"MLM1456543785","title":"Bolso Mujer Bandolera Cuero Pu Moda Mensajero Chica","url":"https://articulo.mercadolibre.com.mx/MLM-1456543785-bolso-mujer-bandolera-cuero-pu-moda-mensajero-chica-_JM","price_numeric":299},
  {"item_id":"MLM3563655028","title":"Zapatillas Deportivas Hombre Running Ligeras Transpirables","url":"https://articulo.mercadolibre.com.mx/MLM-3563655028-zapatillas-deportivas-hombre-running-ligeras-transpirables-_JM","price_numeric":219.99},
  {"item_id":"MLM1627940555","title":"Bota Para Hombre Clasica Vaquera Piel Genuina","url":"https://articulo.mercadolibre.com.mx/MLM-1627940555-bota-para-hombre-clasica-vaquera-piel-genuina-_JM","price_numeric":899},
  {"item_id":"MLM2127344948","title":"Huarache Sandalia Mexicana Artesanal Hombre Mujer","url":"https://articulo.mercadolibre.com.mx/MLM-2127344948-huarache-sandalia-mexicana-artesanal-hombre-mujer-_JM","price_numeric":259},
  {"item_id":"MLM2481483282","title":"Zapatilla Casual Mujer Plataforma Cómoda Moda","url":"https://articulo.mercadolibre.com.mx/MLM-2481483282-zapatilla-casual-mujer-plataforma-comoda-moda-_JM","price_numeric":249},
  {"item_id":"MLM1536893716","title":"Sudadera Hombre Con Capucha Hoodie Casual Algodón","url":"https://articulo.mercadolibre.com.mx/MLM-1536893716-sudadera-hombre-con-capucha-hoodie-casual-algodon-_JM","price_numeric":199},
  {"item_id":"MLM2641714892","title":"Tenis Mujer Plataforma Casual Moda Cómodos","url":"https://articulo.mercadolibre.com.mx/MLM-2641714892-tenis-mujer-plataforma-casual-moda-comodos-_JM","price_numeric":279},
  {"item_id":"MLM2003948393","title":"Bota Vaquera Hombre Punta Cuadrada Cuero Genuino","url":"https://articulo.mercadolibre.com.mx/MLM-2003948393-bota-vaquera-hombre-punta-cuadrada-cuero-genuino-_JM","price_numeric":1199},
  {"item_id":"MLM2198127671","title":"Cinturón Hombre Cuero Genuino Casual Formal Resistente","url":"https://articulo.mercadolibre.com.mx/MLM-2198127671-cinturon-hombre-cuero-genuino-casual-formal-resistente-_JM","price_numeric":179},
  {"item_id":"MLM3413434065","title":"Pijama Mujer Conjunto Suave Cómodo Manga Larga","url":"https://articulo.mercadolibre.com.mx/MLM-3413434065-pijama-mujer-conjunto-suave-comodo-manga-larga-_JM","price_numeric":199.99},
  {"item_id":"MLM2583047765","title":"Sombrero De Paja Para Hombre Mujer Verano Playa","url":"https://articulo.mercadolibre.com.mx/MLM-2583047765-sombrero-de-paja-para-hombre-mujer-verano-playa-_JM","price_numeric":159},
  {"item_id":"MLM1573049026","title":"Medias Pantimedia Mujer Control Top Opaca","url":"https://articulo.mercadolibre.com.mx/MLM-1573049026-medias-pantimedia-mujer-control-top-opaca-_JM","price_numeric":79.99},
  {"item_id":"MLM1502100665","title":"Tenis De Piel Para Hombre Casuales Moda Clásicos","url":"https://articulo.mercadolibre.com.mx/MLM-1502100665-tenis-de-piel-para-hombre-casuales-moda-clasicos-_JM","price_numeric":399},
  {"item_id":"MLM2406820694","title":"Bolsa Tote Bag Mujer Lona Grande Hombro Casual Escolar","url":"https://articulo.mercadolibre.com.mx/MLM-2406820694-bolsa-tote-bag-mujer-lona-grande-hombro-casual-escolar-_JM","price_numeric":149.99},
  {"item_id":"MLM3462551698","title":"Gorra Snapback Plana Ajustable Hombre Mujer Hip Hop","url":"https://articulo.mercadolibre.com.mx/MLM-3462551698-gorra-snapback-plana-ajustable-hombre-mujer-hip-hop-_JM","price_numeric":89.99},
  {"item_id":"MLM2840095891","title":"Suéter De Punto Para Mujer Cuello Redondo Casual","url":"https://articulo.mercadolibre.com.mx/MLM-2840095891-sueter-de-punto-para-mujer-cuello-redondo-casual-_JM","price_numeric":249},
  {"item_id":"MLM1652200768","title":"Pantalón Cargo Hombre Táctico Multi Bolsillo Slim","url":"https://articulo.mercadolibre.com.mx/MLM-1652200768-pantalon-cargo-hombre-tactico-multi-bolsillo-slim-_JM","price_numeric":299},
  {"item_id":"MLM3605803726","title":"Zapato Formal Hombre Piel Genuina Oxford Clásico","url":"https://articulo.mercadolibre.com.mx/MLM-3605803726-zapato-formal-hombre-piel-genuina-oxford-clasico-_JM","price_numeric":549},
  {"item_id":"MLM1545248756","title":"Bolsa Mujer Cuero Genuino Elegante Hombro Grande","url":"https://articulo.mercadolibre.com.mx/MLM-1545248756-bolsa-mujer-cuero-genuino-elegante-hombro-grande-_JM","price_numeric":499},
  {"item_id":"MLM2956403568","title":"Blusa Mujer Elegante Manga Larga Formal Trabajo","url":"https://articulo.mercadolibre.com.mx/MLM-2956403568-blusa-mujer-elegante-manga-larga-formal-trabajo-_JM","price_numeric":179.99},
  {"item_id":"MLM2062773048","title":"Sandalia Mujer Plataforma Tacon Bajo Cómoda Casual","url":"https://articulo.mercadolibre.com.mx/MLM-2062773048-sandalia-mujer-plataforma-tacon-bajo-comoda-casual-_JM","price_numeric":199.99},
  {"item_id":"MLM3139680736","title":"Playera Polo Mujer Slim Fit Manga Corta Casual Colores","url":"https://articulo.mercadolibre.com.mx/MLM-3139680736-playera-polo-mujer-slim-fit-manga-corta-casual-colores-_JM","price_numeric":119.99},
  {"item_id":"MLM3250069148","title":"Lentes Sol Polarizados Uv400 Hombre Mujer Sport Ciclismo","url":"https://articulo.mercadolibre.com.mx/MLM-3250069148-lentes-sol-polarizados-uv400-hombre-mujer-sport-ciclismo-_JM","price_numeric":179.99},
  {"item_id":"MLM1596867561","title":"Suéter Lana Para Hombre Tejido Cuello Redondo Casual","url":"https://articulo.mercadolibre.com.mx/MLM-1596867561-sueter-lana-para-hombre-tejido-cuello-redondo-casual-_JM","price_numeric":279},
  {"item_id":"MLM2355889929","title":"Chamarra Hombre Invierno Impermeable Cortavientos","url":"https://articulo.mercadolibre.com.mx/MLM-2355889929-chamarra-hombre-invierno-impermeable-cortavientos-_JM","price_numeric":499},
]

// ─── Detectar género ──────────────────────────────────────────────────────────
function detectGender(title) {
  const t = title.toLowerCase()
  if (t.includes('mujer') || t.includes('dama') || t.includes('chica') || t.includes('brasier') || t.includes('bra ') || t.includes('panty') || t.includes('pantimedia') || t.includes('blusa')) return 'Mujer'
  if (t.includes('hombre') || t.includes('boxer') || t.includes('bóxer')) return 'Hombre'
  if (t.includes('hombre') && t.includes('mujer')) return null
  return null
}

// ─── Detectar categoría + subcategoría ────────────────────────────────────────
function detectCategory(title) {
  const t = title.toLowerCase()
  // Calzado
  if (t.includes('tenis') || t.includes('zapatilla') || t.includes('sneaker')) {
    if (t.includes('mujer') || t.includes('dama')) return { cat: 'Calzado', sub: 'Tenis', gender: 'Mujer' }
    if (t.includes('hombre')) return { cat: 'Calzado', sub: 'Tenis', gender: 'Hombre' }
    return { cat: 'Calzado', sub: 'Tenis', gender: null }
  }
  if (t.includes('bota') || t.includes('boot')) {
    if (t.includes('mujer')) return { cat: 'Calzado', sub: 'Botas', gender: 'Mujer' }
    return { cat: 'Calzado', sub: 'Botas', gender: 'Hombre' }
  }
  if (t.includes('sandalia') || t.includes('chancla') || t.includes('huarache')) {
    if (t.includes('mujer') || t.includes('dama')) return { cat: 'Calzado', sub: 'Sandalias', gender: 'Mujer' }
    return { cat: 'Calzado', sub: 'Sandalias', gender: null }
  }
  if (t.includes('zapato') || t.includes('oxford') || t.includes('medico') || t.includes('médico')) {
    if (t.includes('mujer')) return { cat: 'Calzado', sub: 'Zapatos', gender: 'Mujer' }
    return { cat: 'Calzado', sub: 'Zapatos', gender: 'Hombre' }
  }
  // Accesorios / Bolsas
  if (t.includes('mochila')) {
    if (t.includes('mujer')) return { cat: 'Accesorios', sub: 'Mochilas', gender: 'Mujer' }
    if (t.includes('hombre')) return { cat: 'Accesorios', sub: 'Mochilas', gender: 'Hombre' }
    return { cat: 'Accesorios', sub: 'Mochilas', gender: null }
  }
  if (t.includes('bolsa') || t.includes('bolso') || t.includes('tote') || t.includes('bandolera')) {
    if (t.includes('mujer') || t.includes('dama') || t.includes('chica')) return { cat: 'Accesorios', sub: 'Bolsas', gender: 'Mujer' }
    return { cat: 'Accesorios', sub: 'Bolsas', gender: null }
  }
  if (t.includes('lonchera')) return { cat: 'Accesorios', sub: 'Bolsas', gender: null }
  if (t.includes('reloj')) {
    if (t.includes('mujer')) return { cat: 'Accesorios', sub: 'Relojes', gender: 'Mujer' }
    return { cat: 'Accesorios', sub: 'Relojes', gender: 'Hombre' }
  }
  if (t.includes('lentes') || t.includes('gafas')) return { cat: 'Accesorios', sub: 'Lentes', gender: null }
  if (t.includes('gorra') || t.includes('sombrero')) return { cat: 'Accesorios', sub: 'Gorras', gender: null }
  if (t.includes('cinturón') || t.includes('cinturon')) return { cat: 'Accesorios', sub: 'Cinturones', gender: 'Hombre' }
  // Mujer
  if (t.includes('vestido')) return { cat: 'Mujer', sub: 'Vestidos', gender: 'Mujer' }
  if (t.includes('blusa')) return { cat: 'Mujer', sub: 'Blusas', gender: 'Mujer' }
  if (t.includes('leggin') || t.includes('legging') || t.includes('licra')) {
    if (t.includes('hombre')) return { cat: 'Hombre', sub: 'Deportivo', gender: 'Hombre' }
    return { cat: 'Mujer', sub: 'Leggins', gender: 'Mujer' }
  }
  if (t.includes('brasier') || t.includes('bra ') || t.includes('faja') || t.includes('panty') || t.includes('pantimedia') || t.includes('medias')) return { cat: 'Mujer', sub: 'Ropa Interior', gender: 'Mujer' }
  if (t.includes('pijama') && t.includes('mujer')) return { cat: 'Mujer', sub: 'Pijamas', gender: 'Mujer' }
  if (t.includes('pijama')) return { cat: 'Mujer', sub: 'Pijamas', gender: null }
  if (t.includes('suéter') || t.includes('sueter')) {
    if (t.includes('mujer')) return { cat: 'Mujer', sub: 'Suéteres', gender: 'Mujer' }
    return { cat: 'Hombre', sub: 'Suéteres', gender: 'Hombre' }
  }
  // Hombre
  if (t.includes('camisa') || t.includes('polo')) {
    if (t.includes('mujer')) return { cat: 'Mujer', sub: 'Tops', gender: 'Mujer' }
    return { cat: 'Hombre', sub: 'Camisas', gender: 'Hombre' }
  }
  if (t.includes('chamarra') || t.includes('chaleco') || t.includes('chaqueta')) {
    if (t.includes('mujer')) return { cat: 'Mujer', sub: 'Chamarras', gender: 'Mujer' }
    return { cat: 'Hombre', sub: 'Chamarras', gender: 'Hombre' }
  }
  if (t.includes('sudadera') || t.includes('hoodie')) {
    if (t.includes('mujer')) return { cat: 'Mujer', sub: 'Sudaderas', gender: 'Mujer' }
    return { cat: 'Hombre', sub: 'Sudaderas', gender: 'Hombre' }
  }
  if (t.includes('pantalon') || t.includes('pantalón') || t.includes('pants') || t.includes('jogger')) {
    if (t.includes('mujer')) return { cat: 'Mujer', sub: 'Pantalones', gender: 'Mujer' }
    return { cat: 'Hombre', sub: 'Pantalones', gender: 'Hombre' }
  }
  if (t.includes('short')) {
    if (t.includes('mujer')) return { cat: 'Mujer', sub: 'Shorts', gender: 'Mujer' }
    return { cat: 'Hombre', sub: 'Shorts', gender: 'Hombre' }
  }
  if (t.includes('playera')) {
    if (t.includes('mujer')) return { cat: 'Mujer', sub: 'Tops', gender: 'Mujer' }
    return { cat: 'Hombre', sub: 'Playeras', gender: 'Hombre' }
  }
  if (t.includes('boxer') || t.includes('bóxer') || t.includes('calzón') || t.includes('calzon')) return { cat: 'Hombre', sub: 'Ropa Interior', gender: 'Hombre' }
  if (t.includes('calcetines') || t.includes('calcetín') || t.includes('mangas protectoras')) return { cat: 'Accesorios', sub: 'Calcetines', gender: null }
  if (t.includes('conjunto') || t.includes('set deportivo')) {
    if (t.includes('mujer') || t.includes('dama')) return { cat: 'Mujer', sub: 'Conjuntos', gender: 'Mujer' }
    return { cat: 'Hombre', sub: 'Conjuntos', gender: 'Hombre' }
  }
  return { cat: 'Ropa', sub: null, gender: null }
}

// ─── Scrape og:image ──────────────────────────────────────────────────────────
async function fetchOgImage(url) {
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'es-MX,es;q=0.9',
    },
    signal: AbortSignal.timeout(10000),
  })
  if (!r.ok) return null
  const html = await r.text()
  const og = html.match(/property="og:image"\s+content="([^"]+)"/) ||
             html.match(/content="([^"]+)"\s+property="og:image"/)
  return og?.[1]?.replace('http://','https://') || null
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`\n🚀 Procesando ${ITEMS.length} productos...\n`)

const rows = []

for (const item of ITEMS) {
  process.stdout.write(`⏳ ${item.item_id} — ${item.title.slice(0, 45)}... `)
  try {
    const image = await fetchOgImage(item.url)
    const { cat, sub, gender: detectedGender } = detectCategory(item.title)
    const gender = detectGender(item.title) || detectedGender
    const price = item.price_numeric

    rows.push({
      id:              mlIdToUuid(item.item_id),
      slug:            slugify(`${item.title}-${item.item_id}`),
      sku:             item.item_id,
      name:            item.title,
      brand:           'Sin marca',
      description:     item.title,
      store:           'Mercado Libre',
      store_type:      'mercadolibre',
      price,
      original_price:  null,
      discount:        null,
      image,
      url:             affUrl(item.url),
      category:        cat,
      subcategory:     sub,
      gender,
      color:           null,
      material:        null,
      sizes_available: null,
      available:       true,
      is_new:          true,
      on_sale:         false,
      trending:        false,
      best_option:     false,
      free_shipping:   false,
      rating:          0,
      review_count:    0,
      additional_images: null,
    })

    console.log(image ? `✅ con imagen` : `✅ sin imagen`)
  } catch(e) {
    console.log(`❌ ${e.message.slice(0,60)}`)
  }
  await sleep(300)
}

console.log(`\n💾 Insertando ${rows.length} productos en Supabase...`)

const BATCH = 20
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH)
  const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id', ignoreDuplicates: false })
  if (error) console.error(`❌ Batch: ${error.message}`)
  else console.log(`✅ Batch ${Math.floor(i/BATCH)+1}: ${batch.length} insertados`)
}

console.log(`\n🎉 ¡Listo! ${rows.length} productos nuevos en BiuBan\n`)
