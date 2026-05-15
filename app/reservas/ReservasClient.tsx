"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Clock, Star } from "lucide-react"
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
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { BookingStepper } from "@/components/reservas/BookingStepper"
import { ReservasSummaryAside } from "@/components/reservas/ReservasSummaryAside"
import { ReservasMobileDock } from "@/components/reservas/ReservasMobileDock"
import { SectionEyebrow } from "@/components/brand/SectionEyebrow"
import {
  BOOKING_MONTHS_AHEAD,
  BOOKING_PLAYERS,
  CANARY_TIMEZONE_NOTE,
  formatEuro,
  getAllowedDurations,
  getPistaTotalPrice,
  getSlotDescription,
  slotEndLabel,
  type BookingDuration,
} from "@/lib/booking"
import { getSlotMockStatus } from "@/lib/slotMock"
import { cn } from "@/lib/utils"

const TIME_SLOTS = [
  "08:00",
  "09:30",
  "11:00",
  "12:30",
  "14:00",
  "15:30",
  "17:00",
  "18:30",
  "20:00",
  "21:30",
]

const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"]

const LS_LAST = "padel-castillo-last-reserva"
const LS_FAV = "padel-castillo-favorite-court"

type LastPayload = {
  fecha: string
  franja: string
  pista: number
  duracion: BookingDuration
}

function slotHour(slot: string) {
  return parseInt(slot.split(":")[0]!, 10)
}

function groupSlots(slot: string) {
  const h = slotHour(slot)
  if (h < 14) return "morning" as const
  if (h < 18) return "afternoon" as const
  return "evening" as const
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedCourtId, setSelectedCourtId] = useState(1)
  const [duration, setDuration] = useState<BookingDuration>(90)
  const [typeFilter, setTypeFilter] = useState<CourtType | "all">("all")
  const [recurring, setRecurring] = useState(false)
  const [recurringWeeks, setRecurringWeeks] = useState(4)
  const [graceUntil, setGraceUntil] = useState<number | null>(null)
  const [graceRemain, setGraceRemain] = useState(0)
  const [mapTouched, setMapTouched] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [online, setOnline] = useState(true)
  const [lastHint, setLastHint] = useState<LastPayload | null>(null)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)
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
    toast.success("Hueco reservado temporalmente", { description: "Inicia sesión en la app para pagar y confirmar." })
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

  const morning = TIME_SLOTS.filter((s) => groupSlots(s) === "morning")
  const afternoon = TIME_SLOTS.filter((s) => groupSlots(s) === "afternoon")
  const evening = TIME_SLOTS.filter((s) => groupSlots(s) === "evening")

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-36 lg:pb-10">
      {!online && (
        <div className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center text-xs font-semibold text-amber-200">
          Sin conexión: la disponibilidad puede no estar actualizada. Reintenta cuando vuelvas a tener red.
        </div>
      )}

      <div className="border-b border-white/10 bg-[#111111] pt-6">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-4">
            <Breadcrumbs />
          </div>
          <SectionEyebrow className="mb-2">Complejo pádel</SectionEyebrow>
          <h1
            className="font-display font-black tracking-tight text-[#f5f5f0]"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            Reservar <span className="text-[#3a7d44]">pista</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#f5f5f0]/60 sm:text-base">
            Elige fecha y franja; después ajusta la pista en el plano. El hueco queda bloqueado 5 minutos.
          </p>
          <p className="mt-2 text-[11px] text-[#f5f5f0]/45">{CANARY_TIMEZONE_NOTE}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {lastHint && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#3a7d44]/30 bg-[#3a7d44]/10 px-4 py-3">
            <p className="text-sm text-[#f5f5f0]/85">¿Repetir tu última reserva guardada en este dispositivo?</p>
            <button
              type="button"
              onClick={applyLast}
              className="rounded-lg bg-[#3a7d44] px-4 py-2 text-xs font-bold text-white hover:bg-[#4a9d54]"
            >
              Misma configuración
            </button>
          </div>
        )}

        <BookingStepper hasDate={!!selectedDate} hasSlot={!!selectedSlot} mapTouched={mapTouched} />

        {!selectedDate && (
          <div className="mb-8 rounded-2xl border border-dashed border-white/15 bg-[#111111]/60 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-[#f5f5f0]">Empieza por el calendario</p>
            <p className="mt-2 text-xs text-[#f5f5f0]/50">Selecciona un día disponible para ver franjas y precios.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section aria-labelledby="fecha-heading">
              <SectionEyebrow className="mb-3" color="ball">
                Paso 1 · Fecha
              </SectionEyebrow>
              <h2 id="fecha-heading" className="sr-only">
                Calendario
              </h2>
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#f5f5f0]/80 hover:border-[#3a7d44]/50"
                  onClick={() => {
                    setSelectedDate(today)
                    setCurrentMonth(startOfMonth(today))
                    clearSlotSelection()
                  }}
                >
                  Hoy
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#f5f5f0]/80 hover:border-[#3a7d44]/50"
                  onClick={() => {
                    const d = addDays(today, 1)
                    setSelectedDate(d)
                    setCurrentMonth(startOfMonth(d))
                    clearSlotSelection()
                  }}
                >
                  Mañana
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#f5f5f0]/80 hover:border-[#3a7d44]/50"
                  onClick={() => {
                    const d = nextSaturday(today)
                    setSelectedDate(d)
                    setCurrentMonth(startOfMonth(d))
                    clearSlotSelection()
                  }}
                >
                  Próximo sábado
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#f5f5f0]/80 hover:border-[#3a7d44]/50"
                  onClick={() => {
                    const d = addDays(nextSaturday(today), 1)
                    setSelectedDate(d)
                    setCurrentMonth(startOfMonth(d))
                    clearSlotSelection()
                  }}
                >
                  Próximo domingo
                </button>
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
                    const sunday = getDay(day) === 0
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
                        aria-label={`${format(day, "d 'de' MMMM 'de' yyyy", { locale: es })}${isPast ? " no disponible" : ""}${isToday ? " hoy" : ""}`}
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
                        {sunday && !isPast && (
                          <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#e8d44d]/80" aria-hidden />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            {selectedDate && (
              <section aria-labelledby="franja-heading">
                <SectionEyebrow className="mb-3" color="ball">
                  Paso 2 · Franja y duración
                </SectionEyebrow>
                <h2 id="franja-heading" className="sr-only">
                  Horarios
                </h2>
                <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <h3 className="font-bold capitalize text-[#f5f5f0]">
                      {format(selectedDate, "EEEE d MMMM", { locale: es })}
                    </h3>
                    <div
                      className="inline-flex w-full max-w-md rounded-xl border border-white/10 bg-[#1a1a1a] p-0.5 text-xs font-bold sm:w-auto"
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
                              "flex-1 rounded-lg px-3 py-2 transition-all sm:flex-none",
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
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#f5f5f0]/45">
                      Disponibilidad orientativa
                    </span>
                    <span className="rounded border border-white/15 px-2 py-0.5 text-[10px] text-[#f5f5f0]/65">Libre</span>
                    <span className="rounded border border-[#e8d44d]/35 px-2 py-0.5 text-[10px] text-[#e8d44d]">Pocas</span>
                    <span className="rounded border border-red-500/35 px-2 py-0.5 text-[10px] text-red-400/90">Completo</span>
                  </div>

                  <div className={cn("relative min-h-[120px]", slotsLoading && "opacity-40")}>
                    {slotsLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#0a0a0a]/40 backdrop-blur-[2px]">
                        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#3a7d44]/30 border-t-[#3a7d44]" aria-hidden />
                      </div>
                    )}
                    {(["Mañana", "Tarde", "Noche"] as const).map((label, idx) => {
                      const group = idx === 0 ? morning : idx === 1 ? afternoon : evening
                      return (
                        <div key={label} className="mb-5 last:mb-0">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/40">{label}</p>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                            {group.map((slot) => {
                              const isSelected = selectedSlot === slot
                              const perPerson = duration === 60 ? 5.5 : duration === 90 ? 6.5 : 8
                              const mock =
                                dateKey != null ? getSlotMockStatus(dateKey, slot, selectedCourtId) : ("free" as const)
                              const isFull = mock === "full"
                              const isFew = mock === "few"
                              const end = slotEndLabel(slot, duration)
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isFull}
                                  onClick={() => {
                                    if (isFull) return
                                    pickSlot(slot)
                                  }}
                                  aria-label={`${isFull ? "Completo " : ""}${slot} a ${end}, ${duration} minutos`}
                                  className={cn(
                                    "flex min-h-[72px] flex-col items-center gap-1 rounded-xl border px-2 py-3 text-sm font-semibold transition-all",
                                    isFull
                                      ? "cursor-not-allowed border-red-500/35 bg-[#1a1a1a] text-[#f5f5f0]/40 opacity-50"
                                      : isSelected
                                        ? "border-[#3a7d44] bg-[#3a7d44] text-white shadow-lg shadow-[#3a7d44]/25"
                                        : isFew
                                          ? "border-[#e8d44d]/50 bg-[#1a1a1a] text-[#f5f5f0]/85 hover:border-[#e8d44d]"
                                          : "border-white/10 bg-[#1a1a1a] text-[#f5f5f0]/75 hover:border-[#3a7d44]/50"
                                  )}
                                >
                                  <Clock size={13} className={isSelected ? "text-white/80" : "text-[#f5f5f0]/55"} aria-hidden />
                                  <span>{slot}</span>
                                  <span className={cn("text-[10px] tabular-nums", isSelected ? "text-white/75" : "text-[#f5f5f0]/45")}>
                                    → {end}
                                  </span>
                                  {isFull ? (
                                    <span className="text-[10px] font-bold uppercase text-red-400/90">Completo</span>
                                  ) : isFew ? (
                                    <span className="text-[10px] font-bold text-[#e8d44d]">Pocas</span>
                                  ) : (
                                    <span className={cn("text-[10px] tabular-nums", isSelected ? "text-white/80" : "text-[#f5f5f0]/55")}>
                                      {perPerson.toFixed(2).replace(".", ",")} €/pers
                                    </span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {selectedSlot && (
                    <p className="mt-4 text-xs text-[#f5f5f0]/55">
                      {getSlotDescription(selectedDate, selectedSlot)} · Total {price} € / pista ({BOOKING_PLAYERS} jugadores, IVA incl.).
                    </p>
                  )}
                </div>
              </section>
            )}

            {selectedDate && selectedSlot && (
              <section aria-labelledby="pista-heading">
                <SectionEyebrow className="mb-3">Paso 3 · Pista en el plano</SectionEyebrow>
                <h2 id="pista-heading" className="sr-only">
                  Selección de pista
                </h2>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[#f5f5f0]/65">Tipo de pista</span>
                  <button
                    type="button"
                    onClick={toggleFavorite}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
                      favoriteId === selectedCourtId
                        ? "border-[#e8d44d]/50 text-[#e8d44d]"
                        : "border-white/10 text-[#f5f5f0]/55 hover:border-white/25"
                    )}
                  >
                    <Star size={14} className={favoriteId === selectedCourtId ? "fill-[#e8d44d]" : ""} aria-hidden />
                    Favorita
                  </button>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
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
                </div>
                <CourtMap
                  selectedCourtId={selectedCourtId}
                  onSelect={(c) => selectCourt(c.id, selectedSlot)}
                  typeFilter={typeFilter}
                  dateKey={dateKey}
                  slot={selectedSlot}
                  onLegendTypeSelect={(t) => setTypeFilter(t)}
                />
              </section>
            )}

            {selectedDate && selectedSlot && (
              <section aria-labelledby="rec-heading">
                <SectionEyebrow className="mb-3" color="white">
                  Serie semanal (opcional)
                </SectionEyebrow>
                <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
                  <label htmlFor="recurring-toggle" className="flex cursor-pointer items-start gap-3">
                    <input
                      id="recurring-toggle"
                      type="checkbox"
                      checked={recurring}
                      onChange={(e) => setRecurring(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#3a7d44]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#f5f5f0]">Repetir cada semana</span>
                      <span className="mt-1 block text-xs text-[#f5f5f0]/55">Útil para entrenos fijos. Importe orientativo.</span>
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
                        onChange={(e) => setRecurringWeeks(Math.min(12, Math.max(2, parseInt(e.target.value, 10) || 2)))}
                        className="w-24 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-sm text-[#f5f5f0] outline-none focus:border-[#3a7d44]/60"
                      />
                      <p className="mt-2 text-xs text-[#f5f5f0]/55">
                        Total orientativo: <span className="font-bold text-[#3a7d44]">{price != null ? price * recurringWeeks : "—"} €</span>
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
                </div>
              </section>
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
        bookingLoading={bookingLoading}
      />
    </div>
  )
}
