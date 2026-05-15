"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, label: "Fecha" },
  { id: 2, label: "Hora" },
  { id: 3, label: "Pista" },
  { id: 4, label: "Confirmar" },
] as const

type Props = {
  hasDate: boolean
  hasSlot: boolean
  /** El usuario ha elegido pista explícitamente en el plano (primer clic). */
  mapTouched: boolean
}

export function BookingStepper({ hasDate, hasSlot, mapTouched }: Props) {
  const current = !hasDate ? 1 : !hasSlot ? 2 : !mapTouched ? 3 : 4

  return (
    <nav aria-label="Pasos de reserva" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 sm:gap-0 sm:justify-between">
        {STEPS.map((step, i) => {
          const done = step.id < current
          const active = step.id === current
          return (
            <li key={step.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors",
                  done
                    ? "border-[#3a7d44]/50 bg-[#3a7d44]/15 text-[#3a7d44]"
                    : active
                      ? "border-[#e8d44d]/50 bg-[#e8d44d]/10 text-[#e8d44d]"
                      : "border-white/10 bg-[#1a1a1a] text-[#f5f5f0]/40"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                    done ? "bg-[#3a7d44] text-white" : active ? "bg-[#e8d44d] text-[#0a0a0a]" : "bg-white/10 text-[#f5f5f0]/50"
                  )}
                >
                  {done && step.id < 4 ? <Check size={10} strokeWidth={3} aria-hidden /> : step.id}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </span>
              {i < STEPS.length - 1 && (
                <span className="hidden sm:block h-px w-4 flex-shrink-0 bg-white/10 sm:w-6" aria-hidden />
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-[11px] text-[#f5f5f0]/45 sm:hidden">
        Paso {current} de {STEPS.length}: {STEPS[current - 1]?.label}
      </p>
    </nav>
  )
}
