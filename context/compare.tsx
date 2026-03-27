'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '@/types/product'

interface CompareContextType {
  compareList: Product[]
  addToCompare: (product: Product) => void
  removeFromCompare: (productId: string) => void
  clearCompare: () => void
  isInCompare: (productId: string) => boolean
}

const CompareContext = createContext<CompareContextType | null>(null)

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('biuban-compare')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setCompareList(parsed)
      }
    } catch {}
  }, [])

  const save = (list: Product[]) => {
    setCompareList(list)
    try {
      localStorage.setItem('biuban-compare', JSON.stringify(list))
    } catch {}
  }

  const addToCompare = (product: Product) => {
    if (compareList.length >= 3) return
    if (compareList.some(p => p.id === product.id)) return
    save([...compareList, product])
  }

  const removeFromCompare = (productId: string) => {
    save(compareList.filter(p => p.id !== productId))
  }

  const clearCompare = () => save([])

  const isInCompare = (productId: string) =>
    compareList.some(p => p.id === productId)

  if (!mounted) {
    return (
      <CompareContext.Provider
        value={{ compareList: [], addToCompare, removeFromCompare, clearCompare, isInCompare }}
      >
        {children}
      </CompareContext.Provider>
    )
  }

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare debe usarse dentro de CompareProvider')
  return ctx
}
