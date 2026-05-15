import type { Metadata } from "next"
import { Suspense } from "react"
import ReservasClient from "./ReservasClient"

export const metadata: Metadata = {
  title: "Reservar pista",
  description:
    "Reserva una de las 14 pistas cubiertas de Pádel Castillo de Agüimes. Calendario online, precios claros, sin comisiones.",
  alternates: { canonical: "/reservas" },
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] pt-24 text-center text-sm text-[#f5f5f0]/50">Cargando reservas…</div>}>
      <ReservasClient />
    </Suspense>
  )
}
