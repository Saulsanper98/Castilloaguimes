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
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), target)
      setCount(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, target])

  return <>{target >= 1000 ? count.toLocaleString("es-ES") : count}</>
}

export default function StatsBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div id="stats-bar" ref={ref} className="bg-[#111111] border-y border-[#3a7d44]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-8 px-4 text-center group"
            >
              <div className="text-[#3a7d44] font-black leading-tight mb-2 whitespace-pre-line" style={{ fontSize: stat.numericValue !== null ? "clamp(2rem, 5vw, 3.5rem)" : "clamp(1.1rem, 2.5vw, 1.75rem)", letterSpacing: "-0.02em" }}>
                {stat.numericValue !== null ? (
                  <>
                    <CountUp target={stat.numericValue} isInView={isInView} />
                    {stat.suffix}
                  </>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-[#f5f5f0]/50 text-xs sm:text-sm font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
