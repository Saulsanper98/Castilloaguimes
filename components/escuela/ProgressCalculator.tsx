"use client"

import { useState, useMemo } from "react"
import { TrendingUp } from "lucide-react"

const LEVELS = ["Iniciación", "Intermedio Bajo", "Intermedio", "Avanzado"] as const
type LevelKey = (typeof LEVELS)[number]

// minutos de práctica acumulada (sesiones × 60min) para alcanzar cada nivel desde 0
const SESSIONS_TO_REACH: Record<LevelKey, number> = {
  "Iniciación": 0,
  "Intermedio Bajo": 30,
  "Intermedio": 90,
  "Avanzado": 200,
}

export function ProgressCalculator() {
  const [current, setCurrent] = useState<LevelKey>("Iniciación")
  const [target, setTarget] = useState<LevelKey>("Intermedio")
  const [freq, setFreq] = useState(2) // sesiones/sem

  const months = useMemo(() => {
    const gap = SESSIONS_TO_REACH[target] - SESSIONS_TO_REACH[current]
    if (gap <= 0) return 0
    const sessionsPerMonth = Math.max(1, freq) * 4.3
    return Math.ceil(gap / sessionsPerMonth)
  }, [current, target, freq])

  const targetIsHigher = SESSIONS_TO_REACH[target] > SESSIONS_TO_REACH[current]
  const goodChoice = targetIsHigher

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-[#3a7d44]" aria-hidden="true" />
        <h3 className="text-[#f5f5f0] font-display font-black text-xl">¿En cuánto puedo mejorar?</h3>
      </div>
      <p className="text-[#f5f5f0]/55 text-sm mb-6 max-w-md">
        Calculadora orientativa. La progresión real depende también de tu técnica de partida y la consistencia entre sesiones.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="calc-current" className="block text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/55 mb-2">
            Tu nivel hoy
          </label>
          <select
            id="calc-current"
            value={current}
            onChange={(e) => setCurrent(e.target.value as LevelKey)}
            className="w-full bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#3a7d44]/60 transition-colors"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="calc-target" className="block text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/55 mb-2">
            Quieres llegar a
          </label>
          <select
            id="calc-target"
            value={target}
            onChange={(e) => setTarget(e.target.value as LevelKey)}
            className="w-full bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#3a7d44]/60 transition-colors"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="calc-freq" className="block text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/55 mb-2">
            Sesiones / semana
          </label>
          <input
            id="calc-freq"
            type="number"
            min={1}
            max={5}
            value={freq}
            onChange={(e) => setFreq(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
            className="w-full bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#3a7d44]/60 transition-colors"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#3a7d44]/10 border border-[#3a7d44]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3a7d44] mb-1">
            Tiempo estimado
          </p>
          {goodChoice ? (
            <p className="text-[#f5f5f0] font-display font-black leading-none" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              {months === 0 ? "Ya estás" : `${months} ${months === 1 ? "mes" : "meses"}`}
            </p>
          ) : (
            <p className="text-[#f5f5f0]/55 text-sm">Selecciona un nivel objetivo superior al actual.</p>
          )}
        </div>
        {goodChoice && months > 0 && (
          <div className="text-right text-xs text-[#f5f5f0]/65">
            <div>
              ≈ <span className="text-[#f5f5f0] font-bold">{Math.ceil(months * freq * 4.3)}</span> sesiones
            </div>
            <div className="mt-1">Con {freq} clases/sem</div>
          </div>
        )}
      </div>
    </div>
  )
}
