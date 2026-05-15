import { Tv, Calendar } from "lucide-react"

export function StreamingEmbed() {
  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-[#3a7d44]/30 to-[#0a0a0a] flex flex-col items-center justify-center relative">
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-red-500/90 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Próxima emisión
        </div>
        <Tv size={48} className="text-white/30 mb-3" aria-hidden="true" />
        <p className="text-[#f5f5f0]/85 font-display font-black text-xl">FINAL OPEN VERANO</p>
        <p className="text-[#f5f5f0]/55 text-xs mt-1">Domingo 21 julio · 20:00</p>
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#f5f5f0]/70 text-xs">
          <Calendar size={12} aria-hidden="true" />
          Streaming en directo desde la pista central
        </div>
        <button
          type="button"
          className="text-[10px] font-bold uppercase tracking-widest text-[#3a7d44] hover:text-[#4a9d54]"
        >
          Recordatorio
        </button>
      </div>
    </div>
  )
}
