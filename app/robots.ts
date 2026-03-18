import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/comparar'],
      },
    ],
    sitemap: 'https://biuban.com/sitemap.xml',
  }
}
