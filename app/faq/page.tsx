import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { FAQAccordion } from "@/components/faq/FAQAccordion"
import { FAQ_GROUPS } from "@/data/faq"

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "¿Cómo reservar pista? ¿Soy socio o visitante? Tarifas, escuela, torneos y dudas habituales del club.",
  alternates: { canonical: "/faq" },
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-8 bg-[#111111] border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6"><Breadcrumbs /></div>
          <span className="text-[#3a7d44] text-xs font-bold tracking-[0.4em] uppercase mb-3 block">
            Ayuda
          </span>
          <h1
            className="text-[#f5f5f0] font-display font-black tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", letterSpacing: "-0.02em" }}
          >
            PREGUNTAS <span className="text-[#3a7d44]">FRECUENTES</span>
          </h1>
          <p className="text-[#f5f5f0]/65 text-sm mt-2 max-w-xl">
            Si no encuentras lo que buscas, llámanos al{" "}
            <a href="tel:+34928753650" className="text-[#3a7d44] hover:underline">928 753 650</a>{" "}
            o escríbenos.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {FAQ_GROUPS.map((group) => (
          <section key={group.id} id={group.id}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 h-7 rounded-full bg-[#3a7d44]" aria-hidden="true" />
              <h2 className="text-[#f5f5f0] font-display font-black text-xl sm:text-2xl">
                {group.title}
              </h2>
            </div>
            <FAQAccordion items={group.items} />
          </section>
        ))}

        <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 sm:p-8 text-center">
          <h3 className="text-[#f5f5f0] font-display font-black text-lg mb-2">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-[#f5f5f0]/65 text-sm mb-5">
            Llámanos, escríbenos o pásate por recepción. Estamos siempre encantados.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center bg-[#3a7d44] hover:bg-[#4a9d54] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
            >
              Formulario de contacto
            </Link>
            <a
              href="tel:+34928753650"
              className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-[#f5f5f0] font-bold px-5 py-3 rounded-xl text-sm transition-colors"
            >
              928 753 650
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
