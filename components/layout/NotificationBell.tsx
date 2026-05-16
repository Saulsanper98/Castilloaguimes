"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  Bell,
  Calendar,
  Trophy,
  Wallet,
  Award,
  Sparkles,
  Building2,
  Check,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import {
  loadNotifications,
  markAllAsRead,
  markAsRead,
  unreadCount,
  type AppNotification,
  type NotifType,
} from "@/lib/notifications"

const TYPE_META: Record<NotifType, { icon: typeof Bell; color: string }> = {
  booking: { icon: Calendar, color: "#3a7d44" },
  match: { icon: Trophy, color: "#7c83ff" },
  wallet: { icon: Wallet, color: "#ff8a5b" },
  loyalty: { icon: Award, color: "#e8d44d" },
  club: { icon: Building2, color: "#3a7d44" },
  tournament: { icon: Sparkles, color: "#e8d44d" },
}

/** Campana de notificaciones con dropdown. */
export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState<AppNotification[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setList(loadNotifications()))
    function onStorage(e: StorageEvent) {
      if (e.key?.startsWith("pcdc-notifications")) setList(loadNotifications())
    }
    window.addEventListener("storage", onStorage)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

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

  const unread = unreadCount(list)

  function handleClick(n: AppNotification) {
    if (!n.read) setList(markAsRead(n.id))
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notificaciones${unread > 0 ? ` (${unread} sin leer)` : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[#f5f5f0]/65 hover:text-[#f5f5f0] hover:bg-white/5 transition-colors"
      >
        <Bell size={16} aria-hidden="true" />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#e8d44d] text-[#0a0a0a] text-[9px] font-black flex items-center justify-center tabular-nums"
            aria-hidden="true"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="menu"
            className="absolute right-0 top-full mt-2 w-[min(calc(100vw-2rem),22rem)] rounded-xl bg-[#111111] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <p className="text-[#f5f5f0] font-bold text-sm">Notificaciones</p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => setList(markAllAsRead())}
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-[#3a7d44] hover:text-[#4a9d54]"
                >
                  <Check size={10} aria-hidden="true" />
                  Marcar todo
                </button>
              )}
            </div>

            {/* List */}
            <ul className="max-h-[420px] overflow-y-auto">
              {list.length === 0 ? (
                <li className="px-4 py-8 text-center text-[#f5f5f0]/55 text-xs">
                  Sin notificaciones por ahora.
                </li>
              ) : (
                list.map((n) => {
                  const meta = TYPE_META[n.type]
                  const Icon = meta.icon
                  const Wrapper = n.href ? Link : "div"
                  const wrapperProps = n.href
                    ? { href: n.href, onClick: () => { handleClick(n); setOpen(false) } }
                    : { onClick: () => handleClick(n) }
                  return (
                    <li key={n.id}>
                      {/* @ts-expect-error - dynamic Wrapper component */}
                      <Wrapper
                        {...wrapperProps}
                        className={`flex gap-3 px-4 py-3 transition-colors cursor-pointer ${
                          n.read ? "hover:bg-white/[0.03]" : "bg-[#3a7d44]/5 hover:bg-[#3a7d44]/10"
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${meta.color}22`, color: meta.color }}
                          aria-hidden="true"
                        >
                          <Icon size={13} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="flex text-[#f5f5f0] font-semibold text-xs leading-tight items-center gap-2">
                            {n.title}
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#3a7d44]" aria-label="No leída" />}
                          </span>
                          <span className="block text-[#f5f5f0]/65 text-[11px] leading-snug mt-0.5">
                            {n.body}
                          </span>
                          <span className="block text-[10px] text-[#f5f5f0]/45 mt-1">
                            {formatDistanceToNow(new Date(n.createdAt), { locale: es, addSuffix: true })}
                          </span>
                        </span>
                      </Wrapper>
                    </li>
                  )
                })
              )}
            </ul>

            <div className="border-t border-white/10 px-4 py-2 bg-[#0d0d0d]">
              <p className="text-[10px] text-[#f5f5f0]/45">
                Solo se muestran las notificaciones de los últimos 30 días.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
