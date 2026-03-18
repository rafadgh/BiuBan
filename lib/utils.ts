import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Añade parámetros UTM de BiuBan a cualquier URL de producto */
export function addUtmParams(url: string): string {
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', 'biuban')
    u.searchParams.set('utm_medium', 'comparador')
    return u.toString()
  } catch {
    return url
  }
}
