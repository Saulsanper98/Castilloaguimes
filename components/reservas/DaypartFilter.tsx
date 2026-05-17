"use client"

import { Sun, Sunset, Moon, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { DAYPART_RANGES } from "@/lib/booking"

export type Daypart = "all" | "morning" | "afternoon" | "evening"

interface Props {
  value: Daypart
  onChange: (v: Daypart) => void
}

const OPTIONS: Array<{
  id: Daypart
  label: string
  range: string
  icon: typeof Sun
  hue: string
}> = [
  { id: "all", label: "Cualquiera", range: DAYPART_RANGES.all, icon: Sparkles, hue: "#3a7d44" },
  { id: "morning", label: "Mañana", range: DAYPART_RANGES.morning, icon: Sun, hue: "#e8d44d" },
  { id: "afternoon", label: "Tarde", range: DAYPART_RANGES.afternoon, icon: Sunset, hue: "#ff8a5b" },
  { id: "evening", label: "Noche", range: DAYPART_RANGES.evening, icon: Moon, hue: "#7c83ff" },
]

/**
 * Filtro principal de franja del día. Botones grandes y visuales —
 * es la primera decisión que hace el 90% de los usuarios.
 */
export function DaypartFilter({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Franja del día"
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
    >
      {OPTIONS.map((o) => {
        const Icon = o.icon
        const active = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "group relative flex flex-col items-center gap-1 rounded-xl border px-3 py-3 transition-all",
              active
                ? "border-[#3a7d44] bg-[#3a7d44]/15 shadow-lg shadow-[#3a7d44]/15"
                : "border-white/10 bg-[#111111] hover:border-white/25 hover:bg-white/[0.04]"
            )}
            style={active ? { boxShadow: `0 0 24px ${o.hue}25` } : undefined}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                active ? "text-[#0a0a0a]" : "text-[#f5f5f0]/75"
              )}
              style={{
                background: active ? o.hue : `${o.hue}1f`,
                color: active ? "#0a0a0a" : o.hue,
              }}
            >
              <Icon size={16} aria-hidden="true" />
            </span>
            <span
              className={cn(
                "text-sm font-bold leading-none",
                active ? "text-[#f5f5f0]" : "text-[#f5f5f0]/85"
              )}
            >
              {o.label}
            </span>
            <span className="text-[10px] text-[#f5f5f0]/45 tabular-nums">{o.range}</span>
          </button>
        )
      })}
    </div>
  )
}
