import type { Metadata } from "next"

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
  { personas: "4 personas", precio: "40 €/mes · persona" },
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
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
            Precios
          </span>
          <h1
            className="text-[#f5f5f0] font-black tracking-tight mb-3"
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

        {/* ── RESERVA DE PISTAS ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#3a7d44] rounded-full" />
            <h2 className="text-[#f5f5f0] font-black text-2xl tracking-tight">Reserva de Pistas</h2>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden mb-4">
            <div className="px-6 py-3 border-b border-white/10 bg-white/[0.02]">
              <p className="text-[#f5f5f0]/40 text-xs font-medium tracking-widest uppercase">Pista completa (4 jugadores) · 1h 30 min</p>
            </div>
            {pistaTarifas.map((t, i) => (
              <div
                key={t.tipo}
                className={`flex items-center justify-between px-6 py-4 ${i !== pistaTarifas.length - 1 ? "border-b border-white/10" : ""} ${i % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
              >
                <div>
                  <span className="text-[#f5f5f0]/80 text-sm">{t.tipo}</span>
                  <span className="text-[#f5f5f0]/30 text-xs ml-2">{t.nota}</span>
                </div>
                <span className="text-[#3a7d44] font-bold text-sm tabular-nums">{t.precio}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-3 border-b border-white/10 bg-white/[0.02]">
              <p className="text-[#f5f5f0]/40 text-xs font-medium tracking-widest uppercase">Pista individual · Todos los días (apertura–cierre)</p>
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
            <h2 className="text-[#f5f5f0] font-black text-2xl tracking-tight">Escuela de Pádel</h2>
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
                className={`flex items-center justify-between px-6 py-4 ${i !== adultosMensuales.length - 1 ? "border-b border-white/10" : ""} ${i % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
              >
                <span className="text-[#f5f5f0]/80 text-sm">{t.personas}</span>
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
            <h2 className="text-[#f5f5f0] font-black text-2xl tracking-tight">Bonos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bonos.map((b) => (
              <div
                key={b.nombre}
                className="bg-[#111111] border border-[#3a7d44]/40 hover:border-[#3a7d44] rounded-2xl p-7 relative overflow-hidden transition-colors group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3a7d44]/5 rounded-full -translate-y-10 translate-x-10 group-hover:bg-[#3a7d44]/10 transition-colors" />
                <div className="relative z-10">
                  <span className="inline-block text-[10px] text-[#e8d44d] font-bold tracking-widest uppercase bg-[#e8d44d]/10 border border-[#e8d44d]/20 px-2.5 py-1 rounded-full mb-4">
                    {b.badge}
                  </span>
                  <h3 className="text-[#f5f5f0] font-black text-xl mb-2">{b.nombre}</h3>
                  <p className="text-[#f5f5f0]/50 text-sm leading-relaxed mb-5">{b.descripcion}</p>
                  <div className="text-[#3a7d44] font-black text-4xl">{b.precio}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-10 text-center">
          <p className="text-[#f5f5f0]/40 text-xs font-bold tracking-widest uppercase mb-3">¿Necesitas ayuda?</p>
          <h3 className="text-[#f5f5f0] font-black text-2xl mb-3">Consulta sin compromiso</h3>
          <p className="text-[#f5f5f0]/50 text-sm mb-7 max-w-md mx-auto">
            ¿Tienes dudas sobre qué bono elegir o cómo funciona la escuela? Nuestro equipo te asesora.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contacto"
              className="inline-block bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors"
            >
              Contactar
            </a>
            <a
              href="tel:928753650"
              className="inline-block border border-white/20 hover:border-white/40 text-[#f5f5f0] font-bold px-8 py-3 rounded-xl text-sm transition-colors"
            >
              928 753 650
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
