import { Trophy } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import ganadores from "@/data/ganadores.json"

export function WinnersGallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {ganadores.map((g) => (
        <article
          key={g.id}
          className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#e8d44d]/40 transition-all"
        >
          <div
            className="h-32 relative flex items-end justify-between p-4"
            style={{
              background: `linear-gradient(135deg, ${g.color}45 0%, #0a0a0a 100%)`,
            }}
          >
            <Trophy size={48} className="absolute top-3 right-3 text-white/10" aria-hidden="true" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/75">
                {g.categoria}
              </p>
              <h3 className="text-[#f5f5f0] font-display font-black text-lg leading-tight">
                {g.torneo}
              </h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#e8d44d] mb-1">Campeones</p>
              <p className="text-[#f5f5f0] font-bold text-sm">
                {g.campeones.join(" · ")}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#f5f5f0]/45 mb-1">Finalistas</p>
              <p className="text-[#f5f5f0]/70 text-xs">{g.finalistas.join(" · ")}</p>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#f5f5f0]/55 pt-3 border-t border-white/5">
              <span>{g.resultado}</span>
              <span>{format(parseISO(g.fecha), "MMM yyyy", { locale: es })}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
