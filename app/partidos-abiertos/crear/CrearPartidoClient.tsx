"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Calendar, Clock, Lock, Users, Check } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { appendCreatedMatch } from "@/lib/userActivity"

const HOURS = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00", "21:30"]
const LEVELS = ["Iniciación", "Intermedio", "Avanzado"] as const

export default function CrearPartidoClient() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [nivel, setNivel] = useState<(typeof LEVELS)[number]>("Intermedio")
  const [visibilidad, setVisibilidad] = useState<"publico" | "privado">("publico")
  const [notas, setNotas] = useState("")

  function nextFromStep1() {
    if (!fecha || !hora) {
      toast.error("Elige fecha y hora")
      return
    }
    setStep(2)
  }

  function submit() {
    appendCreatedMatch({
      date: fecha,
      time: hora,
      level: nivel,
      visibility: visibilidad,
      notes: notas,
    })
    toast.success("Partido creado", {
      description: "Lo verás en tu listado de Partidos abiertos.",
    })
    router.push("/partidos-abiertos")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6">
            <Breadcrumbs />
          </div>
          <Link
            href="/partidos-abiertos"
            className="inline-flex items-center gap-2 text-[#f5f5f0]/55 hover:text-[#3a7d44] text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Volver a partidos abiertos
          </Link>
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">Nuevo partido</span>
          <h1
            className="text-[#f5f5f0] font-display font-black tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            CREAR <span className="text-[#3a7d44]">PARTIDO</span>
          </h1>
          <p className="text-[#f5f5f0]/55 text-sm mt-2">Dos pasos: cuándo juegas → quién puede unirse.</p>

          <div className="flex gap-2 mt-8" aria-label="Progreso">
            <div
              className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-[#3a7d44]" : "bg-white/10"}`}
              aria-current={step === 1 ? "step" : undefined}
            />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-[#3a7d44]" : "bg-white/10"}`} />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28">
        {step === 1 && (
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-[#f5f5f0] font-bold flex items-center gap-2">
              <Calendar size={18} className="text-[#3a7d44]" aria-hidden="true" />
              Fecha y hora
            </h2>
            <div>
              <label htmlFor="cp-fecha" className="block text-xs font-bold text-[#f5f5f0]/55 uppercase tracking-widest mb-2">
                Día
              </label>
              <input
                id="cp-fecha"
                name="fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full max-w-xs rounded-[var(--radius-input)] bg-[#1a1a1a] border border-white/15 px-4 py-3 text-[#f5f5f0] text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#3a7d44]"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-[#f5f5f0]/55 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Clock size={14} aria-hidden="true" />
                Hora de inicio
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Hora de inicio">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHora(h)}
                    className={`min-h-11 min-w-[4.5rem] px-3 py-2 rounded-[var(--radius-btn)] text-sm font-semibold border transition-colors ${
                      hora === h
                        ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                        : "bg-[#1a1a1a] border-white/15 text-[#f5f5f0]/80 hover:border-[#3a7d44]/50"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={nextFromStep1}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-8 py-3 rounded-[var(--radius-btn)] transition-colors"
            >
              Siguiente
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-[#f5f5f0] font-bold flex items-center gap-2">
              <Users size={18} className="text-[#3a7d44]" aria-hidden="true" />
              Nivel y visibilidad
            </h2>
            <div>
              <p className="text-xs font-bold text-[#f5f5f0]/55 uppercase tracking-widest mb-2">Nivel requerido</p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Nivel">
                {LEVELS.map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    role="radio"
                    aria-checked={nivel === lv}
                    onClick={() => setNivel(lv)}
                    className={`px-4 py-2 rounded-[var(--radius-btn)] text-sm font-semibold border transition-colors ${
                      nivel === lv
                        ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                        : "bg-[#1a1a1a] border-white/15 text-[#f5f5f0]/80"
                    }`}
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#f5f5f0]/55 uppercase tracking-widest mb-2">Visibilidad</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisibilidad("publico")}
                  className={`flex items-start gap-3 text-left p-4 rounded-[var(--radius-card)] border transition-colors ${
                    visibilidad === "publico"
                      ? "border-[#3a7d44] bg-[#3a7d44]/10"
                      : "border-white/10 bg-[#1a1a1a] hover:border-white/20"
                  }`}
                >
                  <Users className="text-[#3a7d44] shrink-0 mt-0.5" size={18} aria-hidden="true" />
                  <span>
                    <span className="block text-[#f5f5f0] font-bold text-sm">Público</span>
                    <span className="text-[#f5f5f0]/55 text-xs">Cualquier socio puede solicitar plaza.</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilidad("privado")}
                  className={`flex items-start gap-3 text-left p-4 rounded-[var(--radius-card)] border transition-colors ${
                    visibilidad === "privado"
                      ? "border-[#e8d44d] bg-[#e8d44d]/10"
                      : "border-white/10 bg-[#1a1a1a] hover:border-white/20"
                  }`}
                >
                  <Lock className="text-[#e8d44d] shrink-0 mt-0.5" size={18} aria-hidden="true" />
                  <span>
                    <span className="block text-[#f5f5f0] font-bold text-sm">Solo invitación</span>
                    <span className="text-[#f5f5f0]/55 text-xs">Compartes enlace con tus contactos.</span>
                  </span>
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="cp-notas" className="block text-xs font-bold text-[#f5f5f0]/55 uppercase tracking-widest mb-2">
                Notas (opcional)
              </label>
              <textarea
                id="cp-notas"
                name="notas"
                rows={3}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej.: traed pelotas nuevas, pista panorámica si hay…"
                className="w-full rounded-[var(--radius-input)] bg-[#1a1a1a] border border-white/15 px-4 py-3 text-[#f5f5f0] text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#3a7d44] placeholder:text-[#f5f5f0]/35"
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-[#f5f5f0] font-bold px-6 py-3 rounded-[var(--radius-btn)] hover:bg-white/5 transition-colors"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Atrás
              </button>
              <button
                type="button"
                onClick={submit}
                className="inline-flex items-center justify-center gap-2 bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] font-black px-8 py-3 rounded-[var(--radius-btn)] transition-colors"
              >
                <Check size={18} aria-hidden="true" />
                Publicar partido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
