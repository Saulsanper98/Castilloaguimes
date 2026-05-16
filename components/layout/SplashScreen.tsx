"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

const SPLASH_FLAG = "pcdc-splash-shown"

/**
 * Pantalla de bienvenida con escudo en la primera carga de la sesión.
 * Duración ~700ms. Se omite si la persona ya la vio en la sesión.
 */
export function SplashScreen() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (reduce) return
    const seen = sessionStorage.getItem(SPLASH_FLAG) === "1"
    if (seen) return
    sessionStorage.setItem(SPLASH_FLAG, "1")
    const raf = requestAnimationFrame(() => setShow(true))
    const t = window.setTimeout(() => setShow(false), 750)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
    }
  }, [reduce])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[500] bg-[#0a0a0a] flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <svg viewBox="0 0 64 64" width="64" height="64">
              <path d="M6 3 L58 3 L58 36 Q58 52 32 61 Q6 52 6 36 Z" fill="#e8b923" />
              <path d="M9 6 L55 6 L55 35 Q55 50 32 58 Q9 50 9 35 Z" fill="#c41e3a" />
              <rect x="9" y="6" width="11.5" height="7" fill="#e8b923" />
              <rect x="32" y="6" width="11.5" height="7" fill="#e8b923" />
              <rect x="20.5" y="13" width="11.5" height="7" fill="#e8b923" />
              <rect x="43.5" y="13" width="11.5" height="7" fill="#e8b923" />
              <g fill="#f5f5f0">
                <rect x="17" y="25" width="3" height="5" />
                <rect x="22" y="25" width="3" height="5" />
                <rect x="27" y="25" width="3" height="5" />
                <rect x="32" y="25" width="3" height="5" />
                <rect x="37" y="25" width="3" height="5" />
                <rect x="42" y="25" width="3" height="5" />
                <rect x="17" y="30" width="28" height="16" />
                <rect x="28" y="20" width="8" height="14" />
                <rect x="28" y="18" width="2.5" height="3" />
                <rect x="32" y="18" width="2.5" height="3" />
              </g>
            </svg>
            <p className="font-display font-black text-[#f5f5f0] tracking-[0.35em] text-sm">CASTILLO</p>
            <span className="block w-12 h-0.5 bg-[#3a7d44] rounded-full">
              <motion.span
                className="block h-full bg-[#e8d44d] rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
