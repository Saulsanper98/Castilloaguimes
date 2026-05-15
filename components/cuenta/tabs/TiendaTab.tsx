"use client"

import { useEffect, useState } from "react"
import { Bell, ShoppingBag, Check } from "lucide-react"
import { toast } from "sonner"

const BRANDS = [
  { name: "Bullpadel", color: "#e8d44d" },
  { name: "NOX", color: "#3a7d44" },
  { name: "Head", color: "#7c83ff" },
  { name: "Wilson", color: "#ff8a5b" },
  { name: "Adidas", color: "#bfc7cc" },
  { name: "Babolat", color: "#a3d2f5" },
]

const CATEGORIES = [
  { label: "Palas", count: 120 },
  { label: "Pelotas", count: 18 },
  { label: "Ropa técnica", count: 86 },
  { label: "Calzado", count: 42 },
  { label: "Accesorios", count: 64 },
  { label: "Pádel kids", count: 28 },
]

// Target: 1 julio 2026 (ajusta a tu gusto)
const TARGET_DATE = new Date("2026-07-01T10:00:00")

export function TiendaTab() {
  const [notified, setNotified] = useState(false)
  const [days, setDays] = useState(0)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setDays(Math.max(0, Math.floor((TARGET_DATE.getTime() - Date.now()) / 86_400_000)))
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  function notifyMe() {
    setNotified(true)
    toast.success("Te avisaremos cuando abramos", {
      description: "Recibirás un email a tu cuenta.",
    })
  }

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#3a7d44]/25 via-[#0a0a0a] to-[#0a0a0a] p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-50"
          style={{ background: "radial-gradient(circle, #e8d44d 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 bg-court-lines opacity-30" aria-hidden="true" />

        {/* Decorative ball */}
        <svg
          viewBox="0 0 100 100"
          className="absolute top-6 right-6 w-20 h-20 opacity-90"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="42" fill="#e8d44d" />
          <path d="M 8 38 Q 50 60 92 38" stroke="#0a0a0a" strokeOpacity="0.25" strokeWidth="2" fill="none" />
          <path d="M 8 62 Q 50 40 92 62" stroke="#0a0a0a" strokeOpacity="0.25" strokeWidth="2" fill="none" />
        </svg>

        <div className="relative max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#e8d44d] mb-2">
            Tienda online
          </p>
          <h2
            className="text-[#f5f5f0] font-display font-black tracking-tight leading-none mb-3"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)", letterSpacing: "-0.02em" }}
          >
            ESTAMOS DANDO LOS<br />
            <span className="text-[#3a7d44]">ÚLTIMOS TOQUES</span>
          </h2>
          <p className="text-[#f5f5f0]/65 text-sm leading-relaxed mb-5 max-w-md">
            La tienda física del club estará disponible online en pocas semanas. Misma garantía, mismas marcas, retirada gratuita en el club.
          </p>

          {/* Countdown */}
          <div className="inline-flex items-center gap-3 bg-[#0a0a0a]/60 border border-white/10 rounded-xl px-4 py-3 mb-5">
            <span className="text-[#e8d44d] font-display font-black tabular-nums" style={{ fontSize: "2rem" }}>
              {days}
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55">Días</p>
              <p className="text-[#f5f5f0]/80 text-xs">para la apertura prevista</p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={notifyMe}
              disabled={notified}
              className={`inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-colors ${
                notified
                  ? "bg-[#3a7d44]/20 border border-[#3a7d44]/40 text-[#3a7d44]"
                  : "bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a]"
              }`}
            >
              {notified ? <Check size={15} aria-hidden="true" /> : <Bell size={15} aria-hidden="true" />}
              {notified ? "Te avisaremos por email" : "Avisarme en la apertura"}
            </button>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section>
        <h3 className="text-[#f5f5f0] font-display font-black text-lg mb-3">Marcas que tendrás</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="aspect-square rounded-2xl border border-white/10 bg-[#111111] flex items-center justify-center text-center p-2 hover:border-white/25 transition-colors group"
            >
              <span
                className="font-display font-black tracking-wider text-sm uppercase transition-colors"
                style={{ color: b.color }}
              >
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories preview */}
      <section>
        <h3 className="text-[#f5f5f0] font-display font-black text-lg mb-3">Catálogo previsto</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-white/10 bg-[#111111] p-4 flex items-center justify-between gap-2"
            >
              <span className="text-[#f5f5f0] font-bold text-sm">{c.label}</span>
              <span className="text-[#3a7d44] text-xs tabular-nums">~{c.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* In-club today */}
      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#3a7d44]/15 border border-[#3a7d44]/30 flex items-center justify-center shrink-0">
          <ShoppingBag size={16} className="text-[#3a7d44]" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="text-[#f5f5f0] font-bold text-sm">Mientras tanto, pásate por la tienda física</p>
          <p className="text-[#f5f5f0]/55 text-xs">L-V 16-21h · Sáb 10-14h · En el club</p>
        </div>
      </section>
    </div>
  )
}
