"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  User,
  Calendar,
  Trophy,
  Wallet,
  Award,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar } from "@/components/cuenta/Avatar"
import { loadProfile, clearProfile, tierFor, type PlayerProfile } from "@/lib/player"
import { toast } from "sonner"

const QUICK_LINKS = [
  { href: "/cuenta", label: "Mi cuenta", icon: User },
  { href: "/cuenta?tab=reservas", label: "Mis reservas", icon: Calendar },
  { href: "/cuenta?tab=partidos", label: "Mis partidos", icon: Trophy },
  { href: "/cuenta?tab=wallet", label: "Wallet", icon: Wallet },
  { href: "/cuenta?tab=loyalty", label: "Fidelización", icon: Award },
  { href: "/cuenta?tab=preferencias", label: "Preferencias", icon: Settings },
]

interface Props {
  variant?: "desktop" | "mobile"
  onNavigate?: () => void
}

/**
 * Botón de cuenta: muestra avatar + dropdown si el usuario está logueado,
 * o "Acceder" si no. Se actualiza al cambiar de pestaña/storage.
 */
export function UserMenu({ variant = "desktop", onNavigate }: Props) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Hydrate profile on mount and on storage events
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const p = loadProfile()
      setProfile(p.name === "Invitado" ? null : p)
    })
    function onStorage(e: StorageEvent) {
      if (e.key === "pcdc-player-v2" || e.key === "pcdc-player-v1" || e.key === null) {
        const p = loadProfile()
        setProfile(p.name === "Invitado" ? null : p)
      }
    }
    function onLocalPatch() {
      const p = loadProfile()
      setProfile(p.name === "Invitado" ? null : p)
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener("pcdc:profile-changed", onLocalPatch)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("pcdc:profile-changed", onLocalPatch)
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  function logout() {
    clearProfile()
    setProfile(null)
    setOpen(false)
    onNavigate?.()
    toast.success("Sesión cerrada")
  }

  // Not logged in: render the two CTAs unchanged
  if (!profile) {
    if (variant === "mobile") {
      return (
        <>
          <Link
            href="/cuenta"
            onClick={onNavigate}
            className="flex-1 text-center text-[#f5f5f0] border border-white/30 text-sm font-semibold py-2.5 rounded-lg hover:bg-white/5"
          >
            Registrarse
          </Link>
          <Link
            href="/cuenta"
            onClick={onNavigate}
            className="flex-1 text-center bg-[#e8d44d] text-[#0a0a0a] text-sm font-bold py-2.5 rounded-lg hover:bg-[#f0dc55]"
          >
            Acceder
          </Link>
        </>
      )
    }
    return (
      <>
        <Link
          href="/cuenta"
          className="text-[#f5f5f0] border border-white/30 hover:border-white/60 text-[13px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 whitespace-nowrap"
        >
          Registrarse
        </Link>
        <Link
          href="/cuenta"
          className="bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
        >
          Acceder
        </Link>
      </>
    )
  }

  const tier = tierFor(profile.loyaltyPoints)
  const firstName = profile.name.split(" ")[0]

  // Mobile: full-width row with avatar + name + logout
  if (variant === "mobile") {
    return (
      <div className="flex-1 flex items-center gap-3 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2">
        <Avatar initials={profile.initials} color={profile.avatarColor} size="md" />
        <Link
          href="/cuenta"
          onClick={onNavigate}
          className="flex-1 min-w-0"
        >
          <span className="block text-[#f5f5f0] font-bold text-sm leading-tight truncate">
            {firstName}
          </span>
          <span
            className="block text-[10px] uppercase tracking-widest font-bold leading-tight"
            style={{ color: tier.color }}
          >
            Socio {tier.tier}
          </span>
        </Link>
        <button
          type="button"
          onClick={logout}
          aria-label="Cerrar sesión"
          className="w-9 h-9 rounded-lg text-[#f5f5f0]/65 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center"
        >
          <LogOut size={14} aria-hidden="true" />
        </button>
      </div>
    )
  }

  // Desktop dropdown
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/5 px-2 py-1 transition-colors"
      >
        <Avatar initials={profile.initials} color={profile.avatarColor} size="sm" />
        <span className="hidden sm:flex flex-col items-start leading-none">
          <span className="text-[#f5f5f0] font-bold text-[11px]">{firstName}</span>
          <span
            className="text-[9px] uppercase tracking-widest font-bold mt-0.5"
            style={{ color: tier.color }}
          >
            {tier.tier}
          </span>
        </span>
        <ChevronDown
          size={12}
          aria-hidden="true"
          className={`text-[#f5f5f0]/55 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[#111111] border border-white/10 shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-white/10 bg-gradient-to-br from-[#3a7d44]/15 to-transparent">
              <div className="flex items-center gap-3">
                <Avatar initials={profile.initials} color={profile.avatarColor} size="md" />
                <div className="min-w-0">
                  <p className="text-[#f5f5f0] font-bold text-sm truncate">{profile.name}</p>
                  <p className="text-[10px] text-[#f5f5f0]/55 truncate">{profile.email}</p>
                  <p
                    className="text-[10px] uppercase tracking-widest font-bold mt-1"
                    style={{ color: tier.color }}
                  >
                    Socio {tier.tier} · {profile.loyaltyPoints} pts
                  </p>
                </div>
              </div>
            </div>

            {/* Links */}
            <ul className="py-1.5">
              {QUICK_LINKS.map((l) => {
                const Icon = l.icon
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#f5f5f0]/80 hover:bg-white/5 hover:text-[#f5f5f0] transition-colors"
                    >
                      <Icon size={13} className="text-[#3a7d44] shrink-0" aria-hidden="true" />
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="border-t border-white/10">
              <button
                type="button"
                onClick={logout}
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={13} className="shrink-0" aria-hidden="true" />
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
