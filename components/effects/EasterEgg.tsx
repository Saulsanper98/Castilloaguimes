"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import { Confetti } from "./Confetti"

const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

export function EasterEgg() {
  const [, setBuffer] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [bang, setBang] = useState(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      const key = e.key
      setBuffer((prev) => {
        const next = [...prev, key].slice(-SEQUENCE.length)
        if (next.length === SEQUENCE.length && next.every((k, i) => k.toLowerCase() === SEQUENCE[i].toLowerCase())) {
          setOpen(true)
          setBang((b) => b + 1)
          toast.success("🏆 ¡Has desbloqueado el Konami!", {
            description: "Has encontrado un pequeño guiño del club.",
          })
          return []
        }
        return next
      })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <Confetti trigger={bang} count={120} />
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Konami unlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[350] bg-black/70 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-gradient-to-br from-[#3a7d44]/30 via-[#0a0a0a] to-[#0a0a0a] border-2 border-[#e8d44d] rounded-2xl p-8 sm:p-10 max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-3">🥇</div>
              <h2 className="text-[#f5f5f0] font-display font-black text-2xl mb-2">¡CASTILLO TOP SECRET!</h2>
              <p className="text-[#f5f5f0]/75 text-sm mb-5">
                Has descubierto el código Konami del club. Como recompensa simbólica te dejamos esta confetti party 🎉.
              </p>
              <button
                type="button"
                onClick={() => { setBang((b) => b + 1) }}
                className="bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] font-black px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Otra ronda de confetti
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
