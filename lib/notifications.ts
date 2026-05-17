/**
 * Centro de notificaciones in-app. Mock: notificaciones generadas a partir
 * de la actividad simulada del usuario (reservas, partidos, wallet, fidelización).
 * Persistencia en localStorage; estado "read" sincronizado entre pestañas.
 */

export type NotifType = "booking" | "match" | "wallet" | "loyalty" | "club" | "tournament"

export interface AppNotification {
  id: string
  type: NotifType
  title: string
  body: string
  /** ISO date */
  createdAt: string
  href?: string
  read: boolean
}

const STORAGE_KEY = "pcdc-notifications-v1"
const READ_KEY = "pcdc-notifications-read-v1"

const GUEST_SEED: AppNotification[] = [
  {
    id: "n-welcome-guest",
    type: "club",
    title: "Bienvenido a Pádel Castillo",
    body: "Crea tu cuenta para reservar pistas, apuntarte a partidos y ver tus notificaciones reales.",
    createdAt: new Date(Date.now() - 60_000).toISOString(),
    href: "/cuenta",
    read: false,
  },
]

const SEED: AppNotification[] = [
  {
    id: "n-welcome",
    type: "club",
    title: "Bienvenido a Pádel Castillo",
    body: "Explora tu cuenta, reservas y partidos abiertos. Pulsa ⌘K para buscar.",
    createdAt: new Date(Date.now() - 60_000).toISOString(),
    href: "/cuenta",
    read: false,
  },
  {
    id: "n-reserve-22",
    type: "booking",
    title: "Reserva confirmada",
    body: "Pista 4 · Vie 22 may a las 19:30. Cancelación gratuita hasta 4h antes.",
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    href: "/cuenta?tab=reservas",
    read: false,
  },
  {
    id: "n-wallet-promo",
    type: "wallet",
    title: "Promo aplicada",
    body: "+10 € en tu wallet por el código BIENVENIDA10.",
    createdAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    href: "/cuenta?tab=wallet",
    read: false,
  },
  {
    id: "n-tour",
    type: "tournament",
    title: "Gran Torneo de Verano 2026",
    body: "Inscripciones abiertas. Plazas limitadas a 64 parejas.",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    href: "/campeonatos",
    read: true,
  },
  {
    id: "n-elo",
    type: "loyalty",
    title: "Tu ELO subió 13 puntos",
    body: "Ganaste el último partido contra Marcos. ¡Buen trabajo!",
    createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    read: true,
  },
]

function isAuthed(): boolean {
  if (typeof window === "undefined") return false
  try {
    const raw = localStorage.getItem("pcdc-player-v2")
    if (!raw) return false
    const p = JSON.parse(raw) as { name?: string; lastLoginAt?: string }
    return !!p.lastLoginAt && p.name !== "Invitado"
  } catch {
    return false
  }
}

const AUTH_FLAG_KEY = "pcdc-notifications-authed-v1"

export function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return GUEST_SEED
  const authed = isAuthed()
  const fallback = authed ? SEED : GUEST_SEED
  try {
    // Si el estado de auth ha cambiado desde la última carga, invalidar caché
    const lastAuth = localStorage.getItem(AUTH_FLAG_KEY)
    const nowAuth = authed ? "1" : "0"
    if (lastAuth !== nowAuth) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.setItem(AUTH_FLAG_KEY, nowAuth)
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    const readSet = JSON.parse(localStorage.getItem(READ_KEY) || "[]") as string[]
    const base = raw ? (JSON.parse(raw) as AppNotification[]) : fallback
    return base.map((n) => ({ ...n, read: n.read || readSet.includes(n.id) }))
  } catch {
    return fallback
  }
}

export function persistNotifications(list: AppNotification[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  localStorage.setItem(
    READ_KEY,
    JSON.stringify(list.filter((n) => n.read).map((n) => n.id))
  )
}

export function markAllAsRead(): AppNotification[] {
  const next = loadNotifications().map((n) => ({ ...n, read: true }))
  persistNotifications(next)
  return next
}

export function markAsRead(id: string): AppNotification[] {
  const next = loadNotifications().map((n) => (n.id === id ? { ...n, read: true } : n))
  persistNotifications(next)
  return next
}

export function unreadCount(list: AppNotification[]): number {
  return list.filter((n) => !n.read).length
}
