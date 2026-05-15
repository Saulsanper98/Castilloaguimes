/** Simulación estable de ocupación por fecha + hora + pista (sin API). */
export type SlotMockStatus = "free" | "few" | "full"

export function getSlotMockStatus(dateKey: string, slot: string, courtId: number): SlotMockStatus {
  let h = 0
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) >>> 0
  for (let i = 0; i < slot.length; i++) h = (h * 31 + slot.charCodeAt(i)) >>> 0
  h = (h + courtId * 17) >>> 0
  const r = h % 100
  if (r < 38) return "free"
  if (r < 72) return "few"
  return "full"
}
