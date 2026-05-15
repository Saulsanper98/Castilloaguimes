"use client"

import { useEffect, useState } from "react"
import { Cookie, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const KEY = "pcdc-cookies-v1"
type Consent = "all" | "essential"

export function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const stored = localStorage.getItem(KEY)
      if (!stored) setOpen(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  function decide(c: Consent) {
    localStorage.setItem(KEY, c)
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md z-[110]"
        >
          <div className="relative bg-[#0f0f0f]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#e8d44d]/15 border border-[#e8d44d]/30 flex items-center justify-center shrink-0">
                <Cookie size={16} className="text-[#e8d44d]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 id="cookie-title" className="text-[#f5f5f0] font-bold text-sm">
                  Cookies del club
                </h2>
                <p className="text-[#f5f5f0]/65 text-xs leading-relaxed mt-1">
                  Usamos cookies esenciales para que la web funcione y, si lo aceptas, otras para mejorar la experiencia (preferencias, analíticas anónimas).
                </p>
              </div>
              <button
                type="button"
                onClick={() => decide("essential")}
                aria-label="Rechazar cookies opcionales"
                className="text-[#f5f5f0]/45 hover:text-[#f5f5f0] p-1"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => decide("essential")}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold border border-white/15 text-[#f5f5f0]/80 hover:bg-white/5 hover:text-[#f5f5f0] transition-colors"
              >
                Solo esenciales
              </button>
              <button
                type="button"
                onClick={() => decide("all")}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#3a7d44] hover:bg-[#4a9d54] text-white transition-colors"
              >
                Aceptar todas
              </button>
            </div>
            <a
              href="/legal/cookies"
              className="block mt-3 text-[10px] text-[#f5f5f0]/45 hover:text-[#f5f5f0] underline-offset-2 hover:underline"
            >
              Política de cookies →
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
