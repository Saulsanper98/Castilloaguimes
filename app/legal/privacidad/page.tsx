import type { Metadata } from "next"
import { LegalDoc } from "@/components/legal/LegalDoc"

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad y tratamiento de datos personales de Pádel Castillo de Agüimes.",
  alternates: { canonical: "/legal/privacidad" },
}

export default function Page() {
  return (
    <LegalDoc title="Política de privacidad" updatedAt="1 de mayo de 2026">
      <p>
        En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y de la Ley Orgánica 3/2018, de 5 de diciembre,
        de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), te informamos del
        tratamiento de tus datos personales cuando utilizas el sitio web y los servicios de{" "}
        <strong>Pádel Castillo de Agüimes</strong>.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Titular:</strong> Pádel Castillo de Agüimes</li>
        <li><strong>Dirección:</strong> C/ Pino nº10, P.I. Arinaga, 35118 Agüimes (Las Palmas)</li>
        <li><strong>Email:</strong> <a href="mailto:recepcioncdca@gmail.com">recepcioncdca@gmail.com</a></li>
        <li><strong>Teléfono:</strong> <a href="tel:+34928753650">928 753 650</a></li>
      </ul>

      <h2>2. Datos que recogemos</h2>
      <ul>
        <li><strong>Datos de contacto:</strong> nombre, email, teléfono, dirección postal cuando los facilitas.</li>
        <li><strong>Datos de juego:</strong> nivel, mano dominante, posición, reservas e historial de partidos.</li>
        <li><strong>Datos económicos:</strong> los necesarios para procesar reservas y pagos (tratados por nuestras pasarelas).</li>
        <li><strong>Datos técnicos:</strong> dirección IP, navegador, dispositivo y métricas anónimas de uso.</li>
      </ul>

      <h2>3. Finalidades</h2>
      <ul>
        <li>Gestionar tu cuenta de socio, reservas, partidos abiertos y torneos.</li>
        <li>Atender consultas a través del formulario de contacto y la recepción.</li>
        <li>Enviarte comunicaciones operativas (confirmaciones, recordatorios, incidencias).</li>
        <li>Si lo aceptas, comunicaciones comerciales del club y newsletter.</li>
      </ul>

      <h2>4. Base legal</h2>
      <p>
        Tratamos tus datos en virtud del consentimiento que prestas al registrarte, la ejecución del contrato
        de socio o reserva, y el interés legítimo del club para prevenir el fraude y mejorar la experiencia.
      </p>

      <h2>5. Conservación</h2>
      <p>
        Los datos se conservan mientras seas socio o exista relación contractual y, posteriormente, durante
        los plazos legales aplicables (Ley General Tributaria, Código Civil, etc.).
      </p>

      <h2>6. Destinatarios</h2>
      <p>
        No cedemos datos a terceros salvo obligación legal. Trabajamos con proveedores de hosting, email
        transaccional y pasarela de pago acogidos al RGPD.
      </p>

      <h2>7. Tus derechos</h2>
      <p>
        Tienes derecho a acceder, rectificar, suprimir, oponerte, limitar el tratamiento y portar tus datos.
        Puedes ejercerlos escribiendo a{" "}
        <a href="mailto:recepcioncdca@gmail.com">recepcioncdca@gmail.com</a>. Si consideras vulnerados tus
        derechos puedes reclamar ante la AEPD (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).
      </p>
    </LegalDoc>
  )
}
