"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { COURTS } from "@/lib/courts"
import { getSlotMockStatus } from "@/lib/slotMock"

interface Props {
  dateKey: string
  slots: string[]
  selectedSlot: string | null
  selectedCourtId: number
  onPick: (courtId: number, slot: string) => void
}

const STATUS_BG = {
  free: "bg-[#3a7d44]/60 hover:bg-[#3a7d44]",
  few: "bg-[#e8d44d]/60 hover:bg-[#e8d44d]",
  full: "bg-red-500/20",
} as const

/**
 * Matriz pistas (filas) × horas (columnas) tipo "Playtomic".
 * Cada celda tiene color de calor según ocupación. Click para fijar pista+hora.
 */
export function CourtHeatmap({
  dateKey,
  slots,
  selectedSlot,
  selectedCourtId,
  onPick,
}: Props) {
  const rows = useMemo(() => COURTS, [])

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111111] p-3 sm:p-4">
      <table className="w-full border-separate border-spacing-1 text-[10px]">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 bg-[#111111] text-left text-[9px] font-bold uppercase tracking-widest text-[#f5f5f0]/45 pr-2"
            >
              Pista
            </th>
            {slots.map((s) => (
              <th
                key={s}
                scope="col"
                className="px-1 text-center text-[9px] font-semibold text-[#f5f5f0]/55 tabular-nums"
              >
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-[#111111] pr-2 text-left text-[10px] font-bold text-[#f5f5f0]/75 whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="block w-1.5 h-1.5 rounded-sm shrink-0"
                    style={{
                      background:
                        c.type === "panoramica"
                          ? "#3a7d44"
                          : c.type === "cristal"
                            ? "#e8d44d"
                            : "#9aa0a6",
                    }}
                    aria-hidden="true"
                  />
                  {c.name}
                </span>
              </th>
              {slots.map((slot) => {
                const status = getSlotMockStatus(dateKey, slot, c.id)
                const isSelected = c.id === selectedCourtId && slot === selectedSlot
                return (
                  <td key={slot} className="p-0">
                    <button
                      type="button"
                      disabled={status === "full"}
                      onClick={() => status !== "full" && onPick(c.id, slot)}
                      aria-label={`${c.name} a las ${slot}: ${status === "free" ? "libre" : status === "few" ? "pocas plazas" : "completo"}`}
                      className={cn(
                        "block w-full h-6 rounded transition-all",
                        isSelected
                          ? "ring-2 ring-[#e8d44d] ring-offset-1 ring-offset-[#111111] scale-110"
                          : "hover:scale-110",
                        STATUS_BG[status],
                        status === "full" && "cursor-not-allowed"
                      )}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-[#f5f5f0]/55">
        <span className="flex items-center gap-1">
          <span className="block w-3 h-3 rounded-sm bg-[#3a7d44]/60" aria-hidden="true" /> Libre
        </span>
        <span className="flex items-center gap-1">
          <span className="block w-3 h-3 rounded-sm bg-[#e8d44d]/60" aria-hidden="true" /> Pocas
        </span>
        <span className="flex items-center gap-1">
          <span className="block w-3 h-3 rounded-sm bg-red-500/20" aria-hidden="true" /> Completo
        </span>
        <span className="ml-auto">14 pistas · {slots.length} franjas</span>
      </div>
    </div>
  )
}
