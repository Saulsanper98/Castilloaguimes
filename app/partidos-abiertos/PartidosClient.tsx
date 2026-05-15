"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Clock, MapPin, Plus, UserCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import partidosData from "@/data/partidos.json"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { Partido } from "@/types"

const partidos = partidosData as Partido[]

const LEVEL_STYLES: Record<string, { badge: string; dot: string }> = {
  Iniciación: { badge: "bg-blue-500/20 text-blue-400 border border-blue-500/30", dot: "bg-blue-400" },
  Intermedio: { badge: "bg-[#e8d44d]/20 text-[#e8d44d] border border-[#e8d44d]/30", dot: "bg-[#e8d44d]" },
  Avanzado: { badge: "bg-red-500/20 text-red-400 border border-red-500/30", dot: "bg-red-400" },
}

const AVATAR_COLORS = [
  "bg-[#3a7d44]", "bg-blue-600", "bg-purple-600", "bg-orange-600",
]

function PlayerAvatars({ total, occupied }: { total: number; occupied: number }) {
  const names = ["MG", "AR", "JL", "CP"]
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#111111] ${
            i < occupied ? AVATAR_COLORS[i % AVATAR_COLORS.length] : "bg-white/10 border-dashed"
          }`}
        >
          {i < occupied ? names[i] : <UserCircle size={14} className="text-white/30" />}
        </div>
      ))}
      <span className="text-[#f5f5f0]/60 text-xs ml-2">
        {total - occupied} libre{total - occupied !== 1 ? "s" : ""}
      </span>
    </div>
  )
}

export default function PartidosPage() {
  const [filterDate, setFilterDate] = useState("")
  const [filterLevel, setFilterLevel] = useState("")
  const [filterHour, setFilterHour] = useState("")

  const filtered = partidos.filter((p) => {
    if (filterDate && !p.fecha.startsWith(filterDate)) return false
    if (filterLevel && p.nivel !== filterLevel) return false
    if (filterHour && p.hora !== filterHour) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Breadcrumbs />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
                Juega con otros
              </span>
              <h1
                className="text-[#f5f5f0] font-display font-black tracking-tight"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
              >
                PARTIDOS <span className="text-[#3a7d44]">ABIERTOS</span>
              </h1>
            </div>
            <Link
              href="/partidos-abiertos/crear"
              className="flex items-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shrink-0"
            >
              <Plus size={16} aria-hidden="true" />
              Crear partido
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="search" aria-label="Filtros de partidos">
          <div>
            <label htmlFor="filter-date" className="sr-only">Filtrar por fecha</label>
            <input
              id="filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#3a7d44]/60 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="filter-level" className="sr-only">Filtrar por nivel</label>
            <select
              id="filter-level"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#3a7d44]/60 transition-colors"
            >
              <option value="">Todos los niveles</option>
              <option value="Iniciación">Iniciación</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-hour" className="sr-only">Filtrar por hora</label>
            <select
              id="filter-hour"
              value={filterHour}
              onChange={(e) => setFilterHour(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#3a7d44]/60 transition-colors"
            >
              <option value="">Cualquier hora</option>
              {["09:00", "10:00", "11:00", "12:30", "18:00", "18:30", "19:00", "20:00"].map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="button"
              onClick={() => { setFilterDate(""); setFilterLevel(""); setFilterHour("") }}
              disabled={!filterDate && !filterLevel && !filterHour}
              className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-[#f5f5f0]/70 text-sm rounded-xl border border-white/10 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Count */}
        <p className="text-[#f5f5f0]/60 text-sm mb-5">
          {filtered.length} partido{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#f5f5f0]/55">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p>No hay partidos con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((partido) => {
              const levelStyle = LEVEL_STYLES[partido.nivel]
              const spotsLeft = partido.plazasTotal - partido.plazasOcupadas
              const isFull = spotsLeft === 0
              return (
                <div
                  key={partido.id}
                  className="bg-[#111111] border border-white/10 hover:border-[#3a7d44]/40 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-[#3a7d44]/10"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[#f5f5f0] font-bold text-sm capitalize">
                        {format(new Date(partido.fecha), "EEEE d MMM", { locale: es })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#f5f5f0]/50 text-xs mt-0.5">
                        <Clock size={11} />
                        {partido.hora}
                        <span className="text-[#f5f5f0]/55">·</span>
                        <MapPin size={11} />
                        {partido.pista}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${levelStyle.badge}`}>
                      {partido.nivel}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[#f5f5f0]/50 text-xs leading-relaxed line-clamp-2">
                    {partido.descripcion}
                  </p>

                  {/* Players */}
                  <PlayerAvatars total={partido.plazasTotal} occupied={partido.plazasOcupadas} />

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-[#3a7d44] font-black text-lg">
                      {partido.precio}€
                      <span className="text-[#f5f5f0]/55 text-xs font-normal"> /jugador</span>
                    </span>
                    <button
                      disabled={isFull}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isFull
                          ? "bg-white/5 text-[#f5f5f0]/55 cursor-not-allowed"
                          : "bg-[#3a7d44] hover:bg-[#4a9d54] text-white"
                      }`}
                    >
                      {isFull ? "Completo" : "Unirse"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
