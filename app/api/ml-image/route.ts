// app/api/ml-image/route.ts
// Proxy server-side: fetch og:image de una URL de ML y la devuelve al browser
// Vercel usa IPs distintas a nuestra máquina local → no está bloqueado por ML

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 15

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const url = req.nextUrl.searchParams.get('url')
  if (!url || !url.includes('mercadolibre')) {
    return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-MX,es;q=0.9',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(12000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `ML devolvió ${res.status}` }, { status: 502 })
    }

    const html = await res.text()

    // Detect CAPTCHA/verification page
    if (html.includes('account-verification') || html.includes('captcha')) {
      return NextResponse.json({ error: 'ML bloqueó la IP del servidor' }, { status: 503 })
    }

    const og = html.match(/property="og:image"\s+content="([^"]+)"/) ||
               html.match(/content="([^"]+)"\s+property="og:image"/)
    const image = og?.[1]?.replace('http://', 'https://') || null

    return NextResponse.json({ image })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error desconocido' }, { status: 500 })
  }
}
