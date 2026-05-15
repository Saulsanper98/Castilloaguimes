"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const LABELS: Record<string, string> = {
  reservas: "Reservas",
  "partidos-abiertos": "Partidos abiertos",
  escuela: "Escuela",
  campeonatos: "Campeonatos",
  instalaciones: "Instalaciones",
  noticias: "Noticias",
  tarifas: "Tarifas",
  contacto: "Contacto",
  crear: "Crear",
  cuenta: "Mi cuenta",
}

function prettify(slug: string): string {
  if (LABELS[slug]) return LABELS[slug]
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Breadcrumbs({ className = "" }: { className?: string }) {
  const pathname = usePathname()
  if (!pathname || pathname === "/") return null

  const parts = pathname.split("/").filter(Boolean)

  return (
    <nav
      aria-label="Ruta de navegación"
      className={`flex items-center gap-1.5 text-xs text-[#f5f5f0]/55 ${className}`}
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-[#3a7d44] transition-colors"
        aria-label="Inicio"
      >
        <Home size={12} aria-hidden="true" />
      </Link>
      {parts.map((part, i) => {
        const href = "/" + parts.slice(0, i + 1).join("/")
        const isLast = i === parts.length - 1
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-[#f5f5f0]/30" aria-hidden="true" />
            {isLast ? (
              <span aria-current="page" className="text-[#f5f5f0]/90 truncate max-w-[200px] sm:max-w-[300px]">
                {prettify(part)}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-[#3a7d44] transition-colors truncate max-w-[140px]"
              >
                {prettify(part)}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
