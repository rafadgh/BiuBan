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
      // Imágenes de prueba (Unsplash)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
}

export default nextConfig
