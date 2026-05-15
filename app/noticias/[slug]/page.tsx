import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { format, formatRelative, isValid } from "date-fns"
import { es } from "date-fns/locale"
import noticiasData from "@/data/noticias.json"
import { NoticiaShare } from "@/components/noticias/NoticiaShare"
import { SITE_URL } from "@/lib/site"
import { Noticia } from "@/types"

const noticias = noticiasData as Noticia[]

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

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return noticias.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const noticia = noticias.find((n) => n.slug === slug)
  if (!noticia) return { title: "Noticia no encontrada" }
  return {
    title: noticia.titulo,
    description: noticia.resumen,
  }
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params
  const noticia = noticias.find((n) => n.slug === slug)
  if (!noticia) notFound()

  const idx = noticias.findIndex((n) => n.slug === slug)
  const related = noticias.filter((n) => n.slug !== slug).slice(0, 2)
  const paragraphs = noticia.contenido.split("\n\n")
  const pubDate = new Date(noticia.fecha)
  const fechaRelativa = isValid(pubDate) ? formatRelative(pubDate, new Date(), { locale: es }) : null
  const words = noticia.contenido.split(/\s+/).filter(Boolean).length
  const minLectura = Math.max(1, Math.round(words / 200))
  const canonicalUrl = `${SITE_URL.replace(/\/$/, "")}/noticias/${noticia.slug}`

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero header */}
      <div className={`pt-20 min-h-[40vh] flex items-end bg-gradient-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-[#f5f5f0]/50 hover:text-[#f5f5f0] text-sm mb-5 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Volver a noticias
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[noticia.categoria] || ""}`}>
              {noticia.categoria}
            </span>
          </div>
          <h1
            className="text-[#f5f5f0] font-display font-black leading-tight"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            {noticia.titulo}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article body */}
          <div className="lg:col-span-2">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[#f5f5f0]/60 text-sm mb-6 pb-6 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {isValid(pubDate)
                  ? format(pubDate, "d 'de' MMMM 'de' yyyy", { locale: es })
                  : noticia.fecha}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag size={13} />
                {noticia.categoria}
              </span>
              <span className="text-[#f5f5f0]/45 text-xs">
                {minLectura} min lectura
                {fechaRelativa ? ` · ${fechaRelativa}` : ""}
              </span>
            </div>

            {/* Body text */}
            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p
                  key={`${noticia.slug}-p${i}`}
                  className={`text-[#f5f5f0]/75 leading-relaxed ${
                    i === 0 ? "text-lg font-medium text-[#f5f5f0]/90" : "text-base"
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            <NoticiaShare url={canonicalUrl} title={noticia.titulo} />

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 text-[#3a7d44] hover:text-[#4a9d54] font-semibold text-sm transition-colors"
              >
                <ArrowLeft size={14} />
                Ver todas las noticias
              </Link>
            </div>
          </div>

          {/* Sidebar: related */}
          <div className="space-y-5">
            <h3 className="text-[#f5f5f0] font-bold text-sm uppercase tracking-widest">
              Artículos relacionados
            </h3>
            {related.map((r, i) => (
              <Link
                key={r.id}
                href={`/noticias/${r.slug}`}
                className="group flex flex-col bg-[#111111] border border-white/10 hover:border-[#3a7d44]/40 rounded-2xl overflow-hidden transition-all"
              >
                <div className={`h-28 bg-gradient-to-br ${GRADIENT_COLORS[(idx + i + 1) % GRADIENT_COLORS.length]}`} />
                <div className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${CATEGORY_STYLES[r.categoria] || ""}`}>
                    {r.categoria}
                  </span>
                  <h4 className="text-[#f5f5f0] font-bold text-xs leading-snug group-hover:text-white transition-colors line-clamp-2">
                    {r.titulo}
                  </h4>
                  <div className="text-[#f5f5f0]/55 text-[10px] mt-1.5">
                    {format(new Date(r.fecha), "d MMM yyyy", { locale: es })}
                  </div>
                </div>
              </Link>
            ))}

            {/* CTA box */}
            <div className="bg-[#111111] border border-[#3a7d44]/30 rounded-2xl p-5">
              <h4 className="text-[#f5f5f0] font-bold text-sm mb-2">¿Quieres reservar una pista?</h4>
              <p className="text-[#f5f5f0]/60 text-xs mb-3 leading-relaxed">
                Reserva online en segundos. 14 pistas disponibles.
              </p>
              <Link
                href="/reservas"
                className="block w-full text-center bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold text-xs py-2.5 rounded-lg transition-all"
              >
                Reservar ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
