/**
 * Persistencia de acciones del usuario que no van todavía a un backend real:
 *  - partidos creados (CrearPartidoClient)
 *  - inscripciones a torneos (InscriptionModal)
 *
 * Igual que el resto de stores, todo vive en localStorage por dispositivo.
 */

const CREATED_MATCHES_KEY = "pcdc-created-matches-v1"
const TOURNAMENT_INSCR_KEY = "pcdc-tournament-inscriptions-v1"
const USER_RESERVAS_KEY = "pcdc-user-reservas-v1"
const RESERVAS_OVERRIDES_KEY = "pcdc-user-reservas-overrides-v1"
const WAITLIST_KEY = "pcdc-waitlist-v1"

export interface UserReservaPlayer {
  initials: string
  name: string
  color: string
}

export interface UserReserva {
  id: string
  date: string
  time: string
  duration: number
  courtId: number
  courtName: string
  courtType: string
  players: UserReservaPlayer[]
  priceCents: number
  status: "upcoming" | "past" | "cancelled"
  reminder: boolean
  payMode?: "online" | "club"
  createdAt: string
}

export interface ReservaOverride {
  status?: "upcoming" | "past" | "cancelled"
  reminder?: boolean
}

export interface WaitlistEntry {
  id: string
  date: string
  slot: string
  courtName: string
  createdAt: string
}

export interface CreatedMatch {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  level: "Iniciación" | "Intermedio" | "Avanzado"
  visibility: "publico" | "privado"
  notes: string
  createdAt: string // ISO
}

export interface TournamentInscription {
  id: string
  tournamentId: number
  tournamentName: string
  category: string
  player1: string
  player2: string
  email: string
  priceCents: number
  createdAt: string
  status: "pending" | "confirmed"
}

function safeRead<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : fallback
  } catch {
    return fallback
  }
}

function safeWrite<T>(key: string, list: T[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    /* quota or private mode */
  }
}

// ── Created matches ───────────────────────────────────────────────────────
export function loadCreatedMatches(): CreatedMatch[] {
  return safeRead<CreatedMatch>(CREATED_MATCHES_KEY, [])
}

export function appendCreatedMatch(m: Omit<CreatedMatch, "id" | "createdAt">): CreatedMatch {
  const full: CreatedMatch = { ...m, id: `cm_${Date.now()}`, createdAt: new Date().toISOString() }
  const list = [full, ...loadCreatedMatches()].slice(0, 50)
  safeWrite(CREATED_MATCHES_KEY, list)
  return full
}

// ── Tournament inscriptions ───────────────────────────────────────────────
export function loadInscriptions(): TournamentInscription[] {
  return safeRead<TournamentInscription>(TOURNAMENT_INSCR_KEY, [])
}

export function appendInscription(
  i: Omit<TournamentInscription, "id" | "createdAt" | "status">
): TournamentInscription {
  const full: TournamentInscription = {
    ...i,
    id: `tx_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  }
  const list = [full, ...loadInscriptions()].slice(0, 50)
  safeWrite(TOURNAMENT_INSCR_KEY, list)
  return full
}

export function isInscribed(tournamentId: number): boolean {
  return loadInscriptions().some((x) => x.tournamentId === tournamentId)
}

// ── User reservations (creadas desde /reservas) ───────────────────────────
export function loadUserReservas(): UserReserva[] {
  return safeRead<UserReserva>(USER_RESERVAS_KEY, [])
}

export function appendUserReserva(
  r: Omit<UserReserva, "id" | "createdAt">
): UserReserva {
  const full: UserReserva = { ...r, id: `ur_${Date.now()}`, createdAt: new Date().toISOString() }
  const list = [full, ...loadUserReservas()].slice(0, 100)
  safeWrite(USER_RESERVAS_KEY, list)
  return full
}

// ── Overrides para reservas seed (cancelar, toggle recordatorio) ──────────
export function loadReservaOverrides(): Record<string, ReservaOverride> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(RESERVAS_OVERRIDES_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" ? (parsed as Record<string, ReservaOverride>) : {}
  } catch {
    return {}
  }
}

export function setReservaOverride(id: string, patch: ReservaOverride): void {
  if (typeof window === "undefined") return
  const all = loadReservaOverrides()
  all[id] = { ...all[id], ...patch }
  try {
    localStorage.setItem(RESERVAS_OVERRIDES_KEY, JSON.stringify(all))
  } catch {
    /* ignore */
  }
}

// ── Waitlist ──────────────────────────────────────────────────────────────
export function loadWaitlist(): WaitlistEntry[] {
  return safeRead<WaitlistEntry>(WAITLIST_KEY, [])
}

export function appendWaitlist(e: Omit<WaitlistEntry, "id" | "createdAt">): WaitlistEntry {
  const full: WaitlistEntry = { ...e, id: `wl_${Date.now()}`, createdAt: new Date().toISOString() }
  const list = [full, ...loadWaitlist()].slice(0, 30)
  safeWrite(WAITLIST_KEY, list)
  return full
}

export function removeWaitlist(id: string): void {
  safeWrite(WAITLIST_KEY, loadWaitlist().filter((w) => w.id !== id))
}

// ── Locally occupied slots (para que el slot reservado se vea ocupado) ────
const OCCUPIED_SLOTS_KEY = "pcdc-occupied-slots-v1"

export function loadOccupiedSlots(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(OCCUPIED_SLOTS_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? new Set(arr as string[]) : new Set()
  } catch {
    return new Set()
  }
}

export function markSlotOccupied(date: string, slot: string, courtId: number): void {
  if (typeof window === "undefined") return
  const set = loadOccupiedSlots()
  set.add(`${date}|${slot}|${courtId}`)
  try {
    localStorage.setItem(OCCUPIED_SLOTS_KEY, JSON.stringify([...set]))
  } catch {
    /* ignore */
  }
}

export function isSlotOccupiedLocally(date: string, slot: string, courtId: number): boolean {
  return loadOccupiedSlots().has(`${date}|${slot}|${courtId}`)
}
