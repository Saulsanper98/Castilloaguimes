"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

const STORAGE_KEY = "castilloaguimes-hc"

export function HighContrastToggle({ className = "" }: { className?: string }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      const stored = localStorage.getItem(STORAGE_KEY) === "1"
      if (stored) {
        document.documentElement.classList.add("hc")
        setEnabled(true)
      }
    })
  }, [])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    if (next) {
      document.documentElement.classList.add("hc")
      localStorage.setItem(STORAGE_KEY, "1")
    } else {
      document.documentElement.classList.remove("hc")
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Desactivar alto contraste" : "Activar alto contraste"}
      title={enabled ? "Desactivar alto contraste" : "Activar alto contraste"}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-all ${
        enabled
          ? "bg-[#3a7d44] border-[#3a7d44] text-white"
          : "bg-transparent border-white/15 text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:border-white/30"
      } ${className}`}
    >
      <Eye size={16} aria-hidden="true" />
    </button>
  )
}
