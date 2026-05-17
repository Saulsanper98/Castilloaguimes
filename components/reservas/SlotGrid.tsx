"use client"

import { Sun, Sunset, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSlotAggregatedMockStatus, slotEndLabel, DAYPART_RANGES, type BookingDuration } from "@/lib/booking"

interface Props {
  slots: string[]
  selectedSlot: string | null
  dateKey: string
  duration: BookingDuration
  /** Filtro principal de franja del día */
  daypart: "all" | "morning" | "afternoon" | "evening"
  onPick: (slot: string) => void
  onFullClick?: (slot: string) => void
}

const PER_PERSON: Record<BookingDuration, number> = { 60: 5.5, 90: 6.5, 120: 8 }

function bucketOf(slot: string): "morning" | "afternoon" | "evening" {
  const h = parseInt(slot.split(":")[0]!, 10)
  if (h < 14) return "morning"
  if (h < 18) return "afternoon"
  return "evening"
}

const BUCKETS = [
  { id: "morning" as const, label: "Mañana", icon: Sun, range: DAYPART_RANGES.morning },
  { id: "afternoon" as const, label: "Tarde", icon: Sunset, range: DAYPART_RANGES.afternoon },
  { id: "evening" as const, label: "Noche", icon: Moon, range: DAYPART_RANGES.evening },
]

/**
 * Slots densificados en columnas por franja del día.
 * Cada slot es compacto (44-48px alto), con estado de ocupación visual.
 */
export function SlotGrid({
  slots,
  selectedSlot,
  dateKey,
  duration,
  daypart,
  onPick,
  onFullClick,
}: Props) {
  const visibleBuckets = daypart === "all" ? BUCKETS : BUCKETS.filter((b) => b.id === daypart)
  const perPerson = PER_PERSON[duration]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {visibleBuckets.map(({ id, label, icon: Icon, range }) => {
        const bucketSlots = slots.filter((s) => bucketOf(s) === id)
        if (bucketSlots.length === 0) return null
        const overflows = bucketSlots.length > 8
        return (
          <div key={id} className="rounded-xl border border-white/5 bg-[#0d0d0d]/40 p-3 relative">
            <div className="mb-2 flex items-center gap-2">
              <Icon size={12} className="text-[#f5f5f0]/55" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/70">
                {label}
              </span>
              <span className="text-[9px] text-[#f5f5f0]/35">{range}</span>
              {overflows && (
                <span className="ml-auto text-[9px] uppercase tracking-widest font-bold text-[#f5f5f0]/45">
                  {bucketSlots.length} franjas
                </span>
              )}
            </div>
            <div className="relative">
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
              {bucketSlots.map((slot) => {
                const status = getSlotAggregatedMockStatus(dateKey, slot)
                const isSelected = selectedSlot === slot
                const isFull = status === "full"
                const isFew = status === "few"
                const end = slotEndLabel(slot, duration)
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => (isFull ? onFullClick?.(slot) : onPick(slot))}
                    aria-label={`${isFull ? "Completo " : isFew ? "Pocas plazas " : ""}${slot} a ${end}, ${duration} minutos, ${perPerson.toFixed(2)} euros por persona`}
                    className={cn(
                      "group relative flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left font-semibold transition-all",
                      "min-h-[48px]",
                      isSelected
                        ? "border-[#3a7d44] bg-[#3a7d44] text-white shadow-lg shadow-[#3a7d44]/30"
                        : isFull
                          ? "cursor-pointer border-white/5 bg-[#1a1a1a]/50 text-[#f5f5f0]/40 line-through hover:border-[#e8d44d]/40"
                          : isFew
                            ? "border-[#e8d44d]/40 bg-[#e8d44d]/5 text-[#f5f5f0]/90 hover:border-[#e8d44d] hover:bg-[#e8d44d]/10"
                            : "border-white/10 bg-[#1a1a1a] text-[#f5f5f0]/85 hover:border-[#3a7d44]/55 hover:bg-[#3a7d44]/10"
                    )}
                  >
                    <span className="flex flex-col leading-tight">
                      <span className="text-sm font-bold tabular-nums">{slot}</span>
                      <span
                        className={cn(
                          "text-[9px] tabular-nums",
                          isSelected ? "text-white/75" : "text-[#f5f5f0]/45"
                        )}
                      >
                        → {end}
                      </span>
                    </span>
                    {!isFull && (
                      <span
                        className={cn(
                          "text-[10px] font-bold tabular-nums",
                          isSelected ? "text-white/85" : isFew ? "text-[#e8d44d]" : "text-[#3a7d44]"
                        )}
                      >
                        {perPerson.toFixed(2).replace(".", ",")}€
                      </span>
                    )}
                    {isFew && !isSelected && (
                      <span
                        className="absolute -top-1 -right-1 inline-flex items-center rounded-full bg-[#e8d44d] px-1 py-px text-[7px] font-black uppercase tracking-widest text-[#0a0a0a]"
                        aria-hidden="true"
                      >
                        Pocas
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            {overflows && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-1 bottom-0 h-6 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent"
              />
            )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
