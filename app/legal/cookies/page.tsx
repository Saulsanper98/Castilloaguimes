import type { Metadata } from "next"
import { LegalDoc } from "@/components/legal/LegalDoc"

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Información sobre el uso de cookies en el sitio web de Pádel Castillo de Agüimes.",
  alternates: { canonical: "/legal/cookies" },
}

export default function Page() {
  return (
    <LegalDoc title="Política de cookies" updatedAt="1 de mayo de 2026">
      <p>
        Esta página explica qué son las cookies, cuáles utilizamos en{" "}
        <strong>Pádel Castillo de Agüimes</strong> y cómo puedes gestionarlas.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos que un sitio web almacena en tu dispositivo cuando lo visitas.
        Permiten reconocerte, recordar tus preferencias y entender cómo usas la web para mejorarla.
      </p>

      <h2>2. Tipos de cookies que usamos</h2>

      <h3>Esenciales (siempre activas)</h3>
      <p>
        Imprescindibles para que el sitio funcione: mantener sesión, recordar tu decisión sobre cookies,
        bloquear el hueco de una reserva durante 5 minutos. No se pueden desactivar.
      </p>

      <h3>Funcionales (opcionales)</h3>
      <p>
        Recuerdan tus preferencias entre visitas: idioma, pista favorita, última reserva guardada,
        artículos marcados para leer luego, modo de alto contraste.
      </p>

      <h3>Analíticas (opcionales)</h3>
      <p>
        Nos ayudan a entender de forma anónima qué páginas funcionan mejor, dónde se pierden los usuarios
        y qué mejorar. Toda la información está agregada y no permite identificarte.
      </p>

      <h2>3. ¿Cómo gestionarlas?</h2>
      <p>
        Cuando entras por primera vez te mostramos un banner para que decidas. Puedes aceptarlas todas o
        usar solo las esenciales. Tu decisión se guarda en este navegador y puedes cambiarla en cualquier
        momento borrando los datos del sitio desde tu navegador.
      </p>

      <h2>4. Más información</h2>
      <p>
        Si necesitas detalles adicionales escríbenos a{" "}
        <a href="mailto:recepcioncdca@gmail.com">recepcioncdca@gmail.com</a>.
      </p>
    </LegalDoc>
  )
}
