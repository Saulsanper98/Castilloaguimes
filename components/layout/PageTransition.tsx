"use client"

import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

/**
 * Transición suave entre páginas. Solo aplica al main; no envuelve hero
 * porque el parallax sufriría. Respeta prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduce = useReducedMotion()

  if (reduce) return <>{children}</>

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
