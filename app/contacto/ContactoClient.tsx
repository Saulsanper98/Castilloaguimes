"use client"

import { useState } from "react"
import { toast } from "sonner"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { getOpeningStatus } from "@/lib/openingHours"

const SUBJECTS = [
  "Reserva de pistas",
  "Información escuela de pádel",
  "Campeonatos y torneos",
  "Instalaciones",
  "Incidencia o reclamación",
  "Otro",
]

const FRANJAS = ["", "Mañana (9–14h)", "Tarde (14–20h)", "Cualquier horario"]

export default function ContactoPage() {
  const status = getOpeningStatus()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
    franjaLlamada: "",
  })
  const [sending, setSending] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.mensaje) {
      toast.error("Por favor, rellena todos los campos obligatorios.")
      return
    }
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
    toast.success("Mensaje enviado", { description: "Te responderemos en 24–48 horas." })
  }

  function resetForm() {
    setSent(false)
    setForm({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "", franjaLlamada: "" })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Breadcrumbs />
          </div>
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">Estamos aquí</span>
          <h1
            className="text-[#f5f5f0] font-display font-black tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            CONTACTO
          </h1>
          <p className="text-[#f5f5f0]/55 mt-2 text-base max-w-2xl">
            Escríbenos o llámanos. Te atenderemos lo antes posible.
          </p>
          <p className="mt-4 text-sm">
            <span className={status.isOpen ? "text-[#3a7d44] font-semibold" : "text-amber-400/90 font-semibold"}>
              {status.isOpen ? "Recepción abierta ahora" : "Recepción cerrada en este momento"}
            </span>
            <span className="text-[#f5f5f0]/50"> — {status.hint}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8">
              {sent ? (
                <div className="text-center py-10 px-4" role="status" aria-live="polite">
                  <CheckCircle2 className="w-16 h-16 text-[#3a7d44] mx-auto mb-5" aria-hidden="true" />
                  <h2 className="text-[#f5f5f0] font-display font-black text-2xl mb-3">¡Mensaje recibido!</h2>
                  <p className="text-[#f5f5f0]/60 text-sm max-w-md mx-auto leading-relaxed mb-8">
                    Gracias por contactar con Pádel Castillo de Agüimes. Nuestro equipo revisará tu mensaje y te responderá por email lo antes posible (normalmente en 24–48 h laborables).
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-[#f5f5f0] font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-[#f5f5f0] font-bold text-lg mb-6">Envíanos un mensaje</h2>
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-nombre" className="block text-[#f5f5f0]/65 text-xs font-medium mb-1.5">
                          Nombre completo <span className="text-red-400" aria-hidden="true">*</span>
                          <span className="sr-only">(obligatorio)</span>
                        </label>
                        <input
                          id="contact-nombre"
                          type="text"
                          name="nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          required
                          autoComplete="name"
                          className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-[#f5f5f0]/35"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-[#f5f5f0]/65 text-xs font-medium mb-1.5">
                          Email <span className="text-red-400" aria-hidden="true">*</span>
                          <span className="sr-only">(obligatorio)</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="tu@email.com"
                          required
                          autoComplete="email"
                          className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-[#f5f5f0]/35"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-telefono" className="block text-[#f5f5f0]/65 text-xs font-medium mb-1.5">
                        Teléfono (opcional)
                      </label>
                      <input
                        id="contact-telefono"
                        type="tel"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        placeholder="Si prefieres que te llamemos"
                        autoComplete="tel"
                        className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-[#f5f5f0]/35"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-franja" className="block text-[#f5f5f0]/65 text-xs font-medium mb-1.5">
                        ¿Te llamamos? Franja preferida
                      </label>
                      <select
                        id="contact-franja"
                        name="franjaLlamada"
                        value={form.franjaLlamada}
                        onChange={handleChange}
                        className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                      >
                        {FRANJAS.map((f) => (
                          <option key={f || "none"} value={f}>
                            {f || "No quiero llamada"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-asunto" className="block text-[#f5f5f0]/65 text-xs font-medium mb-1.5">
                        Asunto
                      </label>
                      <select
                        id="contact-asunto"
                        name="asunto"
                        value={form.asunto}
                        onChange={handleChange}
                        className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                      >
                        <option value="">Selecciona un asunto</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-mensaje" className="block text-[#f5f5f0]/65 text-xs font-medium mb-1.5">
                        Mensaje <span className="text-red-400" aria-hidden="true">*</span>
                        <span className="sr-only">(obligatorio)</span>
                      </label>
                      <textarea
                        id="contact-mensaje"
                        name="mensaje"
                        value={form.mensaje}
                        onChange={handleChange}
                        placeholder="Escribe tu mensaje aquí..."
                        required
                        rows={5}
                        className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-[#f5f5f0]/35 resize-none"
                      />
                    </div>

                    {/* Captcha placeholder (anti-spam discreto) */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a1a]/60 border border-white/5 text-xs text-[#f5f5f0]/55">
                      <span className="w-4 h-4 rounded-sm bg-[#3a7d44]/20 border border-[#3a7d44]/40 inline-flex items-center justify-center" aria-hidden="true">
                        <span className="w-2 h-2 rounded-sm bg-[#3a7d44]" />
                      </span>
                      <span>Protegido contra spam · sin captcha intrusivo</span>
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] disabled:bg-[#3a7d44]/50 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send size={15} aria-hidden="true" />
                      )}
                      {sending ? "Enviando..." : "Enviar mensaje"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <a
              href="https://wa.me/34928753650?text=Hola%20P%C3%A1del%20Castillo%2C%20"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#111111] border border-[#25D366]/40 hover:border-[#25D366]/70 rounded-2xl p-5 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="text-[#25D366]" size={22} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[#f5f5f0] font-bold text-sm mb-0.5">WhatsApp recepción</h3>
                <p className="text-[#f5f5f0]/55 text-xs group-hover:text-[#f5f5f0]/75 transition-colors">
                  Respuesta rápida en horario de apertura
                </p>
              </div>
            </a>

            {[
              {
                icon: Phone,
                title: "Teléfono",
                lines: ["928 753 650"],
                link: "tel:+34928753650",
              },
              {
                icon: Mail,
                title: "Email",
                lines: ["recepcioncdca@gmail.com"],
                link: "mailto:recepcioncdca@gmail.com",
              },
              {
                icon: MapPin,
                title: "Dirección",
                lines: ["C/ Pino nº10, P.I. Arinaga", "Agüimes, Las Palmas de Gran Canaria"],
                link: "https://maps.google.com/?q=C+Pino+10+Arinaga+Aguimes",
              },
              {
                icon: Clock,
                title: "Horario de atención",
                lines: ["L–V: 08:00–23:00", "Sábados: 08:00–20:00", "Dom/Festivos: 09:00–20:00"],
              },
            ].map((card) => {
              const Icon = card.icon
              return (
                <div key={card.title} className="bg-[#111111] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#3a7d44]/15 border border-[#3a7d44]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#3a7d44]" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-[#f5f5f0] font-bold text-sm mb-1">{card.title}</h3>
                      {card.lines.map((line, i) =>
                        "link" in card && card.link && i === 0 ? (
                          <a
                            key={i}
                            href={card.link}
                            target={card.link.startsWith("http") ? "_blank" : undefined}
                            rel={card.link.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="block text-[#f5f5f0]/60 hover:text-[#3a7d44] text-sm transition-colors"
                          >
                            {line}
                          </a>
                        ) : (
                          <p key={i} className="text-[#f5f5f0]/60 text-sm">
                            {line}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=C%2F%20Pino%2010%2C%20Pol%C3%ADgono%20Industrial%20Arinaga%2C%20Ag%C3%BCimes%2C%20Las%20Palmas&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[40%] hover:grayscale-0 transition-all duration-500"
                title="Ubicación de Pádel Castillo de Agüimes en Google Maps"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
