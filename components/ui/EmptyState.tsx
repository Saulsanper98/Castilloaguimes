import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface Props {
  icon?: LucideIcon
  title: string
  description?: string
  /** CTA opcional al pie */
  action?: ReactNode
  /** Visual del cuadrado de fondo: court (verde sutil) o neutral */
  tone?: "court" | "neutral"
}

/**
 * Estado vacío reutilizable. Reemplaza los "no hay X" planos por algo
 * con identidad: marco con líneas de pista + icono + microcopy + CTA.
 */
export function EmptyState({ icon: Icon, title, description, action, tone = "court" }: Props) {
  return (
    <div className="relative overflow-hidden bg-[#111111] border border-white/10 rounded-2xl py-14 px-6 text-center">
      {/* Court lines background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            tone === "court"
              ? "repeating-linear-gradient(-45deg, #3a7d44 0 1px, transparent 1px 22px)"
              : "repeating-linear-gradient(-45deg, #f5f5f0 0 1px, transparent 1px 22px)",
        }}
      />
      <div className="relative z-10 max-w-sm mx-auto">
        {Icon && (
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#3a7d44]/10 border border-[#3a7d44]/25 flex items-center justify-center">
            <Icon size={22} className="text-[#3a7d44]" aria-hidden="true" />
          </div>
        )}
        <h3 className="text-[#f5f5f0] font-display font-black text-lg sm:text-xl mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-[#f5f5f0]/65 text-sm leading-relaxed">{description}</p>
        )}
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  )
}
