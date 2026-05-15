"use client"

import { useEffect, useState } from "react"
import { Bookmark } from "lucide-react"
import { loadProfile, patchProfile } from "@/lib/player"
import { toast } from "sonner"

export function SaveButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setSaved(loadProfile().savedNewsSlugs.includes(slug))
    )
    return () => cancelAnimationFrame(id)
  }, [slug])

  function toggle() {
    const profile = loadProfile()
    const isSaved = profile.savedNewsSlugs.includes(slug)
    const next = isSaved
      ? profile.savedNewsSlugs.filter((s) => s !== slug)
      : [...profile.savedNewsSlugs, slug]
    patchProfile({ savedNewsSlugs: next })
    setSaved(!isSaved)
    toast(isSaved ? "Quitado de guardados" : "Guardado para luego", {
      description: isSaved
        ? "El artículo ya no aparece en tu lista."
        : "Lo encontrarás en tu cuenta personal.",
    })
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={saved ? "Quitar de guardados" : "Guardar para luego"}
        aria-pressed={saved}
        className={`w-9 h-9 inline-flex items-center justify-center rounded-lg border transition-colors ${
          saved
            ? "bg-[#3a7d44]/15 border-[#3a7d44]/50 text-[#3a7d44]"
            : "bg-transparent border-white/15 text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:border-white/30"
        }`}
      >
        <Bookmark size={14} className={saved ? "fill-current" : ""} aria-hidden="true" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border ${
        saved
          ? "bg-[#3a7d44]/15 border-[#3a7d44]/50 text-[#3a7d44]"
          : "border-white/15 text-[#f5f5f0]/80 hover:text-[#f5f5f0] hover:border-white/30"
      }`}
    >
      <Bookmark size={13} className={saved ? "fill-current" : ""} aria-hidden="true" />
      {saved ? "Guardado" : "Guardar"}
    </button>
  )
}
