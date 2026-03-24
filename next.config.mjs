/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Playwright y sus plugins no deben ser bundleados por Turbopack
  serverExternalPackages: [
    'playwright',
    'playwright-extra',
    'playwright-core',
    '@playwright/browser-chromium',
    'puppeteer-extra-plugin-stealth',
    'puppeteer-extra',
  ],
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
      // Levi's México (VTEX)
      { protocol: 'https', hostname: 'levimx.vteximg.com.br' },
      { protocol: 'https', hostname: '*.vteximg.com.br' },
      { protocol: 'https', hostname: '*.vtexassets.com' },
      // Imágenes de prueba (Unsplash)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
}

export default nextConfig
