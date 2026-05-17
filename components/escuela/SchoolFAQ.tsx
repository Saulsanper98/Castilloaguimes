import { FaqJsonLd } from "@/components/seo/FaqJsonLd"

const FAQ = [
  {
    q: "¿Necesito traer mi pala?",
    a: "No. La escuela presta material a todos los alumnos durante el primer mes. Después, podemos asesorarte para que compres una pala adecuada a tu nivel y estilo de juego.",
  },
  {
    q: "¿Hay clase de prueba gratuita?",
    a: "Sí. Te organizamos una evaluación inicial de 60 minutos sin coste para situar tu nivel y recomendarte la mejor modalidad. Solo tienes que pedir cita en recepción o por el formulario de contacto.",
  },
  {
    q: "¿Mi empresa puede bonificar las clases?",
    a: "Los bonos y mensualidades pueden facturarse a la empresa. Pregunta por el certificado deportivo trimestral que algunas compañías aceptan como retribución flexible.",
  },
  {
    q: "¿Qué pasa si no puedo ir a una clase?",
    a: "Tienes hasta 24 horas antes para reprogramarla sin coste. Aplican excepciones por enfermedad acreditada — habla con tu entrenador o recepción.",
  },
  {
    q: "¿A qué edad puede empezar mi hijo/a?",
    a: "Aceptamos a partir de 6 años con grupos por edades (Benjamín 6–8, Alevín 9–11, Infantil 12–14). Los más pequeños trabajan coordinación con elementos lúdicos.",
  },
  {
    q: "¿Puedo cambiar de grupo si veo que no es mi nivel?",
    a: "Por supuesto. La primera semana hacemos seguimiento para confirmar que el grupo encaja contigo; si no, te movemos sin coste.",
  },
]

export function SchoolFAQ() {
  return (
    <div className="space-y-3">
      <FaqJsonLd items={FAQ} />
      {FAQ.map((item) => (
        <details
          key={item.q}
          className="group bg-[#111111] border border-white/10 rounded-2xl px-5 py-4 hover:border-white/20 transition-colors"
        >
          <summary className="cursor-pointer text-[#f5f5f0] font-semibold text-sm list-none flex items-center justify-between gap-3">
            {item.q}
            <span className="text-[#3a7d44] text-lg transition-transform group-open:rotate-45 leading-none">+</span>
          </summary>
          <p className="text-[#f5f5f0]/65 text-sm mt-3 leading-relaxed border-t border-white/5 pt-3">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
