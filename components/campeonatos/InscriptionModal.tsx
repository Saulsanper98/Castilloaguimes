"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Check, ArrowLeft, ArrowRight, Users, User, CreditCard } from "lucide-react"
import { toast } from "sonner"
import type { Campeonato } from "@/types"

interface Props {
  campeonato: Campeonato | null
  onClose: () => void
}

const CATEGORIES = ["Masculino A", "Masculino B", "Femenino A", "Femenino B", "Mixto"] as const

export function InscriptionModal({ campeonato, onClose }: Props) {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Masculino A")
  const [p1, setP1] = useState("")
  const [p2, setP2] = useState("")
  const [email, setEmail] = useState("")
  const [agree, setAgree] = useState(false)

  function reset() {
    setStep(1)
    setP1("")
    setP2("")
    setEmail("")
    setAgree(false)
    onClose()
  }

  function submit() {
    toast.success("Inscripción enviada (demo)", {
      description: `${campeonato?.nombre} · ${category} · ${p1} / ${p2}`,
    })
    reset()
  }

  const canNext1 = !!p1 && !!p2 && !!email
  const canSubmit = canNext1 && agree

  return (
    <AnimatePresence>
      {campeonato && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Inscripción a ${campeonato.nombre}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={reset}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-[#111111] sm:border sm:border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            <header className="flex items-start justify-between p-5 border-b border-white/10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#3a7d44] mb-1">
                  Paso {step} de 2
                </p>
                <h2 className="text-[#f5f5f0] font-display font-black text-lg leading-tight">
                  {campeonato.nombre}
                </h2>
              </div>
              <button
                type="button"
                onClick={reset}
                aria-label="Cerrar"
                className="p-1 text-[#f5f5f0]/65 hover:text-[#f5f5f0] rounded hover:bg-white/5"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </header>

            <div className="px-5 pt-4">
              <div className="flex gap-1.5">
                <div className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-[#3a7d44]" : "bg-white/10"}`} />
                <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-[#3a7d44]" : "bg-white/10"}`} />
              </div>
            </div>

            <div className="p-5 space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="ins-cat" className="block text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/65 mb-2">
                      <Users size={11} className="inline mr-1 -mt-0.5" aria-hidden="true" />
                      Categoría
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          aria-pressed={category === c}
                          onClick={() => setCategory(c)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                            category === c
                              ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                              : "bg-[#1a1a1a] border-white/15 text-[#f5f5f0]/75"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="ins-p1" className="block text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/65 mb-1.5">
                        <User size={11} className="inline mr-1 -mt-0.5" aria-hidden="true" />
                        Jugador 1
                      </label>
                      <input
                        id="ins-p1"
                        value={p1}
                        onChange={(e) => setP1(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#3a7d44]/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="ins-p2" className="block text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/65 mb-1.5">
                        <User size={11} className="inline mr-1 -mt-0.5" aria-hidden="true" />
                        Jugador 2 (pareja)
                      </label>
                      <input
                        id="ins-p2"
                        value={p2}
                        onChange={(e) => setP2(e.target.value)}
                        placeholder="Nombre de tu pareja"
                        className="w-full bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#3a7d44]/60"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ins-email" className="block text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/65 mb-1.5">
                      Email de contacto
                    </label>
                    <input
                      id="ins-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      autoComplete="email"
                      className="w-full bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#3a7d44]/60"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2 text-xs">
                    <SumRow label="Torneo" value={campeonato.nombre} />
                    <SumRow label="Categoría" value={category} />
                    <SumRow label="Pareja" value={`${p1} · ${p2}`} />
                    <SumRow label="Email" value={email} />
                    <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                      <span className="text-[#f5f5f0] font-bold">Total (pareja)</span>
                      <span className="text-[#3a7d44] font-black text-2xl tabular-nums">{campeonato.precio}€</span>
                    </div>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer text-[#f5f5f0]/80 text-xs leading-relaxed">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="accent-[#3a7d44] w-4 h-4 mt-0.5"
                    />
                    <span>
                      Acepto el <a href="#" className="text-[#3a7d44] underline">reglamento del torneo</a> y la política de privacidad. El pago se realiza en recepción al confirmar.
                    </span>
                  </label>
                  <div className="bg-[#3a7d44]/10 border border-[#3a7d44]/30 rounded-xl p-3 flex items-start gap-2 text-xs">
                    <CreditCard size={13} className="text-[#3a7d44] mt-0.5 shrink-0" aria-hidden="true" />
                    <span className="text-[#f5f5f0]/80">
                      Plaza reservada 48 h para confirmar pago. Cancelación gratuita hasta 7 días antes del torneo.
                    </span>
                  </div>
                </>
              )}
            </div>

            <footer className="flex items-center justify-between gap-3 p-5 border-t border-white/10 bg-[#0d0d0d]">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-[#f5f5f0]/80 hover:text-[#f5f5f0] text-sm"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Atrás
                </button>
              ) : (
                <span />
              )}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canNext1}
                  className="inline-flex items-center gap-1.5 bg-[#3a7d44] hover:bg-[#4a9d54] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Siguiente
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit}
                  className="inline-flex items-center gap-1.5 bg-[#e8d44d] hover:bg-[#f0dc55] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0a0a] font-black px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  <Check size={14} aria-hidden="true" />
                  Inscribirnos
                </button>
              )}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[#f5f5f0]/55">{label}</span>
      <span className="text-[#f5f5f0] font-semibold text-right truncate">{value}</span>
    </div>
  )
}
