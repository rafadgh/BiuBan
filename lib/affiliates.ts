/**
 * lib/affiliates.ts
 * Configuración centralizada de links de afiliado por tienda.
 *
 * Para agregar una nueva tienda de Admitad:
 *   1. Copia el link base que te da Admitad (ej. https://xmknb.com/g/XXXX/)
 *   2. Agrega la entrada en ADMITAD_PROGRAMS con el dominio como clave
 */

interface AffiliateProgram {
  /** Link base del programa en Admitad (sin ?ulp=) */
  baseUrl: string
}

/** Mapa de dominio → programa de Admitad */
const ADMITAD_PROGRAMS: Record<string, AffiliateProgram> = {
  'samsonite.com.mx': {
    baseUrl: 'https://xmknb.com/g/cj6zaw6m9p674ad4a807a68f2598b9/',
  },
  'samsonite.com': {
    baseUrl: 'https://xmknb.com/g/cj6zaw6m9p674ad4a807a68f2598b9/',
  },
  'levis.com': {
    baseUrl: 'https://heqgr.com/g/31ueucbr2o674ad4a8071cdb375fa2/',
  },
  'www.levis.com': {
    baseUrl: 'https://heqgr.com/g/31ueucbr2o674ad4a8071cdb375fa2/',
  },
}

/**
 * Dado un URL de producto, devuelve el link de afiliado correspondiente.
 * Si la tienda no tiene programa configurado, devuelve el URL original.
 *
 * Formato Admitad deep-link:
 *   https://xmknb.com/g/[campaign_code]/?ulp=[producto_url_encoded]
 */
export function wrapWithAffiliate(productUrl: string): string {
  try {
    const u = new URL(productUrl)
    const domain = u.hostname.replace(/^www\./, '')

    const program = ADMITAD_PROGRAMS[domain]
    if (!program) return productUrl

    const affiliateUrl = new URL(program.baseUrl)
    affiliateUrl.searchParams.set('ulp', productUrl)
    return affiliateUrl.toString()
  } catch {
    return productUrl
  }
}
