import { format } from "date-fns"
import { getSlotMockStatus } from "./slotMock"
import { COURTS } from "./courts"

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

/**
 * Demanda agregada de un día (0..1). Suma slots ocupados/casi-llenos contra el total.
 * Optimizado con caché por día para no recalcular en cada render.
 */
const cache = new Map<string, number>()

export function getDayDemand(date: Date): number {
  const key = format(date, "yyyy-MM-dd")
  const cached = cache.get(key)
  if (cached !== undefined) return cached

  let occupied = 0
  let total = 0
  for (const s of TIME_SLOTS) {
    for (const c of COURTS) {
      const st = getSlotMockStatus(key, s, c.id)
      total++
      if (st === "full") occupied += 1
      else if (st === "few") occupied += 0.5
    }
  }
  const ratio = total > 0 ? occupied / total : 0
  cache.set(key, ratio)
  return ratio
}

export type DemandLevel = "low" | "med" | "high"

export function demandLevel(ratio: number): DemandLevel {
  if (ratio < 0.4) return "low"
  if (ratio < 0.6) return "med"
  return "high"
}
