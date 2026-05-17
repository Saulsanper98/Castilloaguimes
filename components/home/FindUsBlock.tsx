import { MapPin, Navigation, Phone, Clock, Car } from "lucide-react"
import { GOOGLE_MAPS_DIRECTIONS_URL } from "@/lib/site"

export function FindUsBlock() {
  return (
    <section className="py-16 lg:py-24 bg-[#111111] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          {/* Map */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] sm:aspect-[16/9]">
            <iframe
              src="https://maps.google.com/maps?q=C%2F%20Pino%2010%2C%20Pol%C3%ADgono%20Industrial%20Arinaga%2C%20Ag%C3%BCimes%2C%20Las%20Palmas&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              className="grayscale-[40%] hover:grayscale-0 transition-all duration-500"
              title="Ubicación de Pádel Castillo de Agüimes"
            />
            {/* Overlay marker badge */}
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#0a0a0a]/85 backdrop-blur-md border border-white/15 px-3 py-1.5">
              <MapPin size={11} className="text-[#3a7d44]" aria-hidden="true" />
              <span className="text-[#f5f5f0] text-[10px] font-bold uppercase tracking-widest">
                Pádel Castillo · Arinaga
              </span>
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
              Cómo llegar
            </span>
            <h2
              className="text-[#f5f5f0] font-display font-black tracking-tight leading-tight mb-4"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", letterSpacing: "-0.02em" }}
            >
              EN EL POLÍGONO<br />
              <span className="text-[#3a7d44]">DE ARINAGA</span>
            </h2>
            <p className="text-[#f5f5f0]/65 text-sm leading-relaxed mb-6 max-w-md">
              A 15 minutos del aeropuerto y 25 de Las Palmas por la GC-1. Parking gratuito en el recinto.
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={14} className="text-[#3a7d44] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[#f5f5f0] font-semibold">C/ Pino nº10, P.I. Arinaga</p>
                  <p className="text-[#f5f5f0]/55 text-xs">35118 Agüimes, Las Palmas</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Car size={14} className="text-[#3a7d44] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[#f5f5f0] font-semibold">Parking gratuito</p>
                  <p className="text-[#f5f5f0]/55 text-xs">Plazas disponibles para socios y visitantes</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock size={14} className="text-[#3a7d44] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[#f5f5f0] font-semibold">L-V 08:00–23:00 · Sáb 08:00–20:00</p>
                  <p className="text-[#f5f5f0]/55 text-xs">Dom/festivos 09:00–20:00 (festivos hasta 15:00)</p>
                </div>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
              >
                <Navigation size={14} aria-hidden="true" />
                Cómo llegar
              </a>
              <a
                href="tel:+34928753650"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-[#f5f5f0] font-bold px-5 py-3 rounded-xl text-sm transition-colors"
              >
                <Phone size={14} aria-hidden="true" />
                928 753 650
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
