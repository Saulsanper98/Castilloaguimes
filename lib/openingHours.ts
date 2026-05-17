/**
 * Calcula si el club está abierto en el momento actual + próxima transición.
 * Horarios oficiales:
 *  - L–V: 08:00–23:00
 *  - Sáb: 08:00–20:00
 *  - Dom: 09:00–20:00 (festivos 09:00–15:00 — se simplifica como domingo)
 */

export type DayKey = 0 | 1 | 2 | 3 | 4 | 5 | 6

const SCHEDULE: Record<DayKey, { open: number; close: number } | null> = {
  0: { open: 9, close: 20 }, // Dom
  1: { open: 8, close: 23 }, // L
  2: { open: 8, close: 23 }, // M
  3: { open: 8, close: 23 }, // X
  4: { open: 8, close: 23 }, // J
  5: { open: 8, close: 23 }, // V
  6: { open: 8, close: 20 }, // S
}

export interface OpeningStatus {
  isOpen: boolean
  /** "Cierra en 2h" / "Abre a las 09:00" */
  hint: string
  closeTime?: string
  openTime?: string
}

/** Devuelve { day, hours, minutes } de `now` interpretado en hora de Canarias. */
function toCanary(now: Date): { day: DayKey; hours: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Atlantic/Canary",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now)
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon"
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10)
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10)
  const dayMap: Record<string, DayKey> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { day: dayMap[weekday] ?? 1, hours: hour, minutes: minute }
}

export function getOpeningStatus(now: Date = new Date()): OpeningStatus {
  const canary = toCanary(now)
  const day = canary.day
  const today = SCHEDULE[day]
  const minutes = canary.hours * 60 + canary.minutes

  if (today) {
    const openM = today.open * 60
    const closeM = today.close * 60
    if (minutes >= openM && minutes < closeM) {
      const left = closeM - minutes
      const h = Math.floor(left / 60)
      const m = left % 60
      const hint =
        left <= 60
          ? `Cierra en ${m} min`
          : `Cierra en ${h}h${m ? ` ${m}min` : ""}`
      return { isOpen: true, hint, closeTime: `${today.close}:00` }
    }
    if (minutes < openM) {
      return { isOpen: false, hint: `Abre hoy a las ${String(today.open).padStart(2, "0")}:00`, openTime: `${today.open}:00` }
    }
  }
  // Closed: find next opening
  const DAY_LABELS: Record<DayKey, string> = {
    0: "el domingo",
    1: "el lunes",
    2: "el martes",
    3: "el miércoles",
    4: "el jueves",
    5: "el viernes",
    6: "el sábado",
  }
  for (let offset = 1; offset <= 7; offset++) {
    const next = ((day + offset) % 7) as DayKey
    const slot = SCHEDULE[next]
    if (slot) {
      const dayLabel = offset === 1 ? "mañana" : DAY_LABELS[next]
      return {
        isOpen: false,
        hint: `Abre ${dayLabel} a las ${String(slot.open).padStart(2, "0")}:00`,
        openTime: `${slot.open}:00`,
      }
    }
  }
  return { isOpen: false, hint: "Cerrado" }
}

/**
 * Simulación de pistas libres en este instante.
 * Pseudoaleatorio basado en la hora para que sea estable durante la sesión.
 */
export function getMockAvailableCourts(now: Date = new Date()): number {
  const minutes = now.getHours() * 60 + now.getMinutes()
  // simulamos disponibilidad: más por la mañana, menos al final de la tarde
  const peak = Math.abs(minutes - 19 * 60) / 60 // distancia a las 19h
  const base = Math.min(14, Math.max(0, Math.round(peak * 1.4)))
  return base
}
