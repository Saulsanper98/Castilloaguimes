"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App error boundary:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={28} className="text-red-400" aria-hidden="true" />
        </div>
        <h1 className="text-[#f5f5f0] font-display font-black text-2xl tracking-tight mb-3">
          ALGO HA FALLADO
        </h1>
        <p className="text-[#f5f5f0]/50 text-sm mb-8 leading-relaxed">
          No hemos podido cargar esta sección. Inténtalo de nuevo o vuelve al inicio.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Reintentar
        </button>
        {error.digest && (
          <p className="mt-6 text-[10px] text-[#f5f5f0]/20 font-mono">Ref: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
