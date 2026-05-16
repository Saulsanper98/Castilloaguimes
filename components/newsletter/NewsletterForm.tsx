"use client"

import { useState } from "react"
import { Check, Mail } from "lucide-react"
import { toast } from "sonner"

const PENDING_KEY = "pcdc-newsletter-pending-v1"

interface PendingSubscriber {
  email: string
  source: "snippet" | "article" | "modal"
  createdAt: string
}

function appendPending(email: string, source: PendingSubscriber["source"]): void {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    const list: PendingSubscriber[] = raw ? JSON.parse(raw) : []
    // No duplicates
    if (list.some((x) => x.email === email)) return
    list.push({ email, source, createdAt: new Date().toISOString() })
    localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(-100)))
  } catch {
    /* ignore */
  }
}

interface Props {
  /** Look & feel: snippet (footer) o full (artículo de noticias) */
  variant?: "snippet" | "full"
  source?: PendingSubscriber["source"]
}

/** Form único de suscripción a newsletter, dos presentaciones. */
export function NewsletterForm({ variant = "full", source = "modal" }: Props) {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value.includes("@") || value.length < 5) {
      toast.error("Introduce un email válido")
      return
    }
    appendPending(value, source)
    setDone(true)
    setEmail("")
  }

  if (variant === "snippet") {
    return (
      <form onSubmit={submit} className="space-y-2">
        <p className="text-[#f5f5f0] font-bold text-sm uppercase tracking-widest">Newsletter</p>
        <p className="text-[#f5f5f0]/55 text-xs leading-relaxed">
          Torneos, ofertas y novedades del club (sin spam).
        </p>
        {done ? (
          <p className="text-[#3a7d44] text-xs font-semibold">
            ¡Gracias! Te avisaremos cuando activemos la newsletter.
          </p>
        ) : (
          <div className="flex gap-2">
            <label htmlFor="footer-nl-email" className="sr-only">
              Email para newsletter
            </label>
            <input
              id="footer-nl-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              className="flex-1 min-w-0 rounded-[var(--radius-input)] bg-[#1a1a1a] border border-white/15 px-3 py-2 text-sm text-[#f5f5f0] placeholder:text-[#f5f5f0]/35 outline-none focus-visible:ring-2 focus-visible:ring-[#3a7d44]"
            />
            <button
              type="submit"
              className="shrink-0 bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2 rounded-[var(--radius-btn)] transition-colors"
            >
              OK
            </button>
          </div>
        )}
      </form>
    )
  }

  // full variant (article)
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
          ¡Apuntado! Te avisamos cuando activemos la lista.
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md">
          <label htmlFor="nl-email" className="sr-only">
            Email
          </label>
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
