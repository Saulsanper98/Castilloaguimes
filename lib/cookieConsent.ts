/**
 * Consentimiento de cookies + coordinación de UI flotante (FAB, WhatsApp, dock).
 * El banner reserva espacio inferior vía CSS variable para que nada quede tapado.
 */

export const COOKIE_CONSENT_STORAGE_KEY = "pcdc-cookies-v1"

/** Se dispara al aceptar/rechazar cookies o si ya había decisión guardada (carga inicial). */
export const COOKIE_SETTLED_EVENT = "pcdc-cookies-settled"

export const FLOATING_COOKIE_OFFSET_VAR = "--pcdc-floating-cookie-offset"

/** Altura aproximada del banner en móvil (compacto) / desktop; evita solapes con FAB y WA. */
const COOKIE_BANNER_OFFSET_PX = 132

export function setCookieBannerInsetActive(active: boolean) {
  if (typeof document === "undefined") return
  document.documentElement.style.setProperty(
    FLOATING_COOKIE_OFFSET_VAR,
    active ? `${COOKIE_BANNER_OFFSET_PX}px` : "0px"
  )
}

export function dispatchCookieConsentSettled() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(COOKIE_SETTLED_EVENT))
}
