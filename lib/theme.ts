/**
 * Theme manager: dark (default) / light / system.
 * Persists in localStorage and applies class on <html>.
 */
export type Theme = "dark" | "light" | "system"

const STORAGE_KEY = "pcdc-theme"

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  const v = localStorage.getItem(STORAGE_KEY)
  if (v === "light" || v === "dark" || v === "system") return v
  return "dark"
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, theme)
  applyTheme(theme)
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return
  const root = document.documentElement
  const isDark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  root.classList.toggle("dark", isDark)
  root.classList.toggle("light", !isDark)
  /* color-scheme: definido en globals.css (:root / html.light); no tocar style en <html> para evitar mismatch de hidratación. */
}

export function watchSystemTheme(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const mq = window.matchMedia("(prefers-color-scheme: dark)")
  const handler = () => callback()
  mq.addEventListener("change", handler)
  return () => mq.removeEventListener("change", handler)
}
