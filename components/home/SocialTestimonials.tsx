"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import reviews from "@/data/reseñasClub.json"
import { getInstagramUrl } from "@/lib/socialUrls"

const total = reviews.length
/** Tres reseñas destacadas en home (resto en carrusel). */
const FEATURED = reviews.slice(0, 3)

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function SocialTestimonials() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), 6000)
    return () => window.clearInterval(id)
  }, [reduce])

  const avg = (reviews.reduce((acc, r) => acc + r.stars, 0) / total).toFixed(1)
  const current = reviews[index]

  function go(delta: number) {
    setIndex((i) => (i + delta + total) % total)
  }

  return (
    <section className="py-16 lg:py-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
          {/* Aggregate */}
          <div>
            <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
              Lo que dice la gente
            </span>
            <h2
              className="text-[#f5f5f0] font-display font-black tracking-tight leading-tight mb-4"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", letterSpacing: "-0.02em" }}
            >
              {avg}{" "}
              <span className="text-[#e8d44d]" aria-hidden="true">
                ★
              </span>{" "}
              de media
              <br />
              <span className="text-[#3a7d44]">Google & club</span>
            </h2>
            <p className="text-[#f5f5f0]/65 text-sm leading-relaxed max-w-xs">
              Selección de opiniones reales del club y redes. Las valoraciones públicas están en Google Maps.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <a
                href="https://www.google.com/maps/search/?api=1&query=P%C3%A1del+Castillo+de+Ag%C3%BCimes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/65 hover:text-[#f5f5f0] border border-white/10 hover:border-white/25 rounded-full px-3 py-2 transition-colors"
              >
                <GoogleMark />
                Ver en Google →
              </a>
              <a
                href={getInstagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/65 hover:text-[#f5f5f0] border border-white/10 hover:border-white/25 rounded-full px-3 py-2 transition-colors"
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-pink-400 shrink-0"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Fotos y vídeos en Instagram →
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="hidden md:block">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/45 mb-3">Destacadas</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FEATURED.map((r) => (
                  <article
                    key={r.id}
                    className="rounded-xl border border-white/10 bg-[#111111] p-4 flex flex-col min-h-[140px]"
                  >
                    <div className="flex gap-0.5 mb-2" aria-label={`${r.stars} estrellas`}>
                      {Array.from({ length: r.stars }).map((_, i) => (
                        <Star key={i} size={12} className="text-[#e8d44d] fill-[#e8d44d]" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-[#f5f5f0]/90 text-xs font-semibold leading-snug line-clamp-3 flex-1">
                      &ldquo;{r.text}&rdquo;
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-bold text-[#f5f5f0] truncate">{r.author}</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#3a7d44] shrink-0">{r.source}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Carrusel completo */}
            <div className="relative rounded-2xl border border-white/10 bg-[#111111] p-6 sm:p-10 overflow-hidden">
              <Quote
                size={140}
                className="absolute -top-6 -right-6 text-[#3a7d44]/10"
                aria-hidden="true"
              />
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, x: 24 }}
                  animate={reduce ? undefined : { opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.32 }}
                  className="relative"
                >
                  <div className="flex gap-0.5 mb-3" aria-label={`${current.stars} estrellas`}>
                    {Array.from({ length: current.stars }).map((_, i) => (
                      <Star key={i} size={14} className="text-[#e8d44d] fill-[#e8d44d]" aria-hidden="true" />
                    ))}
                  </div>
                  <p
                    className="text-[#f5f5f0] font-display font-bold leading-tight mb-6"
                    style={{ fontSize: "clamp(1.2rem, 2.6vw, 1.7rem)" }}
                  >
                    &ldquo;{current.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-black text-xs shrink-0"
                        style={{ background: current.color }}
                        aria-hidden="true"
                      >
                        {current.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[#f5f5f0] font-bold text-sm">{current.author}</p>
                        <p className="text-[#f5f5f0]/55 text-[11px]">
                          {format(parseISO(current.date), "MMM yyyy", { locale: es })} ·{" "}
                          <span className="uppercase tracking-widest text-[#3a7d44]">{current.source}</span>
                        </p>
                      </div>
                    </div>
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#e8d44d] bg-[#e8d44d]/10 border border-[#e8d44d]/30">
                      {current.highlight}
                    </span>
                  </div>
                </motion.blockquote>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <div className="flex gap-1.5" role="tablist" aria-label="Reseñas">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      type="button"
                      aria-selected={i === index}
                      aria-label={`Reseña ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index ? "bg-[#3a7d44] w-8" : "bg-white/15 w-3 hover:bg-white/30"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Anterior"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-[#f5f5f0]/65 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Siguiente"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-[#f5f5f0]/65 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
