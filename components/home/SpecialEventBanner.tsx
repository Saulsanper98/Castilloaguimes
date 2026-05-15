"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Trophy, ArrowRight, Clock } from "lucide-react"
import { parseISO, differenceInCalendarDays, isToday, isTomorrow, isAfter } from "date-fns"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import campeonatos from "@/data/campeonatos.json"
import type { Campeonato } from "@/types"

const all = campeonatos as Campeonato[]

export function SpecialEventBanner() {
  const next = useMemo(() => {
    const today = new Date()
    return all
      .filter((c) => c.estado !== "Finalizado" && isAfter(parseISO(c.fecha), today))
      .sort((a, b) => parseISO(a.fecha).getTime() - parseISO(b.fecha).getTime())[0]
  }, [])

  if (!next) return null

  const date = parseISO(next.fecha)
  const days = differenceInCalendarDays(date, new Date())

  let when: string
  if (isToday(date)) when = "Hoy"
  else if (isTomorrow(date)) when = "Mañana"
  else if (days <= 7) when = `En ${days} días`
  else when = format(date, "d MMM", { locale: es })

  // Solo mostrar si es próximo (≤ 21 días)
  if (days > 21) return null

  return (
    <Link
      href="/campeonatos"
      className="group block relative overflow-hidden bg-gradient-to-r from-[#e8d44d]/20 via-[#3a7d44]/20 to-[#e8d44d]/20 border-y border-[#e8d44d]/30 hover:border-[#e8d44d]/50 transition-colors"
    >
      <div className="absolute inset-0 bg-court-lines opacity-30" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 relative z-10 flex items-center gap-3 sm:gap-4">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#e8d44d]/20 border border-[#e8d44d]/40 flex items-center justify-center shrink-0">
          <Trophy size={18} className="text-[#e8d44d]" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#e8d44d] bg-[#e8d44d]/15 border border-[#e8d44d]/30 px-2 py-0.5 rounded-full">
              <Clock size={9} aria-hidden="true" />
              {when}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#f5f5f0]/55 font-bold">
              {next.tipo} · {next.estado}
            </span>
          </div>
          <p className="text-[#f5f5f0] font-bold text-sm sm:text-base truncate mt-0.5">
            {next.nombre}
            <span className="hidden sm:inline text-[#f5f5f0]/55 font-normal text-sm">
              {" "}· {next.plazas - next.plazasOcupadas} plazas · {next.precio}€/pareja
            </span>
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[#3a7d44] font-bold text-xs shrink-0">
          Ver
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
