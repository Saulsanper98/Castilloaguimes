"use client"

import { useState } from "react"

interface Zone {
  id: string
  label: string
  desc: string
  x: number
  y: number
  w: number
  h: number
  color: string
}

const ZONES: Zone[] = [
  { id: "p1-6", label: "Pistas 1–6 (Panorámicas & Cristal)", desc: "Pistas principales con techo retráctil. Ideales para retransmisión.", x: 6, y: 10, w: 88, h: 18, color: "#3a7d44" },
  { id: "p7-12", label: "Pistas 7–12 (Centrales)", desc: "Bloque central. Iluminación LED HD y panorámica frontal.", x: 6, y: 30, w: 88, h: 18, color: "#3a7d44" },
  { id: "p13-14", label: "Pistas 13–14 (Premium)", desc: "Reservadas para finales y clases técnicas.", x: 18, y: 50, w: 64, h: 16, color: "#e8d44d" },
  { id: "vest", label: "Vestuarios", desc: "Vestuarios amplios con duchas y taquillas individuales.", x: 6, y: 68, w: 28, h: 12, color: "#7c83ff" },
  { id: "cafe", label: "Cafetería & terraza", desc: "120 plazas. Carta saludable y pantallas para seguir partidos.", x: 36, y: 68, w: 32, h: 12, color: "#ff8a5b" },
  { id: "tienda", label: "Tienda de material", desc: "Bullpadel, Nox, Head, Wilson… encordado y personalización en 24h.", x: 70, y: 68, w: 24, h: 12, color: "#9aa0a6" },
  { id: "recepcion", label: "Recepción & entrada", desc: "Atención de socios y visitas. Servicio de toallas y zona de lockers diarios.", x: 6, y: 82, w: 88, h: 10, color: "#3a7d44" },
]

export function VenuePlan() {
  const [active, setActive] = useState<Zone | null>(ZONES[0])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
      <div className="relative aspect-[16/10] bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
          <defs>
            <pattern id="vp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#3a7d44" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vp-grid)" />
        </svg>
        <p className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-[#f5f5f0]/60 font-bold">
          Plano interactivo · 6.000 m²
        </p>
        {ZONES.map((z) => (
          <button
            key={z.id}
            type="button"
            onMouseEnter={() => setActive(z)}
            onFocus={() => setActive(z)}
            onClick={() => setActive(z)}
            className={`absolute rounded-md border-2 transition-all focus-visible:scale-105 ${
              active?.id === z.id ? "scale-[1.02] shadow-lg z-10" : "hover:scale-[1.02]"
            }`}
            style={{
              left: `${z.x}%`,
              top: `${z.y}%`,
              width: `${z.w}%`,
              height: `${z.h}%`,
              background: active?.id === z.id ? `${z.color}40` : `${z.color}1f`,
              borderColor: active?.id === z.id ? z.color : `${z.color}55`,
              boxShadow: active?.id === z.id ? `0 0 24px ${z.color}55` : "none",
            }}
            aria-label={z.label}
            aria-pressed={active?.id === z.id}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-[#f5f5f0]/85 px-2 text-center">
              {z.label}
            </span>
          </button>
        ))}
      </div>
      <aside className="bg-[#111111] border border-white/10 rounded-2xl p-5 flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#3a7d44] mb-2">Zona seleccionada</p>
        {active ? (
          <>
            <h3 className="text-[#f5f5f0] font-display font-black text-xl leading-tight mb-2">{active.label}</h3>
            <p className="text-[#f5f5f0]/65 text-sm leading-relaxed">{active.desc}</p>
          </>
        ) : (
          <p className="text-[#f5f5f0]/55 text-sm">Pasa el ratón o toca una zona del plano para ver detalles.</p>
        )}
        <ul className="mt-5 pt-5 border-t border-white/10 space-y-2 text-xs">
          <li className="flex items-center gap-2 text-[#f5f5f0]/75">
            <span className="w-3 h-3 rounded-sm bg-[#3a7d44]" aria-hidden="true" /> Pistas estándar
          </li>
          <li className="flex items-center gap-2 text-[#f5f5f0]/75">
            <span className="w-3 h-3 rounded-sm bg-[#e8d44d]" aria-hidden="true" /> Pistas premium
          </li>
          <li className="flex items-center gap-2 text-[#f5f5f0]/75">
            <span className="w-3 h-3 rounded-sm bg-[#7c83ff]" aria-hidden="true" /> Servicios al usuario
          </li>
        </ul>
      </aside>
    </div>
  )
}
