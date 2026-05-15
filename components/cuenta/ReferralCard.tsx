"use client"

import { useState } from "react"
import { Copy, Check, Gift } from "lucide-react"
import { toast } from "sonner"
import { SITE_URL } from "@/lib/site"

interface Props {
  memberCode: string
}

export function ReferralCard({ memberCode }: Props) {
  const [copied, setCopied] = useState(false)
  const link = `${SITE_URL.replace(/\/$/, "")}/?ref=${memberCode}`

  function copy() {
    navigator.clipboard?.writeText(link)
    setCopied(true)
    toast.success("Enlace copiado")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e8d44d]/30 bg-gradient-to-br from-[#e8d44d]/10 via-[#111111] to-[#111111] p-5">
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle, #e8d44d 0%, transparent 70%)" }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Gift size={14} className="text-[#e8d44d]" aria-hidden="true" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#e8d44d]">
            Trae un amigo
          </p>
        </div>
        <h3 className="text-[#f5f5f0] font-display font-black text-lg leading-tight mb-1">
          10 € para ti y otros 10 € para él
        </h3>
        <p className="text-[#f5f5f0]/65 text-xs mb-4 leading-relaxed">
          Cuando tu amigo se haga socio y haga su primera reserva, ambos recibís 10 € en el wallet.
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 bg-[#0a0a0a]/60 border border-white/10 text-[#f5f5f0] text-[11px] font-mono rounded-lg px-3 py-2 outline-none truncate"
            onFocus={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] text-xs font-bold px-3 rounded-lg transition-colors"
          >
            {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  )
}
