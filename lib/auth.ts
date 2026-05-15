/**
 * Auth mock con un único usuario de prueba.
 *
 * Credenciales válidas:
 *   email:    test@test.com
 *   password: Test!
 */
import type { PlayerProfile } from "./player"

interface MockUser {
  email: string
  password: string
  profile: Partial<PlayerProfile>
}

const USERS: MockUser[] = [
  {
    email: "test@test.com",
    password: "Test!",
    profile: {
      name: "Saúl Sánchez Pérez",
      initials: "SS",
      email: "test@test.com",
      phone: "+34 612 345 678",
      birthDate: "1998-04-12",
      gender: "M",
      bio: "Jugando desde 2021. Me gusta el revés sobre cristal y los partidos de la mañana.",
      avatarColor: "#3a7d44",
      level: "Intermedio",
      elo: 1485,
      eloHistory: [1410, 1432, 1448, 1455, 1472, 1485],
      hand: "diestra",
      position: "reves",
      joinedAt: "2024-05-18T10:00:00.000Z",
      memberCode: "PCDC-2487",
      walletCents: 2500,
      loyaltyPoints: 320,
      redeemedRewardIds: [],
      streakWeeks: 4,
      joinedMatchIds: [],
      savedNewsSlugs: [],
      savedCampeonatoIds: [],
      favouriteCourtIds: [1, 9],
      notifEmail: true,
      notifPush: true,
      notifWhatsapp: false,
      publicProfile: true,
      language: "es",
      newsletter: true,
      twoFactorEnabled: false,
    },
  },
]

export interface AuthResult {
  ok: boolean
  error?: "missing" | "invalid"
  profile?: Partial<PlayerProfile>
}

export function tryLogin(email: string, password: string): AuthResult {
  const e = email.trim().toLowerCase()
  if (!e || !password) return { ok: false, error: "missing" }
  const user = USERS.find((u) => u.email.toLowerCase() === e)
  if (!user || user.password !== password) return { ok: false, error: "invalid" }
  return { ok: true, profile: { ...user.profile, lastLoginAt: new Date().toISOString() } }
}

export function getDemoCredentials() {
  return { email: USERS[0].email, password: USERS[0].password }
}
