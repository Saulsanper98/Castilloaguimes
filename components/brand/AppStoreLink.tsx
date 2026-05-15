"use client"

import { toast } from "sonner"
import type { ReactNode } from "react"

interface Props {
  store: "appstore" | "playstore"
  children: ReactNode
  className?: string
}

/**
 * Botón de descarga de app que muestra un toast "Próximamente" mientras la
 * publicación oficial no está lista. Evita los href="#" y da feedback claro.
 */
export function AppStoreLink({ store, children, className = "" }: Props) {
  function handle() {
    toast("App oficial en preparación", {
      description:
        store === "appstore"
          ? "Estará disponible pronto en App Store. Te avisaremos por email."
          : "Estará disponible pronto en Google Play. Te avisaremos por email.",
    })
  }

  return (
    <button type="button" onClick={handle} className={className}>
      {children}
    </button>
  )
}
