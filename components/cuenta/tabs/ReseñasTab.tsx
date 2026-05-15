"use client"

import { useState } from "react"
import { Star, Send } from "lucide-react"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

interface MyReview {
  id: string
  topic: string
  stars: number
  text: string
  date: string
  status: "published" | "pending"
}

const INITIAL_REVIEWS: MyReview[] = [
  {
    id: "r1",
    topic: "Cafetería y terraza",
    stars: 5,
    text: "El sitio para descansar tras un partido. Los smoothies son top.",
    date: "2026-05-04T20:35:00.000Z",
    status: "published",
  },
  {
    id: "r2",
    topic: "Pistas panorámicas",
    stars: 4,
    text: "Iluminación impecable. La bandeja queda muy clara.",
    date: "2026-04-12T19:20:00.000Z",
    status: "published",
  },
]

const TOPICS = ["Pistas centrales", "Pistas panorámicas", "Cafetería y terraza", "Vestuarios", "Tienda", "Escuela", "Torneos", "Atención"]

export function ReseñasTab() {
  const [reviews, setReviews] = useState<MyReview[]>(INITIAL_REVIEWS)
  const [topic, setTopic] = useState(TOPICS[0])
  const [stars, setStars] = useState(5)
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const avgStars =
    reviews.length === 0
      ? 0
      : reviews.reduce((acc, r) => acc + r.stars, 0) / reviews.length

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (text.trim().length < 10) {
      toast.error("La reseña debe tener al menos 10 caracteres")
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    setReviews((prev) => [
      {
        id: `r${Date.now()}`,
        topic,
        stars,
        text: text.trim(),
        date: new Date().toISOString(),
        status: "pending",
      },
      ...prev,
    ])
    setText("")
    setStars(5)
    setSubmitting(false)
    toast.success("¡Gracias por tu reseña!", { description: "La revisaremos antes de publicarla." })
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Mis reseñas" value={reviews.length.toString()} />
        <StatCard label="Media estrellas" value={avgStars.toFixed(1)} suffix="★" tone="#e8d44d" />
        <StatCard label="Publicadas" value={reviews.filter((r) => r.status === "published").length.toString()} />
      </div>

      {/* Leave a review */}
      <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
        <h2 className="text-[#f5f5f0] font-display font-black text-xl mb-1">Deja una reseña</h2>
        <p className="text-[#f5f5f0]/55 text-xs mb-5">
          Tu opinión ayuda al club a mejorar y a otros socios a decidir.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-2">
              ¿Sobre qué?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  aria-pressed={topic === t}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors border ${
                    topic === t
                      ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                      : "bg-[#1a1a1a] border-white/10 text-[#f5f5f0]/70 hover:border-white/25"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-2">
              Tu valoración
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStars(s)}
                  aria-label={`${s} estrella${s !== 1 ? "s" : ""}`}
                  className="p-1"
                >
                  <Star
                    size={28}
                    className={s <= stars ? "text-[#e8d44d] fill-[#e8d44d]" : "text-white/15"}
                    aria-hidden="true"
                  />
                </button>
              ))}
              <span className="ml-2 text-[#f5f5f0]/65 text-sm self-center tabular-nums">{stars}/5</span>
            </div>
          </div>

          <div>
            <label htmlFor="review-text" className="block text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-2">
              Tu comentario
            </label>
            <textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={280}
              placeholder="Cuéntanos qué te ha gustado o qué mejorarías"
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none transition-colors resize-none placeholder:text-[#f5f5f0]/35"
            />
            <p className="text-[10px] text-[#f5f5f0]/45 mt-1 text-right tabular-nums">
              {text.length}/280
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || text.trim().length < 10}
            className="inline-flex items-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] disabled:bg-white/10 disabled:text-[#f5f5f0]/40 disabled:cursor-not-allowed text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            {submitting ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={14} aria-hidden="true" />
            )}
            {submitting ? "Enviando…" : "Enviar reseña"}
          </button>
        </form>
      </section>

      {/* My reviews */}
      <section>
        <h3 className="text-[#f5f5f0] font-display font-black text-lg mb-4">Mis reseñas publicadas</h3>
        {reviews.length === 0 ? (
          <p className="text-[#f5f5f0]/55 text-sm py-8 text-center bg-[#111111] border border-white/5 rounded-2xl">
            Aún no has dejado ninguna reseña.
          </p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="bg-[#111111] border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#3a7d44]">
                      {r.topic}
                    </p>
                    <div className="flex gap-0.5 mt-1" aria-label={`${r.stars} estrellas`}>
                      {Array.from({ length: r.stars }).map((_, i) => (
                        <Star key={i} size={12} className="text-[#e8d44d] fill-[#e8d44d]" aria-hidden="true" />
                      ))}
                      {Array.from({ length: 5 - r.stars }).map((_, i) => (
                        <Star key={`e-${i}`} size={12} className="text-white/15" aria-hidden="true" />
                      ))}
                    </div>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                      r.status === "published"
                        ? "bg-[#3a7d44]/20 text-[#3a7d44] border border-[#3a7d44]/30"
                        : "bg-[#e8d44d]/15 text-[#e8d44d] border border-[#e8d44d]/30"
                    }`}
                  >
                    {r.status === "published" ? "Publicada" : "Pendiente"}
                  </span>
                </div>
                <p className="text-[#f5f5f0]/80 text-sm leading-relaxed">{r.text}</p>
                <p className="text-[#f5f5f0]/45 text-[11px] mt-2">
                  {format(parseISO(r.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value, suffix, tone = "#3a7d44" }: { label: string; value: string; suffix?: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111111] p-4">
      <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-1">{label}</p>
      <p className="font-display font-black text-2xl tabular-nums leading-tight" style={{ color: tone }}>
        {value}
        {suffix && <span className="text-base ml-1">{suffix}</span>}
      </p>
    </div>
  )
}
