"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Props {
  step?: number
  eyebrow?: string
  title: ReactNode
  hint?: string
  children: ReactNode
  /** Si true, oculta el contenido por defecto y muestra un toggle "Avanzado". */
  collapsible?: boolean
  defaultOpen?: boolean
  className?: string
}

/**
 * Tarjeta de paso del flujo de reserva con animación de entrada y collapse opcional.
 * Estandariza la jerarquía visual y respeta prefers-reduced-motion.
 */
export function StepCard({
  step,
  eyebrow,
  title,
  hint,
  children,
  collapsible = false,
  defaultOpen = false,
  className,
}: Props) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(defaultOpen)

  const Body = (
    <motion.div
      key="body"
      initial={reduce ? false : { opacity: 0, height: 0 }}
      animate={reduce ? undefined : { opacity: 1, height: "auto" }}
      exit={reduce ? undefined : { opacity: 0, height: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="pt-4">{children}</div>
    </motion.div>
  )

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative", className)}
    >
      <header className="mb-3 flex items-center gap-3">
        {step != null && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3a7d44]/15 text-[11px] font-black text-[#3a7d44] tabular-nums">
            {step}
          </span>
        )}
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#f5f5f0]/45">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display font-black text-[#f5f5f0] text-lg sm:text-xl tracking-tight leading-tight">
            {title}
          </h2>
          {hint && <p className="mt-0.5 text-xs text-[#f5f5f0]/55">{hint}</p>}
        </div>
        {collapsible && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
              open
                ? "border-[#3a7d44]/50 bg-[#3a7d44]/10 text-[#3a7d44]"
                : "border-white/10 bg-[#1a1a1a] text-[#f5f5f0]/65 hover:border-white/25 hover:text-[#f5f5f0]"
            )}
          >
            {open ? "Ocultar" : "Mostrar"}
            <ChevronDown
              size={12}
              aria-hidden="true"
              className={cn("transition-transform", open && "rotate-180")}
            />
          </button>
        )}
      </header>
      {collapsible ? <AnimatePresence initial={false}>{open && Body}</AnimatePresence> : Body}
    </motion.section>
  )
}
