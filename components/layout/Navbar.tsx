"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Reservas", href: "/reservas" },
  { label: "Partidos", href: "/partidos-abiertos" },
  { label: "Escuela", href: "/escuela" },
  { label: "Campeonatos", href: "/campeonatos" },
  { label: "Instalaciones", href: "/instalaciones" },
  { label: "Noticias", href: "/noticias" },
  { label: "Tarifas", href: "/tarifas" },
  { label: "Contacto", href: "/contacto" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="text-[#3a7d44] font-black text-xl lg:text-2xl tracking-widest group-hover:text-[#4a9d54] transition-colors">
              CASTILLO
            </span>
            <span className="text-[#f5f5f0]/60 text-[10px] tracking-[0.3em] uppercase font-medium -mt-0.5">
              AGÜIMES
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#f5f5f0]/70 hover:text-[#f5f5f0] text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="text-[#f5f5f0] border border-white/30 hover:border-white/60 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:bg-white/5">
              Registrarse
            </button>
            <button className="bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] text-sm font-bold px-4 py-2 rounded-lg transition-all">
              Acceder
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-[#f5f5f0] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block text-[#f5f5f0]/80 hover:text-[#f5f5f0] hover:bg-white/5 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                <button className="flex-1 text-[#f5f5f0] border border-white/30 text-sm font-semibold py-2.5 rounded-lg transition-all hover:bg-white/5">
                  Registrarse
                </button>
                <button className="flex-1 bg-[#e8d44d] text-[#0a0a0a] text-sm font-bold py-2.5 rounded-lg transition-all hover:bg-[#f0dc55]">
                  Acceder
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
