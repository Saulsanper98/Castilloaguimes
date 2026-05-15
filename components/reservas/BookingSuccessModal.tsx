"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Check, Mail, Calendar as CalendarIcon, Bell, Share2, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Props {
  open: boolean
  onClose: () => void
  name?: string
  courtName: string
  date: Date | null
  slot: string | null
  duration: 60 | 90 | 120
  total: number | null
  onShare: () => void
  onDownloadIcs: () => void
}

/**
 * Modal celebratorio tras reservar con éxito.
 * Refuerza confianza con 3 chips de "promesa" (email, calendario, recordatorio)
 * y atajos sociales (compartir, calendario).
 */
export function BookingSuccessModal({
  open,
  onClose,
  name,
  courtName,
  date,
  slot,
  duration,
  total,
  onShare,
  onDownloadIcs,
}: Props) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!date || !slot) return null
  const first = name?.split(" ")[0] ?? "Jugador"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-success-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[210] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={reduce ? false : { y: 60, opacity: 0, scale: 0.96 }}
            animate={reduce ? undefined : { y: 0, opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { y: 40, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md bg-[#0f0f0f] sm:border sm:border-[#3a7d44]/40 sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Court lines bg */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, rgba(58,125,68,0.4) 0 1px, transparent 1px 22px)",
              }}
            />
            {/* Soft glow */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, #3a7d44 0%, transparent 70%)" }}
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg text-[#f5f5f0]/65 hover:text-[#f5f5f0] hover:bg-white/5 flex items-center justify-center"
            >
              <X size={14} aria-hidden="true" />
            </button>

            <div className="relative px-6 sm:px-7 pt-7 pb-6">
              {/* Big check */}
              <motion.div
                initial={reduce ? false : { scale: 0 }}
                animate={reduce ? undefined : { scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 18 }}
                className="mx-auto w-14 h-14 rounded-full bg-[#3a7d44] flex items-center justify-center shadow-2xl shadow-[#3a7d44]/50 mb-4"
              >
                <Check size={24} className="text-white" strokeWidth={3} aria-hidden="true" />
              </motion.div>

              <h2
                id="booking-success-title"
                className="text-center font-display font-black text-[#f5f5f0] leading-tight"
                style={{ fontSize: "clamp(1.4rem, 4vw, 1.8rem)" }}
              >
                ¡Bien jugado, {first}!
              </h2>
              <p className="text-center text-[#f5f5f0]/65 text-sm mt-2">
                Tu hueco está bloqueado durante 5 minutos. Confirma desde la app para asegurarlo.
              </p>

              {/* Recap */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#1a1a1a]/70 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#3a7d44]">
                    Resumen
                  </span>
                  {total != null && (
                    <span className="text-[#3a7d44] font-display font-black text-lg tabular-nums">
                      {total} €
                    </span>
                  )}
                </div>
                <p className="text-[#f5f5f0] font-bold text-base capitalize">
                  {format(date, "EEEE d 'de' MMMM", { locale: es })} · {slot}
                </p>
                <p className="text-[#f5f5f0]/65 text-xs">
                  {courtName} · {duration} min · 4 jugadores
                </p>
              </div>

              {/* Promise chips */}
              <ul className="mt-5 grid grid-cols-3 gap-2">
                <PromiseChip icon={Mail} label="Email confirmación" />
                <PromiseChip icon={CalendarIcon} label="Añadir al calendario" />
                <PromiseChip icon={Bell} label="Recordatorio 1h antes" />
              </ul>

              {/* Actions */}
              <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={onDownloadIcs}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 text-[#f5f5f0]/85 hover:bg-white/5 text-xs font-bold"
                >
                  <CalendarIcon size={13} aria-hidden="true" />
                  Calendario
                </button>
                <button
                  type="button"
                  onClick={onShare}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 text-[#f5f5f0]/85 hover:bg-white/5 text-xs font-bold"
                >
                  <Share2 size={13} aria-hidden="true" />
                  Compartir
                </button>
                <Link
                  href="/cuenta"
                  className="flex-1 inline-flex items-center justify-center bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Ver mi reserva
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PromiseChip({
  icon: Icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <li className="flex flex-col items-center text-center gap-1.5 rounded-xl border border-[#3a7d44]/20 bg-[#3a7d44]/5 px-2 py-3">
      <span className="w-7 h-7 rounded-lg bg-[#3a7d44]/15 text-[#3a7d44] flex items-center justify-center">
        <Icon size={12} aria-hidden="true" />
      </span>
      <span className="text-[9px] uppercase tracking-widest font-bold text-[#f5f5f0]/80 leading-tight">
        {label}
      </span>
    </li>
  )
}
