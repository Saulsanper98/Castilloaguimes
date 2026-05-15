"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryItem {
  id: string
  label: string
  caption?: string
  /** Tailwind gradient classes (placeholder hasta tener fotos reales) */
  gradient: string
}

interface Props {
  items: GalleryItem[]
  index: number | null
  onClose: () => void
  onChange: (next: number) => void
}

export function Lightbox({ items, index, onClose, onChange }: Props) {
  useEffect(() => {
    if (index == null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onChange((index! - 1 + items.length) % items.length)
      if (e.key === "ArrowRight") onChange((index! + 1) % items.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, items.length, onClose, onChange])

  return (
    <AnimatePresence>
      {index != null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ${index + 1} de ${items.length}: ${items[index].label}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Prev */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange((index - 1 + items.length) % items.length) }}
            aria-label="Anterior"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X size={18} aria-hidden="true" />
          </button>

          {/* Image */}
          <motion.div
            key={items[index].id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${items[index].gradient} shadow-2xl`} />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-widest text-white/65 mb-1">
                {index + 1} / {items.length}
              </p>
              <h3 className="text-white font-display font-black text-2xl sm:text-3xl">{items[index].label}</h3>
              {items[index].caption && (
                <p className="text-white/80 text-sm mt-2 max-w-2xl">{items[index].caption}</p>
              )}
            </div>
          </motion.div>

          {/* Next */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange((index + 1) % items.length) }}
            aria-label="Siguiente"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(i) }}
                aria-label={`Ir a la imagen ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "bg-white w-8" : "bg-white/30 w-3 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
