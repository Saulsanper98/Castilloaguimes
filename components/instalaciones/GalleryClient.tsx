"use client"

import { useState } from "react"
import { Lightbox } from "./Lightbox"

const ITEMS = [
  { id: "panoramic", label: "Pistas Panorámicas", caption: "Las 4 pistas con cristal panorámico para grabaciones y finales.", gradient: "from-[#3a7d44]/50 to-[#0d2e16]", cols: 2 },
  { id: "central", label: "Pistas Centrales", caption: "8 pistas centrales con iluminación LED HD.", gradient: "from-blue-700/40 to-blue-950", cols: 1 },
  { id: "cafe", label: "Cafetería & Terraza", caption: "120 plazas, carta saludable, pantallas en directo.", gradient: "from-amber-600/40 to-amber-950", cols: 1 },
  { id: "fisio", label: "Zona de Calentamiento", caption: "Material de movilidad, rodillos y servicio de fisio.", gradient: "from-red-700/40 to-red-950", cols: 1 },
  { id: "vest", label: "Vestuarios Premium", caption: "Agua caliente, taquillas individuales, toallas opcionales.", gradient: "from-teal-700/40 to-teal-950", cols: 2 },
]

export function GalleryClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 auto-rows-[200px] gap-4">
        {ITEMS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Abrir ${item.label}`}
            className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${item.gradient} group focus-visible:ring-2 focus-visible:ring-[#3a7d44] transition-transform ${
              item.cols === 2 ? "sm:col-span-2" : "sm:col-span-1"
            }`}
          >
            <div className="absolute inset-0 flex items-end p-5">
              <span className="text-white font-bold text-sm bg-black/45 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                {item.label}
              </span>
            </div>
            <div className="absolute inset-0 ring-0 group-hover:ring-2 group-hover:ring-[#3a7d44]/40 transition-all rounded-2xl" aria-hidden="true" />
          </button>
        ))}
      </div>
      <Lightbox
        items={ITEMS.map((i) => ({ id: i.id, label: i.label, caption: i.caption, gradient: i.gradient }))}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={(i) => setOpenIndex(i)}
      />
    </>
  )
}
