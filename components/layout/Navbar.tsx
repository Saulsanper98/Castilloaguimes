"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Menu, X, Search, Calendar, Receipt, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/brand/Logo"
import { UserMenu } from "@/components/layout/UserMenu"

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Reservas", href: "/reservas", mega: true as const },
  { label: "Partidos", href: "/partidos-abiertos" },
  { label: "Escuela", href: "/escuela" },
  { label: "Campeonatos", href: "/campeonatos" },
  { label: "Instalaciones", href: "/instalaciones" },
  { label: "Noticias", href: "/noticias" },
  { label: "Tarifas", href: "/tarifas" },
  { label: "Contacto", href: "/contacto" },
] as const

export default function Navbar() {
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    queueMicrotask(() => setMobileOpen(false))
  }, [pathname])

  function openCommandPalette() {
    window.dispatchEvent(new CustomEvent("command-palette-open"))
  }

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-[#0a0a0a]/80 backdrop-blur-sm"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Principal">
        <div className={cn("flex items-center justify-between transition-all", scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20")}>
          <Logo variant={scrolled ? "mark" : "horizontal"} />

          <div className="hidden lg:flex items-center gap-0">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href)
              if ("mega" in link && link.mega) {
                return (
                  <div key={link.href} className="relative group">
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative text-[13px] font-medium px-2 py-2 rounded-md transition-colors flex items-center gap-1",
                        isActive
                          ? "text-[#f5f5f0]"
                          : "text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:bg-white/5"
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute left-2 right-2 bottom-1 h-0.5 bg-[#3a7d44] rounded-full"
                          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                    <div
                      className="absolute left-0 top-full pt-2 w-[min(100vw-2rem,22rem)] opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 z-[100]"
                      role="region"
                      aria-label="Accesos reservas"
                    >
                      <div className="bg-[#111111] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-4">
                        <p className="text-[10px] font-bold text-[#f5f5f0]/45 uppercase tracking-widest mb-3">Reservas</p>
                        <div className="space-y-1">
                          <Link
                            href="/reservas"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#f5f5f0]/85 hover:bg-white/5 hover:text-[#f5f5f0] transition-colors"
                          >
                            <Calendar size={16} className="text-[#3a7d44] shrink-0" aria-hidden="true" />
                            <span className="flex-1">Calendario de pistas</span>
                            <ChevronRight size={14} className="text-[#f5f5f0]/35" aria-hidden="true" />
                          </Link>
                          <Link
                            href="/tarifas"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#f5f5f0]/85 hover:bg-white/5 hover:text-[#f5f5f0] transition-colors"
                          >
                            <Receipt size={16} className="text-[#e8d44d] shrink-0" aria-hidden="true" />
                            <span className="flex-1">Tarifas y bonos</span>
                            <ChevronRight size={14} className="text-[#f5f5f0]/35" aria-hidden="true" />
                          </Link>
                          <Link
                            href="/partidos-abiertos/crear"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#f5f5f0]/85 hover:bg-white/5 hover:text-[#f5f5f0] transition-colors"
                          >
                            <span className="w-4 h-4 rounded-full bg-[#3a7d44]/30 border border-[#3a7d44]/50 shrink-0" aria-hidden="true" />
                            <span className="flex-1">Crear partido abierto</span>
                            <ChevronRight size={14} className="text-[#f5f5f0]/35" aria-hidden="true" />
                          </Link>
                        </div>
                        <p className="text-[10px] text-[#f5f5f0]/40 mt-3 pt-3 border-t border-white/10 leading-relaxed">
                          14 pistas cubiertas · bloqueo 5 min al elegir hueco
                        </p>
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative text-[13px] font-medium px-2 py-2 rounded-md transition-colors",
                    isActive ? "text-[#f5f5f0]" : "text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:bg-white/5"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-2 right-2 bottom-1 h-0.5 bg-[#3a7d44] rounded-full"
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={openCommandPalette}
              title="Buscar (⌘K)"
              aria-label="Abrir buscador. Atajo: Cmd o Ctrl + K"
              className={cn(
                "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                "text-[#f5f5f0]/45 hover:text-[#f5f5f0] hover:bg-white/[0.06]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7d44]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              )}
            >
              <Search className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
            </button>
            <UserMenu variant="desktop" />
          </div>

          <div className="lg:hidden flex items-center gap-1">
            <button
              type="button"
              onClick={openCommandPalette}
              title="Buscar"
              aria-label="Abrir buscador"
              className={cn(
                "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
                "text-[#f5f5f0]/45 hover:text-[#f5f5f0] hover:bg-white/[0.06]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7d44]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              )}
            >
              <Search className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              className="text-[#f5f5f0] p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(link.href)
                return (
                  <motion.div
                    key={link.href}
                    initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#3a7d44]/15 text-[#3a7d44] border-l-2 border-[#3a7d44]"
                          : "text-[#f5f5f0]/80 hover:text-[#f5f5f0] hover:bg-white/5"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <UserMenu variant="mobile" onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
