"use client"

import { useEffect, useState } from "react"
import { Toaster } from "sonner"

type ThemeMode = "light" | "dark"

function readTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark"
  return document.documentElement.classList.contains("light") ? "light" : "dark"
}

export function ThemedToaster() {
  const [mode, setMode] = useState<ThemeMode>("dark")

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMode(readTheme()))
    const obs = new MutationObserver(() => setMode(readTheme()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [])

  const isLight = mode === "light"

  return (
    <Toaster
      theme={mode}
      position="top-center"
      richColors
      closeButton
      offset="80px"
      mobileOffset={{ top: "70px" }}
      toastOptions={{
        style: {
          background: isLight ? "#ffffff" : "#1a1a1a",
          border: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.1)",
          color: isLight ? "#111111" : "#f5f5f0",
        },
      }}
    />
  )
}
