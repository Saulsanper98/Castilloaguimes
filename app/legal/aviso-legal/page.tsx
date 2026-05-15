import type { Metadata } from "next"
import { LegalDoc } from "@/components/legal/LegalDoc"

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal y condiciones de uso del sitio web de Pádel Castillo de Agüimes.",
  alternates: { canonical: "/legal/aviso-legal" },
}

export default function Page() {
  return (
    <LegalDoc title="Aviso legal" updatedAt="1 de mayo de 2026">
      <p>
        En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y
        Comercio Electrónico (LSSI-CE), se exponen a continuación los datos identificativos del titular del
        sitio web.
      </p>

      <h2>1. Titular</h2>
      <ul>
        <li><strong>Titular:</strong> Pádel Castillo de Agüimes</li>
        <li><strong>Domicilio:</strong> C/ Pino nº10, P.I. Arinaga, 35118 Agüimes (Las Palmas)</li>
        <li><strong>Contacto:</strong> <a href="mailto:recepcioncdca@gmail.com">recepcioncdca@gmail.com</a> · <a href="tel:+34928753650">928 753 650</a></li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene como finalidad informar sobre las instalaciones, servicios y actividades del
        club, así como facilitar la gestión de reservas, escuela, partidos abiertos y torneos.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El usuario se compromete a utilizar el sitio web de forma diligente, correcta y lícita, y a no
        emplearlo para realizar actividades ilícitas o contrarias a la buena fe.
      </p>

      <h2>4. Propiedad intelectual</h2>
      <p>
        Todos los contenidos del sitio (textos, imágenes, diseño, código) son propiedad del titular o de
        terceros que han autorizado su uso. Queda prohibida la reproducción total o parcial sin
        autorización expresa.
      </p>

      <h2>5. Limitación de responsabilidad</h2>
      <p>
        El titular no garantiza la disponibilidad ininterrumpida del sitio web ni la ausencia de errores en
        sus contenidos. No se responsabiliza de los perjuicios derivados del uso del sitio.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para cualquier controversia las
        partes se someten a los juzgados y tribunales de Las Palmas de Gran Canaria.
      </p>
    </LegalDoc>
  )
}
