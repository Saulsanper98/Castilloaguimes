"use client"

import { useState } from "react"
import { toast } from "sonner"

export function NewsletterSnippet() {
  const [email, setEmail] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) {
      toast.error("Introduce un email válido")
      return
    }
    toast.success("¡Gracias!", { description: "Cuando activemos la newsletter, serás de los primeros." })
    setEmail("")
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <p className="text-[#f5f5f0] font-bold text-sm uppercase tracking-widest">Newsletter</p>
      <p className="text-[#f5f5f0]/55 text-xs leading-relaxed">Torneos, ofertas y novedades del club (sin spam).</p>
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
          className="flex-1 min-w-0 rounded-[var(--radius-input)] bg-[#1a1a1a] border border-white/15 px-3 py-2 text-sm text-[#f5f5f0] placeholder:text-[#f5f5f0]/35 outline-none focus-visible:ring-2 focus-visible:ring-[#3a7d44]"
        />
        <button
          type="submit"
          className="shrink-0 bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-4 py-2 rounded-[var(--radius-btn)] transition-colors"
        >
          OK
        </button>
      </div>
    </form>
  )
}
