"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { ChevronLeft, LogOut } from "lucide-react"

export interface TabDef {
  id: string
  label: string
  icon: LucideIcon
  group: "actividad" | "club" | "tu"
  badge?: number
}

const GROUP_LABELS: Record<TabDef["group"], string> = {
  actividad: "Actividad",
  club: "Club",
  tu: "Tu cuenta",
}

interface Props {
  tabs: TabDef[]
  active: string
  onChange: (id: string) => void
  onLogout: () => void
}

export function AccountSidebar({ tabs, active, onChange, onLogout }: Props) {
  const groups: Array<TabDef["group"]> = ["actividad", "club", "tu"]

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        aria-label="Mi cuenta"
        className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-24 self-start"
      >
        {groups.map((g) => (
          <div key={g}>
            <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.3em] text-[#f5f5f0]/45 font-bold">
              {GROUP_LABELS[g]}
            </p>
            <div className="space-y-0.5">
              {tabs
                .filter((t) => t.group === g)
                .map((t) => {
                  const Icon = t.icon
                  const isActive = t.id === active
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onChange(t.id)}
                      aria-pressed={isActive}
                      className={`relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-[#3a7d44]/20 text-[#f5f5f0]"
                          : "text-[#f5f5f0]/65 hover:bg-white/5 hover:text-[#f5f5f0]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="account-active-bar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#3a7d44]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon size={14} aria-hidden="true" />
                      <span className="flex-1 text-left">{t.label}</span>
                      {t.badge !== undefined && t.badge > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold tabular-nums bg-[#3a7d44]/20 text-[#3a7d44]">
                          {t.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
            </div>
          </div>
        ))}

        {/* Sidebar footer */}
        <div className="pt-4 mt-2 border-t border-white/5 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#f5f5f0]/55 hover:text-[#f5f5f0] px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <ChevronLeft size={12} aria-hidden="true" />
            Volver a la web
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-xs text-[#f5f5f0]/55 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10"
          >
            <LogOut size={12} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Mobile pills (horizontal scroll) */}
      <div
        className="lg:hidden -mx-4 px-4 overflow-x-auto no-scrollbar sticky top-[var(--mobile-pills-top,4rem)] z-20 bg-[#0a0a0a]/85 backdrop-blur-md py-2 border-b border-white/10"
        role="tablist"
        aria-label="Mi cuenta"
      >
        <div className="flex gap-1.5 min-w-max">
          {tabs.map((t) => {
            const Icon = t.icon
            const isActive = t.id === active
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(t.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                  isActive
                    ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                    : "bg-[#1a1a1a] border-white/10 text-[#f5f5f0]/70"
                }`}
              >
                <Icon size={13} aria-hidden="true" />
                {t.label}
                {t.badge !== undefined && t.badge > 0 && (
                  <span className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold ${
                    isActive ? "bg-white/25 text-white" : "bg-[#3a7d44]/25 text-[#3a7d44]"
                  }`}>
                    {t.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
