"use client"

import { useEffect, useState } from "react"

export function EventCountdown({ title, targetISO }: { title: string; targetISO: string }) {
  const [ms, setMs] = useState<number | null>(null)

  useEffect(() => {
    const target = new Date(targetISO).getTime()
    const tick = () => setMs(target - Date.now())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [targetISO])

  if (ms === null) return null
  // Si el evento ya pasó hace más de 24h, no mostramos nada
  if (ms < -86_400_000) return null
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)

  return (
    <div className="mt-6 p-4 rounded-xl border border-[#3a7d44]/35 bg-[#3a7d44]/10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#3a7d44] mb-1">Próximo gran evento</p>
      <p className="text-[#f5f5f0] font-semibold text-sm mb-2">{title}</p>
      <p className="text-[#f5f5f0]/70 text-xs tabular-nums">
        {ms <= 0 ? (
          <span className="text-[#e8d44d] font-bold">¡Ya está aquí!</span>
        ) : (
          <>
            Faltan <span className="text-[#f5f5f0] font-black">{d}</span>d{" "}
            <span className="text-[#f5f5f0] font-black">{h}</span>h{" "}
            <span className="text-[#f5f5f0] font-black">{m}</span>m
          </>
        )}
      </p>
    </div>
  )
}
