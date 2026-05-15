"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { Check, Clock, CreditCard, Info, MapPin, MessageCircle, Share2, X, Link2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import type { Court } from "@/lib/courts"
import { COURT_TYPE_LABEL } from "@/lib/courts"
import { formatEuro, getCancellationPolicyUpdatedLabel } from "@/lib/booking"
import { cn } from "@/lib/utils"

type Props = {
  selectedCourt: Court
  selectedDate: Date | null
  selectedSlot: string | null
  duration: number
  recurring: boolean
  recurringWeeks: number
  price: number | null
  graceRemain: number
  graceActive: boolean
  bookingLoading: boolean
  liveMessage: string
  onBook: () => void
  onShare: () => void
}

export function ReservasSummaryAside({
  selectedCourt,
  selectedDate,
  selectedSlot,
  duration,
  recurring,
  recurringWeeks,
  price,
  graceRemain,
  graceActive,
  bookingLoading,
  liveMessage,
  onBook,
  onShare,
}: Props) {
  const minutesRemain = Math.floor(graceRemain / 60)
  const secondsRemain = graceRemain % 60
  const total = price !== null ? (recurring ? price * recurringWeeks : price) : null
  const progressPct = graceActive ? Math.min(100, (graceRemain / 300) * 100) : 0

  const shareWhatsApp = () => {
    if (!selectedDate || !selectedSlot || total === null) return
    const dateStr = format(selectedDate, "EEEE d MMM", { locale: es })
    const text = `¿Te apuntas? ${selectedCourt.name} · ${dateStr} ${selectedSlot} · ${formatEuro(total)} (IVA incl.)`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer")
  }

  const copySummary = async () => {
    if (!selectedDate || !selectedSlot || total === null) return
    const dateStr = format(selectedDate, "EEEE d MMM", { locale: es })
    const text = `${selectedCourt.name} · ${dateStr} ${selectedSlot} · ${formatEuro(total)}`
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Resumen copiado")
    } catch {
      toast.error("No se pudo copiar")
    }
  }

  const policyDate = getCancellationPolicyUpdatedLabel()

  return (
    <aside aria-label="Resumen de reserva" className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 lg:sticky lg:top-24">
        <div className="mb-4 flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#f5f5f0]">Resumen</h3>
          <span className="rounded-full border border-[#3a7d44]/30 bg-[#3a7d44]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#3a7d44]">
            IVA incluido
          </span>
        </div>

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {liveMessage}
        </div>

        <div className="mb-6 space-y-3">
          <SummaryRow label="Pista" value={selectedCourt.name} hint={COURT_TYPE_LABEL[selectedCourt.type]} />
          <SummaryRow
            label="Fecha"
            value={selectedDate ? format(selectedDate, "d MMM yyyy", { locale: es }) : "—"}
          />
          <SummaryRow label="Hora" value={selectedSlot ? `${selectedSlot} (${duration} min)` : "—"} />
          {recurring && selectedSlot && <SummaryRow label="Semanas" value={`${recurringWeeks} repeticiones`} />}
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="font-bold text-[#f5f5f0]">Total estimado</span>
            <span className="font-black text-xl tabular-nums text-[#3a7d44]">
              {total !== null ? formatEuro(total) : "—"}
            </span>
          </div>
          <p className="text-[10px] leading-relaxed text-[#f5f5f0]/45">Pista completa (4 jugadores). Precio orientativo hasta confirmación en recepción o app.</p>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-md border border-white/10 bg-[#1a1a1a] px-2 py-1 text-[9px] font-semibold text-[#f5f5f0]/55">Pago seguro</span>
          <span className="rounded-md border border-white/10 bg-[#1a1a1a] px-2 py-1 text-[9px] font-semibold text-[#f5f5f0]/55">Sin comisiones web</span>
        </div>

        {graceActive && selectedSlot && graceRemain > 0 && (
          <div className="mb-4 rounded-xl border border-[#e8d44d]/30 bg-[#e8d44d]/10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Clock size={14} className="text-[#e8d44d]" aria-hidden />
              <span className="text-xs font-semibold tabular-nums text-[#e8d44d]">
                Bloqueo: {String(minutesRemain).padStart(2, "0")}:{String(secondsRemain).padStart(2, "0")}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/30" role="progressbar" aria-valuenow={graceRemain} aria-valuemin={0} aria-valuemax={300}>
              <div className="h-full rounded-full bg-[#e8d44d] transition-[width] duration-1000 ease-linear" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        <button
          type="button"
          disabled={!selectedDate || !selectedSlot || bookingLoading}
          onClick={onBook}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all",
            selectedDate && selectedSlot && !bookingLoading
              ? "bg-[#e8d44d] text-[#0a0a0a] hover:bg-[#f0dc55]"
              : "cursor-not-allowed bg-white/10 text-[#f5f5f0]/40"
          )}
        >
          {bookingLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a]" />
              Procesando…
            </span>
          ) : (
            <>
              <Check size={15} aria-hidden />
              Iniciar sesión para confirmar
            </>
          )}
        </button>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            disabled={!selectedDate || !selectedSlot}
            onClick={onShare}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all",
              selectedDate && selectedSlot
                ? "border-white/15 text-[#f5f5f0] hover:bg-white/5"
                : "cursor-not-allowed border-white/5 text-[#f5f5f0]/30"
            )}
          >
            <Share2 size={13} aria-hidden />
            Compartir
          </button>
          <button
            type="button"
            disabled={!selectedDate || !selectedSlot}
            onClick={shareWhatsApp}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all",
              selectedDate && selectedSlot
                ? "border-[#3a7d44]/40 text-[#3a7d44] hover:bg-[#3a7d44]/10"
                : "cursor-not-allowed border-white/5 text-[#f5f5f0]/30"
            )}
          >
            <MessageCircle size={13} aria-hidden />
            WhatsApp
          </button>
          <button
            type="button"
            disabled={!selectedDate || !selectedSlot}
            onClick={copySummary}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all",
              selectedDate && selectedSlot
                ? "border-white/15 text-[#f5f5f0] hover:bg-white/5"
                : "cursor-not-allowed border-white/5 text-[#f5f5f0]/30"
            )}
          >
            <Link2 size={13} aria-hidden />
            Copiar
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-xs text-[#f5f5f0]/55">
            <Info size={11} aria-hidden />
            Cancelación gratuita hasta 4 h antes.
          </p>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button type="button" className="text-left text-xs font-semibold text-[#3a7d44] underline underline-offset-2 hover:text-[#4a9d54]">
                Condiciones de cancelación
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/75" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-[301] w-[min(100vw-2rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl focus:outline-none">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <Dialog.Title className="font-display text-lg font-black text-[#f5f5f0]">Política de cancelación</Dialog.Title>
                  <Dialog.Close type="button" className="rounded-lg p-1 text-[#f5f5f0]/55 hover:bg-white/10 hover:text-[#f5f5f0]" aria-label="Cerrar">
                    <X size={18} aria-hidden />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="space-y-3 text-sm leading-relaxed text-[#f5f5f0]/65">
                  <p>
                    Cancelación gratuita hasta <strong className="text-[#f5f5f0]">4 horas antes</strong> del inicio. Fuera de plazo se factura el importe íntegro.
                  </p>
                  <p>Cambio de hora o pista sin coste con 4 h de margen y disponibilidad (confirmación recepción).</p>
                  <p className="text-xs text-[#f5f5f0]/50">Torneos y eventos especiales pueden tener condiciones distintas.</p>
                  <p className="text-[10px] text-[#f5f5f0]/40">Última actualización: {policyDate}</p>
                </Dialog.Description>
                <Dialog.Close asChild>
                  <button type="button" className="mt-6 w-full rounded-xl bg-[#3a7d44] py-3 text-sm font-bold text-white hover:bg-[#4a9d54]">
                    Entendido
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#f5f5f0]">
          <CreditCard size={14} className="text-[#3a7d44]" aria-hidden />
          Tarifas
        </h4>
        <div className="space-y-2 text-xs">
          {[
            { label: "Pista completa (4 jug.) · 1h30", price: "6,50 €/pers." },
            { label: "Pista completa (4 jug.) · 2h", price: "8,00 €/pers." },
            { label: "Pista individual · 1h", price: "5,50 €/pers." },
            { label: "Pista individual · 1h30", price: "6,50 €/pers." },
            { label: "Bono 50×10 (16:00–23:00)", price: "50 €" },
          ].map((t) => (
            <div key={t.label} className="flex justify-between gap-2 text-[#f5f5f0]/65">
              <span>{t.label}</span>
              <span className="shrink-0 font-semibold text-[#f5f5f0]">{t.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#f5f5f0]">
          <MapPin size={14} className="text-[#3a7d44]" aria-hidden />
          Ubicación
        </h4>
        <p className="text-xs leading-relaxed text-[#f5f5f0]/65">
          C/ Pino nº10, P.I. Arinaga
          <br />
          Agüimes, Las Palmas
          <br />
          Tel:{" "}
          <a href="tel:+34928753650" className="font-semibold text-[#3a7d44] hover:underline">
            928 753 650
          </a>
        </p>
      </div>
    </aside>
  )
}

function SummaryRow({ label, value, hint }: { label: string; value?: string; hint?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-sm text-[#f5f5f0]/55">{label}</span>
      <span className="text-right text-sm font-semibold text-[#f5f5f0]">
        {value ?? "—"}
        {hint && <span className="mt-0.5 block text-[10px] font-normal text-[#f5f5f0]/45">{hint}</span>}
      </span>
    </div>
  )
}
