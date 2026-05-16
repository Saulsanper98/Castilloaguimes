import type { Metadata } from "next"
import { Suspense } from "react"
import PartidosClient from "./PartidosClient"

export const metadata: Metadata = {
  title: "Partidos abiertos",
  description:
    "Únete a partidos abiertos de pádel en Agüimes. Filtra por nivel, hora y fecha. Encuentra compañeros y juega hoy mismo.",
  alternates: { canonical: "/partidos-abiertos" },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PartidosClient />
    </Suspense>
  )
}
