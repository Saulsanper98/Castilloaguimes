"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Download, X, Smartphone } from "lucide-react"
import { COOKIE_CONSENT_STORAGE_KEY, COOKIE_SETTLED_EVENT } from "@/lib/cookieConsent"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "pcdc-pwa-dismissed"
const SHOW_DELAY_MS = 28_000

/**
 * Píldora de instalación PWA. El retraso empieza cuando el navegador emite
 * `beforeinstallprompt`, y solo después de resolver cookies si aún no hay consentimiento.
 */
export function PWAPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const settledRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0)
    const recently = dismissedAt && Date.now() - dismissedAt < 30 * 86400_000
    if (recently) return

    let showTimer: number | undefined

    function armShowDelay() {
      if (showTimer) window.clearTimeout(showTimer)
      showTimer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS)
    }

    function onBefore(e: Event) {
      e.preventDefault()
      const ev = e as BeforeInstallPromptEvent
      setEvent(ev)

      if (localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)) {
        armShowDelay()
      } else {
        if (settledRef.current) {
          window.removeEventListener(COOKIE_SETTLED_EVENT, settledRef.current)
        }
        const onSettled = () => {
          window.removeEventListener(COOKIE_SETTLED_EVENT, onSettled)
          settledRef.current = null
          armShowDelay()
        }
        settledRef.current = onSettled
        window.addEventListener(COOKIE_SETTLED_EVENT, onSettled)
      }
    }

    window.addEventListener("beforeinstallprompt", onBefore)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore)
      if (showTimer) window.clearTimeout(showTimer)
      if (settledRef.current) {
        window.removeEventListener(COOKIE_SETTLED_EVENT, settledRef.current)
        settledRef.current = null
      }
    }
  }, [])

  async function install() {
    if (!event) return
    setVisible(false)
    await event.prompt()
    await event.userChoice
    setEvent(null)
  }

  function dismiss() {
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  }

  return (
    <AnimatePresence>
      {visible && event && (
        <motion.div
          role="region"
          aria-label="Instalar app"
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 -translate-x-1/2 z-[80] w-[min(calc(100vw-1.5rem),420px)] bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px)+var(--pcdc-floating-cookie-offset,0px))] sm:bottom-[calc(1.5rem+var(--pcdc-floating-cookie-offset,0px))]"
        >
          <div className="bg-[#0f0f0f]/95 backdrop-blur-md border border-[#3a7d44]/40 rounded-2xl shadow-2xl shadow-black/50 p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-xl bg-[#3a7d44]/20 border border-[#3a7d44]/40 text-[#3a7d44] flex items-center justify-center shrink-0">
                <Smartphone size={18} aria-hidden="true" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[#f5f5f0] font-bold text-sm leading-tight">
                  Instala la web en tu móvil
                </p>
                <p className="text-[#f5f5f0]/65 text-[11px] leading-tight">
                  Acceso directo desde la pantalla de inicio, como una app.
                </p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="No instalar"
                className="text-[#f5f5f0]/45 hover:text-[#f5f5f0] p-1"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold border border-white/15 text-[#f5f5f0]/75 hover:bg-white/5"
              >
                Ahora no
              </button>
              <button
                type="button"
                onClick={install}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-[#3a7d44] hover:bg-[#4a9d54] text-white"
              >
                <Download size={12} aria-hidden="true" />
                Instalar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
