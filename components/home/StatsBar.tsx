"use client"

import { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"

interface Stat {
  value: string
  numericValue: number | null
  label: string
  suffix?: string
}

const stats: Stat[] = [
  { value: "14", numericValue: 14, label: "Pistas Cubiertas", suffix: "" },
  { value: "6.000", numericValue: 6000, label: "Metros Cuadrados", suffix: " m²" },
  { value: "Todos\nlos días", numericValue: null, label: "Abierto", suffix: "" },
  { value: "Tienda &\nCafetería", numericValue: null, label: "En el recinto", suffix: "" },
]

function CountUp({ target, isInView }: { target: number; isInView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      // Skip animation: jump straight to target on next tick.
      const id = requestAnimationFrame(() => setCount(target))
      return () => cancelAnimationFrame(id)
    }
    const duration = 1800
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCount(Math.round(target * eased))
      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [isInView, target])

  return <>{target >= 1000 ? count.toLocaleString("es-ES") : count}</>
}

export default function StatsBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div id="stats-bar" ref={ref} className="bg-[#111111] border-y border-[#3a7d44]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-white/10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-5 sm:py-6 px-4 text-center"
            >
              <div
                className="text-[#3a7d44] font-display font-black leading-tight mb-1 whitespace-pre-line"
                style={{
                  fontSize:
                    stat.numericValue !== null
                      ? "clamp(1.5rem, 3.5vw, 2.4rem)"
                      : "clamp(0.95rem, 2vw, 1.35rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.numericValue !== null ? (
                  <>
                    <CountUp target={stat.numericValue} isInView={isInView} />
                    {stat.suffix}
                  </>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-[#f5f5f0]/55 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
