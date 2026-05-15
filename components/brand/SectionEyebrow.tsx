import { cn } from "@/lib/utils"

interface Props {
  children: React.ReactNode
  className?: string
  color?: "court" | "ball" | "white"
}

/**
 * Etiqueta de sección uniforme: barrita vertical + texto pequeño tracking ancho.
 * Sustituye al patrón duplicado `<span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase ...">`.
 */
export function SectionEyebrow({ children, className, color = "court" }: Props) {
  const colors = {
    court: "before:bg-[#3a7d44] text-[#3a7d44]",
    ball: "before:bg-[#e8d44d] text-[#e8d44d]",
    white: "before:bg-[#f5f5f0]/50 text-[#f5f5f0]/70",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 relative text-xs font-bold tracking-[0.4em] uppercase",
        "before:content-[''] before:block before:w-8 before:h-px",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  )
}
