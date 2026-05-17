"use client"

import * as Select from "@radix-ui/react-select"
import { Check, ChevronDown, Moon, Sparkles, Sun, Sunset } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Daypart } from "@/components/reservas/DaypartFilter"
import { DAYPART_RANGES } from "@/lib/booking"

const OPTIONS: {
  value: Daypart
  title: string
  range: string
  icon: typeof Sun
}[] = [
  { value: "all", title: "Todo el día", range: DAYPART_RANGES.all, icon: Sparkles },
  { value: "morning", title: "Mañana", range: DAYPART_RANGES.morning, icon: Sun },
  { value: "afternoon", title: "Tarde", range: DAYPART_RANGES.afternoon, icon: Sunset },
  { value: "evening", title: "Noche", range: DAYPART_RANGES.evening, icon: Moon },
]

interface Props {
  value: Daypart
  onChange: (v: Daypart) => void
  /** Oculta la etiqueta superior (útil si la pintas fuera, p. ej. alinear con otro control de 52px). */
  hideLabel?: boolean
}

export function DaypartSelect({ value, onChange, hideLabel = false }: Props) {
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0]!
  const Icon = current.icon

  return (
    <div className="min-w-0 flex-1">
      {!hideLabel && (
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5f5f0]/45">
          Filtrar por franja
        </label>
      )}
      <Select.Root value={value} onValueChange={(v) => onChange(v as Daypart)}>
        <Select.Trigger
          aria-label="Franja horaria del día"
          className={cn(
            "flex h-[52px] w-full min-w-0 items-center gap-3 rounded-xl border bg-[#141414]",
            "border-[#252525] px-4 text-left outline-none transition-[border-color,box-shadow,background-color] duration-200",
            "hover:border-white/10 hover:bg-[#161616]",
            "focus:outline-none focus:ring-0 focus:ring-offset-0",
            "focus-visible:border-[#3a7d44]/50 focus-visible:ring-2 focus-visible:ring-[#3a7d44]/25",
            "data-[state=open]:border-[#3a7d44]/35 data-[state=open]:bg-[#161616] data-[state=open]:shadow-none"
          )}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3a7d44]/20 text-[#3a7d44]"
            aria-hidden
          >
            <Icon size={18} strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-sm font-bold leading-none text-[#f5f5f0]">{current.title}</span>
            <span className="mt-1 block text-[11px] font-medium tabular-nums text-[#f5f5f0]/45">{current.range}</span>
          </span>
          <Select.Icon className="shrink-0 text-[#f5f5f0]/50">
            <ChevronDown size={18} strokeWidth={2} aria-hidden />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={8}
            className={cn(
              "bg-[#141414] shadow-xl shadow-black/40 backdrop-blur-md border border-[#252525]"
            )}
          >
            <Select.Viewport className="p-1.5">
              {OPTIONS.map((o) => (
                <Select.Item
                  key={o.value}
                  value={o.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center gap-3 rounded-lg py-2.5 pl-3 pr-8 text-sm outline-none",
                    "text-[#f5f5f0]/85 data-highlighted:bg-[#3a7d44]/20 data-highlighted:text-[#f5f5f0]",
                    "data-[state=checked]:bg-[#3a7d44]/25"
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-[#3a7d44]">
                    <o.icon size={15} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Select.ItemText className="font-bold leading-tight">{o.title}</Select.ItemText>
                    <span className="text-[10px] tabular-nums text-[#f5f5f0]/45">{o.range}</span>
                  </span>
                  <Select.ItemIndicator className="absolute right-2 flex w-4 items-center justify-center text-[#e8d44d]">
                    <Check size={14} strokeWidth={3} aria-hidden />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
