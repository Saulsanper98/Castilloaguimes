"use client"

import Link from "next/link"
import { Users, Wallet as WalletIcon, ArrowRight } from "lucide-react"

interface Props {
  /** Slot ya elegido en HH:mm */
  slot: string
  /** Saldo wallet en céntimos */
  walletCents: number
  /** Precio total a pagar en € */
  totalEur: number
}

/**
 * Bloque de "extras" tras seleccionar fecha+hora:
 *  - Cross-link a partidos abiertos (¿solo eres tú? busca compañeros)
 *  - Estado del wallet ("Pagas con saldo / Te faltan X €")
 */
export function PostBookExtras({ slot, walletCents, totalEur }: Props) {
  const walletEur = walletCents / 100
  const enough = walletEur >= totalEur
  const missing = Math.max(0, totalEur - walletEur)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Cross-link partidos abiertos */}
      <Link
        href={`/partidos-abiertos?hora=${encodeURIComponent(slot)}`}
        className="group rounded-xl border border-white/10 bg-[#111111] hover:border-[#3a7d44]/40 hover:bg-[#3a7d44]/5 p-4 transition-colors flex items-center gap-3"
      >
        <span className="w-9 h-9 rounded-lg bg-[#3a7d44]/15 text-[#3a7d44] flex items-center justify-center shrink-0">
          <Users size={14} aria-hidden="true" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-[#3a7d44]">
            ¿Solo eres tú?
          </span>
          <span className="block text-[#f5f5f0] font-bold text-sm leading-tight">
            Busca compañeros para las {slot}
          </span>
          <span className="block text-[10px] text-[#f5f5f0]/55">
            Publica partido abierto y completa el cuarteto
          </span>
        </span>
        <ArrowRight
          size={13}
          aria-hidden="true"
          className="text-[#f5f5f0]/45 group-hover:translate-x-1 group-hover:text-[#3a7d44] transition-all shrink-0"
        />
      </Link>

      {/* Wallet status */}
      <div
        className={`rounded-xl border p-4 flex items-center gap-3 ${
          enough
            ? "border-[#3a7d44]/40 bg-[#3a7d44]/10"
            : "border-white/10 bg-[#111111]"
        }`}
      >
        <span
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            enough ? "bg-[#3a7d44]/25 text-[#3a7d44]" : "bg-[#e8d44d]/15 text-[#e8d44d]"
          }`}
        >
          <WalletIcon size={14} aria-hidden="true" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/55">
            Wallet
          </span>
          {enough ? (
            <>
              <span className="block text-[#f5f5f0] font-bold text-sm leading-tight">
                Pagas con saldo · {walletEur.toFixed(2).replace(".", ",")} € disponibles
              </span>
              <span className="block text-[10px] text-[#3a7d44]">
                Sin pasos extra al confirmar
              </span>
            </>
          ) : (
            <>
              <span className="block text-[#f5f5f0] font-bold text-sm leading-tight">
                Te faltan {missing.toFixed(2).replace(".", ",")} €
              </span>
              <Link
                href="/cuenta"
                className="block text-[10px] text-[#e8d44d] hover:text-[#f0dc55] underline-offset-2 hover:underline"
              >
                Recargar wallet →
              </Link>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
