"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"

export default function HeroSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const next = document.getElementById("stats-bar")
    if (next) next.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      ref={scrollRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Court texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #3a7d44 0px,
            #3a7d44 1px,
            transparent 1px,
            transparent 24px
          )`,
        }}
      />

      {/* Green radial glow */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-[#3a7d44]/20 via-transparent to-transparent" />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="inline-block text-[#3a7d44] text-xs sm:text-sm font-bold tracking-[0.4em] uppercase mb-6 border border-[#3a7d44]/40 px-4 py-1.5 rounded-full">
            Agüimes · Gran Canaria · Canarias
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[#f5f5f0] font-black tracking-tight leading-none mb-6"
          style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", letterSpacing: "-0.02em" }}
        >
          14 PISTAS.
          <br />
          <span className="text-[#3a7d44]">UN SOLO</span> LUGAR.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-[#f5f5f0]/60 text-lg sm:text-xl lg:text-2xl font-light mb-10 max-w-2xl mx-auto"
        >
          El mayor complejo indoor de pádel de Canarias
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/reservas"
            className="flex items-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-[#3a7d44]/30 group"
          >
            Reservar Pista
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/partidos-abiertos"
            className="flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-[#f5f5f0] font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:bg-white/5"
          >
            Ver Partidos Abiertos
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator — positioned relative to the section */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={handleScroll}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#f5f5f0]/30 hover:text-[#f5f5f0]/60 transition-colors z-20"
        aria-label="Scroll down"
      >
        <span className="text-[10px] tracking-widest uppercase">Descubre</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  )
}
