"use client"

import { Link2, MessageCircle } from "lucide-react"
import { toast } from "sonner"

type Props = {
  url: string
  title: string
}

export function NoticiaShare({ url, title }: Props) {
  const text = `${title} — ${url}`
  const waHref = `https://wa.me/?text=${encodeURIComponent(text)}`
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Enlace copiado")
    } catch {
      toast.error("No se pudo copiar el enlace")
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <span className="text-[#f5f5f0]/50 text-xs font-semibold uppercase tracking-widest w-full sm:w-auto sm:mr-2">
        Compartir
      </span>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#1a1a1a] px-3 py-2 text-xs font-bold text-[#f5f5f0]/85 hover:border-[#3a7d44]/50 hover:text-[#f5f5f0] transition-colors"
      >
        <MessageCircle size={14} className="text-[#3a7d44]" aria-hidden />
        WhatsApp
      </a>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#1a1a1a] px-3 py-2 text-xs font-bold text-[#f5f5f0]/85 hover:border-white/35 hover:text-[#f5f5f0] transition-colors"
      >
        X
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#1a1a1a] px-3 py-2 text-xs font-bold text-[#f5f5f0]/85 hover:border-[#3a7d44]/50 hover:text-[#f5f5f0] transition-colors"
      >
        <Link2 size={14} className="text-[#e8d44d]" aria-hidden />
        Copiar enlace
      </button>
    </div>
  )
}
