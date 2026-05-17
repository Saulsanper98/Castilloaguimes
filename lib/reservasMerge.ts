/**
 * Une las reservas seed (data/userReservas.json) con las creadas por el usuario
 * (lib/userActivity.ts) y aplica overrides (cancelaciones, recordatorios).
 *
 * Para usar tanto en /cuenta como en el dashboard y la cabecera.
 */

import userReservasSeed from "@/data/userReservas.json"
import {
  loadUserReservas,
  loadReservaOverrides,
  type UserReserva,
} from "./userActivity"

export type MergedReserva = UserReserva

type SeedReserva = Omit<UserReserva, "createdAt" | "payMode">

export function getAllReservas(): MergedReserva[] {
  const seed = (userReservasSeed as SeedReserva[]).map((r) => ({
    ...r,
    createdAt: `${r.date}T${r.time}:00.000Z`,
  })) as MergedReserva[]
  const user = loadUserReservas()
  const overrides = loadReservaOverrides()
  const all = [...user, ...seed]
  return all.map((r) => {
    const o = overrides[r.id]
    if (!o) return r
    return { ...r, ...(o.status ? { status: o.status } : {}), ...(typeof o.reminder === "boolean" ? { reminder: o.reminder } : {}) }
  })
}

export function getUpcomingReservas(): MergedReserva[] {
  return getAllReservas()
    .filter((r) => r.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
}

export function getNextReserva(): MergedReserva | undefined {
  return getUpcomingReservas()[0]
}
