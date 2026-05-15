import { Star, Users as UsersIcon } from "lucide-react"
import entrenadores from "@/data/entrenadores.json"

export function CoachesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {entrenadores.map((c) => (
        <article
          key={c.slug}
          className="card-hover group bg-[#111111] border border-white/10 rounded-2xl overflow-hidden"
        >
          {/* Photo placeholder with initials + court-lines texture */}
          <div
            className="h-44 relative flex items-end p-4 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${c.color}66 0%, #0a0a0a 100%)`,
            }}
          >
            {/* Court line pattern overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-25 mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 18px)",
              }}
            />
            {/* Soft glow blob */}
            <div
              aria-hidden="true"
              className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-50 transition-opacity duration-300 group-hover:opacity-80"
              style={{ background: c.color }}
            />
            <div
              className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-black text-base shadow-lg ring-2 ring-black/30"
              style={{ background: c.color }}
              aria-hidden="true"
            >
              {c.nombre
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="relative z-10">
              <h3 className="text-[#f5f5f0] font-display font-black text-lg leading-tight drop-shadow-md">
                {c.nombre}
              </h3>
              <p className="text-[#f5f5f0]/85 text-[11px] uppercase tracking-widest">{c.rol}</p>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs text-[#f5f5f0]/65">
              <span className="flex items-center gap-1">
                <Star size={11} className="text-[#e8d44d] fill-[#e8d44d]" aria-hidden="true" />
                <span className="text-[#f5f5f0] font-bold">{c.rating.toFixed(1)}</span>
              </span>
              <span className="flex items-center gap-1">
                <UsersIcon size={11} aria-hidden="true" />
                {c.alumnos}
              </span>
              <span className="ml-auto text-[#f5f5f0]/45">{c.anos} años</span>
            </div>
            <p className="text-[#f5f5f0]/65 text-xs leading-relaxed line-clamp-3">{c.bio}</p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
              {c.especialidades.map((e) => (
                <span
                  key={e}
                  className="text-[10px] font-semibold text-[#3a7d44] bg-[#3a7d44]/10 border border-[#3a7d44]/20 px-2 py-0.5 rounded-full"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
