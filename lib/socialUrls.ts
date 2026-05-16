/**
 * Enlaces a redes del club.
 * Instagram: perfil oficial por defecto; define NEXT_PUBLIC_INSTAGRAM_URL para otro dominio o staging.
 * Facebook: solo si NEXT_PUBLIC_FACEBOOK_URL es una URL http(s) válida (evita enlaces genéricos rotos).
 */

/** Perfil oficial @padelcastillodeaguimes */
export const OFFICIAL_INSTAGRAM_URL = "https://www.instagram.com/padelcastillodeaguimes/"

function cleanUrl(v: string | undefined): string | null {
  if (!v || typeof v !== "string") return null
  const t = v.trim()
  if (!t.startsWith("http")) return null
  return t
}

export function getInstagramUrl(): string {
  return cleanUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL) ?? OFFICIAL_INSTAGRAM_URL
}

export function getFacebookUrl(): string | null {
  return cleanUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL)
}
