"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function MobileFAB() {
  const pathname = usePathname()
  const [scrollPast, setScrollPast] = useState(false)
  const hidden =
    pathname === "/reservas" ||
    pathname?.startsWith("/reservas/") ||
    pathname?.startsWith("/cuenta") ||
    pathname?.startsWith("/disponibilidad")

  useEffect(() => {
    if (hidden) return
    function onScroll() {
      setScrollPast(window.scrollY > 400)
    }
    const raf = requestAnimationFrame(onScroll)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [hidden])

  const visible = !hidden && scrollPast

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:hidden fixed bottom-[calc(1.25rem+var(--pcdc-floating-cookie-offset,0px))] right-5 z-40 transition-[bottom] duration-300 ease-out"
        >
          <Link
            href="/reservas"
            aria-label="Reservar pista"
            className="flex items-center gap-2 bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] font-black px-5 py-3.5 rounded-full shadow-2xl shadow-[#e8d44d]/30 transition-all"
          >
            <Calendar size={18} aria-hidden="true" />
            <span className="text-sm tracking-wide">Reservar</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
