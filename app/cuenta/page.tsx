import type { Metadata } from "next"
import CuentaClient from "./CuentaClient"

export const metadata: Metadata = {
  title: "Mi cuenta",
  description:
    "Tus reservas, partidos, wallet del club, puntos de fidelización y noticias guardadas en Pádel Castillo de Agüimes.",
  alternates: { canonical: "/cuenta" },
}

export default function Page() {
  return <CuentaClient />
}
