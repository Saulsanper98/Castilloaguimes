import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"
import { Logo } from "@/components/brand/Logo"
import { ClubClock } from "@/components/footer/ClubClock"
import { NewsletterSnippet } from "@/components/footer/NewsletterSnippet"

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Logo + Info */}
          <div>
            <Logo className="mb-6" />
            <p className="text-[#f5f5f0]/50 text-sm leading-relaxed mb-6">
              El mayor complejo indoor de pádel de Canarias, con 14 pistas cubiertas y servicios de primera clase.
            </p>
            <ul className="space-y-3 text-sm text-[#f5f5f0]/60 mb-6">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[#3a7d44] mt-0.5 flex-shrink-0" />
                <span>C/ Pino nº10, P.I. Arinaga, Agüimes, Las Palmas</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#3a7d44] flex-shrink-0" />
                <a href="tel:+34928753650" className="hover:text-[#f5f5f0] transition-colors">
                  928 753 650
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#3a7d44] flex-shrink-0" />
                <a href="mailto:recepcioncdca@gmail.com" className="hover:text-[#f5f5f0] transition-colors">
                  recepcioncdca@gmail.com
                </a>
              </li>
            </ul>
            <div className="mb-6">
              <ClubClock />
            </div>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-[#f5f5f0]/50 hover:text-[#f5f5f0] hover:border-white/40 transition-all"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-[#f5f5f0]/50 hover:text-[#f5f5f0] hover:border-white/40 transition-all"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[#f5f5f0] font-bold text-sm uppercase tracking-widest mb-6">
              Acceso Rápido
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Reservar Pista", href: "/reservas" },
                { label: "Partidos Abiertos", href: "/partidos-abiertos" },
                { label: "Escuela de Pádel", href: "/escuela" },
                { label: "Campeonatos", href: "/campeonatos" },
                { label: "Instalaciones", href: "/instalaciones" },
                { label: "Noticias", href: "/noticias" },
                { label: "Tarifas", href: "/tarifas" },
                { label: "Contacto", href: "/contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#f5f5f0]/50 hover:text-[#3a7d44] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="lg:pt-1">
            <NewsletterSnippet />
          </div>

          {/* Column 4: App Download */}
          <div>
            <h3 className="text-[#f5f5f0] font-bold text-sm uppercase tracking-widest mb-6">
              Descarga Nuestra App
            </h3>
            <p className="text-[#f5f5f0]/50 text-sm leading-relaxed mb-6">
              Reserva pistas, apúntate a partidos abiertos y gestiona todo desde tu móvil con nuestra app oficial.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center gap-3 border border-white/20 hover:border-white/40 rounded-xl px-4 py-3 transition-all group"
              >
                <div className="text-[#f5f5f0]/70 group-hover:text-[#f5f5f0]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[#f5f5f0]/60 text-[10px] uppercase tracking-wide">Disponible en</div>
                  <div className="text-[#f5f5f0] text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 border border-white/20 hover:border-white/40 rounded-xl px-4 py-3 transition-all group"
              >
                <div className="text-[#f5f5f0]/70 group-hover:text-[#f5f5f0]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.64.22.99.13l12.12-6.99-2.81-2.81-10.3 9.67zm-1.9-20.4C1.1 3.7 1 4.08 1 4.5v15c0 .42.1.8.28 1.14L13.5 8.5 1.28 3.36zM20.49 10.1l-2.78-1.6-3.14 3.14 3.14 3.14 2.81-1.62c.8-.46.8-1.6-.03-2.06zM4.17.24L16.29 7.23 13.48 10.04 3.18.37c.3-.17.68-.2.99-.13z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[#f5f5f0]/60 text-[10px] uppercase tracking-wide">Disponible en</div>
                  <div className="text-[#f5f5f0] text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#f5f5f0]/55 text-xs">
            © {new Date().getFullYear()} Pádel Castillo de Agüimes. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-[#f5f5f0]/55 hover:text-[#f5f5f0]/60 text-xs transition-colors">
              Política de Privacidad
            </Link>
            <Link href="#" className="text-[#f5f5f0]/55 hover:text-[#f5f5f0]/60 text-xs transition-colors">
              Aviso Legal
            </Link>
            <Link href="#" className="text-[#f5f5f0]/55 hover:text-[#f5f5f0]/60 text-xs transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
