"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Calendar, Users, GraduationCap, Trophy, Dumbbell, ArrowRight, Activity } from "lucide-react"
import { SectionEyebrow } from "@/components/brand/SectionEyebrow"

const services = [
  {
    icon: Calendar,
    title: "Reservar Pista",
    description: "14 pistas cubiertas disponibles. Reserva online en segundos, paga de forma segura y juega cuando quieras.",
    href: "/reservas",
    color: "from-[#3a7d44]/20 to-transparent",
  },
  {
    icon: Activity,
    title: "Disponibilidad en directo",
    description: "Consulta el mapa de calor de todas las pistas sin cuenta. Elige hueco y entra a reservar cuando quieras.",
    href: "/disponibilidad",
    color: "from-[#e8d44d]/12 to-transparent",
  },
  {
    icon: Users,
    title: "Partidos Abiertos",
    description: "Únete a partidos organizados con jugadores de tu nivel. Crea tu propio partido y completa el grupo fácilmente.",
    href: "/partidos-abiertos",
    color: "from-[#e8d44d]/10 to-transparent",
  },
  {
    icon: GraduationCap,
    title: "Escuela de Pádel",
    description: "Clases individuales, en parejas o en grupo para todos los niveles. Entrenadores titulados con metodología probada.",
    href: "/escuela",
    color: "from-[#3a7d44]/20 to-transparent",
  },
  {
    icon: Trophy,
    title: "Campeonatos",
    description: "Torneos y ligas internas para todas las categorías. Compite, supérate y vive la emoción de la competición.",
    href: "/campeonatos",
    color: "from-[#e8d44d]/10 to-transparent",
  },
  {
    icon: Dumbbell,
    title: "Gimnasio & Instalaciones",
    description: "Vestuarios, duchas, cafetería con terraza, tienda de material y zona de calentamiento. Todo en un solo lugar.",
    href: "/instalaciones",
    color: "from-[#3a7d44]/20 to-transparent",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariantsBase = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ServicesGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const reduceMotion = useReducedMotion()
  const cardVariants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0, transition: { duration: 0 } } }
    : cardVariantsBase

  return (
    <section className="py-20 lg:py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-3">
            <SectionEyebrow>Servicios</SectionEyebrow>
          </div>
          <h2
            className="text-[#f5f5f0] font-display font-black tracking-tight leading-none"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            ¿QUÉ PUEDES
            <br />
            <span className="text-[#3a7d44]">HACER AQUÍ?</span>
          </h2>
        </div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.href} variants={cardVariants}>
                <Link
                  href={service.href}
                  className="group relative flex flex-col h-full bg-[#111111] border border-white/10 hover:border-[#3a7d44]/60 rounded-2xl p-7 transition-all duration-300 hover:shadow-xl hover:shadow-[#3a7d44]/10 overflow-hidden"
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#3a7d44]/15 border border-[#3a7d44]/30 flex items-center justify-center mb-5 group-hover:bg-[#3a7d44]/25 transition-colors">
                      <Icon size={22} className="text-[#3a7d44]" />
                    </div>
                    <h3 className="text-[#f5f5f0] font-bold text-lg mb-3 group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[#f5f5f0]/50 text-sm leading-relaxed mb-5">
                      {service.description}
                    </p>
                    <span className="flex items-center gap-1.5 text-[#3a7d44] text-sm font-semibold">
                      Entrar
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
