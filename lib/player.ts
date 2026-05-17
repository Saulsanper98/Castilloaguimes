/**
 * Perfil mock del jugador local (persiste en localStorage).
 * Es el modelo extendido tras el rediseño de /cuenta.
 */
export type PlayerLevel = "Iniciación" | "Intermedio" | "Avanzado"
export type DominantHand = "diestra" | "zurda"
export type CourtPosition = "drive" | "reves" | "indistinto"
export type LoyaltyTier = "Bronce" | "Plata" | "Oro" | "Platino"

export interface PlayerProfile {
  // Identidad
  name: string
  initials: string
  email: string
  phone?: string
  birthDate?: string // YYYY-MM-DD
  gender?: "M" | "F" | "X"
  bio?: string
  avatarColor: string
  // Juego
  level: PlayerLevel
  elo: number
  /** Puntos ELO mensuales (últimos 6 meses, más antiguo primero) */
  eloHistory: number[]
  hand: DominantHand
  position: CourtPosition
  // Membresía
  joinedAt: string // ISO date
  memberCode: string // P/ tarjeta socio
  // Wallet & fidelización
  walletCents: number
  loyaltyPoints: number
  redeemedRewardIds: number[]
  /** Días seguidos con actividad (racha) */
  streakWeeks: number
  // Relaciones
  joinedMatchIds: number[]
  savedNewsSlugs: string[]
  savedCampeonatoIds: number[]
  favouriteCourtIds: number[]
  // Preferencias
  notifEmail: boolean
  notifPush: boolean
  notifWhatsapp: boolean
  publicProfile: boolean
  language: "es" | "en" | "de"
  newsletter: boolean
  // Seguridad
  twoFactorEnabled: boolean
  /** Última transición desde sesión iniciada */
  lastLoginAt?: string
}

const KEY = "pcdc-player-v2"
const LEGACY_KEY = "pcdc-player-v1"

export const DEFAULT_PROFILE: PlayerProfile = {
  name: "Invitado",
  initials: "IN",
  email: "",
  phone: "",
  birthDate: "",
  gender: undefined,
  bio: "",
  avatarColor: "#3a7d44",
  level: "Intermedio",
  elo: 1450,
  eloHistory: [1390, 1410, 1428, 1440, 1462, 1450],
  hand: "diestra",
  position: "indistinto",
  joinedAt: "1970-01-01T00:00:00.000Z",
  memberCode: "PCDC-0000",
  walletCents: 0,
  loyaltyPoints: 0,
  redeemedRewardIds: [],
  streakWeeks: 0,
  joinedMatchIds: [],
  savedNewsSlugs: [],
  savedCampeonatoIds: [],
  favouriteCourtIds: [],
  notifEmail: true,
  notifPush: true,
  notifWhatsapp: false,
  publicProfile: true,
  language: "es",
  newsletter: true,
  twoFactorEnabled: false,
}

export function loadProfile(): PlayerProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE
  try {
    // Migration from v1 → v2 (forwards-compatible)
    const rawV2 = localStorage.getItem(KEY)
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<PlayerProfile>
      return { ...DEFAULT_PROFILE, ...parsed }
    }
    const rawV1 = localStorage.getItem(LEGACY_KEY)
    if (rawV1) {
      const parsed = JSON.parse(rawV1) as Partial<PlayerProfile>
      const migrated = { ...DEFAULT_PROFILE, ...parsed }
      localStorage.setItem(KEY, JSON.stringify(migrated))
      return migrated
    }
    return DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export const PROFILE_CHANGE_EVENT = "pcdc:profile-changed"

export function saveProfile(p: PlayerProfile): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(p))
  window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT))
}

export function patchProfile(patch: Partial<PlayerProfile>): PlayerProfile {
  const next = { ...loadProfile(), ...patch }
  saveProfile(next)
  return next
}

export function clearProfile(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
  localStorage.removeItem(LEGACY_KEY)
}

/** Niveles compatibles según nivel del jugador */
export function compatibleLevels(level: PlayerLevel): PlayerLevel[] {
  if (level === "Iniciación") return ["Iniciación", "Intermedio"]
  if (level === "Intermedio") return ["Iniciación", "Intermedio", "Avanzado"]
  return ["Intermedio", "Avanzado"]
}

// ── Loyalty tier helpers ──────────────────────────────────────────────────
const TIERS: Array<{ tier: LoyaltyTier; min: number; max: number; color: string }> = [
  { tier: "Bronce", min: 0, max: 199, color: "#b87333" },
  { tier: "Plata", min: 200, max: 499, color: "#bfc7cc" },
  { tier: "Oro", min: 500, max: 999, color: "#e8d44d" },
  { tier: "Platino", min: 1000, max: Infinity, color: "#a3d2f5" },
]

export function tierFor(points: number) {
  const tier = TIERS.find((t) => points >= t.min && points <= t.max) ?? TIERS[0]
  const next = TIERS.find((t) => t.min > points)
  return {
    ...tier,
    pointsToNext: next ? next.min - points : 0,
    nextTier: next?.tier ?? null,
    progressPct: next ? ((points - tier.min) / (next.min - tier.min)) * 100 : 100,
  }
}

export function allTiers() {
  return TIERS
}

// ── ELO context (where am I in the ranking?) ──────────────────────────────
export function eloPercentile(elo: number): number {
  // Distribución asumida del club: media ~1450, std ~120.
  // Aproximación gaussiana simplificada → percentil.
  const z = (elo - 1450) / 120
  const p = 0.5 * (1 + erf(z / Math.SQRT2))
  return Math.round(p * 100)
}
function erf(x: number): number {
  // Abramowitz & Stegun 7.1.26
  const sign = x >= 0 ? 1 : -1
  const ax = Math.abs(x)
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  const t = 1 / (1 + p * ax)
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax)
  return sign * y
}
