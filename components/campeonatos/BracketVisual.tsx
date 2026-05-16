"use client"

import { Trophy } from "lucide-react"

interface Player {
  name: string
  /** Equipo ganador del nodo previo */
  winner?: boolean
}

interface Match {
  id: string
  p1: Player
  p2: Player
}

// Bracket fake (8 → 4 → 2 → 1)
const ROUND_1: Match[] = [
  { id: "R1-1", p1: { name: "García / López" }, p2: { name: "Suárez / Ramos", winner: true } },
  { id: "R1-2", p1: { name: "Hdez / Pérez", winner: true }, p2: { name: "Mtz / Ojeda" } },
  { id: "R1-3", p1: { name: "Cabrera / Vega" }, p2: { name: "Reyes / Vargas", winner: true } },
  { id: "R1-4", p1: { name: "Quesada / Mora", winner: true }, p2: { name: "Gil / Falcón" } },
]
const QUARTERS: Match[] = [
  { id: "QF-1", p1: { name: "Suárez / Ramos", winner: true }, p2: { name: "Hdez / Pérez" } },
  { id: "QF-2", p1: { name: "Reyes / Vargas" }, p2: { name: "Quesada / Mora", winner: true } },
]
const FINAL: Match[] = [
  { id: "F-1", p1: { name: "Suárez / Ramos", winner: true }, p2: { name: "Quesada / Mora" } },
]

function MatchBox({ m }: { m: Match }) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden text-xs">
      <Row name={m.p1.name} winner={m.p1.winner} />
      <div className="h-px bg-white/10" />
      <Row name={m.p2.name} winner={m.p2.winner} />
    </div>
  )
}

function Row({ name, winner }: { name: string; winner?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 ${
        winner ? "bg-[#3a7d44]/15 text-[#f5f5f0]" : "text-[#f5f5f0]/65"
      }`}
    >
      <span className={`truncate ${winner ? "font-bold" : ""}`}>{name}</span>
      {winner && <Trophy size={11} className="text-[#3a7d44] shrink-0 ml-2" aria-hidden="true" />}
    </div>
  )
}

export function BracketVisual() {
  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-4 sm:p-6 overflow-x-auto">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3a7d44]">
          Cuadro de ejemplo — categoría A
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8d44d]/30 bg-[#e8d44d]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#e8d44d]">
          Demo
        </span>
      </div>
      <p className="text-[#f5f5f0]/55 text-xs mb-6">
        Vista de ejemplo. El cuadro real se actualizará automáticamente durante cada torneo.
      </p>
      <div className="grid grid-cols-4 gap-3 min-w-[640px]">
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase text-[#f5f5f0]/45 tracking-widest">Cuartos</span>
          {ROUND_1.map((m) => (
            <MatchBox key={m.id} m={m} />
          ))}
        </div>
        <div className="space-y-4 pt-12">
          <span className="text-[10px] font-bold uppercase text-[#f5f5f0]/45 tracking-widest">Semifinales</span>
          {QUARTERS.map((m) => (
            <MatchBox key={m.id} m={m} />
          ))}
        </div>
        <div className="space-y-4 pt-32">
          <span className="text-[10px] font-bold uppercase text-[#f5f5f0]/45 tracking-widest">Final</span>
          {FINAL.map((m) => (
            <MatchBox key={m.id} m={m} />
          ))}
        </div>
        <div className="space-y-4 pt-32">
          <span className="text-[10px] font-bold uppercase text-[#e8d44d] tracking-widest">Campeón</span>
          <div className="bg-gradient-to-br from-[#e8d44d]/25 to-transparent border border-[#e8d44d]/40 rounded-lg px-3 py-3 text-center">
            <Trophy size={20} className="text-[#e8d44d] mx-auto mb-1" aria-hidden="true" />
            <p className="text-[#f5f5f0] font-display font-black text-sm leading-tight">Por decidir</p>
            <p className="text-[#f5f5f0]/55 text-[10px] mt-1">Dom 20:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
