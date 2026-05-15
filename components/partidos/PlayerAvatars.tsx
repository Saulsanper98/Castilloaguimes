"use client"

import { UserCircle } from "lucide-react"

const AVATAR_COLORS = ["bg-[#3a7d44]", "bg-blue-600", "bg-purple-600", "bg-orange-600"]
const NAMES = [
  { initials: "MG", name: "Marcos G.", level: "Intermedio" },
  { initials: "AR", name: "Ana R.", level: "Avanzado" },
  { initials: "JL", name: "Juanjo L.", level: "Intermedio" },
  { initials: "CP", name: "Carmen P.", level: "Avanzado" },
]

interface Props {
  total: number
  occupied: number
}

export function PlayerAvatars({ total, occupied }: Props) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const occ = i < occupied
        const p = NAMES[i % NAMES.length]
        return (
          <div
            key={i}
            className={`relative group w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#111111] transition-transform hover:scale-110 hover:z-10 ${
              occ ? AVATAR_COLORS[i % AVATAR_COLORS.length] : "bg-white/10 border-dashed"
            }`}
            aria-label={occ ? `Jugador: ${p.name}, nivel ${p.level}` : "Plaza libre"}
            title={occ ? `${p.name} · ${p.level}` : "Plaza libre"}
          >
            {occ ? p.initials : <UserCircle size={14} className="text-white/35" aria-hidden="true" />}
            {/* Tooltip on hover (desktop) */}
            {occ && (
              <span
                role="tooltip"
                className="hidden group-hover:flex absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1a1a1a] border border-white/15 text-[#f5f5f0] text-[10px] font-medium px-2 py-1 rounded shadow-lg z-20 pointer-events-none"
              >
                {p.name} · {p.level}
              </span>
            )}
          </div>
        )
      })}
      <span className="text-[#f5f5f0]/60 text-xs ml-2">
        {total - occupied} libre{total - occupied !== 1 ? "s" : ""}
      </span>
    </div>
  )
}
