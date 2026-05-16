"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  Clock,
  Share2,
  Download,
  Pencil,
  X as Cancel,
  Bell,
  BellOff,
  MapPin,
} from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { EmptyState } from "@/components/ui/EmptyState"
import { getAllReservas, type MergedReserva } from "@/lib/reservasMerge"
import { setReservaOverride } from "@/lib/userActivity"

type Reserva = MergedReserva
type Status = Reserva["status"]

const STATUS_LABELS: Record<Status, string> = {
  upcoming: "Próximas",
  past: "Pasadas",
  cancelled: "Canceladas",
}

const COURT_TYPE_COLOR: Record<string, string> = {
  panoramica: "#3a7d44",
  cristal: "#e8d44d",
  central: "#9aa0a6",
}

export function ReservasTab() {
  const router = useRouter()
  const [filter, setFilter] = useState<Status>("upcoming")
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)
  const [items, setItems] = useState<Reserva[]>([])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setItems(getAllReservas()))
    return () => cancelAnimationFrame(raf)
  }, [])

  function editReserva(r: Reserva) {
    const params = new URLSearchParams({
      fecha: r.date,
      franja: r.time,
      pista: String(r.courtId),
      duracion: String(r.duration),
    })
    router.push(`/reservas?${params.toString()}`)
  }

  const filtered = items.filter((r) => r.status === filter)
  const counts: Record<Status, number> = {
    upcoming: items.filter((r) => r.status === "upcoming").length,
    past: items.filter((r) => r.status === "past").length,
    cancelled: items.filter((r) => r.status === "cancelled").length,
  }

  function toggleReminder(id: string) {
    const current = items.find((r) => r.id === id)
    if (!current) return
    const next = !current.reminder
    setReservaOverride(id, { reminder: next })
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, reminder: next } : r)))
    toast.success("Recordatorio actualizado")
  }

  function cancel(id: string) {
    setReservaOverride(id, { status: "cancelled" })
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r))
    )
    setConfirmCancelId(null)
    toast.success("Reserva cancelada", {
      description: "Se reembolsará el importe en el wallet en 24 horas.",
    })
  }

  function downloadIcs(r: Reserva) {
    const start = new Date(`${r.date}T${r.time}:00`)
    const end = new Date(start.getTime() + r.duration * 60_000)
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//PadelCastillo//ES",
      "BEGIN:VEVENT",
      `UID:${r.id}@padelcastillo`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:Pádel · ${r.courtName}`,
      `LOCATION:C/ Pino nº10, P.I. Arinaga, Agüimes`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")
    const blob = new Blob([ics], { type: "text/calendar" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `reserva-${r.id}.ics`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function share(r: Reserva) {
    const text = `Tengo pista reservada en Pádel Castillo: ${r.courtName} el ${format(parseISO(r.date), "EEE d MMM", { locale: es })} a las ${r.time}. ¿Te vienes?`
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> }
    if (nav.share) {
      nav.share({ title: "Reserva Pádel Castillo", text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text)
      toast.success("Resumen copiado", { description: "Pégalo en WhatsApp." })
    }
  }

  return (
    <div className="space-y-5">
      {/* Header + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[#f5f5f0] font-display font-black text-xl">Mis reservas</h2>
          <p className="text-[#f5f5f0]/55 text-xs">Tus pistas reservadas y el historial.</p>
        </div>
        <Link
          href="/reservas"
          className="inline-flex items-center gap-1.5 bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] text-xs font-black px-4 py-2.5 rounded-xl"
        >
          Reservar nueva pista
        </Link>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/10 -mx-1 px-1">
        {(["upcoming", "past", "cancelled"] as const).map((s) => {
          const active = filter === s
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              aria-pressed={active}
              className={`relative px-4 py-2.5 text-xs font-bold transition-colors ${
                active ? "text-[#3a7d44]" : "text-[#f5f5f0]/55 hover:text-[#f5f5f0]"
              }`}
            >
              {STATUS_LABELS[s]}
              <span
                className={`ml-1.5 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[9px] font-bold ${
                  active ? "bg-[#3a7d44]/25 text-[#3a7d44]" : "bg-white/10 text-[#f5f5f0]/55"
                }`}
              >
                {counts[s]}
              </span>
              {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3a7d44] rounded-full" />}
            </button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={
            filter === "upcoming" ? "Sin reservas próximas" : filter === "past" ? "Sin reservas pasadas" : "Sin reservas canceladas"
          }
          description={
            filter === "upcoming"
              ? "Aún no tienes pistas reservadas. Echa una ojeada al calendario."
              : "Aquí verás tu historial cuando lo tengas."
          }
          action={
            filter === "upcoming" ? (
              <Link
                href="/reservas"
                className="inline-flex bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
              >
                Reservar pista
              </Link>
            ) : null
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li key={r.id} className="bg-[#111111] border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Date block */}
                <div className="flex items-center gap-3 sm:gap-4 sm:w-48 shrink-0">
                  <div
                    className="rounded-xl flex flex-col items-center justify-center w-14 h-14 shrink-0"
                    style={{ background: `${COURT_TYPE_COLOR[r.courtType]}22`, border: `1px solid ${COURT_TYPE_COLOR[r.courtType]}55` }}
                  >
                    <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: COURT_TYPE_COLOR[r.courtType] }}>
                      {format(parseISO(r.date), "MMM", { locale: es })}
                    </span>
                    <span className="text-[#f5f5f0] font-display font-black text-lg leading-none tabular-nums">
                      {format(parseISO(r.date), "d")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#f5f5f0] font-bold text-sm capitalize">
                      {format(parseISO(r.date), "EEEE", { locale: es })}
                    </p>
                    <p className="text-[#f5f5f0]/65 text-xs flex items-center gap-1.5">
                      <Clock size={11} aria-hidden="true" />
                      {r.time} · {r.duration} min
                    </p>
                    {r.status === "upcoming" && (
                      <p className="text-[10px] text-[#3a7d44] mt-0.5">
                        {formatDistanceToNow(parseISO(`${r.date}T${r.time}:00`), { locale: es, addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Court + players */}
                <div className="flex-1 min-w-0">
                  <p className="text-[#f5f5f0] font-bold text-sm flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#3a7d44]" aria-hidden="true" />
                    {r.courtName}
                    <span
                      className="text-[9px] uppercase tracking-widest font-bold ml-1 px-1.5 py-0.5 rounded"
                      style={{
                        background: `${COURT_TYPE_COLOR[r.courtType]}22`,
                        color: COURT_TYPE_COLOR[r.courtType],
                      }}
                    >
                      {r.courtType}
                    </span>
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {r.players.map((p) => (
                      <span
                        key={p.initials}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold border-2 border-[#111111]"
                        style={{ background: p.color }}
                        title={p.name}
                        aria-label={p.name}
                      >
                        {p.initials}
                      </span>
                    ))}
                    {r.players.length < 4 && (
                      <span className="text-[10px] text-[#f5f5f0]/55 ml-2">
                        Faltan {4 - r.players.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price + actions */}
                <div className="flex sm:flex-col items-end gap-3 sm:gap-2 sm:w-32 shrink-0">
                  <p className="text-[#3a7d44] font-display font-black text-xl tabular-nums">
                    {(r.priceCents / 100).toFixed(2).replace(".", ",")} €
                  </p>
                </div>
              </div>

              {r.status === "upcoming" && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <IconBtn icon={Pencil} label="Editar" onClick={() => editReserva(r)} />
                  <IconBtn icon={Share2} label="Compartir" onClick={() => share(r)} />
                  <IconBtn icon={Download} label="Calendario" onClick={() => downloadIcs(r)} />
                  <IconBtn
                    icon={r.reminder ? BellOff : Bell}
                    label={r.reminder ? "Recordatorio activo" : "Activar recordatorio"}
                    active={r.reminder}
                    onClick={() => toggleReminder(r.id)}
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmCancelId(r.id)}
                    className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 px-3 py-1.5 rounded-lg"
                  >
                    <Cancel size={11} aria-hidden="true" />
                    Cancelar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirmCancelId !== null}
        title="Cancelar reserva"
        description="Si cancelas con más de 4h de antelación, te reembolsamos en el wallet. Pasado ese límite no hay reembolso."
        confirmLabel="Cancelar reserva"
        cancelLabel="Mantener"
        destructive
        onConfirm={() => confirmCancelId && cancel(confirmCancelId)}
        onCancel={() => setConfirmCancelId(null)}
      />
    </div>
  )
}

function IconBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${
        active
          ? "border-[#3a7d44]/50 bg-[#3a7d44]/10 text-[#3a7d44]"
          : "border-white/10 text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:border-white/25"
      }`}
    >
      <Icon size={11} aria-hidden="true" />
      {label}
    </button>
  )
}
