import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { TarifasExtras } from "./TarifasExtras"

export const metadata: Metadata = {
  title: "Tarifas",
  description: "Precios y tarifas de pistas, escuela de pádel y bonos en Pádel Castillo de Agüimes. Sin sorpresas.",
}

const pistaTarifas = [
  {
    tipo: "L–V Mañana (08:00–16:00)",
    precio: "6,50 €/persona",
    nota: "Turno de 1h 30 min",
  },
  {
    tipo: "L–V Tarde (16:00–23:00)",
    precio: "6,50 €/persona",
    nota: "Turno de 1h 30 min",
  },
  {
    tipo: "Sábados (08:00–20:00)",
    precio: "6,50 €/persona",
    nota: "Turno de 1h 30 min",
  },
  {
    tipo: "Domingos y festivos (09:00–15:00)",
    precio: "6,50 €/persona",
    nota: "Turno de 1h 30 min",
  },
]

const pistaIndividualTarifas = [
  { tipo: "Pista individual – 1 hora", precio: "5,50 €/persona" },
  { tipo: "Pista individual – 1h 30 min", precio: "6,50 €/persona" },
]

const escuelaBonos = [
  { modalidad: "Individual", precio: "120 €", detalle: "Bono 6 clases · 1 alumno" },
  { modalidad: "Parejas", precio: "150 €", detalle: "Bono 6 clases · 2 alumnos" },
  { modalidad: "Grupo de 3", precio: "180 €", detalle: "Bono 6 clases · 3 alumnos" },
]

const adultosMensuales = [
  { personas: "1 persona", precio: "120 €/mes" },
  { personas: "2 personas", precio: "60 €/mes · persona" },
  { personas: "3 personas", precio: "50 €/mes · persona" },
  { personas: "4 personas", precio: "40 €/mes · persona", popular: true },
]

const ninosMensuales = [
  { frecuencia: "1 día / semana", precio: "30 €/mes" },
  { frecuencia: "2 días / semana", precio: "50 €/mes" },
]

const bonos = [
  {
    nombre: "Bono 50×10",
    descripcion: "10 partidas de pista. Válido todos los días de 16:00 a 23:00.",
    precio: "50 €",
    badge: "Mejor valor",
  },
]

export default function TarifasPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-6">
            <Breadcrumbs />
          </div>
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
            Precios
          </span>
          <h1
            className="text-[#f5f5f0] font-display font-black tracking-tight mb-3"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            TARIFAS
          </h1>
          <p className="text-[#f5f5f0]/50 text-base max-w-xl">
            Precios claros, sin sorpresas. Todos los precios incluyen IVA.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* ── PRECIO GENERAL (hero card) ── */}
        <section className="relative overflow-hidden rounded-3xl border border-[#3a7d44]/40 bg-gradient-to-br from-[#3a7d44]/15 via-[#0f0f0f] to-[#0d0d0d] p-8 sm:p-10">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, #3a7d44 0%, transparent 70%)" }}
          />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[#3a7d44] text-[11px] font-bold tracking-[0.35em] uppercase mb-3">
                Precio general
              </p>
              <h2
                className="text-[#f5f5f0] font-display font-black tracking-tight leading-none"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", letterSpacing: "-0.02em" }}
              >
                Desde <span className="text-[#3a7d44]">5,50 €</span>
                <span className="block text-base font-medium text-[#f5f5f0]/65 tracking-normal mt-2">
                  por jugador y hora · IVA incluido
                </span>
              </h2>
              <p className="text-[#f5f5f0]/65 text-sm leading-relaxed mt-4 max-w-md">
                Reserva online sin comisiones, paga al llegar o desde el wallet del club. Pista completa para 4 jugadores.
              </p>
            </div>
            <ul className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { dur: "60 min", price: "5,50 €" },
                { dur: "90 min", price: "6,50 €" },
                { dur: "120 min", price: "8,00 €" },
              ].map((row) => (
                <li
                  key={row.dur}
                  className="rounded-2xl border border-white/10 bg-[#111111]/70 px-3 py-4 text-center"
                >
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55">
                    {row.dur}
                  </p>
                  <p className="text-[#3a7d44] font-display font-black text-xl sm:text-2xl tabular-nums mt-1">
                    {row.price}
                  </p>
                  <p className="text-[9px] text-[#f5f5f0]/45">/ jugador</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── RESERVA DE PISTAS ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#3a7d44] rounded-full" />
            <h2 className="text-[#f5f5f0] font-display font-black text-3xl tracking-tight">Reserva de Pistas</h2>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden mb-4">
            <div className="px-6 py-3 border-b border-white/10 bg-white/[0.02]">
              <p className="text-[#f5f5f0]/60 text-xs font-medium tracking-widest uppercase">Pista completa (4 jugadores) · 1h 30 min</p>
            </div>
            {pistaTarifas.map((t, i) => (
              <div
                key={t.tipo}
                className={`flex items-center justify-between px-6 py-4 ${i !== pistaTarifas.length - 1 ? "border-b border-white/10" : ""} ${i % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
              >
                <div>
                  <span className="text-[#f5f5f0]/80 text-sm">{t.tipo}</span>
                  <span className="text-[#f5f5f0]/55 text-xs ml-2">{t.nota}</span>
                </div>
                <span className="text-[#3a7d44] font-bold text-sm tabular-nums">{t.precio}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-3 border-b border-white/10 bg-white/[0.02]">
              <p className="text-[#f5f5f0]/60 text-xs font-medium tracking-widest uppercase">Pista individual · Todos los días (apertura–cierre)</p>
            </div>
            {pistaIndividualTarifas.map((t, i) => (
              <div
                key={t.tipo}
                className={`flex items-center justify-between px-6 py-4 ${i !== pistaIndividualTarifas.length - 1 ? "border-b border-white/10" : ""} ${i % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
              >
                <span className="text-[#f5f5f0]/80 text-sm">{t.tipo}</span>
                <span className="text-[#3a7d44] font-bold text-sm tabular-nums">{t.precio}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── ESCUELA DE PÁDEL ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#e8d44d] rounded-full" />
            <h2 className="text-[#f5f5f0] font-display font-black text-3xl tracking-tight">Escuela de Pádel</h2>
          </div>

          {/* Bonos de clases */}
          <h3 className="text-[#f5f5f0]/60 text-xs font-bold tracking-widest uppercase mb-4">Bonos de 6 clases</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {escuelaBonos.map((b) => (
              <div
                key={b.modalidad}
                className="bg-[#111111] border border-white/10 hover:border-[#3a7d44]/50 rounded-2xl p-6 transition-colors group"
              >
                <div className="text-[#f5f5f0]/50 text-xs mb-2">{b.detalle}</div>
                <div className="text-[#f5f5f0] font-bold text-base mb-3">{b.modalidad}</div>
                <div className="text-[#3a7d44] font-black text-3xl group-hover:text-[#4a9d54] transition-colors">{b.precio}</div>
              </div>
            ))}
          </div>

          {/* Adultos mensual */}
          <h3 className="text-[#f5f5f0]/60 text-xs font-bold tracking-widest uppercase mb-4">Adultos — Mensual (1 día/semana)</h3>
          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden mb-10">
            {adultosMensuales.map((t, i) => (
              <div
                key={t.personas}
                className={`relative flex items-center justify-between px-6 py-4 ${i !== adultosMensuales.length - 1 ? "border-b border-white/10" : ""} ${i % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
              >
                <span className="text-[#f5f5f0]/80 text-sm flex items-center gap-2 flex-wrap">
                  {t.personas}
                  {"popular" in t && t.popular && (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-[#e8d44d]/15 text-[#e8d44d] border border-[#e8d44d]/25 px-2 py-0.5 rounded-full">
                      Más popular
                    </span>
                  )}
                </span>
                <span className="text-[#3a7d44] font-bold text-sm tabular-nums">{t.precio}</span>
              </div>
            ))}
          </div>

          {/* Niños mensual */}
          <h3 className="text-[#f5f5f0]/60 text-xs font-bold tracking-widest uppercase mb-4">Niños — Mensual</h3>
          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
            {ninosMensuales.map((t, i) => (
              <div
                key={t.frecuencia}
                className={`flex items-center justify-between px-6 py-4 ${i !== ninosMensuales.length - 1 ? "border-b border-white/10" : ""} ${i % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
              >
                <span className="text-[#f5f5f0]/80 text-sm">{t.frecuencia}</span>
                <span className="text-[#3a7d44] font-bold text-sm tabular-nums">{t.precio}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── BONOS ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#3a7d44] rounded-full" />
            <h2 className="text-[#f5f5f0] font-display font-black text-3xl tracking-tight">Bonos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bonos.map((b) => (
              <div
                key={b.nombre}
                className="relative bg-gradient-to-br from-[#3a7d44]/15 via-[#111111] to-[#111111] border-2 border-[#3a7d44]/60 hover:border-[#3a7d44] rounded-2xl p-7 overflow-hidden transition-all group hover:shadow-2xl hover:shadow-[#3a7d44]/15"
              >
                {/* Ribbon */}
                <div className="absolute -top-1 -right-12 rotate-45 bg-[#e8d44d] text-[#0a0a0a] text-[10px] font-black uppercase tracking-widest px-12 py-1 shadow-lg">
                  Top
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3a7d44]/5 rounded-full -translate-y-10 translate-x-10 group-hover:bg-[#3a7d44]/10 transition-colors" />
                <div className="relative z-10">
                  <span className="inline-block text-[10px] text-[#e8d44d] font-bold tracking-widest uppercase bg-[#e8d44d]/10 border border-[#e8d44d]/30 px-2.5 py-1 rounded-full mb-4">
                    ★ {b.badge}
                  </span>
                  <h3 className="text-[#f5f5f0] font-display font-black text-2xl mb-2">{b.nombre}</h3>
                  <p className="text-[#f5f5f0]/65 text-sm leading-relaxed mb-5">{b.descripcion}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <div className="text-[#3a7d44] font-display font-black text-4xl">{b.precio}</div>
                    <span className="text-[#f5f5f0]/55 text-xs">= 5 €/partida</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[#f5f5f0]/45 mt-1">
                    Ahorras ≈ 15 € frente a precio suelto
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <TarifasExtras />
      </div>
    </div>
  )
}
