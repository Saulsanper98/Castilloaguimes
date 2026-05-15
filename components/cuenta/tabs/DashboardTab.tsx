"use client"

import Link from "next/link"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import {
  Calendar,
  Trophy,
  Wallet,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Share2,
  Download,
  type LucideIcon,
} from "lucide-react"
import { EloSparkline } from "@/components/cuenta/EloSparkline"
import { InfoTooltip } from "@/components/ui/InfoTooltip"
import { eloPercentile, tierFor } from "@/lib/player"
import type { PlayerProfile } from "@/lib/player"
import userReservas from "@/data/userReservas.json"
import userActivity from "@/data/userActivity.json"
import partidos from "@/data/partidos.json"

interface Props {
  profile: PlayerProfile
  onGoTab: (id: string) => void
}

type Reserva = (typeof userReservas)[number]
type Activity = (typeof userActivity)[number]

const ACTIVITY_ICONS: Record<Activity["type"], { icon: LucideIcon; color: string }> = {
  loyalty: { icon: Award, color: "#e8d44d" },
  booking: { icon: Calendar, color: "#3a7d44" },
  match: { icon: Trophy, color: "#7c83ff" },
  wallet: { icon: Wallet, color: "#ff8a5b" },
  review: { icon: Sparkles, color: "#e8d44d" },
  elo: { icon: TrendingUp, color: "#3a7d44" },
}

export function DashboardTab({ profile, onGoTab }: Props) {
  const upcoming: Reserva[] = (userReservas as Reserva[]).filter(
    (r) => r.status === "upcoming"
  )
  const nextBooking = upcoming[0]
  const tier = tierFor(profile.loyaltyPoints)
  const percentile = eloPercentile(profile.elo)
  const eloDelta = profile.eloHistory[profile.eloHistory.length - 1] - profile.eloHistory[0]
  const monthMatches = (partidos as Array<{ id: number }>).filter((p) =>
    profile.joinedMatchIds.includes(p.id)
  ).length
  const recommendations = (partidos as Array<{
    id: number
    fecha: string
    hora: string
    pista: string
    nivel: string
    plazasTotal: number
    plazasOcupadas: number
  }>)
    .filter((p) => p.nivel === profile.level && p.plazasOcupadas < p.plazasTotal)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Hero next booking + KPIs grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Próxima reserva (col-span-2) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#3a7d44]/30 bg-gradient-to-br from-[#3a7d44]/20 via-[#111111] to-[#0d0d0d] p-6">
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl opacity-50"
            style={{ background: "radial-gradient(circle, #3a7d44 0%, transparent 70%)" }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#3a7d44]">
                Próxima reserva
              </p>
              {nextBooking && (
                <span className="text-[11px] text-[#f5f5f0]/65 tabular-nums">
                  {formatDistanceToNow(parseISO(nextBooking.date), { locale: es, addSuffix: true })}
                </span>
              )}
            </div>
            {nextBooking ? (
              <>
                <h2
                  className="text-[#f5f5f0] font-display font-black leading-none mb-3"
                  style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", letterSpacing: "-0.02em" }}
                >
                  {nextBooking.courtName.toUpperCase()}{" "}
                  <span className="text-[#3a7d44]">· {nextBooking.time}</span>
                </h2>
                <p className="text-[#f5f5f0]/75 text-sm capitalize">
                  {format(parseISO(nextBooking.date), "EEEE d 'de' MMMM", { locale: es })} ·{" "}
                  {nextBooking.duration} min
                </p>

                {/* Players row */}
                <div className="flex items-center gap-1.5 mt-4">
                  {nextBooking.players.map((p) => (
                    <span
                      key={p.initials}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#0a0a0a]"
                      style={{ background: p.color }}
                      title={p.name}
                      aria-label={p.name}
                    >
                      {p.initials}
                    </span>
                  ))}
                  {nextBooking.players.length < 4 && (
                    <span className="text-[10px] text-[#f5f5f0]/55 ml-2">
                      Faltan {4 - nextBooking.players.length} compañero{4 - nextBooking.players.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => onGoTab("reservas")}
                    className="inline-flex items-center gap-1.5 bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                  >
                    Ver detalle
                    <ArrowRight size={12} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 border border-white/15 hover:border-white/30 text-[#f5f5f0]/80 text-xs font-bold px-3 py-2 rounded-lg"
                  >
                    <Download size={12} aria-hidden="true" />
                    Calendario
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 border border-white/15 hover:border-white/30 text-[#f5f5f0]/80 text-xs font-bold px-3 py-2 rounded-lg"
                  >
                    <Share2 size={12} aria-hidden="true" />
                    Compartir
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Clock size={36} className="text-[#3a7d44]/45 mx-auto mb-3" aria-hidden="true" />
                <p className="text-[#f5f5f0]/65 text-sm">No tienes reservas próximas.</p>
                <Link
                  href="/reservas"
                  className="inline-flex items-center gap-1.5 mt-3 bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] font-black text-xs px-4 py-2 rounded-lg"
                >
                  Reservar pista
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ELO card */}
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#f5f5f0]/55">
              Tu ELO
            </p>
            <InfoTooltip text="ELO es tu nivel competitivo. Sube al ganar partidos contra rivales de nivel similar o superior." />
          </div>
          <p className="text-[#3a7d44] font-display font-black text-4xl tabular-nums leading-none">
            {profile.elo}
          </p>
          <p className="text-[#f5f5f0]/55 text-[11px] mt-1">
            Top {100 - percentile}% del club ·{" "}
            <span className={eloDelta >= 0 ? "text-[#3a7d44]" : "text-red-400"}>
              {eloDelta >= 0 ? "+" : ""}
              {eloDelta} este semestre
            </span>
          </p>
          <div className="mt-3 -mx-1">
            <EloSparkline data={profile.eloHistory} />
          </div>
        </div>
      </div>

      {/* Mini KPIs row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi
          icon={Trophy}
          label="Partidos"
          value={`${monthMatches}`}
          sub="apuntados ahora"
          onClick={() => onGoTab("partidos")}
        />
        <Kpi
          icon={Award}
          label="Fidelización"
          value={`${profile.loyaltyPoints} pts`}
          sub={`Socio ${tier.tier}`}
          tone={tier.color}
          onClick={() => onGoTab("loyalty")}
        />
        <Kpi
          icon={Wallet}
          label="Wallet"
          value={`${(profile.walletCents / 100).toFixed(2).replace(".", ",")} €`}
          sub="Disponible"
          onClick={() => onGoTab("wallet")}
        />
        <Kpi
          icon={Sparkles}
          label="Racha"
          value={`${profile.streakWeeks} sem`}
          sub="jugando seguido"
          onClick={() => onGoTab("loyalty")}
          tone="#e8d44d"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity feed */}
        <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
          <h3 className="text-[#f5f5f0] font-display font-black text-lg mb-4">
            Actividad reciente
          </h3>
          <ul className="space-y-3">
            {(userActivity as Activity[]).slice(0, 6).map((a) => {
              const meta = ACTIVITY_ICONS[a.type]
              const Icon = meta.icon
              return (
                <li key={a.id} className="flex items-start gap-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${meta.color}20`, color: meta.color }}
                  >
                    <Icon size={13} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#f5f5f0] text-sm font-semibold leading-tight">{a.title}</p>
                    <p className="text-[#f5f5f0]/55 text-xs leading-tight">{a.detail}</p>
                  </div>
                  <span className="text-[10px] text-[#f5f5f0]/45 whitespace-nowrap">
                    {formatDistanceToNow(parseISO(a.date), { locale: es, addSuffix: true })}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Recommendations */}
        <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-[#f5f5f0] font-display font-black text-lg">
              Para ti
            </h3>
            <Link
              href="/partidos-abiertos"
              className="text-[10px] text-[#3a7d44] hover:text-[#4a9d54] font-bold uppercase tracking-widest"
            >
              Ver más →
            </Link>
          </div>
          {recommendations.length === 0 ? (
            <p className="text-[#f5f5f0]/55 text-sm py-6 text-center">
              No hay partidos abiertos para tu nivel ahora mismo.
            </p>
          ) : (
            <ul className="space-y-3">
              {recommendations.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 bg-[#1a1a1a] border border-white/5 rounded-xl p-3"
                >
                  <div className="min-w-0">
                    <p className="text-[#f5f5f0] font-bold text-xs capitalize truncate">
                      {format(parseISO(r.fecha), "EEE d MMM", { locale: es })} · {r.hora}
                    </p>
                    <p className="text-[#f5f5f0]/55 text-[10px]">
                      {r.pista} · {r.nivel} · {r.plazasTotal - r.plazasOcupadas} plaza{r.plazasTotal - r.plazasOcupadas !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Link
                    href="/partidos-abiertos"
                    className="bg-[#3a7d44] hover:bg-[#4a9d54] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shrink-0"
                  >
                    Unirme
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

interface KpiProps {
  icon: LucideIcon
  label: string
  value: string
  sub: string
  tone?: string
  onClick?: () => void
}

function Kpi({ icon: Icon, label, value, sub, tone = "#3a7d44", onClick }: KpiProps) {
  const Tag = onClick ? "button" : "div"
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`text-left rounded-xl border border-white/10 bg-[#111111] p-4 transition-colors ${onClick ? "hover:border-white/20" : ""}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${tone}20`, color: tone }}
        >
          <Icon size={12} aria-hidden="true" />
        </span>
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55">{label}</span>
      </div>
      <p className="text-[#f5f5f0] font-display font-black text-xl tabular-nums leading-tight">{value}</p>
      <p className="text-[#f5f5f0]/55 text-[10px]">{sub}</p>
    </Tag>
  )
}
