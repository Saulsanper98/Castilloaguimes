import type { Metadata } from "next"
import Link from "next/link"
import { LegalDoc } from "@/components/legal/LegalDoc"
import { ArrowRight, FileText, Cookie, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Información legal",
  description: "Documentación legal de Pádel Castillo de Agüimes: privacidad, aviso legal y política de cookies.",
  alternates: { canonical: "/legal" },
}

const DOCS = [
  {
    href: "/legal/privacidad",
    title: "Política de privacidad",
    desc: "Cómo tratamos tus datos personales (RGPD, LOPDGDD).",
    icon: ShieldCheck,
  },
  {
    href: "/legal/aviso-legal",
    title: "Aviso legal",
    desc: "Datos identificativos del titular y condiciones de uso (LSSI-CE).",
    icon: FileText,
  },
  {
    href: "/legal/cookies",
    title: "Política de cookies",
    desc: "Qué cookies usamos y cómo gestionarlas.",
    icon: Cookie,
  },
]

export default function Page() {
  return (
    <LegalDoc title="Información legal" updatedAt="1 de mayo de 2026">
      <p>
        Aquí tienes los documentos legales del club. Si tienes cualquier duda escríbenos a{" "}
        <a href="mailto:recepcioncdca@gmail.com">recepcioncdca@gmail.com</a>.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {DOCS.map((d) => {
          const Icon = d.icon
          return (
            <li key={d.href}>
              <Link
                href={d.href}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111111] p-4 hover:border-[#3a7d44]/40 transition-colors"
              >
                <span className="w-10 h-10 rounded-xl bg-[#3a7d44]/15 border border-[#3a7d44]/30 flex items-center justify-center text-[#3a7d44] shrink-0">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[#f5f5f0] font-bold text-sm">{d.title}</span>
                  <span className="block text-[#f5f5f0]/55 text-xs">{d.desc}</span>
                </span>
                <ArrowRight size={13} className="text-[#f5f5f0]/45 group-hover:translate-x-1 group-hover:text-[#3a7d44] transition-all" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ul>
    </LegalDoc>
  )
}
