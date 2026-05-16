"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const WA_NUMBER = "34928753650"
const DEFAULT_TEXT = "Hola Pádel Castillo, quería preguntaros sobre..."

/**
 * Botón flotante de WhatsApp. En clubes españoles es el canal de primer
 * contacto. Esquina inferior izquierda en escritorio; en móvil sube el
 * `bottom` si hay FAB de reserva a la derecha para no solaparse.
 */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)
  const [pulse, setPulse] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setDismissed(sessionStorage.getItem("pcdc-wa-dismissed") === "1")
    })
    const t = window.setTimeout(() => setVisible(true), 800)
    const stopPulse = window.setTimeout(() => setPulse(false), 6000)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.clearTimeout(stopPulse)
    }
  }, [])

  const onCuenta = pathname?.startsWith("/cuenta")
  const onReservas = pathname === "/reservas" || pathname?.startsWith("/reservas/")

  if (onCuenta || onReservas || dismissed) return null

  function dismiss(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDismissed(true)
    sessionStorage.setItem("pcdc-wa-dismissed", "1")
  }

  const link = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(DEFAULT_TEXT)}`

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "group fixed left-4 z-[45] flex flex-col items-start gap-1",
            "bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px)+var(--pcdc-floating-cookie-offset,0px))] lg:bottom-[calc(1.75rem+var(--pcdc-floating-cookie-offset,0px))]",
            "transition-[bottom] duration-300 ease-out"
          )}
        >
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 hover:scale-105 transition-transform"
          >
            {pulse && (
              <span
                className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-50"
                aria-hidden="true"
              />
            )}
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
              aria-hidden="true"
              className="relative"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Ocultar WhatsApp"
            className="opacity-100 lg:pointer-events-none lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 transition-opacity rounded-full bg-[#1a1a1a] border border-white/15 text-[#f5f5f0]/70 hover:text-[#f5f5f0] w-7 h-7 flex items-center justify-center text-[10px] ml-0.5"
          >
            <X size={12} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
