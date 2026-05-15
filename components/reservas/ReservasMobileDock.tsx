"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { ChevronUp, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatEuro } from "@/lib/booking"
import type { Court } from "@/lib/courts"

type Props = {
  visible: boolean
  selectedCourt: Court
  selectedDate: Date
  selectedSlot: string
  duration: number
  recurring: boolean
  recurringWeeks: number
  total: number
  graceRemain: number
  graceActive: boolean
  onBook: () => void
  bookingLoading: boolean
}

export function ReservasMobileDock({
  visible,
  selectedCourt,
  selectedDate,
  selectedSlot,
  duration,
  recurring,
  recurringWeeks,
  total,
  graceRemain,
  graceActive,
  onBook,
  bookingLoading,
}: Props) {
  const [open, setOpen] = useState(false)
  const minutesRemain = Math.floor(graceRemain / 60)
  const secondsRemain = graceRemain % 60
  const progressPct = graceActive ? Math.min(100, (graceRemain / 300) * 100) : 0

  if (!visible) return null

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-white/10 bg-[#111111]/95 p-3 shadow-2xl shadow-black/60 backdrop-blur lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-[10px] font-bold uppercase tracking-wider text-[#f5f5f0]/55">
            {selectedCourt.name} · {format(selectedDate, "EEE d MMM", { locale: es })} · {selectedSlot} · {duration} min
            {recurring && ` · ×${recurringWeeks}`}
          </div>
          <div className="font-black text-lg tabular-nums text-[#3a7d44]">{formatEuro(total)}</div>
          {graceActive && graceRemain > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <Clock size={12} className="shrink-0 text-[#e8d44d]" aria-hidden />
              <span className="text-[10px] font-semibold tabular-nums text-[#e8d44d]">
                {String(minutesRemain).padStart(2, "0")}:{String(secondsRemain).padStart(2, "0")}
              </span>
              <div className="h-1 min-w-[4rem] flex-1 overflow-hidden rounded-full bg-black/40">
                <div className="h-full rounded-full bg-[#e8d44d]" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-xl border border-white/15 px-3 py-2 text-[11px] font-bold text-[#f5f5f0]/80"
        >
          Detalle
        </button>
        <button
          type="button"
          disabled={bookingLoading}
          onClick={onBook}
          className="shrink-0 rounded-xl bg-[#e8d44d] px-5 py-3 text-sm font-black text-[#0a0a0a] disabled:opacity-60"
        >
          {bookingLoading ? "…" : "Reservar"}
        </button>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[350] bg-black/70 lg:hidden" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-[351] max-h-[85vh] overflow-y-auto rounded-t-2xl border border-white/10 bg-[#111111] p-5 lg:hidden">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" aria-hidden />
            <Dialog.Title className="mb-2 font-bold text-[#f5f5f0]">Resumen de reserva</Dialog.Title>
            <Dialog.Description className="space-y-2 text-sm text-[#f5f5f0]/65">
              <p>
                <strong className="text-[#f5f5f0]">{selectedCourt.name}</strong> · {format(selectedDate, "EEEE d MMMM", { locale: es })}
              </p>
              <p>
                Franja {selectedSlot} · Duración {duration} min{recurring ? ` · ${recurringWeeks} semanas` : ""}
              </p>
              <p className="text-lg font-black text-[#3a7d44]">{formatEuro(total)}</p>
              <p className="text-xs text-[#f5f5f0]/45">IVA incluido. Confirma en la app o recepción.</p>
            </Dialog.Description>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-[#f5f5f0]"
              onClick={() => setOpen(false)}
            >
              <ChevronUp size={16} aria-hidden />
              Cerrar
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
