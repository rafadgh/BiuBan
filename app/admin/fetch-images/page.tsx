'use client'

import { useState } from 'react'

const PRODUCTS = [
  { sku: 'MLM2395817051', url: 'https://articulo.mercadolibre.com.mx/MLM-2395817051-tenis-adidas-tensaur-joven-jp9644-simipiel-ngo-22-25-_JM' },
  { sku: 'MLM3835195154', url: 'https://articulo.mercadolibre.com.mx/MLM-3835195154-tenis-adidas-tensaur-run-joven-jp9641-simipiel-bco-_JM' },
  { sku: 'MLM2119699269', url: 'https://articulo.mercadolibre.com.mx/MLM-2119699269-tenis-adidas-vl-court-30-id8797-adidas-_JM' },
  { sku: 'MLM2417314321', url: 'https://articulo.mercadolibre.com.mx/MLM-2417314321-tenis-adidas-casual-street-talk-hombre-blanco-jp8275-_JM' },
  { sku: 'MLM3835102268', url: 'https://articulo.mercadolibre.com.mx/MLM-3835102268-tenis-urbano-zap-tensaur-run30-el-c-adidas-9643-negro-nino-_JM' },
  { sku: 'MLM1459557671', url: 'https://articulo.mercadolibre.com.mx/MLM-1459557671-tenis-tensaur-sport-training-cierre-por-contacto-adidas-_JM' },
  { sku: 'MLM2202512503', url: 'https://articulo.mercadolibre.com.mx/MLM-2202512503-tenis-adidas-casual-vl-court-30-hombre-blanco-id6285-_JM' },
  { sku: 'MLM2824433914', url: 'https://articulo.mercadolibre.com.mx/MLM-2824433914-tenis-adidas-grand-court-platforma-ie1092-adidas-_JM' },
  { sku: 'MLM3510998772', url: 'https://articulo.mercadolibre.com.mx/MLM-3510998772-tenis-adidas-casual-cloudfoam-comfy-hombre-negro-ih2973-_JM' },
  { sku: 'MLM2128843049', url: 'https://articulo.mercadolibre.com.mx/MLM-2128843049-tenis-break-start-ih7963-adidas-_JM' },
  { sku: 'MLM3377638772', url: 'https://articulo.mercadolibre.com.mx/MLM-3377638772-tenis-adidas-grand-court-20-kids-ih5529-adidas-_JM' },
  { sku: 'MLM1459538436', url: 'https://articulo.mercadolibre.com.mx/MLM-1459538436-tenis-grand-court-para-tenis--blanco-adidas-_JM' },
  { sku: 'MLM1459589141', url: 'https://articulo.mercadolibre.com.mx/MLM-1459589141-tenis-grand-court-lifestyle-para-tenis--negro-adidas-_JM' },
  { sku: 'MLM2417327159', url: 'https://articulo.mercadolibre.com.mx/MLM-2417327159-tenis-adidas-casual-street-talk-hombre-negro-jp8276-_JM' },
  { sku: 'MLM2119631433', url: 'https://articulo.mercadolibre.com.mx/MLM-2119631433-tenis-adidas-grand-court-20-ninos-ie5995-adidas-_JM' },
  { sku: 'MLM3531305206', url: 'https://articulo.mercadolibre.com.mx/MLM-3531305206-tenis-adidas-correr-duramo-speed-2-hombre-negro-ih8201-_JM' },
  { sku: 'MLM3377694630', url: 'https://articulo.mercadolibre.com.mx/MLM-3377694630-tenis-adidas-vl-court-30-id6286-adidas-_JM' },
  { sku: 'MLM2353934757', url: 'https://articulo.mercadolibre.com.mx/MLM-2353934757-tenis-star-wars-grand-court-ji2842-adidas-_JM' },
  { sku: 'MLM3787198202', url: 'https://articulo.mercadolibre.com.mx/MLM-3787198202-jersey-de-local-del-club-america-hombre-2526-jn8612-adidas-_JM' },
  { sku: 'MLM950211934',  url: 'https://articulo.mercadolibre.com.mx/MLM-950211934-sandalias-adilette-aqua-unisex-negro-adidas-_JM' },
  { sku: 'MLM833829361',  url: 'https://articulo.mercadolibre.com.mx/MLM-833829361-sandalias-adilette-aqua-adidas-_JM' },
  { sku: 'MLM3507224498', url: 'https://articulo.mercadolibre.com.mx/MLM-3507224498-jersey-adidas-futbol-tiro-24-ninos-rojo-is1030-_JM' },
]

type Status = 'idle' | 'running' | 'done' | 'error'
type LogEntry = { sku: string; ok: boolean; msg: string }

export default function FetchImagesPage() {
  const [status, setStatus]   = useState<Status>('idle')
  const [logs, setLogs]       = useState<LogEntry[]>([])
  const [progress, setProgress] = useState(0)
  const [updated, setUpdated] = useState(0)

  async function run() {
    setStatus('running')
    setLogs([])
    setProgress(0)
    setUpdated(0)

    const patches: { sku: string; image: string }[] = []

    for (let i = 0; i < PRODUCTS.length; i++) {
      const p = PRODUCTS[i]
      setProgress(i + 1)
      try {
        const res  = await fetch(p.url)
        const html = await res.text()
        const og   = html.match(/property="og:image"\s+content="([^"]+)"/) ||
                     html.match(/content="([^"]+)"\s+property="og:image"/)
        const img  = og?.[1]?.replace('http://', 'https://')
        if (img) {
          patches.push({ sku: p.sku, image: img })
          setLogs(l => [...l, { sku: p.sku, ok: true, msg: '✅ imagen lista' }])
        } else {
          setLogs(l => [...l, { sku: p.sku, ok: false, msg: '⚠️ sin imagen' }])
        }
      } catch (e: unknown) {
        setLogs(l => [...l, { sku: p.sku, ok: false, msg: `❌ ${e instanceof Error ? e.message : 'error'}` }])
      }
      await new Promise(r => setTimeout(r, 250))
    }

    if (patches.length === 0) {
      setStatus('error')
      return
    }

    // Enviar al servidor
    const resp = await fetch('/api/patch-images?secret=biuban-sync-2026', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patches }),
    })
    const result = await resp.json()
    setUpdated(result.updated ?? 0)
    setStatus('done')
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-2xl font-bold text-[#0B0B0B]">Obtener imágenes de Adidas</h1>
        <p className="mb-6 text-sm text-[#6B6B6B]">
          Haz clic en el botón. Tu navegador descargará las imágenes de Mercado Libre
          y las guardará en BiuBan automáticamente (~2 min).
        </p>

        {status === 'idle' && (
          <button
            onClick={run}
            className="rounded-xl bg-[#31470B] px-6 py-3 font-semibold text-white hover:bg-[#586E26] transition-colors"
          >
            Iniciar → obtener {PRODUCTS.length} imágenes
          </button>
        )}

        {status === 'running' && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-[#E5E5E5]">
                <div
                  className="h-2 rounded-full bg-[#31470B] transition-all"
                  style={{ width: `${(progress / PRODUCTS.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-[#0B0B0B]">{progress}/{PRODUCTS.length}</span>
            </div>
            <p className="mb-4 text-sm text-[#6B6B6B]">Procesando... no cierres esta página.</p>
          </div>
        )}

        {status === 'done' && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-5 py-4">
            <p className="font-semibold text-green-800">🎉 ¡Listo! {updated} imágenes guardadas en BiuBan.</p>
            <p className="mt-1 text-sm text-green-700">Ya puedes ver Adidas en <a href="/marcas" className="underline">/marcas</a>.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-5 py-4">
            <p className="font-semibold text-red-800">❌ No se obtuvo ninguna imagen.</p>
            <p className="mt-1 text-sm text-red-700">Mercado Libre puede estar bloqueando. Intenta más tarde.</p>
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-4 rounded-xl border border-[#E5E5E5] bg-white p-4 font-mono text-xs space-y-1 max-h-72 overflow-y-auto">
            {logs.map((l, i) => (
              <div key={i} className={l.ok ? 'text-green-700' : 'text-amber-600'}>
                {l.sku} — {l.msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
