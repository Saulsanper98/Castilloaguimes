import { Suspense } from "react"
import type { Metadata } from "next"
import CrearPartidoClient from "./CrearPartidoClient"

export const metadata: Metadata = {
  title: "Crear partido abierto",
  description: "Publica un partido abierto en Pádel Castillo de Agüimes: elige fecha, hora, nivel y visibilidad.",
  alternates: { canonical: "/partidos-abiertos/crear" },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CrearPartidoClient />
    </Suspense>
  )
}
