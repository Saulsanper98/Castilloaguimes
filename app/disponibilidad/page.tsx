import type { Metadata } from "next"
import { Suspense } from "react"
import DisponibilidadClient from "./DisponibilidadClient"

export const metadata: Metadata = {
  title: "Disponibilidad en directo",
  description:
    "Consulta la disponibilidad de las 14 pistas de Pádel Castillo de Agüimes en tiempo real. Sin necesidad de iniciar sesión.",
  alternates: { canonical: "/disponibilidad" },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DisponibilidadClient />
    </Suspense>
  )
}
