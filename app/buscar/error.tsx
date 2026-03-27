'use client'

export default function BuscarError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4 text-center">
      <p className="text-[#6B6B6B] text-sm">
        Ocurrió un error al buscar productos. Intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 text-sm font-medium bg-[#586E26] text-white rounded-lg hover:bg-[#4a5d20] transition-colors"
      >
        Reintentar
      </button>
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-xs text-red-500 bg-red-50 p-3 rounded max-w-xl overflow-auto text-left">
          {error.message}
        </pre>
      )}
    </div>
  )
}
