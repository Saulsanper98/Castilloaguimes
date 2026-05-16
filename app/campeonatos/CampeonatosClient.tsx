"use client"

import { useEffect, useState, useMemo } from "react"
import { loadInscriptions } from "@/lib/userActivity"
import {
  Trophy,
  Calendar,
  Users,
  Tag,
  LayoutGrid,
  Table as TableIcon,
  Filter,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import campeonatosData from "@/data/campeonatos.json"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { EventCountdown } from "@/components/campeonatos/EventCountdown"
import { BracketVisual } from "@/components/campeonatos/BracketVisual"
import { WinnersGallery } from "@/components/campeonatos/WinnersGallery"
import { InscriptionModal } from "@/components/campeonatos/InscriptionModal"
import { StreamingEmbed } from "@/components/campeonatos/StreamingEmbed"
import { EmptyState } from "@/components/ui/EmptyState"
import type { Campeonato } from "@/types"

const campeonatos = campeonatosData as Campeonato[]

const TIPO_STYLES: Record<string, string> = {
  Americano: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  Liga: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  Open: "bg-[#e8d44d]/20 text-[#e8d44d] border border-[#e8d44d]/30",
}

const ESTADO_STYLES: Record<string, { badge: string; btn: string; btnText: string }> = {
  "Inscripción abierta": {
    badge: "bg-[#3a7d44]/20 text-[#3a7d44] border border-[#3a7d44]/30",
    btn: "bg-[#3a7d44] hover:bg-[#4a9d54] text-white",
    btnText: "Inscribirse",
  },
  Completo: {
    badge: "bg-red-500/20 text-red-400 border border-red-500/30",
    btn: "bg-white/10 text-[#f5f5f0]/55 cursor-not-allowed",
    btnText: "Completo",
  },
  Finalizado: {
    badge: "bg-white/10 text-[#f5f5f0]/55 border border-white/10",
    btn: "bg-white/5 text-[#f5f5f0]/45 cursor-not-allowed",
    btnText: "Finalizado",
  },
}

const GRADIENT_COLORS = [
  "from-[#3a7d44]/30 to-[#1a3d20]",
  "from-blue-700/30 to-blue-950",
  "from-purple-700/30 to-purple-950",
  "from-[#e8d44d]/20 to-yellow-900",
  "from-red-700/20 to-red-950",
  "from-[#3a7d44]/20 to-teal-950",
]

type TipoFilter = "all" | "Americano" | "Liga" | "Open"
type EstadoFilter = "all" | "Inscripción abierta" | "Completo"
type ViewMode = "cards" | "table"

function SpotsBar({ total, occupied }: { total: number; occupied: number }) {
  const pct = (occupied / total) * 100
  return (
    <div>
      <div className="flex justify-between text-xs text-[#f5f5f0]/55 mb-1.5">
        <span>{occupied} inscritos</span>
        <span>{total - occupied} libres</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 75 ? "bg-[#e8d44d]" : "bg-[#3a7d44]"}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default function CampeonatosClient() {
  const [tipo, setTipo] = useState<TipoFilter>("all")
  const [estado, setEstado] = useState<EstadoFilter>("all")
  const [view, setView] = useState<ViewMode>("cards")
  const [modal, setModal] = useState<Campeonato | null>(null)
  const [inscribedIds, setInscribedIds] = useState<Set<number>>(new Set())

  const refreshInscribed = () => {
    setInscribedIds(new Set(loadInscriptions().map((x) => x.tournamentId)))
  }

  useEffect(() => {
    const raf = requestAnimationFrame(refreshInscribed)
    return () => cancelAnimationFrame(raf)
  }, [])

  const upcoming = useMemo(
    () =>
      campeonatos
        .filter((c) => c.estado !== "Finalizado")
        .filter((c) => tipo === "all" || c.tipo === tipo)
        .filter((c) => estado === "all" || c.estado === estado)
        .sort((a, b) => parseISO(a.fecha).getTime() - parseISO(b.fecha).getTime()),
    [tipo, estado]
  )
  const past = useMemo(
    () =>
      campeonatos
        .filter((c) => c.estado === "Finalizado")
        .sort((a, b) => parseISO(b.fecha).getTime() - parseISO(a.fecha).getTime()),
    []
  )

  const nextShow = upcoming.find((c) => c.estado === "Inscripción abierta") ?? upcoming[0]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-8 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6"><Breadcrumbs /></div>
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
            Competición
          </span>
          <h1
            className="text-[#f5f5f0] font-display font-black tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            CAMPEONATOS
          </h1>
          <p className="text-[#f5f5f0]/60 mt-2 text-base">
            Torneos y ligas para todos los niveles. Compite, supérate y vive la emoción.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {nextShow && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EventCountdown title={nextShow.nombre} targetISO={`${nextShow.fecha}T12:00:00.000Z`} />
            <StreamingEmbed />
          </section>
        )}

        <section>
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-3" role="search" aria-label="Filtros de campeonatos">
            <span className="text-[10px] uppercase tracking-widest text-[#f5f5f0]/45 font-bold flex items-center gap-1">
              <Filter size={11} aria-hidden="true" /> Filtrar
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "Americano", "Liga", "Open"] as TipoFilter[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tipo === t}
                  onClick={() => setTipo(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    tipo === t
                      ? "bg-[#3a7d44] text-white border-[#3a7d44]"
                      : "bg-[#1a1a1a] text-[#f5f5f0]/65 border-white/10 hover:border-white/20"
                  }`}
                >
                  {t === "all" ? "Todos" : t}
                </button>
              ))}
            </div>
            <span className="w-px h-5 bg-white/10 hidden sm:block" aria-hidden="true" />
            <div className="flex flex-wrap gap-1.5">
              {(["all", "Inscripción abierta", "Completo"] as EstadoFilter[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={estado === s}
                  onClick={() => setEstado(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    estado === s
                      ? "bg-[#e8d44d] text-[#0a0a0a] border-[#e8d44d]"
                      : "bg-[#1a1a1a] text-[#f5f5f0]/65 border-white/10 hover:border-white/20"
                  }`}
                >
                  {s === "all" ? "Cualquier estado" : s}
                </button>
              ))}
            </div>
            <div className="ml-auto inline-flex bg-[#1a1a1a] rounded-lg border border-white/10 p-0.5">
              <button
                type="button"
                aria-pressed={view === "cards"}
                onClick={() => setView("cards")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === "cards" ? "bg-[#3a7d44] text-white" : "text-[#f5f5f0]/65"}`}
              >
                <LayoutGrid size={12} aria-hidden="true" /> Cards
              </button>
              <button
                type="button"
                aria-pressed={view === "table"}
                onClick={() => setView("table")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === "table" ? "bg-[#3a7d44] text-white" : "text-[#f5f5f0]/65"}`}
              >
                <TableIcon size={12} aria-hidden="true" /> Tabla
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <Trophy size={20} className="text-[#3a7d44]" aria-hidden="true" />
            <h2 className="text-[#f5f5f0] font-display font-black text-2xl tracking-tight">
              Próximos torneos
            </h2>
          </div>

          {upcoming.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No hay torneos con esos filtros"
              description="Prueba a quitar algún filtro o vuelve más tarde — publicamos nuevas competiciones cada mes."
              action={
                <button
                  type="button"
                  onClick={() => { setTipo("all"); setEstado("all") }}
                  className="inline-flex bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  Quitar filtros
                </button>
              }
            />
          ) : view === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((c, i) => {
                const tipoStyle = TIPO_STYLES[c.tipo] || ""
                const estadoStyle = ESTADO_STYLES[c.estado]
                return (
                  <div
                    key={c.id}
                    className="bg-[#111111] border border-white/10 hover:border-[#3a7d44]/40 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-[#3a7d44]/10 flex flex-col"
                  >
                    <div className={`h-36 bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} relative flex items-end p-4`}>
                      <Trophy size={32} className="text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full relative z-10 ${tipoStyle}`}>
                        {c.tipo}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1 gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[#f5f5f0] font-bold text-sm leading-snug">{c.nombre}</h3>
                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${estadoStyle.badge}`}>
                          {c.estado}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#f5f5f0]/55">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={11} aria-hidden="true" />
                          {format(new Date(c.fecha), "d MMM yyyy", { locale: es })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={11} aria-hidden="true" />
                          {c.plazas} plazas
                        </span>
                      </div>

                      <p className="text-[#f5f5f0]/65 text-xs leading-relaxed line-clamp-2">{c.descripcion}</p>

                      <SpotsBar total={c.plazas} occupied={c.plazasOcupadas} />

                      <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
                        <div className="flex items-center gap-1.5 text-[#f5f5f0]/65 text-xs">
                          <Tag size={11} aria-hidden="true" />
                          <span className="text-[#3a7d44] font-bold text-base">{c.precio}€</span>
                          <span>/pareja</span>
                        </div>
                        <button
                          type="button"
                          disabled={c.estado !== "Inscripción abierta" || inscribedIds.has(c.id)}
                          onClick={() => setModal(c)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            inscribedIds.has(c.id)
                              ? "bg-[#3a7d44]/20 text-[#3a7d44] border border-[#3a7d44]/50 cursor-default"
                              : estadoStyle.btn
                          }`}
                        >
                          {inscribedIds.has(c.id) ? "Inscrito ✓" : estadoStyle.btnText}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-[#f5f5f0]/55">
                  <tr>
                    <th scope="col" className="text-left px-4 py-3 font-bold">Torneo</th>
                    <th scope="col" className="text-left px-4 py-3 font-bold">Tipo</th>
                    <th scope="col" className="text-left px-4 py-3 font-bold">Fecha</th>
                    <th scope="col" className="text-left px-4 py-3 font-bold">Plazas</th>
                    <th scope="col" className="text-right px-4 py-3 font-bold">Precio</th>
                    <th scope="col" className="text-right px-4 py-3 font-bold">Estado</th>
                    <th scope="col" className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((c) => {
                    const estadoStyle = ESTADO_STYLES[c.estado]
                    return (
                      <tr key={c.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-[#f5f5f0] font-semibold">{c.nombre}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${TIPO_STYLES[c.tipo]}`}>
                            {c.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#f5f5f0]/75">
                          {format(parseISO(c.fecha), "d MMM yyyy", { locale: es })}
                        </td>
                        <td className="px-4 py-3 text-[#f5f5f0]/75 tabular-nums">{c.plazasOcupadas}/{c.plazas}</td>
                        <td className="px-4 py-3 text-right text-[#3a7d44] font-black tabular-nums">{c.precio}€</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${estadoStyle.badge}`}>
                            {c.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            disabled={c.estado !== "Inscripción abierta" || inscribedIds.has(c.id)}
                            onClick={() => setModal(c)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                              inscribedIds.has(c.id)
                                ? "bg-[#3a7d44]/20 text-[#3a7d44] border border-[#3a7d44]/50 cursor-default"
                                : estadoStyle.btn
                            }`}
                          >
                            {inscribedIds.has(c.id) ? "Inscrito ✓" : estadoStyle.btnText}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[#3a7d44] rounded-full" />
            <h2 className="text-[#f5f5f0] font-display font-black text-2xl tracking-tight">
              Cuadro en vivo
            </h2>
          </div>
          <p className="text-[#f5f5f0]/55 text-xs sm:text-sm mb-4 max-w-3xl leading-relaxed">
            Ilustración de formato de torneo. Los cruces y horarios reales se publican en recepción y en la app del club cuando el torneo esté en curso.
          </p>
          <BracketVisual />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[#e8d44d] rounded-full" />
            <h2 className="text-[#f5f5f0] font-display font-black text-2xl tracking-tight">
              Sala de campeones
            </h2>
          </div>
          <WinnersGallery />
        </section>

        {past.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-white/20 rounded-full" />
              <h2 className="text-[#f5f5f0]/70 font-bold text-lg tracking-tight">Resultados pasados</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {past.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#111111] border border-white/5 rounded-2xl p-5 opacity-70 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-[#f5f5f0] font-bold text-sm">{c.nombre}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#f5f5f0]/55 mt-1">
                      <span>{format(new Date(c.fecha), "d MMM yyyy", { locale: es })}</span>
                      <span className="w-1 h-1 rounded-full bg-current" aria-hidden="true" />
                      <span>{c.tipo}</span>
                      <span className="w-1 h-1 rounded-full bg-current" aria-hidden="true" />
                      <span>{c.plazas} plazas</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-[#f5f5f0]/55">
                    Finalizado
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <InscriptionModal
        campeonato={modal}
        onClose={() => {
          setModal(null)
          refreshInscribed()
        }}
      />
    </div>
  )
}
