import { NextRequest, NextResponse } from 'next/server'

// ── Rate limiting en memoria: 10 req/min por IP ────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const WINDOW_MS  = 60_000

function checkRateLimit(ip: string): boolean {
  const now   = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

// ── Máximo 2MB de imagen en base64 ────────────────────────────────────────
const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Espera un momento.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  // API key
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY no configurada' },
      { status: 503 }
    )
  }

  // Parse body
  let image: string
  try {
    const body = await request.json()
    image = body.image
    if (!image) throw new Error('No image')
  } catch {
    return NextResponse.json({ error: 'Imagen inválida' }, { status: 400 })
  }

  // Validar tamaño
  const sizeBytes = Buffer.byteLength(image, 'utf8')
  if (sizeBytes > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: 'Imagen demasiado grande. Máximo 2MB.' },
      { status: 413 }
    )
  }

  // Detect mime type from base64 header if present, default to jpeg
  const mimeMatch = image.match(/^data:(image\/\w+);base64,/)
  const mime      = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const base64    = mimeMatch ? image.split(',')[1] : image

  let response: Response
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analiza esta imagen de ropa o calzado. Responde ÚNICAMENTE con una búsqueda corta en español (máximo 5 palabras) para encontrar este producto en una tienda mexicana. Ejemplos: "tenis nike blancos hombre", "sudadera negra oversized", "vestido rojo floral". Solo la frase de búsqueda, sin explicación ni puntuación.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mime};base64,${base64}`,
                detail: 'low',
              },
            },
          ],
        },
      ],
      max_tokens: 30,
      temperature: 0.2,
    }),
  })
  } catch {
    return NextResponse.json({ error: 'No se pudo conectar con el analizador de imágenes' }, { status: 503 })
  }

  if (!response.ok) {
    const err = await response.text()
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'Error al analizar imagen' }, { status: 500 })
  }

  const data  = await response.json()
  const query = data.choices?.[0]?.message?.content?.trim() ?? ''

  return NextResponse.json({ query })
}
