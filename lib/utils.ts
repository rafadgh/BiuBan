import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { wrapWithAffiliate } from '@/lib/affiliates'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Construye el URL de salida final para un producto:
 * 1. Si la tienda tiene programa de afiliado (Admitad), envuelve el URL.
 * 2. Agrega parámetros UTM de BiuBan.
 */
export function addUtmParams(url: string): string {
  try {
    const affiliateUrl = wrapWithAffiliate(url)
    const u = new URL(affiliateUrl)
    u.searchParams.set('utm_source', 'biuban')
    u.searchParams.set('utm_medium', 'comparador')
    return u.toString()
  } catch {
    return url
  }
}
