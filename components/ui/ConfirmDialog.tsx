"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { useEffect } from "react"

interface Props {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-[#111111] sm:border sm:border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    destructive
                      ? "bg-red-500/15 border border-red-500/40 text-red-400"
                      : "bg-[#3a7d44]/15 border border-[#3a7d44]/40 text-[#3a7d44]"
                  }`}
                >
                  <AlertTriangle size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="confirm-title" className="text-[#f5f5f0] font-display font-black text-lg mb-1">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-[#f5f5f0]/65 text-sm leading-relaxed">{description}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 p-4 border-t border-white/10 bg-[#0d0d0d]">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold border border-white/15 text-[#f5f5f0]/75 hover:bg-white/5"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  destructive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-[#3a7d44] hover:bg-[#4a9d54] text-white"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
