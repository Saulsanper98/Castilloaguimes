"use client"

import { useState } from "react"
import Link from "next/link"
import { Trophy, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { MatchCard } from "@/components/partidos/MatchCard"
import { MatchChat } from "@/components/partidos/MatchChat"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { EmptyState } from "@/components/ui/EmptyState"
import partidos from "@/data/partidos.json"
import type { Partido } from "@/types"

interface Props {
  joinedIds: number[]
  onUpdate: (ids: number[]) => void
}

type Bucket = "all" | "today" | "week"

export function PartidosTab({ joinedIds, onUpdate }: Props) {
  const [bucket, setBucket] = useState<Bucket>("all")
  const [chatId, setChatId] = useState<number | null>(null)
  const [confirmLeaveId, setConfirmLeaveId] = useState<number | null>(null)

  const joined = (partidos as Partido[]).filter((p) => joinedIds.includes(p.id))

  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 86_400_000)
  const filtered = joined.filter((p) => {
    if (bucket === "all") return true
    const date = new Date(p.fecha)
    if (bucket === "today") return date.toDateString() === now.toDateString()
    return date <= weekFromNow && date >= now
  })

  function leave(id: number) {
    onUpdate(joinedIds.filter((x) => x !== id))
    setConfirmLeaveId(null)
    toast("Has salido del partido", { description: "Tu plaza queda libre para otros jugadores." })
  }

  const counts = {
    all: joined.length,
    today: joined.filter((p) => new Date(p.fecha).toDateString() === now.toDateString()).length,
    week: joined.filter((p) => {
      const d = new Date(p.fecha)
      return d <= weekFromNow && d >= now
    }).length,
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[#f5f5f0] font-display font-black text-xl">Mis partidos</h2>
          <p className="text-[#f5f5f0]/55 text-xs">Los partidos abiertos a los que te has unido.</p>
        </div>
        <Link
          href="/partidos-abiertos"
          className="inline-flex items-center gap-1.5 bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          Buscar partidos
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-white/10">
        {([
          { id: "all", label: "Todos" },
          { id: "today", label: "Hoy" },
          { id: "week", label: "Esta semana" },
        ] as Array<{ id: Bucket; label: string }>).map(({ id, label }) => {
          const active = bucket === id
          const n = counts[id]
          return (
            <button
              key={id}
              type="button"
              onClick={() => setBucket(id)}
              className={`relative px-4 py-2.5 text-xs font-bold transition-colors ${
                active ? "text-[#3a7d44]" : "text-[#f5f5f0]/55 hover:text-[#f5f5f0]"
              }`}
            >
              {label}
              <span
                className={`ml-1.5 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[9px] font-bold ${
                  active ? "bg-[#3a7d44]/25 text-[#3a7d44]" : "bg-white/10 text-[#f5f5f0]/55"
                }`}
              >
                {n}
              </span>
              {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3a7d44] rounded-full" />}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Pista vacía"
          description={
            bucket === "all"
              ? "Aún no te has apuntado a ningún partido. Hay muchos buscando jugador."
              : "Sin partidos en este periodo."
          }
          action={
            <Link
              href="/partidos-abiertos"
              className="inline-flex bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
            >
              Buscar partidos abiertos
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="relative">
              {/* Mark organizer (first joined of each match in mock) */}
              <span className="absolute -top-2 -left-2 z-10 inline-flex items-center gap-1 bg-[#e8d44d] text-[#0a0a0a] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg">
                Tu partido
              </span>
              <MatchCard
                partido={p}
                joined
                onJoin={() => undefined}
                onMessage={(id) => setChatId(id)}
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChatId(p.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#f5f5f0]/80 hover:text-[#f5f5f0] border border-white/10 hover:border-white/25 px-3 py-2 rounded-lg"
                >
                  <MessageCircle size={11} aria-hidden="true" />
                  Chat
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmLeaveId(p.id)}
                  className="flex-1 inline-flex items-center justify-center text-[11px] font-bold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 px-3 py-2 rounded-lg"
                >
                  Salirme
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MatchChat matchId={chatId} onClose={() => setChatId(null)} />

      <ConfirmDialog
        open={confirmLeaveId !== null}
        title="¿Salir del partido?"
        description="Tu plaza quedará libre y otros jugadores podrán apuntarse. Puedes volver a unirte si sigue habiendo hueco."
        confirmLabel="Salir del partido"
        cancelLabel="Mantener mi plaza"
        destructive
        onConfirm={() => confirmLeaveId !== null && leave(confirmLeaveId)}
        onCancel={() => setConfirmLeaveId(null)}
      />
    </div>
  )
}
