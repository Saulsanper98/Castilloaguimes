"use client"

import { useEffect, useState } from "react"
import { HelpCircle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

/**
 * Tooltip/popover con dibujo explicativo de los 3 tipos de pista
 * (panorámica / cristal / central). Diferenciador para usuarios nuevos.
 */
export function CourtTypeInfo() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Diferencia entre tipos de pista"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/55 hover:text-[#3a7d44] transition-colors"
      >
        <HelpCircle size={12} aria-hidden="true" />
        ¿Cuál es la diferencia?
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="region"
              aria-label="Tipos de pista"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30 w-72 rounded-xl border border-white/15 bg-[#0f0f0f] p-4 shadow-2xl shadow-black/50"
            >
              <h3 className="text-[#f5f5f0] font-bold text-sm mb-3">Tipos de pista</h3>
              <ul className="space-y-3 text-xs">
                <CourtTypeRow
                  color="#3a7d44"
                  name="Panorámica"
                  desc="Cristal solo en el fondo. Visibilidad espectacular para grabaciones y finales."
                />
                <CourtTypeRow
                  color="#e8d44d"
                  name="Cristal"
                  desc="Cristal en los 3 lados. Rebote más vivo, ideal para entrenar fondo de pista."
                />
                <CourtTypeRow
                  color="#9aa0a6"
                  name="Central"
                  desc="Configuración clásica. La más utilizada para juego habitual."
                />
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </span>
  )
}

function CourtTypeRow({ color, name, desc }: { color: string; name: string; desc: string }) {
  return (
    <li className="flex items-start gap-2.5">
      {/* Mini court diagram */}
      <svg viewBox="0 0 36 22" width="40" height="24" className="shrink-0 mt-0.5" aria-hidden="true">
        <rect x="1" y="1" width="34" height="20" rx="1.5" fill="none" stroke={color} strokeWidth="1" />
        <line x1="18" y1="1" x2="18" y2="21" stroke={color} strokeOpacity="0.6" strokeWidth="0.7" />
        <line x1="1" y1="11" x2="35" y2="11" stroke={color} strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 1.5" />
        {name === "Panorámica" && (
          <>
            <rect x="1" y="1" width="34" height="2" fill={color} fillOpacity="0.45" />
            <rect x="1" y="19" width="34" height="2" fill={color} fillOpacity="0.45" />
          </>
        )}
        {name === "Cristal" && (
          <>
            <rect x="1" y="1" width="34" height="20" fill={color} fillOpacity="0.18" />
            <rect x="1" y="1" width="34" height="20" fill="none" stroke={color} strokeOpacity="0.7" strokeWidth="1.2" />
          </>
        )}
        {name === "Central" && (
          <rect x="1" y="1" width="34" height="20" fill={color} fillOpacity="0.08" />
        )}
      </svg>
      <span>
        <span className="block text-[#f5f5f0] font-bold text-xs" style={{ color }}>
          {name}
        </span>
        <span className="block text-[#f5f5f0]/65 text-[11px] leading-snug">{desc}</span>
      </span>
    </li>
  )
}
