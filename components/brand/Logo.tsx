import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  /** "horizontal" muestra mark + texto, "mark" solo el símbolo */
  variant?: "horizontal" | "mark" | "stacked"
  /** Si true, no envuelve en <Link> */
  asChild?: boolean
  /** Texto alternativo (a11y) */
  ariaLabel?: string
}

/**
 * Logo identitario de Pádel Castillo de Agüimes.
 * Símbolo: torre estilizada + pelota integrada. Construido en SVG inline para nitidez perfecta.
 */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("flex-shrink-0", className)}
      aria-hidden="true"
      role="img"
    >
      {/* Outer rounded square (court-shape) */}
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#3a7d44" />
      {/* Inner court lines */}
      <rect
        x="10"
        y="10"
        width="44"
        height="44"
        rx="6"
        fill="none"
        stroke="#0a0a0a"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      {/* Horizontal mid line */}
      <line x1="10" y1="32" x2="54" y2="32" stroke="#0a0a0a" strokeOpacity="0.35" strokeWidth="1" />
      {/* "Castillo" tower silhouette */}
      <path
        d="M20 42 V26 H24 V22 H28 V26 H32 V22 H36 V26 H40 V22 H44 V26 H48 V42 Z"
        fill="#f5f5f0"
      />
      {/* Padel ball */}
      <circle cx="48" cy="18" r="5" fill="#e8d44d" stroke="#0a0a0a" strokeOpacity="0.2" strokeWidth="0.5" />
      <path
        d="M44 16 Q48 18 52 16"
        stroke="#0a0a0a"
        strokeOpacity="0.25"
        strokeWidth="0.6"
        fill="none"
      />
    </svg>
  )
}

export function Logo({
  className,
  variant = "horizontal",
  asChild = false,
  ariaLabel = "Inicio — Pádel Castillo de Agüimes",
}: LogoProps) {
  const content =
    variant === "mark" ? (
      <LogoMark className={cn("h-9 w-9", className)} />
    ) : variant === "stacked" ? (
      <div className={cn("flex flex-col items-center leading-none", className)}>
        <LogoMark className="h-10 w-10 mb-2" />
        <span className="text-[#3a7d44] font-display font-black text-base tracking-[0.25em]">
          CASTILLO
        </span>
        <span className="text-[#f5f5f0]/50 text-[9px] tracking-[0.3em] uppercase font-medium mt-0.5">
          Agüimes
        </span>
      </div>
    ) : (
      <div className={cn("flex items-center gap-2.5 leading-none", className)}>
        <LogoMark className="h-9 w-9" />
        <div className="flex flex-col">
          <span className="text-[#f5f5f0] font-display font-black text-lg lg:text-xl tracking-[0.18em] leading-none">
            CASTILLO
          </span>
          <span className="text-[#f5f5f0]/60 text-[9px] lg:text-[10px] tracking-[0.3em] uppercase font-medium mt-0.5">
            Pádel · Agüimes
          </span>
        </div>
      </div>
    )

  if (asChild) return content

  return (
    <Link href="/" aria-label={ariaLabel} className="group inline-block">
      {content}
    </Link>
  )
}

export { LogoMark }
