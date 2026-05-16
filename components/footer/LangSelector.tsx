"use client"

import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import { toast } from "sonner"
import { loadProfile, patchProfile, type PlayerProfile } from "@/lib/player"

type LangCode = PlayerProfile["language"]

const LANGS: Array<{ code: LangCode; label: string }> = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
]

export function LangSelector() {
  const [current, setCurrent] = useState<LangCode>("es")

  useEffect(() => {
    const raf = requestAnimationFrame(() => setCurrent(loadProfile().language))
    return () => cancelAnimationFrame(raf)
  }, [])

  function pick(code: LangCode) {
    if (code === current) return
    setCurrent(code)
    patchProfile({ language: code })
    toast.message("Idioma seleccionado", {
      description: `${LANGS.find((l) => l.code === code)?.label} — la traducción completa estará disponible pronto.`,
    })
  }

  return (
    <div className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-lg p-0.5">
      <Globe size={13} className="text-[#f5f5f0]/55 ml-2" aria-hidden="true" />
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => pick(l.code)}
          aria-pressed={current === l.code}
          aria-label={l.label}
          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${
            current === l.code
              ? "bg-[#3a7d44] text-white"
              : "text-[#f5f5f0]/65 hover:text-[#f5f5f0]"
          }`}
        >
          {l.code}
        </button>
      ))}
    </div>
  )
}
