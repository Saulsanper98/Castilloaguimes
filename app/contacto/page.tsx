"use client"

import { useState } from "react"
import { toast } from "sonner"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

const SUBJECTS = [
  "Reserva de pistas",
  "Información escuela de pádel",
  "Campeonatos y torneos",
  "Instalaciones",
  "Incidencia o reclamación",
  "Otro",
]

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
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
    toast.success("Mensaje enviado correctamente. Te responderemos en 24–48 horas.", {
      duration: 5000,
    })
    setForm({ nombre: "", email: "", asunto: "", mensaje: "" })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
            Estamos aquí
          </span>
          <h1
            className="text-[#f5f5f0] font-black tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            CONTACTO
          </h1>
          <p className="text-[#f5f5f0]/50 mt-2 text-base">
            Escríbenos o llámanos. Te atenderemos lo antes posible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-[#f5f5f0] font-bold text-lg mb-6">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#f5f5f0]/50 text-xs font-medium mb-1.5">
                      Nombre completo <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-[#f5f5f0]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[#f5f5f0]/50 text-xs font-medium mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-[#f5f5f0]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#f5f5f0]/50 text-xs font-medium mb-1.5">Asunto</label>
                  <select
                    name="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                  >
                    <option value="">Selecciona un asunto</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#f5f5f0]/50 text-xs font-medium mb-1.5">
                    Mensaje <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    required
                    rows={5}
                    className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-[#f5f5f0]/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] disabled:bg-[#3a7d44]/50 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  {sending ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            </div>
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact cards */}
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
                      <Icon size={18} className="text-[#3a7d44]" />
                    </div>
                    <div>
                      <h3 className="text-[#f5f5f0] font-bold text-sm mb-1">{card.title}</h3>
                      {card.lines.map((line, i) => (
                        card.link && i === 0 ? (
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
                          <p key={i} className="text-[#f5f5f0]/60 text-sm">{line}</p>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Map embed */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3524.8!2d-15.4!3d27.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDUxJzAwLjAiTiAxNcKwMjQnMDAuMCJX!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80"
                title="Mapa Pádel Castillo de Agüimes"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
