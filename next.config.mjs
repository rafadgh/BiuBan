/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Nike
      { protocol: 'https', hostname: 'images.nike.com' },
      { protocol: 'https', hostname: '*.nike.com' },
      // MercadoLibre
      { protocol: 'https', hostname: 'http2.mlstatic.com' },
      { protocol: 'http',  hostname: 'http2.mlstatic.com' },
      // Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co' },
      // Futuras tiendas
      { protocol: 'https', hostname: '*.cloudfront.net' },
      { protocol: 'https', hostname: '*.liverpool.com.mx' },
      { protocol: 'https', hostname: '*.adidas.com' },
      { protocol: 'https', hostname: '*.zara.com' },
      // Imágenes de prueba
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: 'live.staticflickr.com' },
      { protocol: 'https', hostname: '*.staticflickr.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
}

export default nextConfig
