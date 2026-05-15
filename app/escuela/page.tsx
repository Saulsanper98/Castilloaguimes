import type { Metadata } from "next"
import { GraduationCap, User, Users, Baby, Trophy } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Escuela de Pádel",
  description: "Aprende pádel con nuestros entrenadores titulados. Clases individuales, en parejas, grupos adultos e infantil en Agüimes.",
}

const modalidades = [
  {
    icon: User,
    title: "Individual",
    description:
      "La opción más efectiva para mejorar rápido. Tu entrenador se dedica exclusivamente a ti, detecta tus puntos débiles y diseña un plan de entrenamiento personalizado.",
    precio: "35€ / hora",
    incluye: ["Análisis técnico inicial", "Plan de mejora personalizado", "Material de práctica incluido", "Grabación y análisis de vídeo"],
    color: "from-[#3a7d44]/20",
  },
  {
    icon: Users,
    title: "Parejas",
    description:
      "Comparte la clase con un compañero. Ideal para parejas de pádel que quieren evolucionar juntos y trabajar la coordinación y táctica en equipo.",
    precio: "25€ / persona / hora",
    incluye: ["Táctica de pareja", "Posicionamiento en pista", "Trabajo de movimiento conjunto", "Análisis de partido grabado"],
    color: "from-blue-500/10",
  },
  {
    icon: GraduationCap,
    title: "Grupos Adultos",
    description:
      "Clases en grupo de 3 a 4 personas para adultos de todos los niveles. La opción más económica con una progresión estructurada y ambiente social.",
    precio: "18€ / persona / hora",
    incluye: ["Grupos por nivel", "Hasta 4 alumnos por grupo", "Metodología progresiva", "Acceso a torneos internos"],
    color: "from-purple-500/10",
  },
  {
    icon: Baby,
    title: "Infantil",
    description:
      "Programa diseñado para niños y jóvenes de 6 a 16 años. Metodología lúdica que combina el aprendizaje técnico con el desarrollo físico y los valores del deporte.",
    precio: "15€ / persona / hora",
    incluye: ["Grupos por edad y nivel", "Metodología lúdica", "Valores deportivos", "Torneos internos trimestrales"],
    color: "from-orange-500/10",
  },
]

const levelProgression = [
  { level: "Iniciación", description: "Sin experiencia o primeras clases", sessions: "20–40 sesiones" },
  { level: "Intermedio Bajo", description: "Domina los golpes básicos", sessions: "40–80 sesiones" },
  { level: "Intermedio", description: "Juega con continuidad y táctica", sessions: "80–150 sesiones" },
  { level: "Avanzado", description: "Técnica depurada y juego competitivo", sessions: "+150 sesiones" },
]

export default function EscuelaPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
            Aprende y mejora
          </span>
          <h1
            className="text-[#f5f5f0] font-black tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            ESCUELA DE <span className="text-[#3a7d44]">PÁDEL</span>
          </h1>
          <p className="text-[#f5f5f0]/50 mt-2 text-base max-w-2xl">
            Entrenadores titulados con experiencia en el circuito profesional. Metodología avalada por la Federación Española de Pádel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Description */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2
              className="text-[#f5f5f0] font-black tracking-tight mb-4"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
            >
              ENTRENADORES
              <br />
              <span className="text-[#3a7d44]">CERTIFICADOS</span>
            </h2>
            <p className="text-[#f5f5f0]/60 text-sm leading-relaxed mb-4">
              Nuestro equipo de entrenadores cuenta con la titulación oficial de la Real Federación Española de Pádel y años de experiencia tanto en el circuito profesional como en la enseñanza a todos los niveles.
            </p>
            <p className="text-[#f5f5f0]/60 text-sm leading-relaxed">
              Cada alumno recibe una evaluación inicial gratuita que nos permite diseñar un programa de mejora adaptado a su nivel, objetivos y disponibilidad. Seguimos tu progreso en cada sesión con herramientas de análisis de vídeo y estadísticas de rendimiento.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "8+", label: "Entrenadores" },
              { value: "500+", label: "Alumnos activos" },
              { value: "12", label: "Años de experiencia" },
              { value: "100%", label: "Titulados FEP" },
            ].map((s) => (
              <div key={s.label} className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-[#3a7d44] font-black text-3xl mb-1">{s.value}</div>
                <div className="text-[#f5f5f0]/50 text-xs uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Modalities */}
        <section>
          <div className="text-center mb-10">
            <h2
              className="text-[#f5f5f0] font-black tracking-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
            >
              MODALIDADES <span className="text-[#3a7d44]">DE CLASE</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {modalidades.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.title}
                  className={`bg-[#111111] border border-white/10 rounded-2xl p-6 relative overflow-hidden hover:border-[#3a7d44]/40 transition-all`}
                >
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${m.color} to-transparent rounded-full -translate-y-16 translate-x-16`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-[#3a7d44]/15 border border-[#3a7d44]/30 rounded-xl flex items-center justify-center mb-4">
                      <Icon size={22} className="text-[#3a7d44]" />
                    </div>
                    <h3 className="text-[#f5f5f0] font-bold text-lg mb-2">{m.title}</h3>
                    <p className="text-[#f5f5f0]/50 text-sm leading-relaxed mb-4">{m.description}</p>
                    <ul className="space-y-1.5 mb-5">
                      {m.incluye.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[#f5f5f0]/60 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3a7d44] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-[#3a7d44] font-black text-lg">{m.precio}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Level progression */}
        <section>
          <div className="text-center mb-8">
            <h2
              className="text-[#f5f5f0] font-black tracking-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
            >
              PROGRESIÓN <span className="text-[#3a7d44]">DE NIVELES</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10 hidden sm:block" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {levelProgression.map((l, i) => (
                <div key={l.level} className="relative flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#3a7d44]/20 border-2 border-[#3a7d44]/50 flex items-center justify-center text-[#3a7d44] font-black text-sm mb-3 relative z-10 bg-[#111111]">
                    {i + 1}
                  </div>
                  <h3 className="text-[#f5f5f0] font-bold text-sm mb-1">{l.level}</h3>
                  <p className="text-[#f5f5f0]/40 text-xs leading-snug mb-2">{l.description}</p>
                  <span className="text-[#3a7d44] text-xs font-semibold">{l.sessions}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#111111] border border-[#3a7d44]/30 rounded-2xl p-8 sm:p-10 text-center">
          <Trophy size={32} className="text-[#3a7d44] mx-auto mb-4" />
          <h3
            className="text-[#f5f5f0] font-black mb-3"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.01em" }}
          >
            EMPIEZA HOY CON UNA CLASE DE PRUEBA GRATUITA
          </h3>
          <p className="text-[#f5f5f0]/50 text-sm mb-6 max-w-lg mx-auto">
            Contacta con nosotros y te organizamos una evaluación inicial sin compromiso para conocer tu nivel y recomendarte la mejor opción.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
          >
            Solicitar clase de prueba
          </Link>
        </section>
      </div>
    </div>
  )
}
