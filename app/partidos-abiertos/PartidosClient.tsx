"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Users, Plus, LayoutGrid, Calendar as CalendarIcon, Sparkles, Filter, RotateCcw } from "lucide-react"
import { format, parseISO, startOfDay, addDays, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import partidosData from "@/data/partidos.json"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { MatchCard } from "@/components/partidos/MatchCard"
import { MatchChat } from "@/components/partidos/MatchChat"
import { Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { loadProfile, patchProfile, compatibleLevels, type PlayerLevel } from "@/lib/player"
import type { Partido } from "@/types"

const partidos = partidosData as Partido[]

type ViewMode = "grid" | "calendar"

export default function PartidosClient() {
  const [filterDate, setFilterDate] = useState("")
  const [filterLevel, setFilterLevel] = useState<"" | PlayerLevel>("")
  const [filterHour, setFilterHour] = useState("")
  const [onlyForMyLevel, setOnlyForMyLevel] = useState(false)
  const [onlyCloser, setOnlyCloser] = useState(false)
  const [view, setView] = useState<ViewMode>("grid")
  const [loading, setLoading] = useState(true)
  const [joinedIds, setJoinedIds] = useState<number[]>([])
  const [chatId, setChatId] = useState<number | null>(null)

  // Load profile + simulate fetch delay for skeletons
  useEffect(() => {
    const id = requestAnimationFrame(() => setJoinedIds(loadProfile().joinedMatchIds))
    const t = setTimeout(() => setLoading(false), 350)
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(t)
    }
  }, [])

  const profile = loadProfile()
  const compatibleSet = useMemo(() => new Set(compatibleLevels(profile.level)), [profile.level])

  const filtered = partidos.filter((p) => {
    if (filterDate && !p.fecha.startsWith(filterDate)) return false
    if (filterLevel && p.nivel !== filterLevel) return false
    if (filterHour && p.hora !== filterHour) return false
    if (onlyForMyLevel && !compatibleSet.has(p.nivel)) return false
    if (onlyCloser && p.plazasTotal - p.plazasOcupadas !== 1) return false
    return true
  })

  const hasAnyFilter = filterDate || filterLevel || filterHour || onlyForMyLevel || onlyCloser

  // Smart recommendation: 3 partidos compatibles con mi nivel y con plazas libres, ordenados por proximidad (fecha) y plazasLibres asc
  const recommendations = useMemo(() => {
    const today = startOfDay(new Date())
    return [...partidos]
      .filter((p) => compatibleSet.has(p.nivel) && p.plazasOcupadas < p.plazasTotal && parseISO(p.fecha) >= today)
      .sort((a, b) => {
        const da = parseISO(a.fecha).getTime()
        const db = parseISO(b.fecha).getTime()
        if (da !== db) return da - db
        return a.plazasTotal - a.plazasOcupadas - (b.plazasTotal - b.plazasOcupadas)
      })
      .slice(0, 3)
  }, [compatibleSet])

  function join(id: number) {
    if (joinedIds.includes(id)) return
    const next = [...joinedIds, id]
    setJoinedIds(next)
    patchProfile({
      joinedMatchIds: next,
      loyaltyPoints: profile.loyaltyPoints + 5,
    })
    toast.success("¡Te has apuntado al partido!", {
      description: "Recibirás un recordatorio el día anterior. +5 puntos.",
    })
  }

  // Calendar grouping: 14 days starting today
  const calendarDays = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i))
  const byDay = (day: Date) =>
    filtered.filter((p) => isSameDay(parseISO(p.fecha), day))

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-8 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
              <p className="text-[#f5f5f0]/65 mt-2 text-sm">
                Tu nivel: <span className="text-[#3a7d44] font-bold">{profile.level}</span> · ELO {profile.elo}
              </p>
            </div>
            <Link
              href="/partidos-abiertos/crear"
              className="flex items-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shrink-0 self-start sm:self-auto"
            >
              <Plus size={16} aria-hidden="true" />
              Crear partido
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Smart recommendations */}
        {recommendations.length > 0 && !hasAnyFilter && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-[#e8d44d]" aria-hidden="true" />
              <h2 className="text-[#f5f5f0] font-bold text-sm uppercase tracking-widest">
                Para tu nivel
              </h2>
              <span className="text-[#f5f5f0]/45 text-xs">· {recommendations.length} sugerencias</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((p) => (
                <MatchCard
                  key={p.id}
                  partido={p}
                  isCompatibleLevel
                  isCloser={p.plazasTotal - p.plazasOcupadas === 1}
                  joined={joinedIds.includes(p.id)}
                  onJoin={join}
                  onMessage={(id) => setChatId(id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Filters + view toggle */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 mb-8" role="search" aria-label="Filtros de partidos">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
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
                onChange={(e) => setFilterLevel(e.target.value as PlayerLevel | "")}
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
            <button
              type="button"
              onClick={() => { setFilterDate(""); setFilterLevel(""); setFilterHour(""); setOnlyForMyLevel(false); setOnlyCloser(false) }}
              disabled={!hasAnyFilter}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-[#f5f5f0]/70 text-sm rounded-xl border border-white/10 transition-colors"
            >
              <RotateCcw size={13} aria-hidden="true" />
              Limpiar
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5">
            <span className="text-[10px] uppercase tracking-widest text-[#f5f5f0]/45 font-bold flex items-center gap-1">
              <Filter size={11} aria-hidden="true" /> Inteligente
            </span>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#f5f5f0]/80">
              <input
                type="checkbox"
                className="accent-[#3a7d44] w-3.5 h-3.5"
                checked={onlyForMyLevel}
                onChange={(e) => setOnlyForMyLevel(e.target.checked)}
              />
              Solo para mi nivel
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#f5f5f0]/80">
              <input
                type="checkbox"
                className="accent-[#3a7d44] w-3.5 h-3.5"
                checked={onlyCloser}
                onChange={(e) => setOnlyCloser(e.target.checked)}
              />
              Buscan 1 jugador (cerrarías el grupo)
            </label>
            <div className="ml-auto inline-flex bg-[#1a1a1a] rounded-lg border border-white/10 p-0.5">
              <button
                type="button"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === "grid" ? "bg-[#3a7d44] text-white" : "text-[#f5f5f0]/65 hover:text-[#f5f5f0]"}`}
              >
                <LayoutGrid size={12} aria-hidden="true" /> Grid
              </button>
              <button
                type="button"
                aria-pressed={view === "calendar"}
                onClick={() => setView("calendar")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === "calendar" ? "bg-[#3a7d44] text-white" : "text-[#f5f5f0]/65 hover:text-[#f5f5f0]"}`}
              >
                <CalendarIcon size={12} aria-hidden="true" /> Calendario
              </button>
            </div>
          </div>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-[#f5f5f0]/65 text-sm mb-5">
            {filtered.length} partido{filtered.length !== 1 ? "s" : ""} {hasAnyFilter ? "con filtros aplicados" : "disponibles"}
          </p>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#111111] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-full" />
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="w-8 h-8 rounded-full" />
                  ))}
                </div>
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid view */}
        {!loading && view === "grid" && (
          filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Pista vacía"
              description="No encontramos partidos con esos filtros. Relaja los criterios o crea uno nuevo y deja que los demás se apunten."
              action={
                <Link
                  href="/partidos-abiertos/crear"
                  className="inline-flex items-center gap-1.5 bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  <Plus size={13} aria-hidden="true" />
                  Crear partido
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <MatchCard
                  key={p.id}
                  partido={p}
                  isCompatibleLevel={compatibleSet.has(p.nivel)}
                  isCloser={p.plazasTotal - p.plazasOcupadas === 1}
                  joined={joinedIds.includes(p.id)}
                  onJoin={join}
                  onMessage={(id) => setChatId(id)}
                />
              ))}
            </div>
          )
        )}

        {/* Calendar view */}
        {!loading && view === "calendar" && (
          <div className="space-y-6">
            {calendarDays.map((day) => {
              const dayMatches = byDay(day)
              if (dayMatches.length === 0) return null
              return (
                <div key={day.toISOString()}>
                  <h3 className="text-[#f5f5f0]/80 text-xs uppercase tracking-widest font-bold mb-3 capitalize flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-[#3a7d44]" />
                    {format(day, "EEEE d 'de' MMMM", { locale: es })}
                    <span className="text-[#f5f5f0]/40 normal-case font-normal tracking-normal">· {dayMatches.length} partido{dayMatches.length !== 1 ? "s" : ""}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dayMatches.map((p) => (
                      <MatchCard
                        key={p.id}
                        partido={p}
                        isCompatibleLevel={compatibleSet.has(p.nivel)}
                        isCloser={p.plazasTotal - p.plazasOcupadas === 1}
                        joined={joinedIds.includes(p.id)}
                        onJoin={join}
                        onMessage={(id) => setChatId(id)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
            {calendarDays.every((d) => byDay(d).length === 0) && (
              <EmptyState
                icon={CalendarIcon}
                title="Dos semanas sin partidos"
                description="Aún no hay nada agendado en los próximos 14 días. Sé el primero en abrir uno."
              />
            )}
          </div>
        )}
      </div>

      <MatchChat matchId={chatId} onClose={() => setChatId(null)} />
    </div>
  )
}
