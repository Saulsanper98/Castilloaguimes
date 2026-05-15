"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, Clock as ClockIcon, Sparkles, Newspaper } from "lucide-react"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import noticiasData from "@/data/noticias.json"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { Newsletter } from "@/components/noticias/Newsletter"
import { SaveButton } from "@/components/noticias/SaveButton"
import { EmptyState } from "@/components/ui/EmptyState"
import { readingTime } from "@/lib/readingTime"
import type { Noticia } from "@/types"

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

const PAGE_SIZE = 9

export default function NoticiasClient() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todas")
  const [page, setPage] = useState(1)

  const sorted = useMemo(
    () => [...noticias].sort((a, b) => parseISO(b.fecha).getTime() - parseISO(a.fecha).getTime()),
    []
  )
  const featured = sorted[0]
  const rest = sorted.slice(1)

  const filtered = rest.filter((n) => activeCategory === "Todas" || n.categoria === activeCategory)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function changeCategory(c: Category) {
    setActiveCategory(c)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-8 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6"><Breadcrumbs /></div>
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">Actualidad</span>
          <h1
            className="text-[#f5f5f0] font-display font-black tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            NOTICIAS
          </h1>
          <p className="text-[#f5f5f0]/60 mt-2 text-base max-w-xl">
            Torneos, escuela, instalaciones y vida de club. Una vez por semana, lo que importa.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Featured */}
        {featured && (
          <Link
            href={`/noticias/${featured.slug}`}
            className="group relative grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#111111] border border-white/10 hover:border-[#3a7d44]/40 rounded-2xl overflow-hidden transition-all"
          >
            <div className={`aspect-[16/9] lg:aspect-auto bg-gradient-to-br ${GRADIENT_COLORS[0]} relative`}>
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#e8d44d] text-[#0a0a0a] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                <Sparkles size={11} aria-hidden="true" />
                Destacado
              </span>
            </div>
            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[featured.categoria]}`}>
                  {featured.categoria}
                </span>
                <span className="text-[#f5f5f0]/55 text-xs flex items-center gap-1">
                  <Calendar size={11} aria-hidden="true" />
                  {format(parseISO(featured.fecha), "d MMM yyyy", { locale: es })}
                </span>
                <span className="text-[#f5f5f0]/55 text-xs flex items-center gap-1">
                  <ClockIcon size={11} aria-hidden="true" />
                  {readingTime(featured.contenido)} min
                </span>
              </div>
              <h2 className="text-[#f5f5f0] font-display font-black leading-tight mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}>
                {featured.titulo}
              </h2>
              <p className="text-[#f5f5f0]/65 text-sm sm:text-base leading-relaxed mb-5 line-clamp-3">
                {featured.resumen}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[#3a7d44] font-bold text-sm">
                Leer artículo
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </div>
          </Link>
        )}

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 sticky top-16 z-30 bg-[#0a0a0a]/70 backdrop-blur-sm py-2 -mx-2 px-2 rounded-xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => changeCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeCategory === cat
                  ? "bg-[#3a7d44] text-white border-[#3a7d44]"
                  : "bg-[#111111] text-[#f5f5f0]/65 border-white/10 hover:border-white/30 hover:text-[#f5f5f0]"
              }`}
            >
              {cat}
            </button>
          ))}
          <p className="ml-auto text-[#f5f5f0]/55 text-xs self-center">
            {filtered.length} artículo{filtered.length !== 1 ? "s" : ""}
            {totalPages > 1 ? ` · pág. ${currentPage}/${totalPages}` : ""}
          </p>
        </div>

        {/* Grid */}
        {paginated.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="Sin novedades en esta categoría"
            description="Aún no hemos publicado nada por aquí. Mientras tanto, echa un vistazo al resto del blog."
            action={
              <button
                type="button"
                onClick={() => changeCategory("Todas")}
                className="inline-flex bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
              >
                Ver todas
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((noticia, i) => (
              <article
                key={noticia.id}
                className="relative group flex flex-col bg-[#111111] border border-white/10 hover:border-[#3a7d44]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#3a7d44]/10"
              >
                <Link href={`/noticias/${noticia.slug}`} className="contents">
                  <div className={`h-44 bg-gradient-to-br ${GRADIENT_COLORS[(i + 1) % GRADIENT_COLORS.length]} relative`}>
                    <div className="absolute inset-0 flex items-end p-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[noticia.categoria] || "bg-white/20 text-white"}`}>
                        {noticia.categoria}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center justify-between text-[#f5f5f0]/55 text-xs mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} aria-hidden="true" />
                        {formatDistanceToNow(parseISO(noticia.fecha), { locale: es, addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon size={11} aria-hidden="true" />
                        {readingTime(noticia.contenido)} min
                      </span>
                    </div>
                    <h3 className="text-[#f5f5f0] font-bold text-sm leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
                      {noticia.titulo}
                    </h3>
                    <p className="text-[#f5f5f0]/60 text-xs leading-relaxed line-clamp-3 flex-1">
                      {noticia.resumen}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-[#3a7d44] text-xs font-semibold">
                      Leer más
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
                <div className="absolute top-3 right-3 z-10">
                  <SaveButton slug={noticia.slug} compact />
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-1 flex-wrap" aria-label="Paginación">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-[#f5f5f0]/80"
            >
              ← Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                  p === currentPage ? "bg-[#3a7d44] text-white" : "bg-white/5 hover:bg-white/10 text-[#f5f5f0]/75"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-[#f5f5f0]/80"
            >
              Siguiente →
            </button>
          </nav>
        )}

        {/* Newsletter */}
        <Newsletter />

        {/* FAQ CTA */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-[#f5f5f0] font-display font-black text-xl mb-1">¿Tienes preguntas?</h3>
            <p className="text-[#f5f5f0]/65 text-sm">
              Si algo no queda claro o tienes una sugerencia para el blog, escríbenos.
            </p>
          </div>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors shrink-0"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  )
}
