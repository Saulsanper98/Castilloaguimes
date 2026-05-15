import type { Metadata } from "next"
import CampeonatosClient from "./CampeonatosClient"

export const metadata: Metadata = {
  title: "Campeonatos y torneos",
  description:
    "Calendario de campeonatos, americanos y ligas internas en Pádel Castillo de Agüimes. Inscripciones abiertas.",
  alternates: { canonical: "/campeonatos" },
}

export default function Page() {
  return <CampeonatosClient />
}
