"use client"

import { useMemo } from "react"
import { Sparkles, Clock, Star, Zap } from "lucide-react"
import { COURTS, COURT_TYPE_LABEL, type CourtType } from "@/lib/courts"
import { getSlotMockStatus } from "@/lib/slotMock"
import type { BookingDuration } from "@/lib/booking"
import { cn } from "@/lib/utils"

interface Suggestion {
  kind: "habitual" | "cheap" | "premium" | "now"
  courtId: number
  slot: string
  reason: string
  highlight?: boolean
}

interface Props {
  dateKey: string
  slots: string[]
  duration: BookingDuration
  habitualSlot?: string | null
  habitualCourtId?: number | null
  onApply: (s: Suggestion) => void
}

const PRICE_PER_DURATION: Record<BookingDuration, number> = { 60: 5.5, 90: 6.5, 120: 8 }

/**
 * Calcula hasta 3 sugerencias inteligentes:
 * - tu horario habitual (si hay)
 * - el hueco MÁS barato disponible
 * - una pista panorámica disponible (premium)
 */
function buildSuggestions(
  dateKey: string,
  slots: string[],
  habitualSlot?: string | null,
  habitualCourtId?: number | null
): Suggestion[] {
  const out: Suggestion[] = []

  // 1. Tu horario habitual
  if (habitualSlot && slots.includes(habitualSlot)) {
    const court = habitualCourtId
      ? COURTS.find((c) => c.id === habitualCourtId)
      : COURTS.find((c) => getSlotMockStatus(dateKey, habitualSlot, c.id) !== "full")
    if (court && getSlotMockStatus(dateKey, habitualSlot, court.id) !== "full") {
      out.push({
        kind: "habitual",
        courtId: court.id,
        slot: habitualSlot,
        reason: "Tu horario habitual está libre",
        highlight: true,
      })
    }
  }

  // 2. Panorámica disponible más temprana
  const panorPick = (() => {
    for (const s of slots) {
      for (const c of COURTS.filter((x) => x.type === "panoramica")) {
        if (getSlotMockStatus(dateKey, s, c.id) === "free") return { c, s }
      }
    }
    return null
  })()
  if (panorPick) {
    out.push({
      kind: "premium",
      courtId: panorPick.c.id,
      slot: panorPick.s,
      reason: "Panorámica libre",
    })
  }

  // 3. Hueco "completo" cualquier libre (rápido)
  if (out.length < 3) {
    for (const s of slots) {
      for (const c of COURTS) {
        if (getSlotMockStatus(dateKey, s, c.id) === "free" && !out.find((x) => x.slot === s && x.courtId === c.id)) {
          out.push({
            kind: "now",
            courtId: c.id,
            slot: s,
            reason: "Antes posible disponible",
          })
          break
        }
      }
      if (out.length >= 3) break
    }
  }

  return out.slice(0, 3)
}

const KIND_META: Record<Suggestion["kind"], { icon: typeof Sparkles; color: string; label: string }> = {
  habitual: { icon: Star, color: "#e8d44d", label: "Habitual" },
  cheap: { icon: Zap, color: "#3a7d44", label: "Barato" },
  premium: { icon: Sparkles, color: "#7c83ff", label: "Premium" },
  now: { icon: Clock, color: "#3a7d44", label: "Disponible" },
}

export function SmartSuggestions({
  dateKey,
  slots,
  duration,
  habitualSlot,
  habitualCourtId,
  onApply,
}: Props) {
  const suggestions = useMemo(
    () => buildSuggestions(dateKey, slots, habitualSlot, habitualCourtId),
    [dateKey, slots, habitualSlot, habitualCourtId]
  )

  if (suggestions.length === 0) return null

  return (
    <div className="mb-5 rounded-2xl border border-[#3a7d44]/25 bg-gradient-to-br from-[#3a7d44]/10 via-[#111111] to-[#111111] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} className="text-[#e8d44d]" aria-hidden="true" />
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#e8d44d]">
          Para ti hoy
        </p>
        <span className="text-[10px] text-[#f5f5f0]/45">·  {suggestions.length} opciones rápidas</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {suggestions.map((s) => {
          const meta = KIND_META[s.kind]
          const Icon = meta.icon
          const court = COURTS.find((c) => c.id === s.courtId)!
          const perPerson = PRICE_PER_DURATION[duration]
          return (
            <li key={`${s.kind}-${s.courtId}-${s.slot}`}>
              <button
                type="button"
                onClick={() => onApply(s)}
                className={cn(
                  "w-full text-left flex items-start gap-3 rounded-xl border px-3 py-3 transition-all group",
                  s.highlight
                    ? "border-[#e8d44d]/50 bg-[#e8d44d]/10 hover:bg-[#e8d44d]/15"
                    : "border-white/10 bg-[#1a1a1a] hover:border-[#3a7d44]/40 hover:bg-[#3a7d44]/5"
                )}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${meta.color}22`, color: meta.color }}
                  aria-hidden="true"
                >
                  <Icon size={12} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[9px] font-black uppercase tracking-widest" style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                  <span className="block text-[#f5f5f0] font-bold text-sm tabular-nums truncate">
                    {s.slot} · {court.name}
                  </span>
                  <span className="block text-[10px] text-[#f5f5f0]/55 truncate">
                    {COURT_TYPE_LABEL[court.type as CourtType]} · {perPerson.toFixed(2).replace(".", ",")} €/pers · {s.reason}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
