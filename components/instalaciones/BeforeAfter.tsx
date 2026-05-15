"use client"

import { useState, useRef, useCallback } from "react"

interface Props {
  beforeLabel?: string
  afterLabel?: string
}

/**
 * Comparador visual antes/después renderizado con dos gradientes (sin imágenes reales todavía).
 * Drag o tap-to-position desplaza el split.
 */
export function BeforeAfter({ beforeLabel = "Antes (2022)", afterLabel = "Hoy (2026)" }: Props) {
  const [split, setSplit] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const onMove = useCallback((clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setSplit(Math.max(0, Math.min(100, pct)))
  }, [])

  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 cursor-ew-resize select-none"
      onMouseDown={() => (dragging.current = true)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onMouseMove={(e) => { if (dragging.current) onMove(e.clientX) }}
      onTouchStart={(e) => onMove(e.touches[0].clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      role="figure"
      aria-label="Comparador antes/después de las instalaciones"
    >
      {/* Before layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a3a3a] via-[#1a1a1a] to-[#0a0a0a] flex items-end p-5">
        <span className="text-[10px] uppercase tracking-widest font-bold text-white/65 bg-black/40 px-2 py-1 rounded">
          {beforeLabel}
        </span>
      </div>
      {/* After layer */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#3a7d44]/50 via-[#1d3e22] to-[#0a0a0a] flex items-end p-5"
        style={{ clipPath: `inset(0 0 0 ${split}%)` }}
      >
        <span className="text-[10px] uppercase tracking-widest font-bold text-white/85 bg-[#3a7d44]/60 px-2 py-1 rounded ml-auto">
          {afterLabel}
        </span>
      </div>
      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[#e8d44d]"
        style={{ left: `${split}%` }}
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#e8d44d] flex items-center justify-center shadow-xl">
          <span className="text-[10px] font-black text-[#0a0a0a]">⇆</span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(e) => setSplit(parseInt(e.target.value))}
        aria-label="Posición del separador"
        className="sr-only"
      />
    </div>
  )
}
