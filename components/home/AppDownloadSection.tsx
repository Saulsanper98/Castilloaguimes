import { AppStoreLink } from "@/components/brand/AppStoreLink"

export default function AppDownloadSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#111111] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
              App Oficial
            </span>
            <h2
              className="text-[#f5f5f0] font-display font-black tracking-tight mb-5"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              RESERVA EN
              <br />
              <span className="text-[#3a7d44]">3 CLICS</span>
            </h2>
            <p className="text-[#f5f5f0]/50 text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Gestiona tus reservas, únete a partidos abiertos, consulta tus facturas y recibe notificaciones sobre torneos y novedades del club, todo desde tu móvil.
            </p>

            <ul className="space-y-3 mb-8 text-left max-w-sm mx-auto lg:mx-0">
              {[
                "Reserva en tiempo real las 14 pistas",
                "Únete o crea partidos abiertos",
                "Consulta el historial de partidos",
                "Recibe alertas de torneos y ofertas",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-[#f5f5f0]/60">
                  <span className="w-5 h-5 rounded-full bg-[#3a7d44]/20 border border-[#3a7d44]/40 flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3a7d44]" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <AppStoreLink
                store="appstore"
                className="flex items-center gap-3 bg-[#f5f5f0] hover:bg-white text-[#0a0a0a] rounded-xl px-5 py-3.5 transition-all group"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] text-[#0a0a0a]/50 uppercase tracking-wide leading-none">Próximamente en</span>
                  <span className="block font-bold text-sm leading-tight">App Store</span>
                </span>
              </AppStoreLink>
              <AppStoreLink
                store="playstore"
                className="flex items-center gap-3 bg-[#f5f5f0] hover:bg-white text-[#0a0a0a] rounded-xl px-5 py-3.5 transition-all"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.18 23.76c.3.17.64.22.99.13l12.12-6.99-2.81-2.81-10.3 9.67zm-1.9-20.4C1.1 3.7 1 4.08 1 4.5v15c0 .42.1.8.28 1.14L13.5 8.5 1.28 3.36zM20.49 10.1l-2.78-1.6-3.14 3.14 3.14 3.14 2.81-1.62c.8-.46.8-1.6-.03-2.06zM4.17.24L16.29 7.23 13.48 10.04 3.18.37c.3-.17.68-.2.99-.13z" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] text-[#0a0a0a]/50 uppercase tracking-wide leading-none">Próximamente en</span>
                  <span className="block font-bold text-sm leading-tight">Google Play</span>
                </span>
              </AppStoreLink>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative">
              {/* Phone outer */}
              <div className="w-56 h-[480px] bg-[#1a1a1a] rounded-[2.5rem] border-4 border-white/20 shadow-2xl shadow-black/50 overflow-hidden relative">
                {/* Status bar */}
                <div className="h-8 bg-[#0a0a0a] flex items-center justify-between px-5 pt-1">
                  <span className="text-white text-[9px] font-bold">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-1.5 bg-white rounded-sm opacity-80" />
                    <div className="w-1 h-1.5 bg-white rounded-sm opacity-50" />
                  </div>
                </div>

                {/* App UI */}
                <div className="flex flex-col h-full bg-[#0a0a0a] px-4 pt-4 pb-6">
                  {/* App header */}
                  <div className="mb-4">
                    <div className="text-[#3a7d44] font-black text-xs tracking-widest">CASTILLO</div>
                    <div className="text-white/80 text-[10px] font-medium mt-1">Reserva tu pista</div>
                  </div>

                  {/* Date selector */}
                  <div className="flex gap-2 mb-4">
                    {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
                      <div
                        key={d}
                        className={`flex-1 rounded-lg py-2 flex flex-col items-center ${
                          i === 2 ? "bg-[#3a7d44]" : "bg-white/5"
                        }`}
                      >
                        <span className="text-[7px] text-white/50">{d}</span>
                        <span className={`text-[9px] font-bold ${i === 2 ? "text-white" : "text-white/60"}`}>
                          {15 + i}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["09:00", "10:30", "12:00", "14:00", "16:00", "18:30"].map((t, i) => (
                      <div
                        key={t}
                        className={`rounded-lg px-2 py-2 text-center ${
                          i === 1
                            ? "bg-[#3a7d44] border border-[#3a7d44]"
                            : i === 3
                            ? "bg-white/10 border border-white/5 opacity-50"
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        <span className={`text-[9px] font-bold ${i === 1 ? "text-white" : "text-white/60"}`}>
                          {t}
                        </span>
                        {i === 3 && (
                          <div className="text-[7px] text-red-400 mt-0.5">Completo</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CTA button */}
                  <div className="mt-auto bg-[#3a7d44] rounded-xl py-3 text-center">
                    <span className="text-white text-[10px] font-bold">RESERVAR AHORA</span>
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-[#3a7d44]/20 rounded-[3rem] blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
