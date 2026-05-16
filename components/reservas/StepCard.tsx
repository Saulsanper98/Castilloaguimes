"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const BOOKING_PHASE_LABEL: Record<number, string> = {
  1: "FECHA",
  2: "HORA",
  3: "PISTA",
}

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
  /** Cabecera sticky bajo la barra global con la fase (FECHA/HORA/PISTA) junto al título. */
  stickyBookingHeader?: boolean
  /** Estado visual del paso en el flujo de reserva. */
  phaseStatus?: "pending" | "active" | "done"
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
  stickyBookingHeader = false,
  phaseStatus,
}: Props) {
  const phaseVisual = step != null ? phaseStatus ?? "pending" : "pending"
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
      <header
        className={cn(
          "mb-3 flex items-start gap-3",
          stickyBookingHeader &&
            "sticky top-14 z-30 -mx-4 border-b border-white/10 bg-[#0a0a0a]/95 px-4 py-2.5 backdrop-blur-md sm:-mx-0 sm:px-0 sm:py-3 lg:top-16"
        )}
      >
        {step != null && (
          <div className="flex shrink-0 flex-col items-center gap-1">
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black tabular-nums transition-all duration-300 sm:h-11 sm:w-11 sm:text-sm",
                phaseVisual === "done" &&
                  "bg-[#3a7d44] text-white shadow-[0_0_20px_rgba(58,125,68,0.45)] ring-2 ring-[#3a7d44]/50",
                phaseVisual === "active" &&
                  "bg-[#e8d44d] text-[#0a0a0a] shadow-[0_0_22px_rgba(232,212,77,0.35)] ring-2 ring-[#e8d44d]/40",
                phaseVisual === "pending" && "bg-[#1a1a1a] text-[#f5f5f0]/35 ring-1 ring-white/10"
              )}
              aria-hidden
            >
              {phaseVisual === "done" ? <Check size={18} strokeWidth={3} className="sm:h-5 sm:w-5" aria-hidden /> : step}
            </span>
            {BOOKING_PHASE_LABEL[step] && (
              <span
                className={cn(
                  "text-[8px] font-black tracking-[0.2em] sm:text-[9px]",
                  phaseVisual === "done" && "text-[#3a7d44]",
                  phaseVisual === "active" && "text-[#e8d44d]",
                  phaseVisual === "pending" && "text-[#f5f5f0]/30"
                )}
              >
                {BOOKING_PHASE_LABEL[step]}
              </span>
            )}
          </div>
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
