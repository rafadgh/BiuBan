/**
 * seed-products.mjs — Inserta productos reales curados directamente en Supabase
 * Links afiliados de ML (search) + imágenes reales de Unsplash fashion
 *
 * Uso: node scripts/seed-products.mjs
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

const supabase = createClient(
  env['NEXT_PUBLIC_SUPABASE_URL'],
  env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
)

const AFF = 'diezrafa20230122100014'
const mlUrl = (q) => `https://www.mercadolibre.com.mx/buscar?q=${encodeURIComponent(q)}&matt_tool=${AFF}&matt_source=affiliate&matt_campaign=biuban`

function uid(key) {
  const h = createHash('sha256').update(`seed:${key}`).digest('hex')
  return [h.slice(0,8),h.slice(8,12),'4'+h.slice(13,16),((parseInt(h[16],16)&3)|8).toString(16)+h.slice(17,20),h.slice(20,32)].join('-')
}
function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,80)
}

// Imágenes de Unsplash (photo IDs verificados, moda)
const IMGS = {
  tenis_h: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=500&h=500&fit=crop',
  ],
  tenis_m: [
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1584735175315-9d5df23be7be?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1562183241-b937e9d4de0a?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=500&h=500&fit=crop',
  ],
  vestido: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1550639524-a9f8b1ef91c2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=500&h=500&fit=crop',
  ],
  blusa: [
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500&h=500&fit=crop',
  ],
  jeans: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500&h=500&fit=crop',
  ],
  chamarra: [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=500&h=500&fit=crop',
  ],
  sudadera: [
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop',
  ],
  bolsa: [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b2c3a?w=500&h=500&fit=crop',
  ],
  deportivo: [
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=500&h=500&fit=crop',
  ],
}
const img = (key, i) => IMGS[key][i % IMGS[key].length]

// ─── Catálogo ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  // ── NIKE TENIS HOMBRE ─────────────────────────────────────────────────────
  { name:'Nike Air Max 270 Hombre Blanco',      brand:'Nike', price:2499, orig:2999, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',0), q:'nike air max 270 hombre', sizes:['25','25.5','26','26.5','27','27.5','28','29'] },
  { name:'Nike Revolution 6 Hombre Negro',      brand:'Nike', price:1299, orig:1599, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',1), q:'nike revolution 6 hombre negro' },
  { name:'Nike Air Force 1 Hombre Blanco',      brand:'Nike', price:1999, orig:2499, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',2), q:'nike air force 1 hombre blanco', sizes:['25','26','27','28','29'] },
  { name:'Nike Pegasus 40 Running Hombre',      brand:'Nike', price:2799, orig:3299, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',3), q:'nike pegasus 40 hombre' },
  { name:'Nike Court Vision Low Hombre',        brand:'Nike', price:1499, orig:1799, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',4), q:'nike court vision low hombre' },

  // ── NIKE TENIS MUJER ──────────────────────────────────────────────────────
  { name:'Nike Air Max 90 Mujer Blanco Rosa',   brand:'Nike', price:2299, orig:2799, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',0), q:'nike air max 90 mujer', sizes:['22','22.5','23','23.5','24','24.5','25'] },
  { name:'Nike React Infinity Run Mujer',       brand:'Nike', price:2599, orig:3199, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',1), q:'nike react infinity run mujer' },
  { name:'Nike Air Force 1 Mujer Triple White', brand:'Nike', price:1899, orig:2299, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',2), q:'nike air force 1 mujer blanco' },
  { name:'Nike Free Run 5.0 Mujer',            brand:'Nike', price:1699, orig:1999, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',3), q:'nike free run mujer' },

  // ── ADIDAS TENIS HOMBRE ───────────────────────────────────────────────────
  { name:'Adidas Ultraboost 22 Hombre',        brand:'Adidas', price:3299, orig:3999, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',0), q:'adidas ultraboost 22 hombre', sizes:['25','26','27','28','29'] },
  { name:'Adidas Stan Smith Hombre Blanco',    brand:'Adidas', price:1599, orig:1999, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',1), q:'adidas stan smith hombre blanco' },
  { name:'Adidas Superstar Hombre',            brand:'Adidas', price:1699, orig:2099, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',2), q:'adidas superstar hombre' },
  { name:'Adidas NMD_R1 Hombre Negro',        brand:'Adidas', price:2499, orig:2999, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',3), q:'adidas nmd r1 hombre' },
  { name:'Adidas Gazelle Hombre Azul',        brand:'Adidas', price:1799, orig:2199, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',4), q:'adidas gazelle hombre' },

  // ── ADIDAS TENIS MUJER ────────────────────────────────────────────────────
  { name:'Adidas Stan Smith Mujer Blanco Verde', brand:'Adidas', price:1599, orig:1999, cat:'Calzado', sub:'Tenis', gen:'Mujer', img:img('tenis_m',0), q:'adidas stan smith mujer', sizes:['22','23','24','25'] },
  { name:'Adidas Superstar Mujer Rosa',        brand:'Adidas', price:1699, orig:2099, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',1), q:'adidas superstar mujer rosa' },
  { name:'Adidas Forum Low Mujer',             brand:'Adidas', price:1899, orig:2299, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',2), q:'adidas forum low mujer' },
  { name:'Adidas Ultraboost 22 Mujer',        brand:'Adidas', price:2999, orig:3599, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',3), q:'adidas ultraboost 22 mujer' },

  // ── PUMA ──────────────────────────────────────────────────────────────────
  { name:'Puma RS-X Hombre Blanco Negro',      brand:'Puma', price:1499, orig:1899, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',0), q:'puma rs-x hombre' },
  { name:'Puma Suede Classic Hombre',          brand:'Puma', price:1199, orig:1499, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',1), q:'puma suede classic hombre' },
  { name:'Puma Mayze Mujer Blanco',            brand:'Puma', price:1299, orig:1599, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',0), q:'puma mayze mujer' },
  { name:'Puma Cali Mujer',                   brand:'Puma', price:1199, orig:1499, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',1), q:'puma cali mujer' },

  // ── VANS ──────────────────────────────────────────────────────────────────
  { name:'Vans Old Skool Hombre Negro',        brand:'Vans', price:1099, orig:1299, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',2), q:'vans old skool hombre negro', sizes:['25','26','27','28','29'] },
  { name:'Vans Authentic Unisex',              brand:'Vans', price:899,  orig:1099, cat:'Calzado', sub:'Tenis', gen:null,     img:img('tenis_h',3), q:'vans authentic unisex' },
  { name:'Vans Era Mujer Rosa',               brand:'Vans', price:999,  orig:1199, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',2), q:'vans era mujer' },
  { name:'Vans Sk8-Hi Hombre Negro Blanco',   brand:'Vans', price:1299, orig:1599, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',4), q:'vans sk8-hi hombre' },

  // ── CONVERSE ──────────────────────────────────────────────────────────────
  { name:'Converse Chuck Taylor All Star Blanco', brand:'Converse', price:999, orig:1299, cat:'Calzado', sub:'Tenis', gen:null, img:img('tenis_h',0), q:'converse chuck taylor blanco', sizes:['25','26','27','28','29'] },
  { name:'Converse Chuck 70 Negro Hombre',    brand:'Converse', price:1299, orig:1599, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',1), q:'converse chuck 70 negro' },
  { name:'Converse Run Star Mujer',           brand:'Converse', price:1499, orig:1799, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',0), q:'converse run star mujer' },

  // ── NEW BALANCE ───────────────────────────────────────────────────────────
  { name:'New Balance 574 Hombre Gris',       brand:'New Balance', price:1699, orig:1999, cat:'Calzado', sub:'Tenis', gen:'Hombre', img:img('tenis_h',3), q:'new balance 574 hombre' },
  { name:'New Balance 327 Unisex',            brand:'New Balance', price:1799, orig:2199, cat:'Calzado', sub:'Tenis', gen:null,     img:img('tenis_h',4), q:'new balance 327 unisex' },
  { name:'New Balance 530 Mujer',             brand:'New Balance', price:1599, orig:1999, cat:'Calzado', sub:'Tenis', gen:'Mujer',  img:img('tenis_m',1), q:'new balance 530 mujer' },

  // ── VESTIDOS MUJER ────────────────────────────────────────────────────────
  { name:'Vestido Floral Mujer Zara',          brand:'Zara', price:699,  orig:999,  cat:'Mujer', sub:'Vestidos', gen:'Mujer', img:img('vestido',0), q:'vestido floral mujer zara' },
  { name:'Vestido Negro Midi H&M',             brand:'H&M',  price:499,  orig:699,  cat:'Mujer', sub:'Vestidos', gen:'Mujer', img:img('vestido',1), q:'vestido negro midi mujer' },
  { name:'Vestido Casual Mujer Verano',        brand:'Zara', price:599,  orig:799,  cat:'Mujer', sub:'Vestidos', gen:'Mujer', img:img('vestido',2), q:'vestido casual mujer verano' },
  { name:'Vestido Formal Mujer Elegante',      brand:'H&M',  price:799,  orig:1099, cat:'Mujer', sub:'Vestidos', gen:'Mujer', img:img('vestido',3), q:'vestido formal mujer elegante', sale:true },
  { name:'Vestido Playero Mujer',              brand:'Zara', price:449,  orig:599,  cat:'Mujer', sub:'Vestidos', gen:'Mujer', img:img('vestido',4), q:'vestido playero mujer' },
  { name:'Vestido Maxi Boho Mujer',            brand:'H&M',  price:649,  orig:899,  cat:'Mujer', sub:'Vestidos', gen:'Mujer', img:img('vestido',0), q:'vestido maxi boho mujer' },

  // ── BLUSAS MUJER ─────────────────────────────────────────────────────────
  { name:'Blusa Mujer Manga Larga Zara',       brand:'Zara', price:349,  orig:499,  cat:'Mujer', sub:'Blusas', gen:'Mujer', img:img('blusa',0), q:'blusa mujer manga larga zara' },
  { name:'Blusa Oversize Mujer H&M',           brand:'H&M',  price:249,  orig:349,  cat:'Mujer', sub:'Blusas', gen:'Mujer', img:img('blusa',1), q:'blusa oversize mujer h&m' },
  { name:'Blusa Satinada Mujer Elegante',      brand:'Zara', price:399,  orig:549,  cat:'Mujer', sub:'Blusas', gen:'Mujer', img:img('blusa',2), q:'blusa satinada mujer elegante' },
  { name:'Top Crop Mujer Deportivo Nike',      brand:'Nike', price:449,  orig:599,  cat:'Mujer', sub:'Blusas', gen:'Mujer', img:img('blusa',3), q:'top crop mujer deportivo nike' },
  { name:'Blusa Floral Mujer Casual',          brand:'H&M',  price:299,  orig:399,  cat:'Mujer', sub:'Blusas', gen:'Mujer', img:img('blusa',0), q:'blusa floral mujer casual' },

  // ── JEANS ─────────────────────────────────────────────────────────────────
  { name:"Levi's 501 Original Hombre Azul",   brand:"Levi's", price:1199, orig:1499, cat:'Hombre', sub:'Jeans', gen:'Hombre', img:img('jeans',0), q:'levis 501 hombre azul', sizes:['28','30','31','32','33','34','36'] },
  { name:"Levi's 512 Slim Taper Hombre",      brand:"Levi's", price:1099, orig:1399, cat:'Hombre', sub:'Jeans', gen:'Hombre', img:img('jeans',1), q:'levis 512 slim hombre' },
  { name:"Levi's 711 Skinny Mujer",           brand:"Levi's", price:999,  orig:1299, cat:'Mujer',  sub:'Jeans', gen:'Mujer',  img:img('jeans',2), q:'levis 711 skinny mujer', sizes:['24','25','26','27','28','29','30'] },
  { name:"Levi's 724 High Rise Mujer",        brand:"Levi's", price:1099, orig:1399, cat:'Mujer',  sub:'Jeans', gen:'Mujer',  img:img('jeans',3), q:'levis 724 mujer' },
  { name:'Jeans Skinny Mujer Zara Negro',     brand:'Zara',   price:699,  orig:899,  cat:'Mujer',  sub:'Jeans', gen:'Mujer',  img:img('jeans',0), q:'jeans skinny mujer zara negro' },
  { name:'Jeans Slim Fit Hombre H&M',         brand:'H&M',    price:599,  orig:799,  cat:'Hombre', sub:'Jeans', gen:'Hombre', img:img('jeans',1), q:'jeans slim fit hombre h&m' },

  // ── CHAMARRAS ─────────────────────────────────────────────────────────────
  { name:'Chamarra Bomber Hombre Nike',        brand:'Nike',  price:1299, orig:1699, cat:'Hombre', sub:'Chamarras', gen:'Hombre', img:img('chamarra',0), q:'chamarra bomber hombre nike' },
  { name:'Chamarra Denim Hombre Levi\'s',     brand:"Levi's",price:1199, orig:1499, cat:'Hombre', sub:'Chamarras', gen:'Hombre', img:img('chamarra',1), q:'chamarra denim hombre levis' },
  { name:'Chamarra Hombre Invierno Zara',      brand:'Zara',  price:1499, orig:1999, cat:'Hombre', sub:'Chamarras', gen:'Hombre', img:img('chamarra',2), q:'chamarra hombre invierno zara' },
  { name:'Chamarra Mujer Oversize H&M',        brand:'H&M',   price:899,  orig:1199, cat:'Mujer',  sub:'Chamarras', gen:'Mujer',  img:img('chamarra',0), q:'chamarra mujer oversize h&m' },
  { name:'Chamarra Deportiva Adidas Hombre',   brand:'Adidas',price:1099, orig:1399, cat:'Hombre', sub:'Chamarras', gen:'Hombre', img:img('chamarra',1), q:'chamarra deportiva adidas hombre' },

  // ── SUDADERAS ─────────────────────────────────────────────────────────────
  { name:'Sudadera Hoodie Nike Hombre Gris',   brand:'Nike',  price:799,  orig:999,  cat:'Hombre', sub:'Sudaderas', gen:'Hombre', img:img('sudadera',0), q:'sudadera hoodie nike hombre gris' },
  { name:'Sudadera Adidas Hombre Negro',       brand:'Adidas',price:699,  orig:899,  cat:'Hombre', sub:'Sudaderas', gen:'Hombre', img:img('sudadera',1), q:'sudadera adidas hombre negro' },
  { name:'Sudadera Mujer Nike Cropped',        brand:'Nike',  price:749,  orig:949,  cat:'Mujer',  sub:'Sudaderas', gen:'Mujer',  img:img('sudadera',2), q:'sudadera mujer nike cropped' },
  { name:'Sudadera Puma Hombre Club',          brand:'Puma',  price:599,  orig:799,  cat:'Hombre', sub:'Sudaderas', gen:'Hombre', img:img('sudadera',0), q:'sudadera puma hombre' },
  { name:'Sudadera Under Armour Hombre',       brand:'Under Armour', price:849, orig:1099, cat:'Hombre', sub:'Sudaderas', gen:'Hombre', img:img('sudadera',1), q:'sudadera under armour hombre' },

  // ── DEPORTIVO ─────────────────────────────────────────────────────────────
  { name:'Conjunto Deportivo Mujer Nike Rosa', brand:'Nike',  price:1099, orig:1399, cat:'Mujer',  sub:'Deportivo', gen:'Mujer',  img:img('deportivo',0), q:'conjunto deportivo mujer nike rosa' },
  { name:'Leggins Mujer Nike Pro',             brand:'Nike',  price:699,  orig:899,  cat:'Mujer',  sub:'Deportivo', gen:'Mujer',  img:img('deportivo',1), q:'leggins mujer nike pro' },
  { name:'Pants Hombre Adidas Essentials',     brand:'Adidas',price:599,  orig:799,  cat:'Hombre', sub:'Deportivo', gen:'Hombre', img:img('deportivo',2), q:'pants hombre adidas essentials' },
  { name:'Conjunto Deportivo Hombre Puma',     brand:'Puma',  price:899,  orig:1199, cat:'Hombre', sub:'Deportivo', gen:'Hombre', img:img('deportivo',0), q:'conjunto deportivo hombre puma' },
  { name:'Shorts Deportivos Mujer Under Armour', brand:'Under Armour', price:549, orig:699, cat:'Mujer', sub:'Deportivo', gen:'Mujer', img:img('deportivo',1), q:'shorts deportivos mujer under armour' },

  // ── BOLSAS / ACCESORIOS ───────────────────────────────────────────────────
  { name:'Bolsa Mujer Tommy Hilfiger Azul',   brand:'Tommy Hilfiger', price:1299, orig:1799, cat:'Accesorios', sub:'Bolsas', gen:'Mujer', img:img('bolsa',0), q:'bolsa mujer tommy hilfiger' },
  { name:'Bolsa Tote Mujer Calvin Klein',     brand:'Calvin Klein',   price:1099, orig:1499, cat:'Accesorios', sub:'Bolsas', gen:'Mujer', img:img('bolsa',1), q:'bolsa tote mujer calvin klein' },
  { name:'Bolsa Crossbody Mujer H&M',         brand:'H&M',            price:499,  orig:699,  cat:'Accesorios', sub:'Bolsas', gen:'Mujer', img:img('bolsa',2), q:'bolsa crossbody mujer h&m' },
  { name:'Mochila Nike Hombre Heritage',      brand:'Nike',           price:799,  orig:999,  cat:'Accesorios', sub:'Mochilas', gen:'Hombre', img:img('bolsa',0), q:'mochila nike hombre heritage' },
  { name:'Mochila Adidas Classic Unisex',     brand:'Adidas',         price:699,  orig:899,  cat:'Accesorios', sub:'Mochilas', gen:null,     img:img('bolsa',1), q:'mochila adidas classic unisex' },
]

// ─── Insertar ─────────────────────────────────────────────────────────────────
const rows = PRODUCTS.map((p, i) => {
  const discount = p.orig && p.orig > p.price ? Math.round((1 - p.price/p.orig)*100) : null
  return {
    id:              uid(`${p.brand}-${p.name}-${i}`),
    slug:            slugify(`${p.name}-${i}`),
    sku:             `seed-${i.toString().padStart(4,'0')}`,
    name:            p.name,
    brand:           p.brand,
    description:     p.name,
    store:           p.brand,
    store_type:      'curated',
    price:           p.price,
    original_price:  p.orig || null,
    discount,
    image:           p.img,
    url:             mlUrl(p.q),
    category:        p.cat,
    subcategory:     p.sub || null,
    gender:          p.gen || null,
    color:           null,
    material:        null,
    sizes_available: p.sizes || null,
    available:       true,
    is_new:          false,
    on_sale:         discount !== null && discount >= 10,
    trending:        false,
    best_option:     false,
    free_shipping:   false,
    rating:          0,
    review_count:    0,
    additional_images: null,
  }
})

console.log(`\n🚀 Insertando ${rows.length} productos en Supabase...\n`)

const BATCH = 25
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH)
  const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id', ignoreDuplicates: false })
  if (error) {
    console.error(`❌ Batch ${i/BATCH + 1}:`, error.message)
  } else {
    console.log(`✅ Batch ${i/BATCH + 1}: ${batch.length} productos`)
  }
}

console.log(`\n🎉 Listo! ${rows.length} productos insertados.`)
console.log(`   Abre https://biuban.com para verlos.\n`)
