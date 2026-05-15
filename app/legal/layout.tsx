import Link from "next/link"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"

export default function LegalLayout({ children }: LayoutProps<"/legal">) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-8 bg-[#111111] border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <Breadcrumbs />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3a7d44] mb-2">
            Información legal
          </p>
          <nav aria-label="Páginas legales" className="flex flex-wrap gap-3 text-xs mt-4">
            <Link href="/legal/privacidad" className="text-[#f5f5f0]/65 hover:text-[#3a7d44] underline-offset-4 hover:underline">
              Política de privacidad
            </Link>
            <span className="text-[#f5f5f0]/25">·</span>
            <Link href="/legal/aviso-legal" className="text-[#f5f5f0]/65 hover:text-[#3a7d44] underline-offset-4 hover:underline">
              Aviso legal
            </Link>
            <span className="text-[#f5f5f0]/25">·</span>
            <Link href="/legal/cookies" className="text-[#f5f5f0]/65 hover:text-[#3a7d44] underline-offset-4 hover:underline">
              Política de cookies
            </Link>
          </nav>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article className="text-[#f5f5f0]/75 leading-relaxed">{children}</article>
      </div>
    </div>
  )
}
