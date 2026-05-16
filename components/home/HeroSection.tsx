"use client"

import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown, MapPin, Activity, HelpCircle } from "lucide-react"
import { GOOGLE_MAPS_DIRECTIONS_URL } from "@/lib/site"
import { useRef } from "react"
import { SectionEyebrow } from "@/components/brand/SectionEyebrow"
import { LiveStatusChip } from "@/components/home/LiveStatusChip"
import { BouncingBall } from "@/components/home/BouncingBall"

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], reduceMotion ? [0, 0] : [0, 120])
  const contentY = useTransform(scrollY, [0, 600], reduceMotion ? [0, 0] : [0, -40])
  const fadeOut = useTransform(scrollY, [0, 400], reduceMotion ? [1, 1] : [1, 0.5])

  const handleScroll = () => {
    const next = document.getElementById("stats-bar")
    if (next) next.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Parallax background layer */}
      <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden="true">
        {/* Court texture overlay */}
        <div className="absolute inset-0 bg-court-lines opacity-70" />
        {/* Green radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(58,125,68,0.22) 0%, rgba(58,125,68,0.06) 40%, transparent 70%)",
          }}
        />
        {/* Decorative court silhouette */}
        <svg
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[140vw] max-w-none opacity-[0.045]"
          viewBox="0 0 1200 600"
          aria-hidden="true"
        >
          <rect x="100" y="50" width="1000" height="500" rx="20" fill="none" stroke="#3a7d44" strokeWidth="3" />
          <line x1="100" y1="300" x2="1100" y2="300" stroke="#3a7d44" strokeWidth="2" />
          <line x1="600" y1="50" x2="600" y2="550" stroke="#3a7d44" strokeWidth="2" strokeDasharray="6,6" />
        </svg>
        {/* Bouncing decorative ball */}
        <BouncingBall />
      </motion.div>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/85" aria-hidden="true" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: fadeOut }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto py-24"
      >
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-6 flex-wrap"
        >
          <SectionEyebrow className="text-[10px] sm:text-xs border border-[#3a7d44]/30 rounded-full px-4 py-2 bg-[#3a7d44]/5">
            Agüimes · Gran Canaria
          </SectionEyebrow>
          <LiveStatusChip />
        </motion.div>

        <motion.h1
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.2 }}
          className="text-[#f5f5f0] font-display font-black tracking-tight leading-[0.9] mb-6"
          style={{ fontSize: "clamp(3rem, 9.5vw, 8rem)", letterSpacing: "-0.03em" }}
        >
          14 PISTAS.
          <br />
          <span className="text-[#3a7d44]">UN SOLO</span> LUGAR.
        </motion.h1>

        <motion.p
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.35 }}
          className="text-[#f5f5f0]/75 text-lg sm:text-xl lg:text-2xl font-light mb-8 max-w-2xl mx-auto"
        >
          El mayor complejo indoor de pádel de Canarias
        </motion.p>

        {/* Trust signals row */}
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] sm:text-xs text-[#f5f5f0]/60 font-bold uppercase tracking-widest mb-10"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#3a7d44]" aria-hidden="true" />
            14 pistas cubiertas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#3a7d44]" aria-hidden="true" />
            Techo retráctil
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#3a7d44]" aria-hidden="true" />
            Afiliado FEP
          </span>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/reservas"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-7 sm:px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-[#3a7d44]/30 group min-h-[52px]"
          >
            Reservar pista
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            href="/partidos-abiertos"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-white/25 hover:border-white/55 text-[#f5f5f0] font-bold px-7 sm:px-8 py-4 rounded-xl text-base transition-all duration-200 hover:bg-white/5 min-h-[52px]"
          >
            Partidos abiertos
          </Link>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: 0.62 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          <a
            href={GOOGLE_MAPS_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#111111]/60 px-4 py-2.5 text-xs font-bold text-[#f5f5f0]/85 hover:border-[#3a7d44]/50 hover:text-[#f5f5f0] transition-colors backdrop-blur-sm"
          >
            <MapPin size={14} className="text-[#3a7d44] shrink-0" aria-hidden="true" />
            <span aria-hidden="true">📍</span> Llegar al club
          </a>
          <Link
            href="/disponibilidad"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#111111]/60 px-4 py-2.5 text-xs font-bold text-[#f5f5f0]/85 hover:border-[#3a7d44]/50 hover:text-[#f5f5f0] transition-colors backdrop-blur-sm"
          >
            <Activity size={14} className="text-[#e8d44d] shrink-0" aria-hidden="true" />
            Ver disponibilidad
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#111111]/60 px-4 py-2.5 text-xs font-bold text-[#f5f5f0]/85 hover:border-[#3a7d44]/50 hover:text-[#f5f5f0] transition-colors backdrop-blur-sm"
          >
            <HelpCircle size={14} className="text-[#3a7d44] shrink-0" aria-hidden="true" />
            FAQ
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { delay: 1.2 }}
        onClick={handleScroll}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#f5f5f0]/55 hover:text-[#f5f5f0]/80 transition-colors z-20 min-h-[44px] min-w-[44px] justify-center"
        aria-label="Bajar al siguiente apartado"
      >
        <span className="text-[10px] tracking-widest uppercase">Descubre</span>
        <motion.div
          animate={reduceMotion ? { y: 0 } : { y: [0, 6, 0] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} aria-hidden="true" />
        </motion.div>
      </motion.button>
    </section>
  )
}
