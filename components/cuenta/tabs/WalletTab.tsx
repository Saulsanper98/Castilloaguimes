"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Plus,
  CreditCard,
  Receipt,
  Download,
  Sparkles,
  Wallet as WalletIcon,
  Ticket,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import transactions from "@/data/transactions.json"

type Tx = (typeof transactions)[number]

interface Props {
  walletCents: number
  onPatch: (cents: number) => void
}

const TX_META: Record<Tx["type"], { color: string; icon: LucideIcon }> = {
  topup: { color: "#3a7d44", icon: ArrowDownLeft },
  spend: { color: "#ff8a5b", icon: ArrowUpRight },
  promo: { color: "#e8d44d", icon: Sparkles },
  refund: { color: "#7c83ff", icon: RotateCcw },
}

const PAYMENT_METHODS = [
  { brand: "Visa", last4: "4821", expiry: "06/27", primary: true },
  { brand: "Mastercard", last4: "1102", expiry: "11/26", primary: false },
]

export function WalletTab({ walletCents, onPatch }: Props) {
  const [customAmount, setCustomAmount] = useState("")
  const [promo, setPromo] = useState("")

  function topUp(amount: number) {
    const bonus = amount === 100 ? Math.round(amount * 0.05) : 0
    const credited = amount + bonus
    const next = walletCents + credited * 100
    onPatch(next)
    toast.success(`+ ${credited}€ añadidos al wallet`, {
      description: bonus ? `Incluye ${bonus} € de bonus por recarga de 100 €.` : "Disponible al instante.",
    })
  }

  function topUpCustom() {
    const n = parseFloat(customAmount.replace(",", "."))
    if (!n || n < 1 || n > 500) {
      toast.error("Importe inválido", { description: "Entre 1 € y 500 €." })
      return
    }
    topUp(n)
    setCustomAmount("")
  }

  function redeem() {
    const code = promo.trim().toUpperCase()
    if (!code) return
    if (code === "CASTILLO10") {
      onPatch(walletCents + 1000)
      toast.success("Promo aplicada", { description: "+10€ al wallet." })
    } else {
      toast.error("Código no válido", { description: "Prueba con 'CASTILLO10'." })
    }
    setPromo("")
  }

  function downloadInvoice(num?: string) {
    if (!num) return
    const body = [
      `PADEL CASTILLO DE AGUIMES`,
      `C/ Pino n10, P.I. Arinaga, Aguimes (Las Palmas)`,
      `(CIF — pendiente)`,
      ``,
      `Factura: ${num}`,
      `Fecha: ${new Date().toLocaleDateString("es-ES")}`,
      ``,
      `Concepto y desglose disponibles en la app oficial del club.`,
      ``,
      `(Documento generado por la web. Para el original solicitalo en recepcion.)`,
    ].join("\n")
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `factura-${num}.txt`
    a.click()
    URL.revokeObjectURL(a.href)
    toast.success(`Factura ${num} descargada`)
  }

  // Active bono progress (mock)
  const bonoUsed = 6
  const bonoTotal = 10

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
      {/* Main column */}
      <div className="space-y-5">
        {/* Balance card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#3a7d44]/40 bg-gradient-to-br from-[#3a7d44]/30 via-[#111111] to-[#0d0d0d] p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-50"
            style={{ background: "radial-gradient(circle, #3a7d44 0%, transparent 70%)" }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <WalletIcon size={14} className="text-[#3a7d44]" aria-hidden="true" />
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#3a7d44]">
                Saldo wallet
              </p>
            </div>
            <p
              className="text-[#f5f5f0] font-display font-black leading-none tabular-nums"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", letterSpacing: "-0.02em" }}
            >
              {(walletCents / 100).toFixed(2).replace(".", ",")} €
            </p>
            <p className="text-[#f5f5f0]/65 text-sm mt-2">
              Úsalo para reservas, bonos, escuela y tienda del club.
            </p>

            {/* Top-ups */}
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mt-6 mb-2">
              Recargar
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { amt: 10, label: null },
                { amt: 25, label: null },
                { amt: 50, label: "Recomendado" },
                { amt: 100, label: "+5% bonus" },
              ].map((b) => (
                <button
                  key={b.amt}
                  type="button"
                  onClick={() => topUp(b.amt)}
                  className={`relative inline-flex items-center gap-1.5 font-bold text-xs px-4 py-2 rounded-lg transition-colors ${
                    b.label
                      ? "bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a]"
                      : "bg-[#3a7d44] hover:bg-[#4a9d54] text-white"
                  }`}
                >
                  {b.label && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest bg-[#0a0a0a] text-[#e8d44d] border border-[#e8d44d]/50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      {b.label}
                    </span>
                  )}
                  <Plus size={11} aria-hidden="true" />
                  {b.amt} €
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="flex gap-2 mt-3 max-w-xs">
              <input
                type="text"
                inputMode="decimal"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                placeholder="Otro importe"
                className="flex-1 bg-[#1a1a1a]/70 border border-white/15 text-[#f5f5f0] text-xs rounded-lg px-3 py-2 outline-none focus:border-[#3a7d44]/60 placeholder:text-[#f5f5f0]/35"
              />
              <button
                type="button"
                onClick={topUpCustom}
                className="bg-white/10 hover:bg-white/15 text-[#f5f5f0] text-xs font-bold px-3 rounded-lg"
              >
                Recargar
              </button>
            </div>
          </div>
        </div>

        {/* Promo */}
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={14} className="text-[#e8d44d]" aria-hidden="true" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/65">
              Código promocional
            </p>
          </div>
          <div className="flex gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Introduce tu código"
              className="flex-1 bg-[#1a1a1a] border border-white/10 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#3a7d44]/60 placeholder:text-[#f5f5f0]/35 uppercase tracking-wide"
            />
            <button
              type="button"
              onClick={redeem}
              className="bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] font-bold text-xs px-4 rounded-xl"
            >
              Canjear
            </button>
          </div>
          <p className="text-[10px] text-[#f5f5f0]/45 mt-2">
            Demo: prueba con <code className="bg-white/5 px-1 rounded">CASTILLO10</code>
          </p>
        </div>

        {/* Active bono */}
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#3a7d44]">
                Bono activo
              </p>
              <h3 className="text-[#f5f5f0] font-display font-black text-lg leading-tight">
                Bono 50×10
              </h3>
            </div>
            <span className="text-[#f5f5f0] font-display font-black text-xl tabular-nums">
              {bonoTotal - bonoUsed}<span className="text-[#f5f5f0]/45 text-sm">/{bonoTotal}</span>
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3a7d44] rounded-full transition-all"
              style={{ width: `${(bonoUsed / bonoTotal) * 100}%` }}
            />
          </div>
          <p className="text-[#f5f5f0]/55 text-[11px] mt-2">
            Has consumido {bonoUsed} de {bonoTotal} partidas. Válido todos los días de 16:00 a 23:00.
          </p>
        </div>

        {/* Transactions */}
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-[#f5f5f0] font-display font-black text-lg">Movimientos</h3>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/40">
              Últimos {(transactions as Tx[]).length}
            </span>
          </div>
          <ul className="divide-y divide-white/5">
            {(transactions as Tx[]).map((tx) => {
              const meta = TX_META[tx.type]
              const Icon = meta.icon
              const sign = tx.amountCents >= 0 ? "+" : ""
              const eur = (Math.abs(tx.amountCents) / 100).toFixed(2).replace(".", ",")
              return (
                <li key={tx.id} className="flex items-center gap-3 py-3">
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${meta.color}22`, color: meta.color }}
                  >
                    <Icon size={14} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#f5f5f0] text-sm font-semibold leading-tight">{tx.label}</p>
                    <p className="text-[#f5f5f0]/55 text-[11px]">
                      {format(parseISO(tx.date), "d MMM yyyy · HH:mm", { locale: es })} · {tx.method}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`font-display font-black text-sm tabular-nums ${
                        tx.amountCents >= 0 ? "text-[#3a7d44]" : "text-[#f5f5f0]"
                      }`}
                    >
                      {sign}
                      {eur} €
                    </p>
                    {tx.invoiceNumber && (
                      <button
                        type="button"
                        onClick={() => downloadInvoice(tx.invoiceNumber)}
                        aria-label={`Descargar factura ${tx.invoiceNumber}`}
                        className="inline-flex items-center gap-0.5 text-[9px] text-[#f5f5f0]/45 hover:text-[#3a7d44] mt-0.5"
                      >
                        <Receipt size={9} aria-hidden="true" />
                        {tx.invoiceNumber}
                        <Download size={9} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Aside: payment methods */}
      <aside className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-[#3a7d44]" aria-hidden="true" />
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/65">
                Métodos de pago
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                toast("Próximamente", {
                  description: "Podrás añadir nuevas tarjetas cuando conectemos el TPV del club.",
                })
              }
              className="text-[10px] uppercase tracking-widest font-bold text-[#3a7d44] hover:text-[#4a9d54]"
            >
              + Añadir
            </button>
          </div>
          <ul className="space-y-3">
            {PAYMENT_METHODS.map((m) => (
              <li
                key={m.last4}
                className={`relative rounded-xl p-4 ${
                  m.primary
                    ? "bg-gradient-to-br from-[#3a7d44]/20 to-[#111111] border border-[#3a7d44]/40"
                    : "bg-[#1a1a1a] border border-white/5"
                }`}
              >
                {m.primary && (
                  <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest text-[#3a7d44] bg-[#3a7d44]/15 border border-[#3a7d44]/40 px-1.5 py-0.5 rounded-full">
                    Principal
                  </span>
                )}
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-1">
                  {m.brand}
                </p>
                <p className="text-[#f5f5f0] font-mono font-bold text-sm tabular-nums tracking-widest">
                  •••• {m.last4}
                </p>
                <p className="text-[#f5f5f0]/55 text-[10px] mt-1">Vence {m.expiry}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
