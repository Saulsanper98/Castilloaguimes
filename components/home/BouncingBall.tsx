"use client"

import { motion } from "framer-motion"

/**
 * Pelota de pádel rebotando decorativamente en el hero.
 * Se oculta en pantallas pequeñas para no saturar.
 */
export function BouncingBall() {
  return (
    <motion.div
      className="absolute top-1/2 right-[8%] -translate-y-1/2 pointer-events-none hidden lg:block"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <motion.div
        animate={{
          y: [0, -40, 0, -25, 0, -15, 0],
          rotate: [0, 90, 180, 270, 360, 450, 540],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: [0.55, 0.06, 0.68, 0.19],
        }}
        className="relative"
        style={{ width: 64, height: 64 }}
      >
        <svg viewBox="0 0 64 64" width="64" height="64">
          <defs>
            <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fff58a" />
              <stop offset="60%" stopColor="#e8d44d" />
              <stop offset="100%" stopColor="#a89531" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#ballGrad)" />
          <path
            d="M 8 26 Q 32 40 56 26"
            stroke="#0a0a0a"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 8 38 Q 32 24 56 38"
            stroke="#0a0a0a"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        {/* Shadow */}
      </motion.div>
      <motion.div
        animate={{ scaleX: [1, 1.4, 1, 1.25, 1, 1.15, 1], opacity: [0.5, 0.2, 0.5, 0.25, 0.5, 0.3, 0.5] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
        className="mx-auto mt-2 w-12 h-1 rounded-full bg-black blur-sm"
      />
    </motion.div>
  )
}
