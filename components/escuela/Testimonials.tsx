"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import testimonios from "@/data/testimonios.json"

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const total = testimonios.length

  function go(delta: number) {
    setIndex((i) => (i + delta + total) % total)
  }

  const t = testimonios[index]

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
      <Quote
        size={120}
        className="absolute -top-6 -right-6 text-[#3a7d44]/10"
        aria-hidden="true"
      />
      <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#e8d44d] mb-6">
        Lo que dicen nuestros alumnos
      </p>

      <AnimatePresence mode="wait">
        <motion.blockquote
          key={t.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="relative"
        >
          <p
            className="text-[#f5f5f0] font-display font-bold leading-tight mb-6"
            style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}
          >
            “{t.texto}”
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-black text-sm shrink-0"
              style={{ background: t.color }}
              aria-hidden="true"
            >
              {t.iniciales}
            </div>
            <div>
              <div className="text-[#f5f5f0] font-bold text-sm">{t.nombre}</div>
              <div className="text-[#f5f5f0]/55 text-xs">
                {t.modalidad} · {t.tiempo}
              </div>
            </div>
            <div className="ml-auto flex gap-0.5" aria-label={`${t.estrellas} estrellas`}>
              {Array.from({ length: t.estrellas }).map((_, i) => (
                <Star key={i} size={12} className="text-[#e8d44d] fill-[#e8d44d]" aria-hidden="true" />
              ))}
            </div>
          </div>
        </motion.blockquote>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <div className="flex gap-1.5" role="tablist" aria-label="Testimonios">
          {testimonios.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Testimonio ${i + 1} de ${total}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "bg-[#3a7d44] w-8" : "bg-white/15 w-3 hover:bg-white/30"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Testimonio anterior"
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-[#f5f5f0]/65 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Siguiente testimonio"
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-[#f5f5f0]/65 flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
