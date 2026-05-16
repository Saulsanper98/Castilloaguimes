"use client"

import Link from "next/link"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import type { LucideIcon } from "lucide-react"
import { Camera, Calendar, Trophy, Wallet, LogOut, Sparkles } from "lucide-react"

import { Avatar } from "./Avatar"
import { greetingFor, daysSince } from "@/lib/greeting"
import { tierFor } from "@/lib/player"

interface Props {
  name: string
  initials: string
  avatarColor: string
  memberCode: string
  joinedAt: string
  loyaltyPoints: number
  nextBooking?: { date: string; time: string; courtName: string }
  matchesThisWeek: number
  walletCents: number
  onLogout: () => void
  onPickAvatar: () => void
  onGoTab: (id: string) => void
}

export function AccountHeader({
  name,
  initials,
  avatarColor,
  memberCode,
  joinedAt,
  loyaltyPoints,
  nextBooking,
  matchesThisWeek,
  walletCents,
  onLogout,
  onPickAvatar,
  onGoTab,
}: Props) {
  const greeting = greetingFor()
  const firstName = name.split(" ")[0]
  const tier = tierFor(loyaltyPoints)
  const days = daysSince(joinedAt)
  const years = Math.floor(days / 365)
  const joined = parseISO(joinedAt)

  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0f0f0f] via-[#111111] to-[#0d0d0d]">
      {/* Decorative court lines */}
      <div className="absolute inset-0 bg-court-lines opacity-40 pointer-events-none" aria-hidden="true" />
      {/* Soft green glow */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3a7d44 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-10 sm:pb-10">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-end justify-between">
          {/* Left: avatar + greeting */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative group">
              <Avatar initials={initials} color={avatarColor} size="xl" />
              <button
                type="button"
                onClick={onPickAvatar}
                aria-label="Cambiar avatar"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/15 text-[#f5f5f0]/65 hover:text-[#f5f5f0] hover:border-[#3a7d44]/60 flex items-center justify-center transition-colors shadow-lg"
              >
                <Camera size={13} aria-hidden="true" />
              </button>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase text-[#3a7d44] mb-1">
                {greeting},
              </p>
              <h1
                className="text-[#f5f5f0] font-display font-black tracking-tight leading-none"
                style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)", letterSpacing: "-0.02em" }}
              >
                {firstName}
              </h1>
              <p className="mt-2 text-[11px] text-[#f5f5f0]/55 flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1"
                  title={`Nº de socio · ${memberCode}`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: tier.color }}
                    aria-hidden="true"
                  />
                  Socio <span className="text-[#f5f5f0] font-bold">{tier.tier}</span>
                </span>
                <span className="text-[#f5f5f0]/35">·</span>
                <span>
                  {years > 0
                    ? `${years} ${years === 1 ? "año" : "años"} en el club`
                    : `Desde ${format(joined, "MMM yyyy", { locale: es })}`}
                </span>
              </p>
            </div>
          </div>

          {/* Right: logout */}
          <button
            type="button"
            onClick={onLogout}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#f5f5f0]/65 hover:text-red-400 border border-white/15 hover:border-red-500/40 rounded-lg px-3 py-2 transition-colors"
          >
            <LogOut size={13} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>

        {/* Summary chips */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SummaryChip
            icon={Calendar}
            label="Próxima reserva"
            value={
              nextBooking
                ? `${format(parseISO(nextBooking.date), "EEE d MMM", { locale: es })} · ${nextBooking.time}`
                : "Sin reservas"
            }
            sub={nextBooking?.courtName ?? "Reserva tu próxima pista"}
            onClick={nextBooking ? () => onGoTab("reservas") : undefined}
            href={nextBooking ? undefined : "/reservas"}
          />
          <SummaryChip
            icon={Trophy}
            label="Partidos esta semana"
            value={matchesThisWeek > 0 ? `${matchesThisWeek} partido${matchesThisWeek !== 1 ? "s" : ""}` : "Ninguno"}
            sub={matchesThisWeek > 0 ? "Toca a fondo" : "Encuentra uno para tu nivel"}
            onClick={matchesThisWeek > 0 ? () => onGoTab("partidos") : undefined}
            href={matchesThisWeek > 0 ? undefined : "/partidos-abiertos"}
          />
          <SummaryChip
            icon={Wallet}
            label="Saldo wallet"
            value={`${(walletCents / 100).toFixed(2).replace(".", ",")} €`}
            sub={
              walletCents > 0 ? "Disponible al instante" : "Recarga y juega sin esperas"
            }
            onClick={() => onGoTab("wallet")}
            accent
          />
        </div>

        {/* Streak / tier hint */}
        {tier.nextTier && (
          <p className="mt-4 text-[11px] text-[#f5f5f0]/55 flex items-center gap-2">
            <Sparkles size={11} className="text-[#e8d44d]" aria-hidden="true" />
            Te faltan <span className="text-[#e8d44d] font-bold">{tier.pointsToNext} puntos</span> para subir a {tier.nextTier}.
          </p>
        )}
      </div>
    </header>
  )
}

interface SummaryChipProps {
  icon: LucideIcon
  label: string
  value: string
  sub: string
  href?: string
  onClick?: () => void
  accent?: boolean
}

function SummaryChip({ icon: Icon, label, value, sub, href, onClick, accent }: SummaryChipProps) {
  const className = `group flex w-full text-left items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
    accent
      ? "border-[#3a7d44]/40 bg-[#3a7d44]/10 hover:bg-[#3a7d44]/15"
      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
  }`
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        <SummaryChipBody Icon={Icon} label={label} value={value} sub={sub} accent={accent} />
      </button>
    )
  }
  return (
    <Link href={href ?? "#"} className={className}>
      <SummaryChipBody Icon={Icon} label={label} value={value} sub={sub} accent={accent} />
    </Link>
  )
}

function SummaryChipBody({
  Icon,
  label,
  value,
  sub,
  accent,
}: {
  Icon: LucideIcon
  label: string
  value: string
  sub: string
  accent?: boolean
}) {
  return (
    <>
      <span
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          accent ? "bg-[#3a7d44]/25 text-[#3a7d44]" : "bg-white/5 text-[#f5f5f0]/70"
        }`}
      >
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[9px] tracking-widest uppercase font-bold text-[#f5f5f0]/55">{label}</span>
        <span className="block text-[#f5f5f0] font-bold text-sm truncate">{value}</span>
        <span className="block text-[#f5f5f0]/55 text-[10px] truncate">{sub}</span>
      </span>
    </>
  )
}
