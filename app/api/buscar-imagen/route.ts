import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY no configurada' },
      { status: 503 }
    )
  }

  let image: string
  try {
    const body = await request.json()
    image = body.image
    if (!image) throw new Error('No image')
  } catch {
    return NextResponse.json({ error: 'Imagen inválida' }, { status: 400 })
  }

  // Detect mime type from base64 header if present, default to jpeg
  const mimeMatch = image.match(/^data:(image\/\w+);base64,/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const base64 = mimeMatch ? image.split(',')[1] : image

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

  if (!response.ok) {
    const err = await response.text()
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'Error al analizar imagen' }, { status: 500 })
  }

  const data = await response.json()
  const query = data.choices?.[0]?.message?.content?.trim() ?? ''

  return NextResponse.json({ query })
}
