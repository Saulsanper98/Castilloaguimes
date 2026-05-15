"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { getOpeningStatus, getMockAvailableCourts } from "@/lib/openingHours"

function subscribe() {
  return () => {}
}

export function LiveStatusChip() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!mounted) {
    // Render placeholder of the same width to prevent layout shift
    return (
      <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide uppercase border border-white/15 px-3 py-1.5 rounded-full bg-white/5 text-[#f5f5f0]/40">
        <span className="w-2 h-2 rounded-full bg-white/20" aria-hidden="true" />
        <span className="opacity-0">Cargando…</span>
      </span>
    )
  }

  const status = getOpeningStatus()
  const courts = status.isOpen ? getMockAvailableCourts() : 0
  // Tick is referenced to ensure re-render every minute
  void tick

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 text-xs font-bold tracking-wide uppercase border px-3 py-1.5 rounded-full ${
        status.isOpen
          ? "border-[#3a7d44]/50 bg-[#3a7d44]/10 text-[#3a7d44]"
          : "border-red-500/40 bg-red-500/10 text-red-400"
      }`}
    >
      <span
        className={`relative w-2 h-2 rounded-full ${status.isOpen ? "bg-[#3a7d44]" : "bg-red-500"}`}
        aria-hidden="true"
      >
        {status.isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#3a7d44] animate-ping opacity-60" />
        )}
      </span>
      {status.isOpen ? (
        <>
          {courts > 0 ? `${courts} pistas libres` : "Abierto"} · {status.hint}
        </>
      ) : (
        status.hint
      )}
    </span>
  )
}
