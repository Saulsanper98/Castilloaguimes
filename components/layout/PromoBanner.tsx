"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X, Sparkles } from "lucide-react"

const STORAGE_KEY = "promo-dismissed-v1"

interface Promo {
  message: string
  cta: { label: string; href: string }
}

const CURRENT_PROMO: Promo = {
  message: "🏆 Inscripciones abiertas para el Gran Torneo de Verano 2026",
  cta: { label: "Ver torneos", href: "/campeonatos" },
}

export function PromoBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      const dismissed = localStorage.getItem(STORAGE_KEY) === "1"
      if (!dismissed) setVisible(true)
    })
  }, [])

  function dismiss() {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, "1")
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Promoción destacada"
      className="relative bg-gradient-to-r from-[#3a7d44] via-[#4a9d54] to-[#3a7d44] text-white text-xs sm:text-sm py-2.5 px-4 z-[60]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 pr-8">
        <Sparkles size={14} className="hidden sm:inline-block flex-shrink-0" aria-hidden="true" />
        <p className="font-medium">
          <span className="hidden sm:inline">{CURRENT_PROMO.message}</span>
          <span className="sm:hidden">🏆 Torneo Verano 2026 abierto</span>
          <Link
            href={CURRENT_PROMO.cta.href}
            className="ml-2 sm:ml-3 underline underline-offset-2 font-bold hover:text-white/90"
          >
            {CURRENT_PROMO.cta.label} →
          </Link>
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar mensaje promocional"
        className="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded hover:bg-white/15 transition-colors"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
