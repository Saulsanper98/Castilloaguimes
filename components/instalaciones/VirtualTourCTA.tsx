import { Camera, ArrowRight } from "lucide-react"

export function VirtualTourCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#3a7d44]/30 via-[#0a0a0a] to-[#0a0a0a]">
      <div className="absolute inset-0 opacity-20 bg-court-lines" aria-hidden="true" />
      <div className="relative p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#3a7d44]/20 border border-[#3a7d44]/40 flex items-center justify-center shrink-0">
          <Camera size={28} className="text-[#3a7d44]" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3a7d44] mb-2">
            Tour virtual 360°
          </p>
          <h3 className="text-[#f5f5f0] font-display font-black text-2xl sm:text-3xl leading-tight mb-2">
            Recorre cada rincón sin moverte
          </h3>
          <p className="text-[#f5f5f0]/65 text-sm max-w-xl">
            Estamos preparando un tour inmersivo: pisa cada pista, mira la cafetería, prueba los vestuarios. Pronto disponible.
          </p>
        </div>
        <a
          href="/contacto"
          className="inline-flex items-center gap-2 bg-[#e8d44d] hover:bg-[#f0dc55] text-[#0a0a0a] font-black px-5 py-3 rounded-xl text-sm shrink-0 transition-colors"
        >
          Avisarme
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
