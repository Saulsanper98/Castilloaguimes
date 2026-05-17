"use client"

import { useId, useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { FAQItem } from "@/data/faq"

interface Props {
  items: FAQItem[]
}

export function FAQAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const baseId = useId()

  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const isOpen = open === i
        const btnId = `${baseId}-btn-${i}`
        const panelId = `${baseId}-panel-${i}`
        return (
          <li key={i} className="rounded-2xl border border-white/10 bg-[#111111] hover:border-white/20 transition-colors">
            <button
              type="button"
              id={btnId}
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-[#f5f5f0] font-semibold text-sm">{item.q}</span>
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={`text-[#f5f5f0]/55 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-1 border-t border-white/5">
                    <p className="text-[#f5f5f0]/70 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
