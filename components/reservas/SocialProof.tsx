"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Users } from "lucide-react"

const SAMPLE = [
  { name: "Marcos G.", slot: "Pista 4 a las 19:30" },
  { name: "Ana R.", slot: "Pista 7 a las 18:00" },
  { name: "Juanjo L.", slot: "Pista 11 a las 20:30" },
  { name: "Carmen P.", slot: "Pista 2 a las 11:00" },
  { name: "Iván S.", slot: "Pista 9 a las 17:00" },
  { name: "Laura M.", slot: "Pista 13 a las 21:30" },
]

/**
 * Toast flotante discreto de "alguien acaba de reservar X".
 * Aparece tras 8s, dura 6s, ciclo cada 20s. Solo en escritorio para no molestar móvil.
 */
export function SocialProof() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (reduce) return
    let i = 0
    const start = window.setTimeout(() => {
      setActive(i % SAMPLE.length)
      const cycle = window.setInterval(() => {
        i++
        setActive(null)
        window.setTimeout(() => setActive(i % SAMPLE.length), 800)
      }, 14_000)
      // cleanup is handled below via return
      ;(start as unknown as { _cycle?: number })._cycle = cycle
    }, 8_000)
    return () => {
      window.clearTimeout(start)
      const cycle = (start as unknown as { _cycle?: number })._cycle
      if (cycle) window.clearInterval(cycle)
      setActive(null)
    }
  }, [reduce])

  useEffect(() => {
    if (active == null) return
    const t = window.setTimeout(() => setActive(null), 6_000)
    return () => window.clearTimeout(t)
  }, [active])

  const sample = active != null ? SAMPLE[active] : null

  return (
    <div className="pointer-events-none fixed bottom-24 left-4 z-30 hidden sm:block">
      <AnimatePresence>
        {sample && (
          <motion.div
            key={active}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-center gap-3 max-w-xs bg-[#111111]/95 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-2xl shadow-black/40"
          >
            <span className="w-9 h-9 rounded-full bg-[#3a7d44]/15 border border-[#3a7d44]/40 flex items-center justify-center shrink-0">
              <Users size={13} className="text-[#3a7d44]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[#f5f5f0] text-xs font-semibold leading-tight">
                {sample.name} acaba de reservar
              </p>
              <p className="text-[#f5f5f0]/55 text-[11px] leading-tight">{sample.slot}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
