"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, CreditCard, MapPin } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, getDay } from "date-fns"
import { es } from "date-fns/locale"

const TIME_SLOTS = [
  "08:00", "09:30", "11:00", "12:30", "14:00",
  "15:30", "17:00", "18:30", "20:00", "21:30",
]

// Precio por persona: 6,50 € todos los días (pista completa 1h30)
const PRICE_PER_PERSON = 6.5
const PLAYERS = 4

function isWeekend(date: Date) {
  const day = getDay(date)
  return day === 0 || day === 6
}

function getPrice(_date: Date, _slot: string): number {
  return PRICE_PER_PERSON * PLAYERS
}

const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"]

export default function ReservasPage() {
  const today = startOfDay(new Date())
  const [currentMonth, setCurrentMonth] = useState(today)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedCourt, setSelectedCourt] = useState("Pista 1")

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Pad start
  const startPad = (getDay(monthStart) + 6) % 7

  const price = selectedDate && selectedSlot ? getPrice(selectedDate, selectedSlot) : null

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
            Complejo Pádel
          </span>
          <h1
            className="text-[#f5f5f0] font-black tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            RESERVAR <span className="text-[#3a7d44]">PISTA</span>
          </h1>
          <p className="text-[#f5f5f0]/50 mt-2 text-base">
            Selecciona fecha y hora para reservar tu pista
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Calendar + Slots */}
          <div className="lg:col-span-2 space-y-6">
            {/* Court selector */}
            <div>
              <label className="text-[#f5f5f0]/60 text-sm font-medium mb-3 block">Seleccionar pista</label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 14 }, (_, i) => `Pista ${i + 1}`).map((court) => (
                  <button
                    key={court}
                    onClick={() => setSelectedCourt(court)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      selectedCourt === court
                        ? "bg-[#3a7d44] text-white border-[#3a7d44]"
                        : "bg-[#1a1a1a] text-[#f5f5f0]/60 border-white/10 hover:border-white/30"
                    }`}
                  >
                    {court}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#f5f5f0] font-bold capitalize">
                  {format(currentMonth, "MMMM yyyy", { locale: es })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#f5f5f0]/60 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#f5f5f0]/60 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-[#f5f5f0]/30 text-xs font-semibold py-1">
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
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => {
                        if (!isPast) {
                          setSelectedDate(day)
                          setSelectedSlot(null)
                        }
                      }}
                      disabled={isPast}
                      className={`relative h-9 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-[#3a7d44] text-white"
                          : isPast
                          ? "text-[#f5f5f0]/20 cursor-not-allowed"
                          : isToday
                          ? "border border-[#3a7d44]/60 text-[#3a7d44] hover:bg-[#3a7d44]/20"
                          : "text-[#f5f5f0]/70 hover:bg-white/10 hover:text-[#f5f5f0]"
                      }`}
                    >
                      {format(day, "d")}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-[#f5f5f0] font-bold mb-4">
                  Horarios para el {format(selectedDate, "EEEE d MMMM", { locale: es })}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const slotPrice = getPrice(selectedDate, slot)
                    const isSelected = selectedSlot === slot
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          isSelected
                            ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                            : "bg-[#1a1a1a] border-white/10 text-[#f5f5f0]/70 hover:border-[#3a7d44]/50 hover:text-[#f5f5f0]"
                        }`}
                      >
                        <Clock size={13} className={isSelected ? "text-white/80" : "text-[#f5f5f0]/40"} />

                        <span>{slot}</span>
                        <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-[#f5f5f0]/40"}`}>
                          {slotPrice.toFixed(2).replace(".", ",")}€
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary + Info */}
          <div className="space-y-5">
            {/* Booking summary */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sticky top-24">
              <h3 className="text-[#f5f5f0] font-bold mb-5">Resumen de reserva</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f5f0]/50 text-sm">Pista</span>
                  <span className="text-[#f5f5f0] font-semibold text-sm">{selectedCourt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f5f0]/50 text-sm">Fecha</span>
                  <span className="text-[#f5f5f0] font-semibold text-sm">
                    {selectedDate
                      ? format(selectedDate, "d MMM yyyy", { locale: es })
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f5f0]/50 text-sm">Hora</span>
                  <span className="text-[#f5f5f0] font-semibold text-sm">
                    {selectedSlot ? `${selectedSlot} (90 min)` : "—"}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="text-[#f5f5f0] font-bold">Total</span>
                  <span className="text-[#3a7d44] font-black text-xl">
                    {price !== null ? `${price}€` : "—"}
                  </span>
                </div>
              </div>
              <button
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                  selectedDate && selectedSlot
                    ? "bg-[#e8d44d] text-[#0a0a0a] hover:bg-[#f0dc55]"
                    : "bg-white/10 text-[#f5f5f0]/30 cursor-not-allowed"
                }`}
                disabled={!selectedDate || !selectedSlot}
              >
                Acceder para reservar
              </button>
              <p className="text-[#f5f5f0]/30 text-xs text-center mt-3">
                Cancelación gratuita hasta 4h antes
              </p>
            </div>

            {/* Pricing cards */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-5">
              <h4 className="text-[#f5f5f0] font-bold text-sm mb-4 flex items-center gap-2">
                <CreditCard size={14} className="text-[#3a7d44]" />
                Tarifas
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { label: "Pista completa (4 jug.) · 1h30", price: "6,50 €/pers." },
                  { label: "Pista individual · 1h", price: "5,50 €/pers." },
                  { label: "Pista individual · 1h30", price: "6,50 €/pers." },
                  { label: "Bono 50×10 (16:00–23:00)", price: "50 €" },
                ].map((t) => (
                  <div key={t.label} className="flex justify-between text-[#f5f5f0]/50">
                    <span>{t.label}</span>
                    <span className="font-semibold text-[#f5f5f0]">{t.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-2xl p-5">
              <h4 className="text-[#f5f5f0] font-bold text-sm mb-2 flex items-center gap-2">
                <MapPin size={14} className="text-[#3a7d44]" />
                Ubicación
              </h4>
              <p className="text-[#f5f5f0]/50 text-xs leading-relaxed">
                C/ Pino nº10, P.I. Arinaga<br />
                Agüimes, Las Palmas de Gran Canaria<br />
                Tel: 928 753 650
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
