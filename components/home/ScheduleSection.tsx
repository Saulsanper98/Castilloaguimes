"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Clock } from "lucide-react"

const schedules = [
  {
    days: "Lunes – Viernes",
    short: "L–V",
    open: "08:00",
    close: "23:00",
    openHour: 8,
    closeHour: 23,
    accent: true,
    note: null,
  },
  {
    days: "Sábados",
    short: "SAB",
    open: "08:00",
    close: "20:00",
    openHour: 8,
    closeHour: 20,
    accent: false,
    note: null,
  },
  {
    days: "Domingos",
    short: "DOM",
    open: "09:00",
    close: "20:00",
    openHour: 9,
    closeHour: 20,
    accent: false,
    note: null,
  },
  {
    days: "Festivos",
    short: "FEST",
    open: "09:00",
    close: "15:00",
    openHour: 9,
    closeHour: 15,
    accent: false,
    note: "Horario reducido",
  },
]

const DAY_START = 6
const DAY_END = 24
const TOTAL_HOURS = DAY_END - DAY_START

function TimeBar({ openHour, closeHour, accent }: { openHour: number; closeHour: number; accent: boolean }) {
  const startPct = ((openHour - DAY_START) / TOTAL_HOURS) * 100
  const widthPct = ((closeHour - openHour) / TOTAL_HOURS) * 100

  return (
    <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`absolute top-0 h-full rounded-full transition-all duration-700 ${
          accent ? "bg-[#3a7d44]" : "bg-[#3a7d44]/50"
        }`}
        style={{ left: `${startPct}%`, width: `${widthPct}%` }}
      />
    </div>
  )
}

export default function ScheduleSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 lg:py-28 bg-[#111111]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
            Horarios
          </span>
          <h2
            className="text-[#f5f5f0] font-black tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            ABIERTOS
            <span className="text-[#3a7d44]"> PARA TI</span>
          </h2>
          <p className="text-[#f5f5f0]/50 mt-3 text-base max-w-xl mx-auto">
            El complejo está disponible casi todos los días del año para que nunca te quedes sin jugar.
          </p>
        </div>

        {/* Time axis labels */}
        <div className="hidden sm:flex justify-between text-[#f5f5f0]/20 text-xs font-mono mb-2 px-0">
          {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => i + DAY_START)
            .filter((h) => h % 2 === 0)
            .map((h) => (
              <span key={h}>{`${h}:00`}</span>
            ))}
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-4"
        >
          {schedules.map((s, i) => (
            <motion.div
              key={s.days}
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              className={`rounded-2xl border p-5 sm:p-6 ${
                s.accent
                  ? "bg-[#3a7d44]/10 border-[#3a7d44]/40"
                  : "bg-[#1a1a1a] border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black tracking-wider ${
                      s.accent
                        ? "bg-[#3a7d44] text-white"
                        : "bg-white/10 text-[#f5f5f0]/60"
                    }`}
                  >
                    {s.short}
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${s.accent ? "text-[#f5f5f0]" : "text-[#f5f5f0]/80"}`}>
                      {s.days}
                    </div>
                    {s.note && (
                      <div className="text-[#e8d44d] text-xs">{s.note}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#f5f5f0]/60">
                  <Clock size={14} />
                  <span className={`font-bold text-sm ${s.accent ? "text-[#3a7d44]" : ""}`}>
                    {s.open} – {s.close}
                  </span>
                </div>
              </div>
              <TimeBar openHour={s.openHour} closeHour={s.closeHour} accent={s.accent} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 p-4 rounded-xl border border-[#e8d44d]/20 bg-[#e8d44d]/5 flex items-start gap-3">
          <span className="text-[#e8d44d] text-lg">!</span>
          <p className="text-[#f5f5f0]/60 text-sm">
            Los horarios pueden variar en fechas especiales. Consulta el calendario o contacta con recepción para confirmar disponibilidad en días festivos.
          </p>
        </div>
      </div>
    </section>
  )
}
