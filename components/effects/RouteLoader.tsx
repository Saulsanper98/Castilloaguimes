"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

/** Barra fina de progreso superior cuando cambia la ruta. */
export function RouteLoader() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setVisible(true)
      setProgress(15)
    })
    const t1 = setTimeout(() => setProgress(55), 80)
    const t2 = setTimeout(() => setProgress(85), 200)
    const t3 = setTimeout(() => setProgress(100), 320)
    const t4 = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 480)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [pathname])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-0.5 z-[400] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[#3a7d44] shadow-[0_0_8px_rgba(58,125,68,0.7)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  )
}
