"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

const FAQ = [
  {
    q: "¿Los precios incluyen IVA?",
    a: "Sí, todos los importes mostrados incluyen IVA.",
  },
  {
    q: "¿Puedo compartir el bono 50×10?",
    a: "Los bonos son nominativos o asociados a la cuenta del titular según condiciones en recepción. Consulta en el club.",
  },
  {
    q: "¿Qué pasa si cancelo una reserva?",
    a: "Cancelación gratuita hasta 4 h antes. Después puede aplicarse el importe íntegro según política vigente.",
  },
]

export function TarifasExtras() {
  const [sesiones, setSesiones] = useState(8)
  const recomendacion = useMemo(() => {
    if (sesiones <= 4) return { label: "Pago por sesión", desc: "Reserva suelta o bono pequeño." }
    if (sesiones <= 12) return { label: "Bono 50×10", desc: "Mejor €/partida en franja tarde." }
    return { label: "Mensual escuela / bono grande", desc: "Si juegas varias veces por semana, pregunta en recepción." }
  }, [sesiones])

  return (
    <div className="space-y-16 pt-4">
      <section className="bg-[#111111] border border-white/10 rounded-2xl p-8">
        <h2 className="text-[#f5f5f0] font-display font-black text-2xl mb-2">¿Qué te conviene?</h2>
        <p className="text-[#f5f5f0]/55 text-sm mb-8 max-w-xl">
          Indica cuántas veces sueles jugar al mes (orientativo). Te sugerimos una opción; en recepción afinamos.
        </p>
        <label htmlFor="tar-ses" className="block text-xs font-bold text-[#f5f5f0]/55 uppercase tracking-widest mb-2">
          Partidas al mes (aprox.)
        </label>
        <input
          id="tar-ses"
          type="range"
          min={1}
          max={20}
          value={sesiones}
          onChange={(e) => setSesiones(Number(e.target.value))}
          className="w-full max-w-md accent-[#3a7d44]"
        />
        <div className="flex justify-between text-xs text-[#f5f5f0]/45 max-w-md mt-1">
          <span>1</span>
          <span className="text-[#f5f5f0] font-bold">{sesiones}</span>
          <span>20</span>
        </div>
        <div className="mt-6 p-5 rounded-[var(--radius-card)] bg-[#3a7d44]/10 border border-[#3a7d44]/30 max-w-lg">
          <p className="text-[10px] uppercase tracking-widest text-[#3a7d44] font-bold mb-1">Sugerencia</p>
          <p className="text-[#f5f5f0] font-display font-black text-xl">{recomendacion.label}</p>
          <p className="text-[#f5f5f0]/60 text-sm mt-2">{recomendacion.desc}</p>
        </div>
      </section>

      <section>
        <h2 className="text-[#f5f5f0] font-display font-black text-2xl mb-6">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group bg-[#111111] border border-white/10 rounded-[var(--radius-card)] px-5 py-4"
            >
              <summary className="cursor-pointer text-[#f5f5f0] font-semibold text-sm list-none flex items-center justify-between gap-2">
                {item.q}
                <span className="text-[#f5f5f0]/40 text-lg group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-[#f5f5f0]/60 text-sm mt-3 leading-relaxed border-t border-white/5 pt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-8">
        <Link
          href="/reservas"
          className="inline-flex items-center justify-center bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-8 py-3.5 rounded-[var(--radius-btn)] text-sm transition-colors w-full sm:w-auto"
        >
          Echa la firma — reservar
        </Link>
        <Link
          href="/instalaciones"
          className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-[#f5f5f0] font-bold px-8 py-3.5 rounded-[var(--radius-btn)] text-sm transition-colors w-full sm:w-auto"
        >
          Ver instalaciones
        </Link>
      </div>
    </div>
  )
}
