import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div
          className="font-display text-[#3a7d44] font-black leading-none mb-4"
          style={{ fontSize: "clamp(6rem, 18vw, 11rem)", letterSpacing: "-0.04em" }}
        >
          404
        </div>
        <h1 className="text-[#f5f5f0] font-display font-black text-2xl sm:text-3xl tracking-tight mb-3">
          PÁGINA FUERA DE PISTA
        </h1>
        <p className="text-[#f5f5f0]/50 text-sm sm:text-base mb-8 leading-relaxed">
          Esta dirección no existe en nuestro club. Quizá la pelota se salió por el cristal.
          Vuelve al inicio para encontrar lo que buscas.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver al inicio
          </Link>
          <Link
            href="/reservas"
            className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-[#f5f5f0] font-bold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Reservar una pista
          </Link>
        </div>
      </div>
    </div>
  )
}
