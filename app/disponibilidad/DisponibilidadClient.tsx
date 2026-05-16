"use client"

import { useState } from "react"
import Link from "next/link"
import { format, addDays, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, LogIn } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { CourtHeatmap } from "@/components/reservas/CourtHeatmap"
import { cn } from "@/lib/utils"

const TIME_SLOTS = (() => {
  const out: string[] = []
  for (let h = 8; h <= 22; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`)
    out.push(`${String(h).padStart(2, "0")}:30`)
  }
  return out
})()

export default function DisponibilidadClient() {
  const today = startOfDay(new Date())
  const [date, setDate] = useState<Date>(today)
  const [selectedCourtId, setSelectedCourtId] = useState(1)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const dateKey = format(date, "yyyy-MM-dd")
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i))

  const reserveUrl = selectedSlot
    ? `/reservas?fecha=${dateKey}&franja=${encodeURIComponent(selectedSlot)}&pista=${selectedCourtId}`
    : `/reservas?fecha=${dateKey}`

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-8 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6"><Breadcrumbs /></div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-2 block">
                Vista pública
              </span>
              <h1
                className="text-[#f5f5f0] font-display font-black tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
              >
                DISPONIBILIDAD <span className="text-[#3a7d44]">EN DIRECTO</span>
              </h1>
              <p className="text-[#f5f5f0]/65 text-sm mt-1 max-w-xl">
                Consulta huecos en las 14 pistas sin iniciar sesión. Cuando encuentres tu hora, pulsa para reservar.
              </p>
            </div>
            <Link
              href={reserveUrl}
              className="inline-flex items-center gap-1.5 bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] font-black text-sm px-5 py-3 rounded-xl transition-colors"
            >
              {selectedSlot ? "Reservar este hueco" : "Ir a reservas"}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Day strip */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max">
            <button
              type="button"
              onClick={() => setDate(today)}
              aria-label="Ir a hoy"
              className="inline-flex items-center justify-center h-12 w-9 rounded-xl bg-[#1a1a1a] border border-white/10 text-[#f5f5f0]/65 hover:text-[#f5f5f0]"
            >
              <ChevronLeft size={14} aria-hidden="true" />
            </button>
            {days.map((d, i) => {
              const isSelected = d.toDateString() === date.toDateString()
              const isToday = i === 0
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => setDate(d)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[58px] h-12 rounded-xl border text-center transition-all",
                    isSelected
                      ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                      : "bg-[#1a1a1a] border-white/10 text-[#f5f5f0]/75 hover:border-white/30"
                  )}
                >
                  <span className="text-[9px] uppercase tracking-widest font-bold opacity-80">
                    {isToday ? "Hoy" : format(d, "EEE", { locale: es })}
                  </span>
                  <span className="text-sm font-bold tabular-nums">{format(d, "d", { locale: es })}</span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setDate(addDays(date, 1))}
              aria-label="Siguiente día"
              className="inline-flex items-center justify-center h-12 w-9 rounded-xl bg-[#1a1a1a] border border-white/10 text-[#f5f5f0]/65 hover:text-[#f5f5f0]"
            >
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#f5f5f0]/65">
          <Calendar size={12} className="text-[#3a7d44]" aria-hidden="true" />
          <span className="capitalize font-bold text-[#f5f5f0]">
            {format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
          </span>
        </div>

        {/* Heatmap */}
        <CourtHeatmap
          dateKey={dateKey}
          slots={TIME_SLOTS}
          selectedSlot={selectedSlot}
          selectedCourtId={selectedCourtId}
          onPick={(courtId, slot) => {
            setSelectedCourtId(courtId)
            setSelectedSlot(slot)
          }}
        />

        {/* CTA panel */}
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            {selectedSlot ? (
              <>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#3a7d44] mb-1">
                  Has elegido
                </p>
                <p className="text-[#f5f5f0] font-display font-black text-lg sm:text-xl">
                  Pista {selectedCourtId} a las {selectedSlot} —{" "}
                  <span className="text-[#3a7d44]">
                    {format(date, "EEE d MMM", { locale: es })}
                  </span>
                </p>
                <p className="text-[#f5f5f0]/65 text-xs mt-1">
                  Para confirmar necesitas iniciar sesión o registrarte (es gratis).
                </p>
              </>
            ) : (
              <>
                <p className="text-[#f5f5f0] font-display font-black text-lg">
                  Toca un hueco verde o amarillo
                </p>
                <p className="text-[#f5f5f0]/65 text-sm">
                  Verde = libre · Amarillo = pocas plazas · Rojo = completo.
                </p>
              </>
            )}
          </div>
          <Link
            href={reserveUrl}
            className="inline-flex items-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors shrink-0"
          >
            <LogIn size={14} aria-hidden="true" />
            {selectedSlot ? "Reservar este hueco" : "Iniciar reserva"}
          </Link>
        </div>
      </div>
    </div>
  )
}
