"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"

interface Props {
  text: string
  className?: string
}

export function InfoTooltip({ text, className = "" }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        aria-label="Más información"
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="text-[#f5f5f0]/45 hover:text-[#3a7d44] transition-colors"
      >
        <HelpCircle size={11} aria-hidden="true" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 px-3 py-2 bg-[#1a1a1a] border border-white/15 text-[#f5f5f0]/85 text-[10px] leading-relaxed rounded-lg shadow-xl z-30 pointer-events-none"
        >
          {text}
        </span>
      )}
    </span>
  )
}
