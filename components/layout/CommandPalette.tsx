"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { Search, X, Calendar, Users, GraduationCap, Trophy, MapPin, Newspaper, Phone, Receipt, Home, Activity, HelpCircle, UserCircle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import noticias from "@/data/noticias.json"

type Item = {
  id: string
  label: string
  hint?: string
  href: string
  icon: LucideIcon
  keywords?: string[]
}

const STATIC_ITEMS: Item[] = [
  { id: "home", label: "Inicio", href: "/", icon: Home, keywords: ["home", "principal"] },
  { id: "cuenta", label: "Mi cuenta", href: "/cuenta", icon: UserCircle, keywords: ["perfil", "reservas", "wallet", "login", "entrar"] },
  { id: "reservas", label: "Reservar pista", href: "/reservas", icon: Calendar, keywords: ["pista", "calendario", "horarios", "book"] },
  {
    id: "disponibilidad",
    label: "Disponibilidad en directo",
    href: "/disponibilidad",
    icon: Activity,
    keywords: ["heatmap", "huecos", "libre", "pistas", "sin login"],
  },
  { id: "faq", label: "Preguntas frecuentes", href: "/faq", icon: HelpCircle, keywords: ["socio", "precio", "llegar", "clase", "cancelar"] },
  { id: "partidos", label: "Partidos abiertos", href: "/partidos-abiertos", icon: Users, keywords: ["match", "jugar", "open", "americano"] },
  { id: "escuela", label: "Escuela de pádel", href: "/escuela", icon: GraduationCap, keywords: ["clases", "entrenador", "aprender", "monitor"] },
  { id: "campeonatos", label: "Campeonatos y torneos", href: "/campeonatos", icon: Trophy, keywords: ["liga", "open", "torneo", "inscripción"] },
  { id: "instalaciones", label: "Instalaciones", href: "/instalaciones", icon: MapPin, keywords: ["cafetería", "tienda", "vestuarios", "gimnasio"] },
  { id: "noticias", label: "Noticias del club", href: "/noticias", icon: Newspaper, keywords: ["blog", "actualidad", "novedades"] },
  { id: "tarifas", label: "Tarifas y bonos", href: "/tarifas", icon: Receipt, keywords: ["precio", "bono", "coste"] },
  { id: "contacto", label: "Contacto", href: "/contacto", icon: Phone, keywords: ["teléfono", "email", "mapa", "dirección"] },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [recentIds, setRecentIds] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Build full searchable list (pages + recent news)
  const newsItems: Item[] = noticias.slice(0, 6).map((n) => ({
    id: `news-${n.slug}`,
    label: n.titulo,
    hint: "Noticia",
    href: `/noticias/${n.slug}`,
    icon: Newspaper,
    keywords: [n.categoria, "blog"],
  }))
  const items = [...STATIC_ITEMS, ...newsItems]

  const q = query.trim().toLowerCase()
  // Recent items (saved when user selects something)
  const recents = recentIds
    .map((id) => items.find((it) => it.id === id))
    .filter(Boolean) as Item[]
  const filtered = q
    ? items.filter((it) => {
        const hay = [it.label, it.hint ?? "", ...(it.keywords ?? [])].join(" ").toLowerCase()
        return hay.includes(q)
      })
    : recents.length > 0
      ? [...recents, ...items.filter((it) => !recentIds.includes(it.id)).slice(0, Math.max(0, 6 - recents.length))]
      : items.slice(0, 9)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((wasOpen) => {
          if (wasOpen) queueMicrotask(() => setQuery(""))
          return !wasOpen
        })
      }
      if (e.key === "Escape") {
        close()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    function onOpenFromNav() {
      setOpen(true)
      setQuery("")
    }
    window.addEventListener("command-palette-open", onOpenFromNav)
    // Hydrate recents
    const raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem("pcdc-cmdk-recent")
        if (raw) setRecentIds(JSON.parse(raw) as string[])
      } catch {
        /* ignore */
      }
    })
    return () => {
      window.removeEventListener("command-palette-open", onOpenFromNav)
      cancelAnimationFrame(raf)
    }
  }, [])

  function close() {
    setOpen(false)
    setQuery("")
  }

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => {
      inputRef.current?.focus()
      setActive(0)
    }, 50)
    return () => clearTimeout(t)
  }, [open])

  function pushRecent(id: string) {
    try {
      const raw = localStorage.getItem("pcdc-cmdk-recent")
      const prev: string[] = raw ? JSON.parse(raw) : []
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 3)
      localStorage.setItem("pcdc-cmdk-recent", JSON.stringify(next))
      setRecentIds(next)
    } catch {
      /* ignore */
    }
  }

  function select(item: Item) {
    pushRecent(item.id)
    close()
    router.push(item.href)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = filtered[Math.min(active, Math.max(0, filtered.length - 1))]
      if (item) select(item)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Búsqueda rápida"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
          onClick={() => close()}
        >
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="w-full max-w-xl bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search size={16} className="text-[#f5f5f0]/60" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                placeholder="Buscar páginas, noticias…"
                aria-label="Buscar"
                className="flex-1 bg-transparent text-[#f5f5f0] text-sm outline-none placeholder:text-[#f5f5f0]/40"
              />
              <kbd className="text-[10px] font-mono text-[#f5f5f0]/40 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
              <button
                type="button"
                onClick={() => close()}
                aria-label="Cerrar búsqueda"
                className="p-1 rounded hover:bg-white/10 text-[#f5f5f0]/60"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto no-scrollbar py-2" role="listbox">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-sm text-[#f5f5f0]/40 text-center">Sin resultados.</li>
              )}
              {!q && recents.length > 0 && (
                <li className="px-4 pt-1 pb-1 text-[9px] uppercase tracking-widest font-bold text-[#f5f5f0]/40">
                  Recientes
                </li>
              )}
              {filtered.map((item, i) => {
                const Icon = item.icon
                return (
                  <li key={item.id} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => select(item)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        i === active ? "bg-[#3a7d44]/15 text-white" : "text-[#f5f5f0]/80 hover:bg-white/5"
                      }`}
                    >
                      <Icon size={15} className="text-[#3a7d44] flex-shrink-0" aria-hidden="true" />
                      <span className="flex-1 text-sm truncate">{item.label}</span>
                      {item.hint && (
                        <span className="text-[10px] text-[#f5f5f0]/40 uppercase tracking-widest">{item.hint}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="px-4 py-2 border-t border-white/10 flex items-center gap-3 text-[10px] text-[#f5f5f0]/40">
              <span><kbd className="font-mono bg-white/5 border border-white/10 rounded px-1">↑↓</kbd> navegar</span>
              <span><kbd className="font-mono bg-white/5 border border-white/10 rounded px-1">↵</kbd> abrir</span>
              <span className="ml-auto"><kbd className="font-mono bg-white/5 border border-white/10 rounded px-1">⌘K</kbd> para abrir</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
