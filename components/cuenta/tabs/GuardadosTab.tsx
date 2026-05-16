"use client"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, Trash2, Newspaper, Trophy, MapPin, UserCircle } from "lucide-react"
import { toast } from "sonner"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { EmptyState } from "@/components/ui/EmptyState"
import noticias from "@/data/noticias.json"
import campeonatos from "@/data/campeonatos.json"
import type { PlayerProfile } from "@/lib/player"
import { COURTS } from "@/lib/courts"

type Group = "noticias" | "torneos" | "pistas" | "companeros"

interface Props {
  profile: PlayerProfile
  onPatch: (patch: Partial<PlayerProfile>) => void
}

const FAVOURITE_COMPANIONS = [
  { id: 1, name: "Marcos G.", initials: "MG", level: "Intermedio", color: "#3a7d44", lastPlayed: "Hace 3 días" },
  { id: 2, name: "Ana R.", initials: "AR", level: "Avanzado", color: "#e8d44d", lastPlayed: "Hace 1 semana" },
  { id: 3, name: "Juanjo L.", initials: "JL", level: "Intermedio", color: "#7c83ff", lastPlayed: "Hace 2 semanas" },
]

export function GuardadosTab({ profile, onPatch }: Props) {
  const [group, setGroup] = useState<Group>("noticias")

  const savedNews = noticias.filter((n) => profile.savedNewsSlugs.includes(n.slug))
  const savedTorneos = campeonatos.filter((c) => profile.savedCampeonatoIds.includes(c.id))
  const favCourts = COURTS.filter((c) => profile.favouriteCourtIds.includes(c.id))

  const counts: Record<Group, number> = {
    noticias: savedNews.length,
    torneos: savedTorneos.length,
    pistas: favCourts.length,
    companeros: FAVOURITE_COMPANIONS.length,
  }

  const groups: Array<{ id: Group; label: string }> = [
    { id: "noticias", label: "Noticias" },
    { id: "torneos", label: "Torneos" },
    { id: "pistas", label: "Pistas favoritas" },
    { id: "companeros", label: "Compañeros frecuentes" },
  ]

  function unsaveNews(slug: string) {
    onPatch({ savedNewsSlugs: profile.savedNewsSlugs.filter((s) => s !== slug) })
    toast("Quitado de guardados")
  }
  function unsaveTorneo(id: number) {
    onPatch({ savedCampeonatoIds: profile.savedCampeonatoIds.filter((x) => x !== id) })
    toast("Torneo quitado de guardados")
  }
  function unfavCourt(id: number) {
    onPatch({ favouriteCourtIds: profile.favouriteCourtIds.filter((x) => x !== id) })
    toast("Pista quitada de favoritas")
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[#f5f5f0] font-display font-black text-xl">Mis guardados</h2>
        <p className="text-[#f5f5f0]/55 text-xs">Lo que has marcado para volver más tarde.</p>
      </div>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/10">
        {groups.map((g) => {
          const active = group === g.id
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={`relative px-3 sm:px-4 py-2.5 text-xs font-bold transition-colors ${
                active ? "text-[#3a7d44]" : "text-[#f5f5f0]/55 hover:text-[#f5f5f0]"
              }`}
            >
              {g.label}
              <span
                className={`ml-1.5 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[9px] font-bold ${
                  active ? "bg-[#3a7d44]/25 text-[#3a7d44]" : "bg-white/10 text-[#f5f5f0]/55"
                }`}
              >
                {counts[g.id]}
              </span>
              {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3a7d44] rounded-full" />}
            </button>
          )
        })}
      </div>

      {group === "noticias" && (
        savedNews.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="Sin noticias guardadas"
            description="Cuando guardes un artículo aparecerá aquí para que vuelvas a él."
            action={<Link href="/noticias" className="inline-flex bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2.5 rounded-xl">Explorar noticias</Link>}
          />
        ) : (
          <ul className="space-y-3">
            {savedNews.map((n) => (
              <li key={n.slug} className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 group">
                <Link href={`/noticias/${n.slug}`} className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-[#3a7d44] font-bold">{n.categoria}</p>
                  <p className="text-[#f5f5f0] font-bold text-sm truncate">{n.titulo}</p>
                  <p className="text-[#f5f5f0]/45 text-[11px] mt-1">
                    Publicado {formatDistanceToNow(parseISO(n.fecha), { locale: es, addSuffix: true })}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => unsaveNews(n.slug)}
                  aria-label="Quitar de guardados"
                  className="w-8 h-8 rounded-lg border border-white/10 text-[#f5f5f0]/55 hover:text-red-400 hover:border-red-500/40 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )
      )}

      {group === "torneos" && (
        savedTorneos.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="Sin torneos guardados"
            description="Marca los torneos que te interesan para no perderlos."
            action={<Link href="/campeonatos" className="inline-flex bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2.5 rounded-xl">Ver torneos</Link>}
          />
        ) : (
          <ul className="space-y-3">
            {savedTorneos.map((c) => (
              <li key={c.id} className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-[#e8d44d] font-bold">{c.tipo}</p>
                  <p className="text-[#f5f5f0] font-bold text-sm truncate">{c.nombre}</p>
                  <p className="text-[#f5f5f0]/45 text-[11px] mt-1">
                    {format(parseISO(c.fecha), "d MMM yyyy", { locale: es })} · {c.precio}€/pareja
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => unsaveTorneo(c.id)}
                  aria-label="Quitar torneo de guardados"
                  className="w-8 h-8 rounded-lg border border-white/10 text-[#f5f5f0]/55 hover:text-red-400 hover:border-red-500/40 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )
      )}

      {group === "pistas" && (
        favCourts.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Sin pistas favoritas"
            description="Marca tus pistas preferidas para reservarlas más rápido."
            action={<Link href="/reservas" className="inline-flex bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2.5 rounded-xl">Ver plano</Link>}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {favCourts.map((c) => (
              <div key={c.id} className="relative bg-[#111111] border border-white/10 rounded-2xl p-4 text-center">
                <button
                  type="button"
                  onClick={() => unfavCourt(c.id)}
                  aria-label="Quitar de favoritas"
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg text-[#f5f5f0]/55 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                >
                  <Bookmark size={11} className="fill-current" aria-hidden="true" />
                </button>
                <p className="text-[10px] uppercase tracking-widest text-[#3a7d44] font-bold">{c.type}</p>
                <p className="text-[#f5f5f0] font-display font-black text-lg">{c.name}</p>
              </div>
            ))}
          </div>
        )
      )}

      {group === "companeros" && (
        FAVOURITE_COMPANIONS.length === 0 ? (
          <EmptyState icon={UserCircle} title="Sin compañeros frecuentes" description="Tus jugadores habituales aparecerán aquí." />
        ) : (
          <ul className="space-y-3">
            {FAVOURITE_COMPANIONS.map((c) => (
              <li key={c.id} className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <span
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                  style={{ background: c.color }}
                  aria-hidden="true"
                >
                  {c.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[#f5f5f0] font-bold text-sm">{c.name}</p>
                  <p className="text-[#f5f5f0]/55 text-[11px]">{c.level} · {c.lastPlayed}</p>
                </div>
                <Link
                  href={`/partidos-abiertos/crear?invitar=${encodeURIComponent(c.name)}`}
                  className="text-[11px] font-bold text-[#3a7d44] hover:text-[#4a9d54] border border-[#3a7d44]/30 hover:border-[#3a7d44]/50 px-3 py-1.5 rounded-lg"
                >
                  Crear partido
                </Link>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
