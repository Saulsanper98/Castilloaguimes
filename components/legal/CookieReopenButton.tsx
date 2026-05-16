"use client"

import { Cookie } from "lucide-react"

export function CookieReopenButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("pcdc:cookies-reopen"))}
      className="not-prose mt-2 inline-flex items-center gap-2 bg-[#e8d44d]/10 hover:bg-[#e8d44d]/15 border border-[#e8d44d]/30 hover:border-[#e8d44d]/50 text-[#e8d44d] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
    >
      <Cookie size={13} aria-hidden="true" />
      Cambiar preferencias de cookies
    </button>
  )
}
