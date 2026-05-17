"use client"

import { useEffect, useState } from "react"
import { Tv, Calendar } from "lucide-react"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import campeonatos from "@/data/campeonatos.json"

const REMINDER_KEY = "pcdc-stream-reminders-v1"

interface Props {
  /** Optional override; por defecto se elige el próximo torneo en inscripción. */
  title?: string
  dateISO?: string
}

export function StreamingEmbed({ title, dateISO }: Props) {
  const next = campeonatos.find((c) => c.estado === "Inscripción abierta")
  const finalTitle = title ?? `Final ${next?.nombre ?? "del próximo torneo"}`
  const finalDate = dateISO ?? next?.fecha ?? null
  const eventId = `${finalTitle}|${finalDate ?? ""}`

  const [reminded, setReminded] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(REMINDER_KEY)
        const list = raw ? (JSON.parse(raw) as string[]) : []
        setReminded(list.includes(eventId))
      } catch {
        /* ignore */
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [eventId])

  function setReminder() {
    try {
      const raw = localStorage.getItem(REMINDER_KEY)
      const list = raw ? (JSON.parse(raw) as string[]) : []
      if (!list.includes(eventId)) list.push(eventId)
      localStorage.setItem(REMINDER_KEY, JSON.stringify(list))
    } catch {
      /* ignore */
    }
    setReminded(true)
    toast.success("Recordatorio activado", {
      description: "Te avisaremos antes de la emisión.",
    })
  }

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-[#3a7d44]/30 to-[#0a0a0a] flex flex-col items-center justify-center relative">
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-red-500/90 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Próxima emisión
        </div>
        <Tv size={48} className="text-white/30 mb-3" aria-hidden="true" />
        <p className="text-[#f5f5f0]/85 font-display font-black text-xl uppercase text-center px-4">
          {finalTitle}
        </p>
        {finalDate && (
          <p className="text-[#f5f5f0]/55 text-xs mt-1 capitalize">
            {format(parseISO(finalDate), "EEEE d 'de' MMMM", { locale: es })}
          </p>
        )}
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#f5f5f0]/70 text-xs">
          <Calendar size={12} aria-hidden="true" />
          Streaming en directo desde la pista central
        </div>
        <button
          type="button"
          onClick={setReminder}
          disabled={reminded}
          className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
            reminded
              ? "text-[#3a7d44]/60 cursor-default"
              : "text-[#3a7d44] hover:text-[#4a9d54]"
          }`}
        >
          {reminded ? "Recordatorio ✓" : "Recordatorio"}
        </button>
      </div>
    </div>
  )
}
