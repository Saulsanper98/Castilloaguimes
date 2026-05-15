"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Star, Link2 } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  startOfDay,
  getDay,
  addDays,
  addWeeks,
  parseISO,
  isValid,
} from "date-fns"
import { es } from "date-fns/locale"
import { COURTS, COURT_TYPE_LABEL, type CourtType } from "@/lib/courts"
import { CourtMap } from "@/components/reservas/CourtMap"
import { Confetti } from "@/components/effects/Confetti"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { BookingStepper } from "@/components/reservas/BookingStepper"
import { ReservasSummaryAside } from "@/components/reservas/ReservasSummaryAside"
import { ReservasMobileDock } from "@/components/reservas/ReservasMobileDock"
import { StepCard } from "@/components/reservas/StepCard"
import { DaypartFilter, type Daypart } from "@/components/reservas/DaypartFilter"
import { SlotGrid } from "@/components/reservas/SlotGrid"
import { CourtHeatmap } from "@/components/reservas/CourtHeatmap"
import { SmartSuggestions } from "@/components/reservas/SmartSuggestions"
import { SocialProof } from "@/components/reservas/SocialProof"
import { FloatingGraceTimer } from "@/components/reservas/FloatingGraceTimer"
import { BookingSuccessModal } from "@/components/reservas/BookingSuccessModal"
import { CourtTypeInfo } from "@/components/reservas/CourtTypeInfo"
import { PostBookExtras } from "@/components/reservas/PostBookExtras"
import { WaitlistCard } from "@/components/reservas/WaitlistCard"
import { InfoTooltip } from "@/components/ui/InfoTooltip"
import { loadProfile } from "@/lib/player"
import { getDayDemand, demandLevel } from "@/lib/demand"
import {
  BOOKING_MONTHS_AHEAD,
  BOOKING_PLAYERS,
  CANARY_TIMEZONE_NOTE,
  formatEuro,
  getAllowedDurations,
  getPistaTotalPrice,
  getSlotDescription,
  type BookingDuration,
} from "@/lib/booking"
import { cn } from "@/lib/utils"

// Slots cada 30 min (igual que la web original: 8:00, 8:30, 9:00, …)
// desde 08:00 hasta 22:30 inclusive.
const TIME_SLOTS = (() => {
  const out: string[] = []
  for (let h = 8; h <= 22; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`)
    out.push(`${String(h).padStart(2, "0")}:30`)
  }
  return out
})()

const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"]

const LS_LAST = "padel-castillo-last-reserva"
const LS_FAV = "padel-castillo-favorite-court"

type LastPayload = {
  fecha: string
  franja: string
  pista: number
  duracion: BookingDuration
}

function nextSaturday(from: Date) {
  const d = startOfDay(from)
  const wd = getDay(d)
  if (wd === 6) return d
  const daysUntil = (6 - wd + 7) % 7
  return addDays(d, daysUntil)
}

export default function ReservasClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlInitDone = useRef(false)
  const skipFirstUrlSync = useRef(true)

  const today = startOfDay(new Date())
  const [currentMonth, setCurrentMonth] = useState(today)
  // Pre-seleccionar hoy para que el usuario vea slots desde el primer momento
  const [selectedDate, setSelectedDate] = useState<Date | null>(today)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedCourtId, setSelectedCourtId] = useState(1)
  const [duration, setDuration] = useState<BookingDuration>(90)
  const [typeFilter, setTypeFilter] = useState<CourtType | "all">("all")
  const [recurring, setRecurring] = useState(false)
  const [recurringWeeks, setRecurringWeeks] = useState(4)
  const [graceUntil, setGraceUntil] = useState<number | null>(null)
  const [graceRemain, setGraceRemain] = useState(0)
  const [confettiTick, setConfettiTick] = useState(0)
  const [mapTouched, setMapTouched] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [online, setOnline] = useState(true)
  const [lastHint, setLastHint] = useState<LastPayload | null>(null)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)
  const [daypart, setDaypart] = useState<Daypart>("all")
  const [slotView, setSlotView] = useState<"grid" | "heatmap">("grid")
  const [successOpen, setSuccessOpen] = useState(false)
  const [userName, setUserName] = useState<string | undefined>(undefined)
  const [walletCents, setWalletCents] = useState(0)
  const [waitlistSlot, setWaitlistSlot] = useState<string | null>(null)
  const calRef = useRef<HTMLDivElement>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = (getDay(monthStart) + 6) % 7
  const maxCalendarMonth = startOfMonth(addMonths(today, BOOKING_MONTHS_AHEAD))
  const canGoNextMonth = startOfMonth(addMonths(currentMonth, 1)) <= maxCalendarMonth

  const selectedCourt = COURTS.find((c) => c.id === selectedCourtId) ?? COURTS[0]
  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
  const price =
    selectedDate && selectedSlot ? getPistaTotalPrice(duration) : null

  const allowedDurations = useMemo(
    () => (selectedDate ? getAllowedDurations(selectedDate) : ([60, 90, 120] as BookingDuration[])),
    [selectedDate]
  )

  const liveMessage = useMemo(() => {
    if (!selectedDate || !selectedSlot || price === null) return "Selecciona fecha y franja."
    return `Total estimado ${formatEuro(price)}, ${selectedCourt.name}, ${format(selectedDate, "d MMMM", { locale: es })} a las ${selectedSlot}.`
  }, [selectedDate, selectedSlot, price, selectedCourt.name])

  const recurringDatesPreview = useMemo(() => {
    if (!selectedDate || !selectedSlot || !recurring) return []
    return Array.from({ length: recurringWeeks }, (_, i) => addWeeks(selectedDate, i))
  }, [selectedDate, selectedSlot, recurring, recurringWeeks])

  useEffect(() => {
    function up() {
      setOnline(typeof navigator !== "undefined" && navigator.onLine)
    }
    up()
    window.addEventListener("online", up)
    window.addEventListener("offline", up)
    return () => {
      window.removeEventListener("online", up)
      window.removeEventListener("offline", up)
    }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const fav = localStorage.getItem(LS_FAV)
        if (fav) {
          const n = parseInt(fav, 10)
          if (n >= 1 && n <= 14) {
            setFavoriteId(n)
            setSelectedCourtId(n)
          }
        }
        const raw = localStorage.getItem(LS_LAST)
        if (raw) {
          const j = JSON.parse(raw) as LastPayload
          if (j.fecha && j.franja && j.pista && j.duracion) setLastHint(j)
        }
        const profile = loadProfile()
        if (profile.name && profile.name !== "Invitado") setUserName(profile.name)
        setWalletCents(profile.walletCents || 0)
      } catch {
        /* ignore */
      }
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (urlInitDone.current) return
    urlInitDone.current = true
    queueMicrotask(() => {
      const fecha = searchParams.get("fecha")
      const franja = searchParams.get("franja")
      const pista = searchParams.get("pista")
      const dur = searchParams.get("duracion")
      if (fecha) {
        const d = parseISO(fecha)
        if (isValid(d) && !isBefore(startOfDay(d), today)) setSelectedDate(startOfDay(d))
      }
      if (franja && TIME_SLOTS.includes(franja)) setSelectedSlot(franja)
      if (pista) {
        const n = parseInt(pista, 10)
        if (n >= 1 && n <= 14) setSelectedCourtId(n)
      }
      if (dur === "60" || dur === "90" || dur === "120") setDuration(parseInt(dur, 10) as BookingDuration)
      if (fecha && franja) setMapTouched(true)
    })
  }, [searchParams, today])

  const syncUrl = useCallback(() => {
    const p = new URLSearchParams()
    if (selectedDate) p.set("fecha", format(selectedDate, "yyyy-MM-dd"))
    if (selectedSlot) p.set("franja", selectedSlot)
    p.set("pista", String(selectedCourtId))
    p.set("duracion", String(duration))
    router.replace(`${pathname}?${p.toString()}`, { scroll: false })
  }, [pathname, router, selectedDate, selectedSlot, selectedCourtId, duration])

  useEffect(() => {
    if (skipFirstUrlSync.current) {
      skipFirstUrlSync.current = false
      return
    }
    syncUrl()
  }, [syncUrl])

  useEffect(() => {
    if (!selectedDate) return
    const boot = window.setTimeout(() => setSlotsLoading(true), 0)
    const done = window.setTimeout(() => setSlotsLoading(false), 160)
    return () => {
      window.clearTimeout(boot)
      window.clearTimeout(done)
    }
  }, [selectedDate, duration, selectedCourtId])

  useEffect(() => {
    if (!selectedDate) return
    queueMicrotask(() => {
      setDuration((prev) => (allowedDurations.includes(prev) ? prev : allowedDurations[0] ?? 90))
    })
  }, [selectedDate, allowedDurations])

  function clearSlotSelection() {
    setSelectedSlot(null)
    setGraceUntil(null)
  }

  function pickSlot(slot: string) {
    setSelectedSlot(slot)
    queueMicrotask(() => setGraceUntil(Date.now() + 5 * 60 * 1000))
  }

  function selectCourt(id: number, slot: string | null) {
    setSelectedCourtId(id)
    setMapTouched(true)
    if (slot) queueMicrotask(() => setGraceUntil(Date.now() + 5 * 60 * 1000))
  }

  useEffect(() => {
    if (!graceUntil) return
    const id = window.setInterval(() => {
      const remain = Math.max(0, Math.floor((graceUntil - Date.now()) / 1000))
      setGraceRemain(remain)
      if (remain <= 0) {
        window.clearInterval(id)
        setSelectedSlot(null)
        setGraceUntil(null)
        toast.message("Tiempo de bloqueo agotado", { description: "Vuelve a elegir la franja." })
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [graceUntil])

  function persistLast() {
    if (!selectedDate || !selectedSlot) return
    const payload: LastPayload = {
      fecha: format(selectedDate, "yyyy-MM-dd"),
      franja: selectedSlot,
      pista: selectedCourtId,
      duracion: duration,
    }
    try {
      localStorage.setItem(LS_LAST, JSON.stringify(payload))
    } catch {
      /* ignore */
    }
  }

  function applyLast() {
    if (!lastHint) return
    const d = parseISO(lastHint.fecha)
    if (!isValid(d) || isBefore(startOfDay(d), today)) {
      toast.error("La última reserva ya no está disponible")
      return
    }
    setSelectedDate(startOfDay(d))
    setSelectedSlot(lastHint.franja)
    setSelectedCourtId(lastHint.pista)
    setDuration(lastHint.duracion)
    setMapTouched(true)
    setCurrentMonth(startOfMonth(startOfDay(d)))
    toast.success("Datos cargados", { description: "Revisa la franja y confirma." })
  }

  function toggleFavorite() {
    const next = favoriteId === selectedCourtId ? null : selectedCourtId
    setFavoriteId(next)
    try {
      if (next == null) localStorage.removeItem(LS_FAV)
      else localStorage.setItem(LS_FAV, String(next))
      toast.message(next ? "Pista favorita guardada" : "Favorita quitada")
    } catch {
      /* ignore */
    }
  }

  async function handleBook() {
    if (!selectedDate || !selectedSlot) return
    setBookingLoading(true)
    persistLast()
    await new Promise((r) => window.setTimeout(r, 450))
    setBookingLoading(false)
    setConfettiTick((c) => c + 1)
    setSuccessOpen(true)
  }

  async function handleBookAtClub() {
    if (!selectedDate || !selectedSlot) return
    setBookingLoading(true)
    persistLast()
    await new Promise((r) => window.setTimeout(r, 450))
    setBookingLoading(false)
    toast.success("Reserva pre-bloqueada", {
      description: "Pasa por recepción a confirmar y pagar. Tienes 24 h.",
      duration: 6000,
    })
    setConfettiTick((c) => c + 1)
    setSuccessOpen(true)
  }

  function handleCopyLink() {
    if (typeof window === "undefined") return
    const url = window.location.href
    void navigator.clipboard?.writeText(url)
    toast.success("Enlace copiado", { description: "Compártelo con tus compañeros." })
  }

  function handleDownloadIcs() {
    if (!selectedDate || !selectedSlot) return
    const [h, m] = selectedSlot.split(":").map((x) => parseInt(x, 10))
    const start = new Date(selectedDate)
    start.setHours(h, m, 0, 0)
    const end = new Date(start.getTime() + duration * 60_000)
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//PadelCastillo//ES",
      "BEGIN:VEVENT",
      `UID:res-${Date.now()}@padelcastillo`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:Pádel · ${selectedCourt.name}`,
      `LOCATION:C/ Pino nº10, P.I. Arinaga, Agüimes`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")
    const blob = new Blob([ics], { type: "text/calendar" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `reserva-${format(selectedDate, "yyyy-MM-dd")}-${selectedSlot.replace(":", "")}.ics`
    a.click()
    URL.revokeObjectURL(a.href)
    toast.success("Añadido al calendario")
  }

  function handleShare() {
    if (!selectedDate || !selectedSlot || price === null) return
    const dateStr = format(selectedDate, "EEEE d MMM", { locale: es })
    const text = `¿Te apuntas a jugar pádel? ${selectedCourt.name} · ${dateStr} a las ${selectedSlot} · ${price} € total (${(price / BOOKING_PLAYERS).toFixed(2).replace(".", ",")} €/pers., IVA incl.)`
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> }
    if (nav.share) {
      nav.share({ title: "Pádel Castillo de Agüimes", text }).catch(() => {})
    } else {
      void navigator.clipboard?.writeText(text)
      toast.success("Texto copiado", { description: "Pégalo en WhatsApp o Telegram." })
    }
  }

  function onCalKeyDown(e: React.KeyboardEvent) {
    if (!selectedDate) return
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      const next = addDays(selectedDate, e.key === "ArrowRight" ? 1 : -1)
      if (isBefore(next, today)) return
      if (next > endOfMonth(addMonths(today, BOOKING_MONTHS_AHEAD))) return
      setSelectedDate(next)
      setCurrentMonth(startOfMonth(next))
      clearSlotSelection()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-36 lg:pb-10">
      {!online && (
        <div className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center text-xs font-semibold text-amber-200">
          Sin conexión: la disponibilidad puede no estar actualizada. Reintenta cuando vuelvas a tener red.
        </div>
      )}

      <div className="border-b border-white/10 bg-gradient-to-b from-[#111111] to-[#0d0d0d] pt-4">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
          <div className="mb-3">
            <Breadcrumbs />
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1
              className="font-display font-black tracking-tight text-[#f5f5f0]"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", letterSpacing: "-0.02em" }}
            >
              Reservar <span className="text-[#3a7d44]">pista</span>
            </h1>
            <p className="text-[11px] text-[#f5f5f0]/55 flex items-center gap-1.5">
              Bloqueo 5 min al elegir hueco
              <InfoTooltip text={CANARY_TIMEZONE_NOTE} />
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
          {lastHint ? (
            <button
              type="button"
              onClick={applyLast}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#3a7d44]/30 bg-[#3a7d44]/10 px-3 py-1.5 text-[11px] font-bold text-[#3a7d44] hover:bg-[#3a7d44]/15"
            >
              <Star size={11} aria-hidden="true" />
              Repetir mi última reserva
            </button>
          ) : <span />}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-[11px] font-bold text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:border-white/25 transition-colors"
          >
            <Link2 size={11} aria-hidden="true" />
            Copiar enlace
          </button>
        </div>

        <BookingStepper
          hasDate={!!selectedDate}
          hasSlot={!!selectedSlot}
          mapTouched={mapTouched}
          onJumpToStep={(s) => {
            if (s === 1) {
              clearSlotSelection()
              setMapTouched(false)
            }
            if (s === 2) setMapTouched(false)
          }}
        />

        {!selectedDate && (
          <div className="mb-8 rounded-2xl border border-dashed border-white/15 bg-[#111111]/60 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-[#f5f5f0]">Empieza por el calendario</p>
            <p className="mt-2 text-xs text-[#f5f5f0]/50">Selecciona un día disponible para ver franjas y precios.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <StepCard step={1} eyebrow="Fecha" title="¿Cuándo quieres jugar?" hint="Toca un día. Los domingos solo turno de 1h 30.">
              <div className="mb-3 flex flex-wrap gap-2">
                {[
                  { label: "Hoy", get: () => today },
                  { label: "Mañana", get: () => addDays(today, 1) },
                  { label: "Próx. sábado", get: () => nextSaturday(today) },
                  { label: "Próx. domingo", get: () => addDays(nextSaturday(today), 1) },
                ].map((quick) => (
                  <button
                    key={quick.label}
                    type="button"
                    className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#f5f5f0]/80 hover:border-[#3a7d44]/50 hover:text-[#f5f5f0] transition-colors"
                    onClick={() => {
                      const d = quick.get()
                      setSelectedDate(d)
                      setCurrentMonth(startOfMonth(d))
                      clearSlotSelection()
                    }}
                  >
                    {quick.label}
                  </button>
                ))}
              </div>

              <div
                ref={calRef}
                tabIndex={0}
                role="application"
                aria-label="Calendario de reservas. Usa flechas izquierda y derecha para cambiar el día."
                onKeyDown={onCalKeyDown}
                className="rounded-2xl border border-white/10 bg-[#111111] p-5 outline-none focus-visible:ring-2 focus-visible:ring-[#3a7d44]/50 sm:p-6"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="capitalize font-bold text-[#f5f5f0]">{format(currentMonth, "MMMM yyyy", { locale: es })}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentMonth(today)
                        setSelectedDate(today)
                        clearSlotSelection()
                      }}
                      className="rounded-lg border border-[#3a7d44]/40 px-3 py-1.5 text-xs font-bold text-[#3a7d44] hover:bg-[#3a7d44]/10"
                    >
                      Ir a hoy
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        aria-label="Mes anterior"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#f5f5f0]/65 transition-colors hover:bg-white/10"
                      >
                        <ChevronLeft size={16} aria-hidden />
                      </button>
                      <button
                        type="button"
                        disabled={!canGoNextMonth}
                        onClick={() => canGoNextMonth && setCurrentMonth(addMonths(currentMonth, 1))}
                        aria-label="Mes siguiente"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#f5f5f0]/65 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <ChevronRight size={16} aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-2 grid grid-cols-7 gap-1">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="py-1 text-center text-xs font-semibold text-[#f5f5f0]/55">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startPad }).map((_, i) => (
                    <div key={`pad-${i}`} />
                  ))}
                  {days.map((day) => {
                    const isPast = isBefore(day, today)
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
                    const isToday = isSameDay(day, today)
                    const demand = !isPast ? demandLevel(getDayDemand(day)) : null
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => {
                          if (!isPast) {
                            setSelectedDate(day)
                            clearSlotSelection()
                          }
                        }}
                        disabled={isPast}
                        aria-label={`${format(day, "d 'de' MMMM 'de' yyyy", { locale: es })}${isPast ? " no disponible" : ""}${isToday ? " hoy" : ""}${demand === "high" ? " alta demanda" : demand === "low" ? " mucha disponibilidad" : ""}`}
                        aria-pressed={isSelected}
                        className={cn(
                          "relative h-11 rounded-lg text-sm font-medium transition-all",
                          isSelected
                            ? "bg-[#3a7d44] text-white"
                            : isPast
                              ? "cursor-not-allowed text-[#f5f5f0]/35"
                              : isToday
                                ? "border border-[#3a7d44]/60 text-[#3a7d44] hover:bg-[#3a7d44]/20"
                                : "text-[#f5f5f0]/75 hover:bg-white/10 hover:text-[#f5f5f0]"
                        )}
                      >
                        {format(day, "d")}
                        {demand && !isSelected && (
                          <span
                            className="absolute bottom-1 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full"
                            aria-hidden="true"
                            style={{
                              background:
                                demand === "high"
                                  ? "#ef4444"
                                  : demand === "med"
                                    ? "#e8d44d"
                                    : "#3a7d44",
                              opacity: 0.7,
                            }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
                {/* Demand legend */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-[#f5f5f0]/55">
                  <span className="font-bold uppercase tracking-widest text-[#f5f5f0]/45">Demanda:</span>
                  <span className="flex items-center gap-1">
                    <span className="block w-3 h-1 rounded-full bg-[#3a7d44]" aria-hidden="true" /> Baja
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="block w-3 h-1 rounded-full bg-[#e8d44d]" aria-hidden="true" /> Media
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="block w-3 h-1 rounded-full bg-red-500" aria-hidden="true" /> Alta
                  </span>
                </div>
              </div>
            </StepCard>

            {selectedDate && dateKey && (
              <SmartSuggestions
                dateKey={dateKey}
                slots={TIME_SLOTS}
                duration={duration}
                habitualSlot={lastHint?.franja ?? null}
                habitualCourtId={favoriteId ?? lastHint?.pista ?? null}
                onApply={(s) => {
                  setSelectedSlot(s.slot)
                  setSelectedCourtId(s.courtId)
                  setMapTouched(true)
                  pickSlot(s.slot)
                }}
              />
            )}

            {selectedDate && (
              <StepCard
                step={2}
                eyebrow={format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                title="¿A qué hora?"
                hint="Elige la franja, después la hora exacta."
              >
                {/* Daypart big buttons */}
                <DaypartFilter value={daypart} onChange={setDaypart} />

                {/* View toggle: grid vs heatmap */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/45">
                    Vista
                  </p>
                  <div
                    className="inline-flex rounded-lg border border-white/10 bg-[#1a1a1a] p-0.5 text-[10px] font-bold"
                    role="radiogroup"
                    aria-label="Vista de horarios"
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={slotView === "grid"}
                      onClick={() => setSlotView("grid")}
                      className={cn(
                        "px-3 py-1.5 rounded-md transition-colors",
                        slotView === "grid"
                          ? "bg-[#3a7d44] text-white"
                          : "text-[#f5f5f0]/65 hover:text-[#f5f5f0]"
                      )}
                    >
                      Por franja
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={slotView === "heatmap"}
                      onClick={() => setSlotView("heatmap")}
                      className={cn(
                        "px-3 py-1.5 rounded-md transition-colors",
                        slotView === "heatmap"
                          ? "bg-[#3a7d44] text-white"
                          : "text-[#f5f5f0]/65 hover:text-[#f5f5f0]"
                      )}
                    >
                      Mapa de calor
                    </button>
                  </div>
                </div>

                {/* Duration toggle */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div
                    className="inline-flex rounded-xl border border-white/10 bg-[#1a1a1a] p-0.5 text-xs font-bold"
                    role="radiogroup"
                    aria-label="Duración de la reserva"
                  >
                    {([60, 90, 120] as BookingDuration[]).map((d) => {
                      const allowed = allowedDurations.includes(d)
                      return (
                        <button
                          key={d}
                          type="button"
                          role="radio"
                          aria-checked={duration === d}
                          disabled={!allowed}
                          title={!allowed ? "No disponible este día" : undefined}
                          onClick={() => allowed && setDuration(d)}
                          className={cn(
                            "rounded-lg px-3 py-1.5 transition-all",
                            duration === d && "bg-[#3a7d44] text-white",
                            duration !== d && allowed && "text-[#f5f5f0]/65 hover:text-[#f5f5f0]",
                            !allowed && "cursor-not-allowed text-[#f5f5f0]/25"
                          )}
                        >
                          {d === 60 ? "1 h" : d === 90 ? "1 h 30" : "2 h"}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#f5f5f0]/45">
                    <span className="rounded border border-white/15 px-1.5 py-0.5 text-[#f5f5f0]/65">Libre</span>
                    <span className="rounded border border-[#e8d44d]/35 px-1.5 py-0.5 text-[#e8d44d]">Pocas</span>
                    <span className="rounded border border-red-500/35 px-1.5 py-0.5 text-red-400/90">Completo</span>
                  </div>
                </div>

                {/* Dense slot grid or heatmap */}
                <div className={cn("relative mt-5 min-h-[160px]", slotsLoading && "opacity-40")}>
                  {slotsLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#0a0a0a]/40 backdrop-blur-[2px]">
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#3a7d44]/30 border-t-[#3a7d44]" aria-hidden />
                    </div>
                  )}
                  {slotView === "grid" ? (
                    <SlotGrid
                      slots={TIME_SLOTS}
                      selectedSlot={selectedSlot}
                      selectedCourtId={selectedCourtId}
                      dateKey={dateKey ?? ""}
                      duration={duration}
                      daypart={daypart}
                      onPick={(s) => {
                        setWaitlistSlot(null)
                        pickSlot(s)
                      }}
                      onFullClick={(s) => setWaitlistSlot(s)}
                    />
                  ) : (
                    <CourtHeatmap
                      dateKey={dateKey ?? ""}
                      slots={TIME_SLOTS}
                      selectedSlot={selectedSlot}
                      selectedCourtId={selectedCourtId}
                      onPick={(courtId, slot) => {
                        setSelectedCourtId(courtId)
                        setMapTouched(true)
                        pickSlot(slot)
                      }}
                    />
                  )}
                </div>

                {selectedSlot && (
                  <p className="mt-4 text-xs text-[#f5f5f0]/55">
                    {getSlotDescription(selectedDate, selectedSlot)} · Total <span className="text-[#3a7d44] font-bold">{price} €</span> / pista ({BOOKING_PLAYERS} jugadores, IVA incl.).
                  </p>
                )}

                <WaitlistCard
                  visible={!!waitlistSlot}
                  slot={waitlistSlot ?? ""}
                  courtName={selectedCourt.name}
                />
              </StepCard>
            )}

            {selectedDate && selectedSlot && price !== null && (
              <PostBookExtras
                slot={selectedSlot}
                walletCents={walletCents}
                totalEur={recurring ? price * recurringWeeks : price}
              />
            )}

            {selectedDate && selectedSlot && (
              <StepCard
                step={3}
                eyebrow="Pista (opcional)"
                title={
                  <span className="flex flex-wrap items-center gap-2">
                    <span>Elige tu pista</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/55 rounded-full border border-white/10 px-2 py-0.5">
                      Opcional · te asignamos una si no eliges
                    </span>
                  </span>
                }
                hint={`Por defecto: ${selectedCourt.name} (${COURT_TYPE_LABEL[selectedCourt.type]})`}
                collapsible
                defaultOpen={false}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {(["all", "panoramica", "cristal", "central"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTypeFilter(t)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                          typeFilter === t
                            ? "border-[#3a7d44] bg-[#3a7d44] text-white"
                            : "border-white/10 bg-[#1a1a1a] text-[#f5f5f0]/65 hover:border-white/30"
                        )}
                      >
                        {t === "all" ? "Todas" : COURT_TYPE_LABEL[t]}
                      </button>
                    ))}
                    <CourtTypeInfo />
                  </div>
                  <button
                    type="button"
                    onClick={toggleFavorite}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
                      favoriteId === selectedCourtId
                        ? "border-[#e8d44d]/50 bg-[#e8d44d]/10 text-[#e8d44d]"
                        : "border-white/10 text-[#f5f5f0]/55 hover:border-white/25"
                    )}
                  >
                    <Star size={14} className={favoriteId === selectedCourtId ? "fill-[#e8d44d]" : ""} aria-hidden="true" />
                    {favoriteId === selectedCourtId ? "Tu favorita" : "Marcar favorita"}
                  </button>
                </div>
                <CourtMap
                  selectedCourtId={selectedCourtId}
                  onSelect={(c) => selectCourt(c.id, selectedSlot)}
                  typeFilter={typeFilter}
                  dateKey={dateKey}
                  slot={selectedSlot}
                  onLegendTypeSelect={(t) => setTypeFilter(t)}
                />
              </StepCard>
            )}

            {selectedDate && selectedSlot && (
              <StepCard
                eyebrow="Extras"
                title="Repetir cada semana"
                hint="Útil para entrenos fijos. Total orientativo."
                collapsible
                defaultOpen={recurring}
              >
                <label htmlFor="recurring-toggle" className="flex cursor-pointer items-start gap-3">
                  <input
                    id="recurring-toggle"
                    type="checkbox"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#3a7d44]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#f5f5f0]">Activar serie semanal</span>
                    <span className="mt-1 block text-xs text-[#f5f5f0]/55">
                      Bloquea el mismo horario las próximas semanas.
                    </span>
                  </span>
                </label>
                {recurring && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <label htmlFor="rec-weeks" className="mb-1.5 block text-xs text-[#f5f5f0]/65">
                      Semanas consecutivas
                    </label>
                    <input
                      id="rec-weeks"
                      type="number"
                      min={2}
                      max={12}
                      value={recurringWeeks}
                      onChange={(e) =>
                        setRecurringWeeks(Math.min(12, Math.max(2, parseInt(e.target.value, 10) || 2)))
                      }
                      className="w-24 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-sm text-[#f5f5f0] outline-none focus:border-[#3a7d44]/60"
                    />
                    <p className="mt-2 text-xs text-[#f5f5f0]/55">
                      Total orientativo:{" "}
                      <span className="font-bold text-[#3a7d44]">
                        {price != null ? price * recurringWeeks : "—"} €
                      </span>
                    </p>
                    <ul className="mt-3 max-h-32 space-y-1 overflow-y-auto text-[10px] text-[#f5f5f0]/50">
                      {recurringDatesPreview.map((d, i) => (
                        <li key={d.toISOString()}>
                          Sesión {i + 1}: {format(d, "EEE d MMM", { locale: es })} · {selectedSlot}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </StepCard>
            )}
          </div>

          <div className="hidden lg:block">
            <ReservasSummaryAside
              selectedCourt={selectedCourt}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              duration={duration}
              recurring={recurring}
              recurringWeeks={recurringWeeks}
              price={price}
              graceRemain={graceRemain}
              graceActive={!!graceUntil && !!selectedSlot}
              bookingLoading={bookingLoading}
              liveMessage={liveMessage}
              onBook={handleBook}
              onBookAtClub={handleBookAtClub}
              onShare={handleShare}
            />
          </div>
        </div>
      </div>

      <ReservasMobileDock
        visible={!!selectedDate && !!selectedSlot && price !== null}
        selectedCourt={selectedCourt}
        selectedDate={selectedDate!}
        selectedSlot={selectedSlot!}
        duration={duration}
        recurring={recurring}
        recurringWeeks={recurringWeeks}
        total={recurring ? price! * recurringWeeks : price!}
        graceRemain={graceRemain}
        graceActive={!!graceUntil && !!selectedSlot}
        onBook={handleBook}
        onBookAtClub={handleBookAtClub}
        bookingLoading={bookingLoading}
      />
      <Confetti trigger={confettiTick} />
      <SocialProof />
      <FloatingGraceTimer
        active={!!graceUntil && !!selectedSlot}
        remainSeconds={graceRemain}
      />
      <BookingSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        name={userName}
        courtName={selectedCourt.name}
        date={selectedDate}
        slot={selectedSlot}
        duration={duration}
        total={recurring && price != null ? price * recurringWeeks : price}
        onShare={handleShare}
        onDownloadIcs={handleDownloadIcs}
      />
    </div>
  )
}
