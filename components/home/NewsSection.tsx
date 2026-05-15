"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import noticias from "@/data/noticias.json"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const categoryColors: Record<string, string> = {
  Torneos: "bg-[#e8d44d]/20 text-[#e8d44d]",
  Escuela: "bg-blue-500/20 text-blue-400",
  Instalaciones: "bg-[#3a7d44]/20 text-[#3a7d44]",
  Club: "bg-purple-500/20 text-purple-400",
}

const placeholderGradients = [
  "from-[#3a7d44]/40 to-[#1a3d20]/60",
  "from-[#e8d44d]/30 to-[#7a6c00]/50",
  "from-blue-600/30 to-blue-900/50",
]

export default function NewsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const featured = [...noticias]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 3)

  return (
    <section className="py-20 lg:py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
              Últimas Noticias
            </span>
            <h2
              className="text-[#f5f5f0] font-display font-black tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              NOVEDADES
              <br />
              <span className="text-[#3a7d44]">DEL CLUB</span>
            </h2>
          </div>
          <Link
            href="/noticias"
            className="flex items-center gap-2 text-[#3a7d44] font-semibold text-sm hover:gap-3 transition-all group shrink-0"
          >
            Ver todas las noticias
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featured.map((noticia, i) => (
            <motion.div
              key={noticia.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
            >
              <Link
                href={`/noticias/${noticia.slug}`}
                className="group flex flex-col h-full bg-[#111111] border border-white/10 hover:border-[#3a7d44]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#3a7d44]/10"
              >
                {/* Image placeholder */}
                <div
                  className={`h-48 bg-gradient-to-br ${placeholderGradients[i % placeholderGradients.length]} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 flex items-end p-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[noticia.categoria] || "bg-white/20 text-white"}`}
                    >
                      {noticia.categoria}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2 text-[#f5f5f0]/60 text-xs mb-3">
                    <Calendar size={12} />
                    <time>
                      {format(new Date(noticia.fecha), "d MMM yyyy", { locale: es })}
                    </time>
                  </div>
                  <h3 className="text-[#f5f5f0] font-bold text-base leading-snug mb-3 group-hover:text-white transition-colors">
                    {noticia.titulo}
                  </h3>
                  <p className="text-[#f5f5f0]/50 text-sm leading-relaxed line-clamp-3 flex-1">
                    {noticia.resumen}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[#3a7d44] text-sm font-semibold">
                    Leer más
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
