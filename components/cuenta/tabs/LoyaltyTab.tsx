"use client"

import { Award, Flame, Check, Sparkles } from "lucide-react"
import { toast } from "sonner"
import rewards from "@/data/rewards.json"
import { tierFor, allTiers, type PlayerProfile } from "@/lib/player"

type Reward = (typeof rewards)[number]

interface Props {
  profile: PlayerProfile
  onPatch: (patch: Partial<PlayerProfile>) => void
}

const EARN_RULES = [
  { label: "Reserva pista", points: 10 },
  { label: "Unirse a partido abierto", points: 5 },
  { label: "Apuntarte a torneo", points: 25 },
  { label: "Reseña verificada", points: 15 },
  { label: "Cumpleaños", points: 50 },
  { label: "Bono comprado", points: 30 },
]

export function LoyaltyTab({ profile, onPatch }: Props) {
  const tier = tierFor(profile.loyaltyPoints)
  const tiers = allTiers()

  function redeem(r: Reward) {
    if (profile.loyaltyPoints < r.cost) {
      toast.error("No tienes puntos suficientes")
      return
    }
    onPatch({
      loyaltyPoints: profile.loyaltyPoints - r.cost,
      redeemedRewardIds: [...profile.redeemedRewardIds, r.id],
    })
    toast.success(`Has canjeado: ${r.name}`, {
      description: "Recoge el premio en recepción cuando quieras.",
    })
  }

  return (
    <div className="space-y-5">
      {/* Hero: tier + progress */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0d0d0d] p-6">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${tier.color} 0%, transparent 70%)` }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-end gap-6 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award size={14} style={{ color: tier.color }} aria-hidden="true" />
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold" style={{ color: tier.color }}>
                Socio {tier.tier}
              </p>
            </div>
            <p
              className="text-[#f5f5f0] font-display font-black tabular-nums leading-none"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)" }}
            >
              {profile.loyaltyPoints}
              <span className="text-[#f5f5f0]/45 text-base font-bold ml-2">puntos</span>
            </p>
            {tier.nextTier ? (
              <p className="text-[#f5f5f0]/65 text-sm mt-2">
                Te faltan <span className="text-[#e8d44d] font-bold">{tier.pointsToNext} puntos</span> para subir a <span className="font-bold" style={{ color: tier.color }}>{tier.nextTier}</span>.
              </p>
            ) : (
              <p className="text-[#f5f5f0]/65 text-sm mt-2">¡Estás en el tier más alto! Sigue ganando puntos para canjear más recompensas.</p>
            )}
          </div>

          {/* Streak */}
          <div className="bg-[#0a0a0a]/40 border border-[#e8d44d]/30 rounded-2xl p-4 flex items-center gap-3">
            <Flame size={24} className="text-[#e8d44d]" aria-hidden="true" />
            <div>
              <p className="text-[#f5f5f0] font-display font-black text-xl tabular-nums leading-none">
                {profile.streakWeeks} sem
              </p>
              <p className="text-[#f5f5f0]/55 text-[11px]">Racha activa · +20% bonus</p>
            </div>
          </div>
        </div>

        {/* Tier ladder */}
        <div className="relative mt-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${tier.progressPct}%`, background: tier.color }}
            />
          </div>
          <div className="grid grid-cols-4 mt-3">
            {tiers.map((t) => {
              const reached = profile.loyaltyPoints >= t.min
              return (
                <div key={t.tier} className="text-center">
                  <span
                    className={`block text-[10px] uppercase tracking-widest font-bold ${
                      reached ? "" : "text-[#f5f5f0]/35"
                    }`}
                    style={reached ? { color: t.color } : {}}
                  >
                    {t.tier}
                  </span>
                  <span className="block text-[10px] text-[#f5f5f0]/45 tabular-nums">{t.min}+</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Rewards catalog */}
      <section>
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-[#f5f5f0] font-display font-black text-xl">Canjear puntos</h2>
          <p className="text-[#f5f5f0]/55 text-xs tabular-nums">
            Tienes {profile.loyaltyPoints} pts disponibles
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(rewards as Reward[]).map((r) => {
            const enough = profile.loyaltyPoints >= r.cost
            const redeemed = profile.redeemedRewardIds.includes(r.id)
            return (
              <article
                key={r.id}
                className={`relative rounded-2xl border p-5 flex flex-col transition-all ${
                  redeemed
                    ? "border-[#3a7d44]/40 bg-[#3a7d44]/10"
                    : enough
                    ? "border-white/10 bg-[#111111] hover:border-[#3a7d44]/30"
                    : "border-white/5 bg-[#111111] opacity-70"
                }`}
              >
                <span
                  className="text-[10px] uppercase tracking-widest font-bold mb-2"
                  style={{ color: r.color }}
                >
                  {r.category}
                </span>
                <h3 className="text-[#f5f5f0] font-display font-black text-base leading-tight mb-1">
                  {r.name}
                </h3>
                <p className="text-[#f5f5f0]/65 text-xs leading-relaxed mb-4 flex-1">{r.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#e8d44d] font-display font-black tabular-nums text-lg">
                    {r.cost} pts
                  </span>
                  {redeemed ? (
                    <span className="inline-flex items-center gap-1 text-[#3a7d44] text-[10px] uppercase tracking-widest font-bold">
                      <Check size={11} aria-hidden="true" />
                      Canjeado
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={!enough}
                      onClick={() => redeem(r)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        enough
                          ? "bg-[#3a7d44] hover:bg-[#4a9d54] text-white"
                          : "bg-white/5 text-[#f5f5f0]/40 cursor-not-allowed"
                      }`}
                    >
                      Canjear
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Earn rules */}
      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-[#e8d44d]" aria-hidden="true" />
          <h2 className="text-[#f5f5f0] font-display font-black text-lg">Cómo ganar puntos</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EARN_RULES.map((r) => (
            <li
              key={r.label}
              className="flex items-center justify-between text-sm bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-2.5"
            >
              <span className="text-[#f5f5f0]/80">{r.label}</span>
              <span className="text-[#e8d44d] font-bold tabular-nums">+{r.points} pts</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
