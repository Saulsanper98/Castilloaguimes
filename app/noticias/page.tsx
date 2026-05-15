"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import noticiasData from "@/data/noticias.json"
import { Noticia } from "@/types"

const noticias = noticiasData as Noticia[]

const CATEGORIES = ["Todas", "Torneos", "Escuela", "Instalaciones", "Club"] as const
type Category = (typeof CATEGORIES)[number]

const CATEGORY_STYLES: Record<string, string> = {
  Torneos: "bg-[#e8d44d]/20 text-[#e8d44d]",
  Escuela: "bg-blue-500/20 text-blue-400",
  Instalaciones: "bg-[#3a7d44]/20 text-[#3a7d44]",
  Club: "bg-purple-500/20 text-purple-400",
}

const GRADIENT_COLORS = [
  "from-[#3a7d44]/40 to-[#1a3d20]/60",
  "from-[#e8d44d]/30 to-[#7a6c00]/50",
  "from-blue-600/30 to-blue-900/50",
  "from-purple-600/30 to-purple-900/50",
  "from-red-600/20 to-red-950",
  "from-teal-600/30 to-teal-900/50",
  "from-orange-600/20 to-orange-950",
  "from-[#3a7d44]/30 to-blue-900/30",
]

export default function NoticiasPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todas")

  const filtered = noticias.filter(
    (n) => activeCategory === "Todas" || n.categoria === activeCategory
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
            Actualidad
          </span>
          <h1
            className="text-[#f5f5f0] font-black tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            NOTICIAS
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeCategory === cat
                  ? "bg-[#3a7d44] text-white border-[#3a7d44]"
                  : "bg-[#111111] text-[#f5f5f0]/60 border-white/10 hover:border-white/30 hover:text-[#f5f5f0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-[#f5f5f0]/30 text-sm mb-6">
          {filtered.length} artículo{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((noticia, i) => (
            <Link
              key={noticia.id}
              href={`/noticias/${noticia.slug}`}
              className="group flex flex-col bg-[#111111] border border-white/10 hover:border-[#3a7d44]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#3a7d44]/10"
            >
              {/* Image */}
              <div className={`h-44 bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} relative`}>
                <div className="absolute inset-0 flex items-end p-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[noticia.categoria] || "bg-white/20 text-white"}`}>
                    {noticia.categoria}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-1.5 text-[#f5f5f0]/30 text-xs mb-2">
                  <Calendar size={11} />
                  <time>{format(new Date(noticia.fecha), "d MMM yyyy", { locale: es })}</time>
                </div>
                <h3 className="text-[#f5f5f0] font-bold text-sm leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
                  {noticia.titulo}
                </h3>
                <p className="text-[#f5f5f0]/40 text-xs leading-relaxed line-clamp-3 flex-1">
                  {noticia.resumen}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[#3a7d44] text-xs font-semibold">
                  Leer más
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
