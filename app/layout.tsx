import type { Metadata } from 'next'
import { Roboto_Slab } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { NavigationProgress } from '@/components/NavigationProgress'
import { CompareProvider } from '@/context/compare'
import { CompareBar } from '@/components/CompareBar'
import './globals.css'

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://biuban.com'),
  title: 'BiuBan - Encuentra la mejor opción de moda',
  description:
    'Busca ropa, tenis y accesorios en un solo lugar. Compara precios entre Nike, Adidas, Zara, Liverpool, Amazon México y más tiendas.',
  applicationName: 'BiuBan',
  authors: [{ name: 'Rafael Diez', url: 'https://github.com/rafadgh' }],
  creator: 'Rafael Diez',
  publisher: 'rafadgh',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-light-32x32.png', sizes: '64x64', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  sizes: '64x64', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180' },
    shortcut: '/favicon-32x32.png',
  },
  alternates: {
    canonical: 'https://biuban.com',
  },
  openGraph: {
    title: 'BiuBan - Encuentra la mejor opción de moda',
    description:
      'Busca ropa, tenis y accesorios en un solo lugar. Compara precios entre distintas tiendas en México.',
    siteName: 'BiuBan',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'BiuBan — Compara precios de moda en México',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@BiuBan_mx',
    creator: '@BiuBan_mx',
    title: 'BiuBan - Encuentra la mejor opción de moda',
    description:
      'Compara ropa, tenis y accesorios entre distintas tiendas en un solo lugar.',
    images: ['/opengraph-image'],
  },
  other: {
    'verify-admitad': '674ad4a807',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${robotoSlab.variable} font-sans antialiased`}>
        <CompareProvider>
          <NavigationProgress />
          {children}
          <CompareBar />
        </CompareProvider>
        <Analytics />
      </body>
    </html>
  )
}