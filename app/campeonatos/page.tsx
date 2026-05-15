"use client"

import { Trophy, Calendar, Users, Tag } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import campeonatosData from "@/data/campeonatos.json"
import { Campeonato } from "@/types"

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
    btn: "bg-white/10 text-[#f5f5f0]/40 cursor-not-allowed",
    btnText: "Completo",
  },
  Finalizado: {
    badge: "bg-white/10 text-[#f5f5f0]/40 border border-white/10",
    btn: "bg-white/5 text-[#f5f5f0]/30 cursor-not-allowed",
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

function SpotsBar({ total, occupied }: { total: number; occupied: number }) {
  const pct = (occupied / total) * 100
  return (
    <div>
      <div className="flex justify-between text-xs text-[#f5f5f0]/40 mb-1.5">
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

export default function CampeonatosPage() {
  const upcoming = campeonatos.filter((c) => c.estado !== "Finalizado")
  const past = campeonatos.filter((c) => c.estado === "Finalizado")

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
            Competición
          </span>
          <h1
            className="text-[#f5f5f0] font-black tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            CAMPEONATOS
          </h1>
          <p className="text-[#f5f5f0]/50 mt-2 text-base">
            Torneos y ligas para todos los niveles. Compite, supérate y vive la emoción.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Upcoming */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Trophy size={20} className="text-[#3a7d44]" />
            <h2 className="text-[#f5f5f0] font-black text-xl tracking-tight">Próximos Torneos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((c, i) => {
              const tipoStyle = TIPO_STYLES[c.tipo] || ""
              const estadoStyle = ESTADO_STYLES[c.estado]
              return (
                <div
                  key={c.id}
                  className="bg-[#111111] border border-white/10 hover:border-[#3a7d44]/40 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-[#3a7d44]/10 flex flex-col"
                >
                  {/* Image placeholder */}
                  <div className={`h-36 bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} relative flex items-end p-4`}>
                    <Trophy size={32} className="text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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

                    <div className="flex items-center gap-4 text-xs text-[#f5f5f0]/40">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {format(new Date(c.fecha), "d MMM yyyy", { locale: es })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={11} />
                        {c.plazas} plazas
                      </span>
                    </div>

                    <p className="text-[#f5f5f0]/50 text-xs leading-relaxed line-clamp-2">{c.descripcion}</p>

                    <SpotsBar total={c.plazas} occupied={c.plazasOcupadas} />

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
                      <div className="flex items-center gap-1.5 text-[#f5f5f0]/50 text-xs">
                        <Tag size={11} />
                        <span className="text-[#3a7d44] font-bold text-base">{c.precio}€</span>
                        <span>/pareja</span>
                      </div>
                      <button
                        disabled={c.estado !== "Inscripción abierta"}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${estadoStyle.btn}`}
                      >
                        {estadoStyle.btnText}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Past results */}
        {past.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-white/20 rounded-full" />
              <h2 className="text-[#f5f5f0]/60 font-bold text-lg tracking-tight">Resultados Pasados</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {past.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#111111] border border-white/5 rounded-2xl p-5 opacity-60 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-[#f5f5f0] font-bold text-sm">{c.nombre}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#f5f5f0]/40 mt-1">
                      <span>{format(new Date(c.fecha), "d MMM yyyy", { locale: es })}</span>
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span>{c.tipo}</span>
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span>{c.plazas} plazas</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-[#f5f5f0]/40">
                    Finalizado
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
