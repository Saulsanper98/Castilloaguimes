"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Lock, Clock } from "lucide-react"

interface Props {
  active: boolean
  remainSeconds: number
  totalSeconds?: number
}

/**
 * Píldora flotante que indica que el hueco está bloqueado y muestra el tiempo restante.
 * Aparece en la esquina superior derecha (debajo de navbar). Se oculta en móvil
 * cuando el dock está en pantalla para no duplicar info.
 */
export function FloatingGraceTimer({ active, remainSeconds, totalSeconds = 300 }: Props) {
  const reduce = useReducedMotion()
  const minutes = Math.floor(remainSeconds / 60)
  const seconds = remainSeconds % 60
  const pct = Math.max(0, Math.min(100, (remainSeconds / totalSeconds) * 100))
  const lowTime = remainSeconds <= 60

  return (
    <AnimatePresence>
      {active && remainSeconds > 0 && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="hidden pointer-events-none fixed top-24 right-4 z-30"
        >
          <div
            className={`pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-2xl shadow-black/40 ${
              lowTime
                ? "border-red-500/40 bg-red-500/15"
                : "border-[#e8d44d]/40 bg-[#1a1a1a]/95"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                lowTime ? "bg-red-500/20 text-red-400" : "bg-[#e8d44d]/20 text-[#e8d44d]"
              }`}
            >
              {lowTime ? <Clock size={13} aria-hidden="true" /> : <Lock size={13} aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <p className={`text-[9px] uppercase tracking-widest font-black ${lowTime ? "text-red-400" : "text-[#e8d44d]"}`}>
                Hueco bloqueado
              </p>
              <p className="text-[#f5f5f0] font-display font-black text-base leading-none tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </p>
              <div className="mt-1.5 h-0.5 w-20 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${lowTime ? "bg-red-500" : "bg-[#e8d44d]"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
