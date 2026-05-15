import type { Metadata } from "next"
import ContactoClient from "./ContactoClient"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con Pádel Castillo de Agüimes. Teléfono, email, dirección y formulario. Atención de lunes a domingo.",
  alternates: { canonical: "/contacto" },
}

export default function Page() {
  return <ContactoClient />
}
