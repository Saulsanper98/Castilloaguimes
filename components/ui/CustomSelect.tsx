"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

interface Option<T extends string> {
  value: T
  label: string
  hint?: string
}

interface Props<T extends string> {
  id?: string
  value: T
  options: Option<T>[]
  onChange: (v: T) => void
  ariaLabel?: string
  placeholder?: string
}

export function CustomSelect<T extends string>({
  id,
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = "Seleccionar…",
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const current = options.find((o) => o.value === value)

  return (
    <div className="relative" ref={ref}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-[#1a1a1a] border border-white/10 hover:border-white/20 focus-visible:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none transition-colors"
      >
        <span className={current ? "" : "text-[#f5f5f0]/45"}>
          {current?.label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`text-[#f5f5f0]/55 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute z-30 mt-1 left-0 right-0 max-h-60 overflow-auto rounded-xl bg-[#111111] border border-white/10 shadow-2xl shadow-black/40 py-1"
        >
          {options.map((o) => {
            const selected = o.value === value
            return (
              <li key={o.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className={`w-full text-left flex items-start gap-2 px-3 py-2 text-sm transition-colors ${
                    selected
                      ? "bg-[#3a7d44]/15 text-[#f5f5f0]"
                      : "text-[#f5f5f0]/75 hover:bg-white/5"
                  }`}
                >
                  <Check
                    size={13}
                    aria-hidden="true"
                    className={selected ? "text-[#3a7d44] mt-1" : "opacity-0 mt-1"}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block">{o.label}</span>
                    {o.hint && <span className="block text-[10px] text-[#f5f5f0]/45">{o.hint}</span>}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
