import { addMinutes, format, getDay, parse } from "date-fns"
import { es } from "date-fns/locale"
import { COURTS } from "@/lib/courts"
import type { SlotMockStatus } from "@/lib/slotMock"
import { getSlotMockStatus } from "@/lib/slotMock"
import { isSlotOccupiedLocally } from "@/lib/userActivity"

export type BookingDuration = 60 | 90 | 120

/** Meses de calendario abiertos hacia adelante (negocio demo). */
export const BOOKING_MONTHS_AHEAD = 6

export const CANARY_TIMEZONE_NOTE =
  "Todos los horarios se muestran en hora de Canarias (Atlantic/Canary)."

const euroFmt = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatEuro(amount: number): string {
  return euroFmt.format(amount)
}

export function formatEuroCompact(amount: number): string {
  return `${amount.toFixed(2).replace(".", ",")} €`
}

/** `start` formato HH:mm, devuelve etiqueta de fin según duración en minutos. */
export function slotEndLabel(start: string, durationMin: BookingDuration): string {
  const base = parse(start, "HH:mm", new Date())
  const end = addMinutes(base, durationMin)
  return format(end, "HH:mm")
}

/**
 * Reglas demo de duración por día: domingo solo turno estándar 1h30;
 * resto de días permite las tres duraciones.
 */
export function getAllowedDurations(date: Date): BookingDuration[] {
  if (getDay(date) === 0) return [90]
  return [60, 90, 120]
}

export function getSlotDescription(date: Date, slot: string): string {
  const day = getDay(date)
  const hour = parseInt(slot.split(":")[0], 10)
  if (day === 0) return hour < 15 ? "Domingo · horario reducido" : "Domingo tarde"
  if (day === 6) return "Sábado"
  return hour < 16 ? "Mañana L-V" : "Tarde L-V"
}

/** Misma fuente que la rejilla de horas y el plano de pistas. */
export function getCourtSlotAvailability(
  courtId: number,
  dateKey: string,
  slot: string
): SlotMockStatus {
  if (isSlotOccupiedLocally(dateKey, slot, courtId)) return "full"
  return getSlotMockStatus(dateKey, slot, courtId)
}

/** Pistas que no están completas en esa fecha y franja (libre o pocas plazas). */
export function getAvailableCourtIdsForSlot(dateKey: string, slot: string): number[] {
  return COURTS.filter((c) => getCourtSlotAvailability(c.id, dateKey, slot) !== "full").map((c) => c.id)
}

/**
 * Estado del hueco mirando las 14 pistas: si alguna está libre → libre;
 * si no, pero alguna con pocas plazas → pocas; si todas llenas → completo.
 */
export function getSlotAggregatedMockStatus(dateKey: string, slot: string): SlotMockStatus {
  let anyFree = false
  let anyFew = false
  for (const c of COURTS) {
    const st = getCourtSlotAvailability(c.id, dateKey, slot)
    if (st === "free") anyFree = true
    if (st === "few") anyFew = true
  }
  if (anyFree) return "free"
  if (anyFew) return "few"
  return "full"
}

const POLICY_UPDATED = "2026-05-01"

export function getCancellationPolicyUpdatedLabel(): string {
  return format(new Date(POLICY_UPDATED), "d MMMM yyyy", { locale: es })
}

export const BOOKING_PLAYERS = 4

export function getPistaTotalPrice(duration: BookingDuration): number {
  const perPerson = duration === 60 ? 5.5 : duration === 90 ? 6.5 : 8
  return perPerson * BOOKING_PLAYERS
}
