"use client"

import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Wallet,
  Award,
  Bookmark,
  ShoppingBag,
  Star,
  User,
  Settings,
  ShieldCheck,
  LogIn,
} from "lucide-react"
import { toast } from "sonner"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import {
  loadProfile,
  patchProfile,
  clearProfile,
  type PlayerLevel,
  type PlayerProfile,
} from "@/lib/player"
import { tryLogin, getDemoCredentials } from "@/lib/auth"
import { AccountHeader } from "@/components/cuenta/AccountHeader"
import { AccountSidebar, type TabDef } from "@/components/cuenta/AccountSidebar"
import { ReferralCard } from "@/components/cuenta/ReferralCard"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { DashboardTab } from "@/components/cuenta/tabs/DashboardTab"
import { PerfilTab } from "@/components/cuenta/tabs/PerfilTab"
import { ReservasTab } from "@/components/cuenta/tabs/ReservasTab"
import { PartidosTab } from "@/components/cuenta/tabs/PartidosTab"
import { WalletTab } from "@/components/cuenta/tabs/WalletTab"
import { LoyaltyTab } from "@/components/cuenta/tabs/LoyaltyTab"
import { GuardadosTab } from "@/components/cuenta/tabs/GuardadosTab"
import { TiendaTab } from "@/components/cuenta/tabs/TiendaTab"
import { ReseñasTab } from "@/components/cuenta/tabs/ReseñasTab"
import { PreferenciasTab } from "@/components/cuenta/tabs/PreferenciasTab"
import { SeguridadTab } from "@/components/cuenta/tabs/SeguridadTab"
import userReservas from "@/data/userReservas.json"

type TabId =
  | "dashboard"
  | "reservas"
  | "partidos"
  | "wallet"
  | "loyalty"
  | "guardados"
  | "tienda"
  | "reseñas"
  | "perfil"
  | "preferencias"
  | "seguridad"

export default function CuentaClient() {
  const [tab, setTab] = useState<TabId>("dashboard")
  const [authed, setAuthed] = useState(false)
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [confirmLogout, setConfirmLogout] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const p = loadProfile()
      setProfile(p)
      setAuthed(p.name !== "Invitado")
    })
    return () => cancelAnimationFrame(id)
  }, [])

  function patch(patchObj: Partial<PlayerProfile>) {
    const next = patchProfile(patchObj)
    setProfile(next)
  }

  function applyLogin(p: Partial<PlayerProfile>) {
    const next = patchProfile(p)
    setProfile(next)
    setAuthed(true)
    setTab("dashboard")
  }

  function logout() {
    clearProfile()
    setProfile(null)
    setAuthed(false)
    setConfirmLogout(false)
    toast.success("Sesión cerrada")
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="pt-8 bg-[#111111] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6"><Breadcrumbs /></div>
            <h1 className="text-[#f5f5f0] font-display font-black text-2xl">Cargando…</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="pt-8 bg-[#111111] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6"><Breadcrumbs /></div>
            <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">Mi cuenta</span>
            <h1
              className="text-[#f5f5f0] font-display font-black tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", letterSpacing: "-0.02em" }}
            >
              ACCEDE A TU <span className="text-[#3a7d44]">CUENTA</span>
            </h1>
          </div>
        </div>
        <LoginScreen onSuccess={applyLogin} />
      </div>
    )
  }

  // Build tabs with badges (live counts)
  const upcomingReservas = (userReservas as Array<{ status: string }>).filter(
    (r) => r.status === "upcoming"
  ).length
  const tabs: Array<TabDef & { id: TabId }> = [
    { id: "dashboard", label: "Resumen", icon: LayoutDashboard, group: "actividad" },
    { id: "reservas", label: "Reservas", icon: Calendar, group: "actividad", badge: upcomingReservas },
    { id: "partidos", label: "Partidos", icon: Trophy, group: "actividad", badge: profile.joinedMatchIds.length },
    { id: "wallet", label: "Wallet", icon: Wallet, group: "club" },
    { id: "loyalty", label: "Fidelización", icon: Award, group: "club", badge: profile.loyaltyPoints > 0 ? undefined : undefined },
    { id: "guardados", label: "Guardados", icon: Bookmark, group: "club", badge: profile.savedNewsSlugs.length + profile.savedCampeonatoIds.length + profile.favouriteCourtIds.length },
    { id: "tienda", label: "Tienda", icon: ShoppingBag, group: "club" },
    { id: "reseñas", label: "Reseñas", icon: Star, group: "club" },
    { id: "perfil", label: "Perfil", icon: User, group: "tu" },
    { id: "preferencias", label: "Preferencias", icon: Settings, group: "tu" },
    { id: "seguridad", label: "Seguridad", icon: ShieldCheck, group: "tu" },
  ]

  // Next booking
  const nextBookingMock = userReservas.find((r) => r.status === "upcoming")
  const matchesThisWeek = profile.joinedMatchIds.length

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-4 bg-[#0d0d0d] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
          <Breadcrumbs />
        </div>
      </div>

      <AccountHeader
        name={profile.name}
        initials={profile.initials}
        avatarColor={profile.avatarColor}
        memberCode={profile.memberCode}
        joinedAt={profile.joinedAt}
        loyaltyPoints={profile.loyaltyPoints}
        nextBooking={
          nextBookingMock
            ? { date: nextBookingMock.date, time: nextBookingMock.time, courtName: nextBookingMock.courtName }
            : undefined
        }
        matchesThisWeek={matchesThisWeek}
        walletCents={profile.walletCents}
        onLogout={() => setConfirmLogout(true)}
        onPickAvatar={() =>
          toast("Próximamente", {
            description: "Pronto podrás subir foto. Usa iniciales mientras tanto.",
          })
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="lg:grid lg:grid-cols-[210px_1fr] lg:gap-8">
          <AccountSidebar
            tabs={tabs}
            active={tab}
            onChange={(id) => setTab(id as TabId)}
            onLogout={() => setConfirmLogout(true)}
          />

          <div id={`tab-${tab}`} className="mt-4 lg:mt-0 min-w-0">
            {tab === "dashboard" && (
              <div className="space-y-5">
                <DashboardTab profile={profile} onGoTab={(id) => setTab(id as TabId)} />
                <ReferralCard memberCode={profile.memberCode} />
              </div>
            )}
            {tab === "perfil" && <PerfilTab profile={profile} onPatch={patch} />}
            {tab === "reservas" && <ReservasTab />}
            {tab === "partidos" && (
              <PartidosTab
                joinedIds={profile.joinedMatchIds}
                onUpdate={(ids) => patch({ joinedMatchIds: ids })}
              />
            )}
            {tab === "wallet" && (
              <WalletTab
                walletCents={profile.walletCents}
                onPatch={(cents) => patch({ walletCents: cents })}
              />
            )}
            {tab === "loyalty" && <LoyaltyTab profile={profile} onPatch={patch} />}
            {tab === "guardados" && <GuardadosTab profile={profile} onPatch={patch} />}
            {tab === "tienda" && <TiendaTab />}
            {tab === "reseñas" && <ReseñasTab />}
            {tab === "preferencias" && <PreferenciasTab profile={profile} onPatch={patch} />}
            {tab === "seguridad" && (
              <SeguridadTab profile={profile} onPatch={patch} onLogout={logout} />
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="¿Cerrar sesión?"
        description="Volverás a la pantalla de inicio de sesión. Tus datos demo siguen guardados en este navegador."
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
        onConfirm={logout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  )
}

// ── Login screen ──────────────────────────────────────────────────────────

interface LoginScreenProps {
  onSuccess: (profile: Partial<PlayerProfile>) => void
}

function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 350))
    const res = tryLogin(email, password)
    setSubmitting(false)
    if (!res.ok) {
      setError(res.error === "missing" ? "Rellena email y contraseña" : "Email o contraseña incorrectos")
      return
    }
    onSuccess(res.profile ?? {})
  }

  function autoFill() {
    const demo = getDemoCredentials()
    setEmail(demo.email)
    setPassword(demo.password)
    setError(null)
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-7 sm:p-9 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#3a7d44]/15 border border-[#3a7d44]/40 flex items-center justify-center mb-4">
            <LogIn size={22} className="text-[#3a7d44]" aria-hidden="true" />
          </div>
          <h2 className="text-[#f5f5f0] font-display font-black text-2xl mb-1">Inicia sesión</h2>
          <p className="text-[#f5f5f0]/55 text-sm">
            Accede para gestionar reservas, partidos y bonos.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="block text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-1.5">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-[#f5f5f0]/30"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label htmlFor="login-password" className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55">
                Contraseña
              </label>
              <a href="#" className="text-[10px] text-[#3a7d44] hover:text-[#4a9d54]">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-4 py-3 pr-20 outline-none transition-colors placeholder:text-[#f5f5f0]/30"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/55 hover:text-[#f5f5f0] px-2 py-1"
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPwd ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#e8d44d] hover:bg-[#f0dc55] disabled:opacity-60 text-[#0a0a0a] font-black py-3 rounded-xl text-sm transition-colors"
          >
            {submitting && <span className="w-3.5 h-3.5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />}
            {submitting ? "Accediendo…" : "Entrar"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/45 mb-2">Cuenta demo</p>
          <p className="text-[11px] text-[#f5f5f0]/55 mb-3 leading-relaxed">
            Email: <code className="bg-white/5 px-1 rounded text-[#f5f5f0]">saulsanper98@gmail.com</code><br />
            Pwd: <code className="bg-white/5 px-1 rounded text-[#f5f5f0]">FoxKay1998!</code>
          </p>
          <button
            type="button"
            onClick={autoFill}
            className="text-xs text-[#3a7d44] hover:text-[#4a9d54] font-semibold underline-offset-2 hover:underline"
          >
            Autorellenar credenciales
          </button>
        </div>

        <p className="text-[10px] text-[#f5f5f0]/40 text-center mt-5">
          Tus datos se guardan solo en este navegador.
        </p>
      </div>
    </div>
  )
}

// Re-export for static type referencing
export type { PlayerLevel }
