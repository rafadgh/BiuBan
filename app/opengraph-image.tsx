import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BiuBan — Compara precios de moda en México'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  // Carga el logo transparente desde la URL pública
  const logoData = await fetch(new URL('/BiuBan_logo_transparent.png', 'https://biuban.com'))
    .then(r => r.arrayBuffer())
    .catch(() => null)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0B0B0B',
          fontFamily: 'serif',
          gap: '20px',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Logo watermark de fondo */}
        {logoData && (
          <img
            src={`data:image/png;base64,${Buffer.from(logoData).toString('base64')}`}
            width={600}
            height={600}
            style={{
              position: 'absolute',
              opacity: 0.04,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* Logo principal */}
        {logoData ? (
          <img
            src={`data:image/png;base64,${Buffer.from(logoData).toString('base64')}`}
            width={200}
            height={200}
            style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        ) : (
          <div style={{ fontSize: '80px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-2px' }}>
            BiuBan
          </div>
        )}

        {/* Tagline */}
        <div
          style={{
            fontSize: '30px',
            color: '#AAAAAA',
            textAlign: 'center',
            maxWidth: '680px',
            lineHeight: 1.4,
          }}
        >
          Compara precios de ropa, tenis y accesorios entre las mejores tiendas de México
        </div>

        {/* Pill badges */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          {['Nike', 'Adidas', 'Zara', 'Liverpool', 'MercadoLibre'].map(store => (
            <div
              key={store}
              style={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '999px',
                padding: '8px 20px',
                fontSize: '16px',
                color: '#E5E5E5',
              }}
            >
              {store}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontSize: '18px',
            color: '#778C43',
            fontWeight: 600,
          }}
        >
          biuban.com
        </div>
      </div>
    ),
    { ...size }
  )
}
