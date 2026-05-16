"use client"

import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { applyTheme, getStoredTheme, setStoredTheme, watchSystemTheme, type Theme } from "@/lib/theme"

const OPTS: Array<{ value: Theme; icon: typeof Sun; label: string }> = [
  { value: "light", icon: Sun, label: "Claro" },
  { value: "dark", icon: Moon, label: "Oscuro" },
  { value: "system", icon: Monitor, label: "Sistema" },
]

interface Props {
  /** "segmented" = los 3 botones, "icon" = un solo botón que cicla */
  variant?: "segmented" | "icon"
  className?: string
}

export function ThemeToggle({ variant = "icon", className = "" }: Props) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const t = getStoredTheme()
      setTheme(t)
      applyTheme(t)
      setMounted(true)
    })
    const unsub = watchSystemTheme(() => {
      if (getStoredTheme() === "system") applyTheme("system")
    })
    return () => {
      cancelAnimationFrame(raf)
      unsub()
    }
  }, [])

  function setT(t: Theme) {
    setTheme(t)
    setStoredTheme(t)
  }

  function cycle() {
    const i = OPTS.findIndex((o) => o.value === theme)
    const next = OPTS[(i + 1) % OPTS.length]
    setT(next.value)
  }

  // Avoid hydration mismatch — render nothing-with-the-same-footprint until mounted
  if (!mounted) {
    return <span className={`inline-block w-9 h-9 ${className}`} aria-hidden="true" />
  }

  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Tema visual"
        className={`inline-flex rounded-lg border border-white/10 bg-[#1a1a1a] p-0.5 ${className}`}
      >
        {OPTS.map((o) => {
          const Icon = o.icon
          const active = theme === o.value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setT(o.value)}
              title={o.label}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                active ? "bg-[#3a7d44] text-white" : "text-[#f5f5f0]/55 hover:text-[#f5f5f0]"
              }`}
            >
              <Icon size={14} aria-hidden="true" />
            </button>
          )
        })}
      </div>
    )
  }

  const current = OPTS.find((o) => o.value === theme) ?? OPTS[1]
  const Icon = current.icon
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Tema: ${current.label}. Pulsa para cambiar.`}
      title={`Tema: ${current.label}`}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 text-[#f5f5f0]/65 hover:text-[#f5f5f0] hover:border-white/30 transition-colors ${className}`}
    >
      <Icon size={15} aria-hidden="true" />
    </button>
  )
}
