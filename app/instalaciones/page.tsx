import type { Metadata } from "next"
import { Wind, Droplets, Coffee, ShoppingBag, Dumbbell, Wifi, Car, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Instalaciones",
  description: "Conoce las instalaciones de Pádel Castillo de Agüimes: 14 pistas cubiertas, vestuarios, cafetería y tienda de material.",
}

const galleryItems = [
  { label: "Pistas Panorámicas", gradient: "from-[#3a7d44]/40 to-[#0d2e16]", cols: 2 },
  { label: "Pistas Centrales", gradient: "from-blue-700/30 to-blue-950", cols: 1 },
  { label: "Cafetería & Terraza", gradient: "from-amber-600/30 to-amber-950", cols: 1 },
  { label: "Tienda de Material", gradient: "from-purple-700/30 to-purple-950", cols: 1 },
  { label: "Zona de Calentamiento", gradient: "from-red-700/30 to-red-950", cols: 1 },
  { label: "Vestuarios Premium", gradient: "from-teal-700/30 to-teal-950", cols: 2 },
]

const features = [
  {
    icon: Wind,
    title: "14 Pistas Cubiertas con Techo Retráctil",
    description:
      "Las 14 pistas están completamente cubiertas con un sistema de techo retráctil de última generación que permite jugar bajo techo en días de lluvia o abrir el espacio en días soleados. Iluminación LED de alta potencia en todas las pistas, garantizando visibilidad perfecta en cualquier horario.",
    highlight: "14 pistas · Césped de última generación · LED HD",
  },
  {
    icon: Droplets,
    title: "Vestuarios y Duchas",
    description:
      "Vestuarios amplios y luminosos, con duchas de agua caliente, taquillas individuales con llave, bancos y espejo de cuerpo completo. Zona diferenciada para hombres y mujeres. Servicio de toallas disponible en recepción.",
    highlight: "Agua caliente · Taquillas · Toallas disponibles",
  },
  {
    icon: Coffee,
    title: "Cafetería con Terraza",
    description:
      "Espacio de 120 plazas entre interior y terraza con vistas a las pistas. Carta diseñada para deportistas con opciones saludables, menú del día entre semana y servicio de bebidas durante todo el horario del club. La terraza cuenta con pantallas para seguir partidos en directo.",
    highlight: "120 plazas · Menú del día · Pantallas en terraza",
  },
  {
    icon: ShoppingBag,
    title: "Tienda de Material",
    description:
      "Tienda especializada en pádel con las mejores marcas del mercado: Bullpadel, Nox, Head, Wilson y más. Palas, pelotas, complementos, ropa técnica y calzado. Servicio de encordado y personalización de palas con entrega en 24 horas.",
    highlight: "Mejores marcas · Encordado · Personalización",
  },
  {
    icon: Dumbbell,
    title: "Zona de Calentamiento y Fisioterapia",
    description:
      "Zona acondicionada para el calentamiento previo y vuelta a la calma con colchonetas, rodillos y equipamiento básico de fitness. Servicio de fisioterapia disponible previa cita para el tratamiento y prevención de lesiones deportivas.",
    highlight: "Calentamiento · Fisioterapia · Prevención de lesiones",
  },
]

const amenities = [
  { icon: Wifi, label: "WiFi gratuito" },
  { icon: Car, label: "Parking gratuito" },
  { icon: Shield, label: "Acceso con tarjeta" },
  { icon: Dumbbell, label: "Gimnasio" },
  { icon: Coffee, label: "Cafetería" },
  { icon: ShoppingBag, label: "Tienda" },
]

export default function InstalacionesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-20 bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
            El complejo
          </span>
          <h1
            className="text-[#f5f5f0] font-black tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            INSTALACIONES
          </h1>
          <p className="text-[#f5f5f0]/50 mt-2 text-base max-w-2xl">
            6.000 m² de instalaciones deportivas de primer nivel en el corazón del Parque Industrial de Arinaga.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Gallery */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 auto-rows-[200px] gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.label}
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${item.gradient} ${
                  item.cols === 2 ? "sm:col-span-2" : "sm:col-span-1"
                }`}
              >
                <div className="absolute inset-0 flex items-end p-5">
                  <span className="text-white font-bold text-sm bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Amenities quick bar */}
        <section>
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {amenities.map((a) => {
                const Icon = a.icon
                return (
                  <div key={a.label} className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 bg-[#3a7d44]/15 border border-[#3a7d44]/30 rounded-xl flex items-center justify-center">
                      <Icon size={18} className="text-[#3a7d44]" />
                    </div>
                    <span className="text-[#f5f5f0]/60 text-xs">{a.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Feature sections */}
        <section className="space-y-8">
          <h2
            className="text-[#f5f5f0] font-black tracking-tight text-center"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
          >
            TODO LO QUE <span className="text-[#3a7d44]">NECESITAS</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="bg-[#111111] border border-white/10 hover:border-[#3a7d44]/40 rounded-2xl p-6 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#3a7d44]/15 border border-[#3a7d44]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={22} className="text-[#3a7d44]" />
                    </div>
                    <div>
                      <h3 className="text-[#f5f5f0] font-bold text-base mb-2">{f.title}</h3>
                      <p className="text-[#f5f5f0]/50 text-sm leading-relaxed mb-3">
                        {f.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {f.highlight.split(" · ").map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold text-[#3a7d44] bg-[#3a7d44]/10 border border-[#3a7d44]/20 px-2.5 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Location */}
        <section className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h3 className="text-[#f5f5f0] font-black text-xl mb-4">Cómo llegar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[#f5f5f0]/60 text-sm leading-relaxed mb-3">
                <strong className="text-[#f5f5f0]">Dirección:</strong><br />
                C/ Pino nº10, P.I. Arinaga<br />
                Agüimes, Las Palmas de Gran Canaria<br />
                35118
              </p>
              <p className="text-[#f5f5f0]/60 text-sm mb-1">
                <strong className="text-[#f5f5f0]">Desde Las Palmas:</strong> GC-1 dirección Sur, salida Arinaga. 25 minutos.
              </p>
              <p className="text-[#f5f5f0]/60 text-sm">
                <strong className="text-[#f5f5f0]">Desde el aeropuerto:</strong> 15 minutos por la GC-1.
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl h-40 flex items-center justify-center text-[#f5f5f0]/20 text-sm">
              [Mapa — Google Maps embed]
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
