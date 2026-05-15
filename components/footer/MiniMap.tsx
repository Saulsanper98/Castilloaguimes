import { MapPin } from "lucide-react"

export function MiniMap() {
  return (
    <a
      href="https://maps.google.com/?q=C%2F+Pino+10%2C+Pol%C3%ADgono+Industrial+Arinaga%2C+Ag%C3%BCimes"
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-[16/9] rounded-xl overflow-hidden border border-white/10 group hover:border-[#3a7d44]/50 transition-colors"
      aria-label="Abrir ubicación en Google Maps"
    >
      <iframe
        src="https://maps.google.com/maps?q=C%2F+Pino+10%2C+Pol%C3%ADgono+Industrial+Arinaga%2C+Ag%C3%BCimes&z=14&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin"
        className="grayscale-[80%] group-hover:grayscale-0 transition-all pointer-events-none"
        title="Ubicación Pádel Castillo de Agüimes"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2 text-white pointer-events-none">
        <MapPin size={12} className="text-[#3a7d44]" aria-hidden="true" />
        <span className="text-[11px] font-bold">Cómo llegar</span>
        <span className="ml-auto text-[10px] text-white/65">→</span>
      </div>
    </a>
  )
}
