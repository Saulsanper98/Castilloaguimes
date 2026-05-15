import type { Metadata } from "next"
import NoticiasClient from "./NoticiasClient"

export const metadata: Metadata = {
  title: "Noticias y novedades",
  description:
    "Toda la actualidad de Pádel Castillo de Agüimes: torneos, escuela, instalaciones y novedades del club.",
  alternates: { canonical: "/noticias" },
}

export default function Page() {
  return <NoticiasClient />
}
