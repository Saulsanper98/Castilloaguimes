"use client"

import { Check, Calendar, Clock, MapPin, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, label: "Fecha", icon: Calendar },
  { id: 2, label: "Hora", icon: Clock },
  { id: 3, label: "Pista", icon: MapPin },
  { id: 4, label: "Confirmar", icon: Sparkles },
] as const

type Props = {
  hasDate: boolean
  hasSlot: boolean
  mapTouched: boolean
  /** Permite saltar a un paso anterior si ya está completo */
  onJumpToStep?: (step: number) => void
}

/**
 * Stepper visual con barra de progreso que se va rellenando.
 * Los pasos completados son clicables (volver atrás).
 */
export function BookingStepper({ hasDate, hasSlot, mapTouched, onJumpToStep }: Props) {
  const current = !hasDate ? 1 : !hasSlot ? 2 : !mapTouched ? 3 : 4
  const progress = ((current - 1) / (STEPS.length - 1)) * 100

  return (
    <nav aria-label="Pasos de reserva" className="mb-6 sm:mb-8">
      <ol className="relative flex items-center justify-between">
        {/* Background bar */}
        <span
          className="absolute left-0 right-0 top-5 h-0.5 bg-white/10 sm:top-6"
          aria-hidden="true"
        />
        {/* Filled bar (transitions as user advances) */}
        <span
          className="absolute left-0 top-5 h-0.5 bg-gradient-to-r from-[#3a7d44] to-[#e8d44d] transition-all duration-500 ease-out sm:top-6"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />

        {STEPS.map((step) => {
          const Icon = step.icon
          const done = step.id < current
          const active = step.id === current
          const clickable = !!onJumpToStep && step.id < current

          const inner = (
            <div
              className={cn(
                "relative flex flex-col items-center gap-1.5 px-1 transition-opacity",
                clickable && "cursor-pointer hover:opacity-90"
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex items-center justify-center rounded-full text-[11px] font-black transition-all",
                  active
                    ? "h-10 w-10 sm:h-12 sm:w-12 bg-[#e8d44d] text-[#0a0a0a] shadow-lg shadow-[#e8d44d]/40 ring-4 ring-[#e8d44d]/20"
                    : done
                      ? "h-10 w-10 sm:h-12 sm:w-12 bg-[#3a7d44] text-white"
                      : "h-10 w-10 sm:h-12 sm:w-12 bg-[#1a1a1a] border border-white/10 text-[#f5f5f0]/40"
                )}
              >
                {done && step.id < 4 ? (
                  <Check size={16} strokeWidth={3} aria-hidden="true" />
                ) : (
                  <Icon size={16} aria-hidden="true" />
                )}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                  active ? "text-[#e8d44d]" : done ? "text-[#3a7d44]" : "text-[#f5f5f0]/45"
                )}
              >
                {step.label}
              </span>
            </div>
          )

          return (
            <li key={step.id}>
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onJumpToStep!(step.id)}
                  aria-label={`Volver a ${step.label}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7d44]/60 rounded-lg"
                >
                  {inner}
                </button>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
