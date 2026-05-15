/** Devuelve un saludo apropiado para la hora actual. */
export function greetingFor(date = new Date()): string {
  const h = date.getHours()
  if (h < 6) return "¿Aún despierto?"
  if (h < 12) return "Buenos días"
  if (h < 20) return "Buenas tardes"
  return "Buenas noches"
}

/** Días que un usuario lleva como socio. */
export function daysSince(iso: string, now = new Date()): number {
  try {
    const d = new Date(iso)
    return Math.max(0, Math.floor((now.getTime() - d.getTime()) / 86_400_000))
  } catch {
    return 0
  }
}
