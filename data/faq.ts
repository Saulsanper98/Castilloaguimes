export interface FAQItem {
  q: string
  a: string
}

export interface FAQGroup {
  id: string
  title: string
  items: FAQItem[]
}

export const FAQ_GROUPS: FAQGroup[] = [
  {
    id: "reservas",
    title: "Reservas y precios",
    items: [
      {
        q: "¿Hace falta ser socio para reservar?",
        a: "No. Puedes reservar como visitante con cualquier email. El club ofrece descuentos a socios pero no es obligatorio.",
      },
      {
        q: "¿Cuánto cuesta jugar?",
        a: "Pista completa (4 jugadores) 1h30: 6,50 €/persona. Pista individual 1h: 5,50 €/persona. Consulta las tarifas completas en /tarifas.",
      },
      {
        q: "¿Cuándo puedo cancelar?",
        a: "Cancelación gratuita hasta 4 horas antes del inicio. Después se factura el importe completo.",
      },
      {
        q: "¿Puedo pagar en recepción?",
        a: "Sí. Al reservar verás dos opciones: pagar online o reservar y pagar en recepción. La pista queda bloqueada a tu nombre durante 24 h.",
      },
      {
        q: "¿Puedo modificar la reserva?",
        a: "Sí, sin coste con más de 4 h de antelación y según disponibilidad. Habla con recepción o usa la app.",
      },
    ],
  },
  {
    id: "club",
    title: "Sobre el club",
    items: [
      {
        q: "¿Dónde estáis?",
        a: "C/ Pino nº10, Polígono Industrial de Arinaga, Agüimes (Las Palmas). 15 minutos del aeropuerto y 25 desde Las Palmas por la GC-1.",
      },
      {
        q: "¿Qué horario tenéis?",
        a: "L-V de 08:00 a 23:00. Sábados de 08:00 a 20:00. Domingos y festivos de 09:00 a 20:00 (festivos hasta 15:00).",
      },
      {
        q: "¿Hay parking?",
        a: "Sí, parking propio gratuito para socios y visitantes.",
      },
      {
        q: "¿Hay cafetería?",
        a: "Sí, con terraza vista a las pistas. Carta saludable y pantallas para seguir partidos. 120 plazas.",
      },
      {
        q: "¿Tenéis vestuarios?",
        a: "Vestuarios amplios con duchas de agua caliente, taquillas individuales y servicio de toallas en recepción.",
      },
    ],
  },
  {
    id: "escuela",
    title: "Escuela y clases",
    items: [
      {
        q: "¿Hay clase de prueba gratuita?",
        a: "Sí. Te organizamos una evaluación inicial de 60 minutos sin coste para situar tu nivel y recomendarte la mejor modalidad.",
      },
      {
        q: "¿A qué edad puede empezar mi hijo/a?",
        a: "Desde los 6 años. Grupos por edad: Benjamín (6-8), Alevín (9-11), Infantil (12-14) y Junior (15-17).",
      },
      {
        q: "¿Necesito traer pala?",
        a: "No los primeros días. La escuela presta material durante el primer mes. Después te asesoramos para comprar una pala adecuada.",
      },
      {
        q: "¿Cuánto cuesta una clase?",
        a: "Depende de la modalidad (individual, parejas o grupo) y del entrenador. En recepción o en /tarifas tienes el desglose actual; la primera evaluación de nivel suele ser gratuita.",
      },
      {
        q: "¿Puede bonificarse por la empresa?",
        a: "Sí, muchas empresas bonifican actividad deportiva. Solicita el certificado en recepción para tu departamento de RR.HH.",
      },
    ],
  },
  {
    id: "partidos",
    title: "Partidos abiertos",
    items: [
      {
        q: "¿Cómo funcionan los partidos abiertos?",
        a: "Cualquier socio o visitante puede crear un partido indicando día, hora y nivel. Otros jugadores se apuntan hasta completar 4. Si no se completa con tiempo, el organizador puede cancelarlo sin coste.",
      },
      {
        q: "¿Qué nivel debo poner?",
        a: "Iniciación si llevas menos de 1 año o aún aprendiendo golpes básicos. Intermedio si juegas con continuidad y táctica. Avanzado si compites o juegas a alto ritmo.",
      },
      {
        q: "¿Puedo apuntarme a un partido sin conocer al organizador?",
        a: "Sí, ese es justo el sentido. Antes del partido podéis chatear en la app y conocer las expectativas.",
      },
    ],
  },
  {
    id: "torneos",
    title: "Torneos y competición",
    items: [
      {
        q: "¿Cómo me inscribo a un torneo?",
        a: "Desde /campeonatos, pulsa Inscribirse en el torneo que te interese. Necesitas indicar pareja, categoría y aceptar el reglamento. El pago se confirma en recepción.",
      },
      {
        q: "¿Qué pasa si me lesiono y no puedo jugar?",
        a: "Con justificante médico te devolvemos la inscripción íntegra. Sin justificante, depende del momento (consulta condiciones específicas del torneo).",
      },
      {
        q: "¿Dais premios?",
        a: "Sí: trofeo y material deportivo para finalistas. En torneos open premios económicos según presupuesto.",
      },
    ],
  },
  {
    id: "cuenta",
    title: "Cuenta de socio y app",
    items: [
      {
        q: "¿Cómo me hago socio?",
        a: "Pásate por recepción o solicítalo desde /cuenta. El alta es gratuita; el club no cobra cuota fija — solo pagas lo que juegas.",
      },
      {
        q: "¿Qué ventajas tienen los socios?",
        a: "Descuento en bonos, prioridad en reservas, acceso a torneos internos, programa de fidelización con recompensas y wallet para pagos rápidos.",
      },
      {
        q: "¿Cómo recargo el wallet?",
        a: "Desde tu cuenta en /cuenta?tab=wallet. Acepta tarjeta, Bizum y recarga en recepción.",
      },
    ],
  },
]
