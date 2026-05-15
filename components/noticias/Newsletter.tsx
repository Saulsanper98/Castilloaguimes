"use client"

import { useState } from "react"
import { Mail, Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes("@")) return
    setDone(true)
  }

  return (
    <div className="bg-gradient-to-br from-[#3a7d44]/15 via-[#111111] to-[#111111] border border-[#3a7d44]/30 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-3">
        <Mail size={14} className="text-[#3a7d44]" aria-hidden="true" />
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#3a7d44]">Newsletter</p>
      </div>
      <h3 className="text-[#f5f5f0] font-display font-black text-xl sm:text-2xl leading-tight mb-2">
        No te pierdas torneos ni novedades
      </h3>
      <p className="text-[#f5f5f0]/65 text-sm mb-5 max-w-xl">
        Una vez por semana: torneos abiertos, ofertas de bonos, calendario de la escuela. Sin spam.
      </p>
      {done ? (
        <div className="inline-flex items-center gap-2 bg-[#3a7d44]/20 border border-[#3a7d44]/40 text-[#3a7d44] px-4 py-3 rounded-xl text-sm font-bold">
          <Check size={14} aria-hidden="true" />
          ¡Apuntado! Revisa tu email para confirmar.
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md">
          <label htmlFor="nl-email" className="sr-only">Email</label>
          <input
            id="nl-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
            className="flex-1 bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none placeholder:text-[#f5f5f0]/35"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
          >
            Suscribirme
          </button>
        </form>
      )}
    </div>
  )
}
