"use client"

import { motion, useReducedMotion } from "framer-motion"

/**
 * Hero estilo "vista de dron" con aurora/blobs animados, plano esquemático del
 * recinto y micro-puntos en las 14 pistas. Sustituye un placeholder vacío.
 */
export function DroneHero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#070707] aspect-[21/9] flex items-end p-6 sm:p-10">
      {/* Aurora blobs */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-1/3 -left-1/4 w-[70%] h-[140%] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle, #3a7d44 0%, transparent 70%)" }}
        animate={reduce ? {} : { x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-1/3 -right-1/4 w-[60%] h-[120%] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, #e8d44d 0%, transparent 65%)" }}
        animate={reduce ? {} : { x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Court lines pattern */}
      <div className="absolute inset-0 bg-court-lines opacity-50" aria-hidden="true" />

      {/* Schematic mini-plan of 14 courts (top-right corner) */}
      <svg
        viewBox="0 0 320 160"
        className="absolute top-4 right-4 sm:top-6 sm:right-8 w-44 sm:w-60 h-auto opacity-50"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="courtFade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a7d44" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3a7d44" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {Array.from({ length: 14 }).map((_, i) => {
          const col = i % 7
          const row = Math.floor(i / 7)
          const x = 10 + col * 44
          const y = 10 + row * 70
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width="38"
                height="58"
                rx="3"
                fill="url(#courtFade)"
                stroke="#3a7d44"
                strokeOpacity="0.6"
                strokeWidth="0.8"
              />
              <line
                x1={x}
                y1={y + 29}
                x2={x + 38}
                y2={y + 29}
                stroke="#3a7d44"
                strokeOpacity="0.4"
                strokeWidth="0.5"
              />
              {!reduce && (
                <circle cx={x + 19} cy={y + 29} r="1.5" fill="#e8d44d">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${3 + (i % 4)}s`}
                    repeatCount="indefinite"
                    begin={`${i * 0.3}s`}
                  />
                </circle>
              )}
            </g>
          )
        })}
      </svg>

      {/* Bottom fade for legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#e8d44d] mb-2">
          Vista aérea
        </p>
        <h2
          className="text-[#f5f5f0] font-display font-black leading-none mb-2"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
        >
          14 PISTAS · 6.000 m²
          <br />
          <span className="text-[#3a7d44]">UN SOLO CONJUNTO</span>
        </h2>
        <p className="text-[#f5f5f0]/70 text-sm max-w-2xl">
          El indoor más grande de Canarias en un único bloque cubierto en el corazón del polígono industrial de Arinaga.
        </p>
      </div>
    </section>
  )
}
