"use client"

import { useEffect, useState } from "react"
import { Cookie, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import {
  COOKIE_CONSENT_STORAGE_KEY,
  dispatchCookieConsentSettled,
  setCookieBannerInsetActive,
} from "@/lib/cookieConsent"

type Consent = "all" | "essential"

export function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const stored = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
      if (stored) {
        setCookieBannerInsetActive(false)
        dispatchCookieConsentSettled()
      } else {
        setOpen(true)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (open) setCookieBannerInsetActive(true)
  }, [open])

  function decide(c: Consent) {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, c)
    setOpen(false)
    dispatchCookieConsentSettled()
  }

  return (
    <AnimatePresence onExitComplete={() => setCookieBannerInsetActive(false)}>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md z-[110]"
        >
          <div className="relative bg-[#0f0f0f]/95 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl shadow-black/60 p-3.5 sm:p-5">
            <div className="flex items-start gap-2.5 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#e8d44d]/15 border border-[#e8d44d]/30 flex items-center justify-center shrink-0">
                <Cookie size={16} className="text-[#e8d44d]" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="cookie-title" className="text-[#f5f5f0] font-bold text-xs sm:text-sm leading-tight">
                  Cookies del club
                </h2>
                <p className="text-[#f5f5f0]/65 text-[11px] sm:text-xs leading-snug sm:leading-relaxed mt-0.5 sm:mt-1">
                  Esenciales para la web. Opcionales para mejorar la experiencia (preferencias, analítica anónima).
                </p>
              </div>
              <button
                type="button"
                onClick={() => decide("essential")}
                aria-label="Rechazar cookies opcionales"
                className="text-[#f5f5f0]/45 hover:text-[#f5f5f0] p-1 shrink-0"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => decide("essential")}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold border border-white/15 text-[#f5f5f0]/80 hover:bg-white/5 hover:text-[#f5f5f0] transition-colors"
              >
                Solo esenciales
              </button>
              <button
                type="button"
                onClick={() => decide("all")}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-[#3a7d44] hover:bg-[#4a9d54] text-white transition-colors"
              >
                Aceptar todas
              </button>
            </div>
            <a
              href="/legal/cookies"
              className="block mt-2 sm:mt-3 text-[10px] text-[#f5f5f0]/45 hover:text-[#f5f5f0] underline-offset-2 hover:underline"
            >
              Política de cookies →
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
