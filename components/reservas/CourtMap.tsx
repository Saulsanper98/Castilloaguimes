"use client"

import { useCallback, useRef, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { COURTS, COURT_TYPE_LABEL, COURT_TYPE_COLOR, type Court, type CourtType } from "@/lib/courts"
import { getCourtSlotAvailability } from "@/lib/booking"
import { cn } from "@/lib/utils"

interface Props {
  selectedCourtId: number | null
  onSelect: (court: Court) => void
  typeFilter: CourtType | "all"
  dateKey?: string
  slot?: string | null
  /** Si se pasa, solo se muestran estas pistas (p. ej. libres en la franja elegida). */
  allowedCourtIds?: number[] | null
  onLegendTypeSelect?: (t: CourtType) => void
}

export function CourtMap({ selectedCourtId, onSelect, typeFilter, dateKey, slot, allowedCourtIds, onLegendTypeSelect }: Props) {
  const [scale, setScale] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)

  const bump = useCallback((delta: number) => {
    setScale((s) => Math.min(1.75, Math.max(0.85, Math.round((s + delta) * 100) / 100)))
  }, [])

  const courtsToShow = COURTS.filter((court) => {
    if (allowedCourtIds != null) {
      if (allowedCourtIds.length === 0) return false
      if (!allowedCourtIds.includes(court.id)) return false
    }
    if (typeFilter !== "all" && court.type !== typeFilter) return false
    return true
  })

  const noneFreeAtSlot = allowedCourtIds != null && allowedCourtIds.length === 0
  const emptyList = courtsToShow.length === 0

  const emptyMessage = noneFreeAtSlot
    ? "No hay pistas libres a esta hora. Elige otra franja."
    : emptyList
      ? "Ninguna pista de este tipo está libre a esta hora. Prueba «Todas» u otro tipo."
      : null

  return (
    <div className="space-y-3">
      {emptyMessage && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/95">
          {emptyMessage}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/45">
          Plano del recinto · toca una pista
        </p>
        {courtsToShow.length > 0 && (
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#1a1a1a] p-0.5">
          <button
            type="button"
            aria-label="Alejar plano"
            className="p-1.5 text-[#f5f5f0]/70 hover:bg-white/10 rounded-md transition-colors"
            onClick={() => bump(-0.1)}
          >
            <Minus size={14} aria-hidden />
          </button>
          <span className="px-1 text-[10px] tabular-nums text-[#f5f5f0]/50">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            aria-label="Acercar plano"
            className="p-1.5 text-[#f5f5f0]/70 hover:bg-white/10 rounded-md transition-colors"
            onClick={() => bump(0.1)}
          >
            <Plus size={14} aria-hidden />
          </button>
        </div>
        )}
      </div>

      {courtsToShow.length > 0 ? (
      <div
        ref={scrollRef}
        className="relative w-full overflow-auto rounded-2xl border border-white/10 bg-[#0d0d0d] [-webkit-overflow-scrolling:touch]"
        style={{ touchAction: "pan-x pan-y pinch-zoom" }}
      >
        <div
          className="relative mx-auto aspect-[16/9] min-h-[200px] w-full min-w-[320px] max-w-4xl origin-top transition-transform duration-200"
          style={{ transform: `scale(${scale})` }}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" aria-hidden>
            <defs>
              <pattern id="court-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3a7d44" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#court-grid)" />
          </svg>

          <div className="pointer-events-none absolute left-4 right-4 top-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#f5f5f0]/45">
            <span>
              {courtsToShow.length === COURTS.length ? "14 pistas · 6.000 m²" : `${courtsToShow.length} pista(s) a esta hora`}
            </span>
            <span className="hidden sm:inline text-[#f5f5f0]/35">LED · techo retráctil</span>
          </div>

          <div className="absolute inset-0 p-8">
            {courtsToShow.map((court) => {
              const isSelected = court.id === selectedCourtId
              const status =
                dateKey && slot ? getCourtSlotAvailability(court.id, dateKey, slot) : ("free" as const)
              const isFull = status === "full"
              const isFew = status === "few"
              const disabled = isFull
              const color = COURT_TYPE_COLOR[court.type]
              const title = `${court.name} — ${COURT_TYPE_LABEL[court.type]}${isFull ? " · Completa" : isFew ? " · Pocas plazas" : " · Disponible"}`

              return (
                <button
                  key={court.id}
                  type="button"
                  title={title}
                  onClick={() => onSelect(court)}
                  disabled={disabled}
                  aria-label={title}
                  aria-pressed={isSelected}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 group",
                    isFull && "cursor-not-allowed opacity-25",
                    !disabled && "cursor-pointer"
                  )}
                  style={{ left: `${court.x}%`, top: `${court.y}%` }}
                >
                  <span
                    className={cn(
                      "relative block rounded-md border-2 transition-all sm:h-14 sm:w-12",
                      "h-12 w-10",
                      isSelected ? "scale-110 shadow-lg" : "group-hover:scale-105",
                      isFew && !isSelected && !isFull && "ring-2 ring-[#e8d44d]/60 ring-offset-2 ring-offset-[#0d0d0d]"
                    )}
                    style={{
                      background: isSelected ? color : `${color}25`,
                      borderColor: isSelected ? "#ffffff" : isFew && !isFull ? "#e8d44d" : color,
                      boxShadow: isSelected ? `0 0 24px ${color}80` : "none",
                    }}
                  >
                    <span className="absolute left-1 right-1 top-1/2 h-px bg-current opacity-40" />
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-center text-[10px] font-bold",
                      isSelected ? "text-white" : "text-[#f5f5f0]/65"
                    )}
                  >
                    {court.id}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-wrap items-center gap-3 text-[10px]">
            {(Object.keys(COURT_TYPE_LABEL) as CourtType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onLegendTypeSelect?.(t)
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[#f5f5f0]/55 transition-colors hover:bg-white/10 hover:text-[#f5f5f0]",
                  typeFilter === t && "bg-white/10 text-[#f5f5f0]"
                )}
              >
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COURT_TYPE_COLOR[t] }} />
                {COURT_TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </div>
      </div>
      ) : null}

      <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Listado de pistas">
        {courtsToShow.map((court) => {
          const st = dateKey && slot ? getCourtSlotAvailability(court.id, dateKey, slot) : "free"
          const active = court.id === selectedCourtId
          return (
            <li key={court.id}>
              <button
                type="button"
                disabled={st === "full"}
                onClick={() => onSelect(court)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors",
                  active
                    ? "border-[#3a7d44] bg-[#3a7d44]/15 text-[#f5f5f0]"
                    : "border-white/10 bg-[#1a1a1a] text-[#f5f5f0]/75 hover:border-white/25",
                  st === "full" && "cursor-not-allowed opacity-40"
                )}
              >
                <span className="font-bold">{court.name}</span>
                <span className="shrink-0 text-[10px] text-[#f5f5f0]/50">{COURT_TYPE_LABEL[court.type]}</span>
                {st === "few" && (
                  <span className="shrink-0 text-[10px] font-bold text-[#e8d44d]">Pocas</span>
                )}
                {st === "full" && (
                  <span className="shrink-0 text-[10px] font-bold text-red-400/90">Llena</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
