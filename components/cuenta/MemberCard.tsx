"use client"

import { LogoMark } from "@/components/brand/Logo"
import { Avatar } from "./Avatar"
import { tierFor } from "@/lib/player"
import { useMemo } from "react"

interface Props {
  name: string
  initials: string
  avatarColor: string
  memberCode: string
  level: string
  elo: number
  loyaltyPoints: number
  joinedAt: string
}

/**
 * Tarjeta digital de socio con QR generado en SVG.
 * El QR es un patrón visual representativo del memberCode (no validable;
 * la lectura real requeriría una librería que aquí no aporta).
 */
export function MemberCard({
  name,
  initials,
  avatarColor,
  memberCode,
  level,
  elo,
  loyaltyPoints,
  joinedAt,
}: Props) {
  const tier = tierFor(loyaltyPoints)
  const qr = useMemo(() => buildQrLikePattern(memberCode), [memberCode])
  const year = new Date(joinedAt).getFullYear()

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3a7d44] via-[#2c5e34] to-[#0a0a0a] p-6 shadow-2xl shadow-black/40 border border-[#3a7d44]/50">
      {/* Decorative court lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 22px)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark className="w-8 h-8" />
            <div className="leading-tight">
              <p className="text-white font-display font-black text-sm tracking-widest">CASTILLO</p>
              <p className="text-white/65 text-[8px] uppercase tracking-[0.3em]">Pádel · Agüimes</p>
            </div>
          </div>
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: `${tier.color}30`, color: tier.color, border: `1px solid ${tier.color}80` }}
          >
            {tier.tier}
          </span>
        </div>

        {/* Member info */}
        <div className="flex items-center gap-3">
          <Avatar initials={initials} color={avatarColor} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-white font-display font-black text-base sm:text-lg leading-tight truncate">{name}</p>
            <p className="text-white/65 text-[10px] uppercase tracking-widest">
              {level} · ELO {elo}
            </p>
          </div>
        </div>

        {/* QR + code */}
        <div className="flex items-center gap-4 bg-black/30 rounded-xl p-3 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-1.5 shrink-0">
            <svg viewBox="0 0 21 21" className="w-16 h-16" aria-label={`Código QR del socio ${memberCode}`}>
              {qr.map((row, y) =>
                row.map((cell, x) =>
                  cell ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0a0a0a" /> : null
                )
              )}
              {/* Corner markers */}
              {[
                [0, 0],
                [14, 0],
                [0, 14],
              ].map(([cx, cy]) => (
                <g key={`${cx}-${cy}`}>
                  <rect x={cx} y={cy} width="7" height="7" fill="none" stroke="#0a0a0a" strokeWidth="1" />
                  <rect x={cx + 2} y={cy + 2} width="3" height="3" fill="#0a0a0a" />
                </g>
              ))}
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-widest text-white/55 font-bold">Nº de socio</p>
            <p className="text-white font-mono font-bold text-lg leading-tight">{memberCode}</p>
            <p className="text-white/55 text-[10px] mt-1">Válido para acceder al torno y a la cafetería · {year}–{year + 1}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Construye una rejilla 21×21 pseudo-aleatoria pero estable a partir
 * del memberCode. No es un QR validable; es decoración con apariencia de QR.
 */
function buildQrLikePattern(seed: string): boolean[][] {
  const size = 21
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Skip corner markers (3 x 7×7)
      if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue
      // Hash-based pseudo-random
      const v = (h ^ ((x * 2654435761) | 0) ^ ((y * 40503) | 0)) >>> 0
      grid[y][x] = (v % 7) < 3
    }
  }
  return grid
}
