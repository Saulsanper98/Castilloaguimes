"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  rot: number
  vr: number
  size: number
  life: number
}

const COLORS = ["#3a7d44", "#e8d44d", "#f5f5f0", "#4a9d54", "#f0dc55"]

interface Props {
  trigger: number
  count?: number
}

/**
 * Lluvia ligera de confetti. Se dispara incrementando `trigger`.
 */
export function Confetti({ trigger, count = 60 }: Props) {
  const [particles, setParticles] = useState<Particle[]>([])
  const triggerRef = useRef(trigger)

  useEffect(() => {
    if (trigger === 0 || trigger === triggerRef.current && particles.length > 0) {
      triggerRef.current = trigger
      return
    }
    if (trigger === triggerRef.current) return
    triggerRef.current = trigger
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const raf = requestAnimationFrame(() => {
      const w = window.innerWidth
      const initial: Particle[] = Array.from({ length: count }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * w,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        size: 6 + Math.random() * 6,
        life: 0,
      }))
      setParticles(initial)
    })
    return () => cancelAnimationFrame(raf)
  }, [trigger, count, particles.length])

  const hasParticles = particles.length > 0

  useEffect(() => {
    if (!hasParticles) return
    let raf = 0
    const step = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12,
            rot: p.rot + p.vr,
            life: p.life + 1,
          }))
          .filter((p) => p.y < window.innerHeight + 60 && p.life < 360)
      )
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [hasParticles])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[300]" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute will-change-transform"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            opacity: Math.max(0, 1 - p.life / 360),
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  )
}
