"use client"

import { useState } from "react"
import { Bell, Check, Clock } from "lucide-react"
import { toast } from "sonner"

interface Props {
  visible: boolean
  slot: string
  courtName: string
}

/**
 * Tarjeta de "lista de espera": aparece cuando el usuario intenta seleccionar
 * un slot completo. Permite que le avisemos si se libera.
 */
export function WaitlistCard({ visible, slot, courtName }: Props) {
  const [subscribed, setSubscribed] = useState(false)

  if (!visible) return null

  function subscribe() {
    setSubscribed(true)
    toast.success("Apuntado a la lista de espera", {
      description: `Te avisaremos si se libera ${courtName} a las ${slot}.`,
    })
  }

  return (
    <div className="mt-4 rounded-2xl border border-[#e8d44d]/30 bg-[#e8d44d]/5 p-4 flex items-start gap-3">
      <span className="w-9 h-9 rounded-lg bg-[#e8d44d]/15 text-[#e8d44d] flex items-center justify-center shrink-0">
        <Clock size={14} aria-hidden="true" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#e8d44d]">
          Lista de espera
        </p>
        <p className="text-[#f5f5f0] font-bold text-sm">
          {courtName} a las {slot} está completa
        </p>
        <p className="text-[#f5f5f0]/65 text-xs">
          Apúntate y te avisamos en cuanto alguien cancele. Suele ocurrir.
        </p>
      </div>
      <button
        type="button"
        disabled={subscribed}
        onClick={subscribe}
        className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0 ${
          subscribed
            ? "bg-[#3a7d44]/20 text-[#3a7d44] cursor-default"
            : "bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a]"
        }`}
      >
        {subscribed ? <Check size={11} aria-hidden="true" /> : <Bell size={11} aria-hidden="true" />}
        {subscribed ? "Apuntado" : "Avísame"}
      </button>
    </div>
  )
}
