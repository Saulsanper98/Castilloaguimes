/**
 * Generación de archivos .ics (RFC 5545) con tiempo local "floating" + TZID
 * Atlantic/Canary. Usar floating sin Z para que la agenda del usuario no
 * desplace la reserva al importar fuera de Canarias.
 */

export interface IcsEvent {
  uid: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  durationMinutes: number
  summary: string
  location?: string
}

function fmtLocal(date: string, time: string): string {
  const [y, m, d] = date.split("-")
  const [hh, mm] = time.split(":")
  return `${y}${m}${d}T${hh}${mm}00`
}

function addMinutesLocal(date: string, time: string, mins: number): { date: string; time: string } {
  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10))
  const [hh, mi] = time.split(":").map((n) => parseInt(n, 10))
  // Trabaja en UTC para no caer en problemas de DST locales del runtime; al
  // final reconstruimos la cadena con los valores brutos (floating local).
  const base = Date.UTC(y, m - 1, d, hh, mi, 0)
  const next = new Date(base + mins * 60_000)
  const ny = next.getUTCFullYear()
  const nm = String(next.getUTCMonth() + 1).padStart(2, "0")
  const nd = String(next.getUTCDate()).padStart(2, "0")
  const nh = String(next.getUTCHours()).padStart(2, "0")
  const nmi = String(next.getUTCMinutes()).padStart(2, "0")
  return { date: `${ny}-${nm}-${nd}`, time: `${nh}:${nmi}` }
}

function dtstamp(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
}

export function buildIcs(event: IcsEvent): string {
  const end = addMinutesLocal(event.date, event.time, event.durationMinutes)
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PadelCastillo//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    "TZID:Atlantic/Canary",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0000",
    "TZOFFSETTO:+0000",
    "TZNAME:WET",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${event.uid}@padelcastillo`,
    `DTSTAMP:${dtstamp()}`,
    `DTSTART;TZID=Atlantic/Canary:${fmtLocal(event.date, event.time)}`,
    `DTEND;TZID=Atlantic/Canary:${fmtLocal(end.date, end.time)}`,
    `SUMMARY:${event.summary}`,
    event.location ? `LOCATION:${event.location}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n")
}

export function downloadIcs(filename: string, ics: string): void {
  const blob = new Blob([ics], { type: "text/calendar" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
