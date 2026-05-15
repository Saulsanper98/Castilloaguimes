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
      {/* Shield gold trim */}
      <path d="M6 3 L58 3 L58 36 Q58 52 32 61 Q6 52 6 36 Z" fill="#e8b923" />
      {/* Shield body (red) */}
      <path d="M9 6 L55 6 L55 35 Q55 50 32 58 Q9 50 9 35 Z" fill="#c41e3a" />

      {/* Heraldic checkered pattern (top) */}
      <rect x="9" y="6" width="11.5" height="7" fill="#e8b923" />
      <rect x="32" y="6" width="11.5" height="7" fill="#e8b923" />
      <rect x="20.5" y="13" width="11.5" height="7" fill="#e8b923" />
      <rect x="43.5" y="13" width="11.5" height="7" fill="#e8b923" />

      {/* Castle silhouette */}
      <g fill="#f5f5f0">
        <rect x="17" y="25" width="3" height="5" />
        <rect x="22" y="25" width="3" height="5" />
        <rect x="27" y="25" width="3" height="5" />
        <rect x="32" y="25" width="3" height="5" />
        <rect x="37" y="25" width="3" height="5" />
        <rect x="42" y="25" width="3" height="5" />
        <rect x="17" y="30" width="28" height="16" />
        <rect x="28" y="20" width="8" height="14" />
        <rect x="28" y="18" width="2.5" height="3" />
        <rect x="32" y="18" width="2.5" height="3" />
      </g>

      {/* Castle details in red */}
      <g fill="#c41e3a">
        <path d="M29.5 38 L34.5 38 L34.5 46 L29.5 46 Z" />
        <rect x="20.5" y="34" width="2.5" height="3" />
        <rect x="39" y="34" width="2.5" height="3" />
        <rect x="30.5" y="24" width="3" height="3" />
      </g>

      {/* Gate gold arch */}
      <path d="M29.5 38 L34.5 38 L34.5 39.5 L29.5 39.5 Z" fill="#e8b923" />
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
