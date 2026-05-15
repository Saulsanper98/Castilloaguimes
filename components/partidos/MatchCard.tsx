"use client"

import { Clock, MapPin, Sparkles, MessageCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Partido } from "@/types"
import { PlayerAvatars } from "./PlayerAvatars"

const LEVEL_STYLES: Record<string, string> = {
  Iniciación: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  Intermedio: "bg-[#e8d44d]/20 text-[#e8d44d] border border-[#e8d44d]/30",
  Avanzado: "bg-red-500/20 text-red-400 border border-red-500/30",
}

interface Props {
  partido: Partido
  /** ¿Este partido completaría su grupo si me uno yo? */
  isCloser?: boolean
  /** ¿Coincide con mi nivel? */
  isCompatibleLevel?: boolean
  joined?: boolean
  onJoin?: (id: number) => void
  onMessage?: (id: number) => void
}

export function MatchCard({ partido, isCloser, isCompatibleLevel, joined, onJoin, onMessage }: Props) {
  const spotsLeft = partido.plazasTotal - partido.plazasOcupadas
  const isFull = spotsLeft === 0

  return (
    <div
      className={`relative bg-[#111111] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg ${
        isCloser
          ? "border-[#e8d44d]/60 shadow-[#e8d44d]/10"
          : isCompatibleLevel
          ? "border-[#3a7d44]/40 hover:border-[#3a7d44]/60 hover:shadow-[#3a7d44]/10"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      {isCloser && !isFull && (
        <span
          className="absolute -top-2 left-4 inline-flex items-center gap-1 bg-[#e8d44d] text-[#0a0a0a] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
          title="Si te unes, se completaría este partido"
        >
          <Sparkles size={10} aria-hidden="true" />
          Cerrarías el grupo
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[#f5f5f0] font-bold text-sm capitalize">
            {format(new Date(partido.fecha), "EEEE d MMM", { locale: es })}
          </div>
          <div className="flex items-center gap-1.5 text-[#f5f5f0]/60 text-xs mt-0.5 flex-wrap">
            <Clock size={11} aria-hidden="true" />
            {partido.hora}
            <span className="text-[#f5f5f0]/40">·</span>
            <MapPin size={11} aria-hidden="true" />
            {partido.pista}
          </div>
        </div>
        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${LEVEL_STYLES[partido.nivel]}`}>
          {partido.nivel}
        </span>
      </div>

      <p className="text-[#f5f5f0]/65 text-xs leading-relaxed line-clamp-2">{partido.descripcion}</p>

      <PlayerAvatars total={partido.plazasTotal} occupied={partido.plazasOcupadas + (joined ? 1 : 0)} />

      <div className="flex items-center justify-between border-t border-white/10 pt-4 gap-2">
        <span className="text-[#3a7d44] font-black text-lg tabular-nums">
          {partido.precio}€
          <span className="text-[#f5f5f0]/55 text-xs font-normal"> /jugador</span>
        </span>
        <div className="flex items-center gap-2">
          {onMessage && joined && (
            <button
              type="button"
              onClick={() => onMessage(partido.id)}
              aria-label="Abrir chat del partido"
              className="w-9 h-9 rounded-xl border border-white/15 text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:bg-white/5 flex items-center justify-center transition-colors"
            >
              <MessageCircle size={14} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            disabled={isFull || joined}
            onClick={() => onJoin?.(partido.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[36px] ${
              joined
                ? "bg-[#3a7d44]/20 text-[#3a7d44] border border-[#3a7d44]/50"
                : isFull
                ? "bg-white/5 text-[#f5f5f0]/55 cursor-not-allowed"
                : "bg-[#3a7d44] hover:bg-[#4a9d54] text-white"
            }`}
          >
            {joined ? "Apuntado ✓" : isFull ? "Completo" : "Unirse"}
          </button>
        </div>
      </div>
    </div>
  )
}
