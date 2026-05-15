"use client"

import { useEffect, useState } from "react"
import { getOpeningStatus } from "@/lib/openingHours"

export function ClubClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    const boot = window.setTimeout(tick, 0)
    const id = window.setInterval(tick, 60_000)
    return () => {
      window.clearTimeout(boot)
      window.clearInterval(id)
    }
  }, [])

  if (!now) return <span className="text-[#f5f5f0]/45 text-xs">Horario club…</span>

  const time = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Atlantic/Canary",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(now)

  const status = getOpeningStatus(now)

  return (
    <p className="text-[#f5f5f0]/55 text-xs leading-relaxed">
      <span className="text-[#f5f5f0]/75 font-semibold">{time}</span>
      {" · "}
      <span className={status.isOpen ? "text-[#3a7d44]" : "text-amber-400/90"}>
        {status.isOpen ? "Abierto ahora" : "Cerrado"}
      </span>
      <span className="text-[#f5f5f0]/45"> — {status.hint}</span>
    </p>
  )
}
