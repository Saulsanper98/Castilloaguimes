export type CourtType = "panoramica" | "cristal" | "central"

export interface Court {
  id: number
  name: string
  type: CourtType
  /** Posición en el plano 0–100 */
  x: number
  y: number
}

export const COURTS: Court[] = [
  { id: 1, name: "Pista 1", type: "panoramica", x: 10, y: 18 },
  { id: 2, name: "Pista 2", type: "panoramica", x: 26, y: 18 },
  { id: 3, name: "Pista 3", type: "panoramica", x: 42, y: 18 },
  { id: 4, name: "Pista 4", type: "panoramica", x: 58, y: 18 },
  { id: 5, name: "Pista 5", type: "cristal", x: 74, y: 18 },
  { id: 6, name: "Pista 6", type: "cristal", x: 90, y: 18 },
  { id: 7, name: "Pista 7", type: "cristal", x: 10, y: 50 },
  { id: 8, name: "Pista 8", type: "cristal", x: 26, y: 50 },
  { id: 9, name: "Pista 9", type: "central", x: 42, y: 50 },
  { id: 10, name: "Pista 10", type: "central", x: 58, y: 50 },
  { id: 11, name: "Pista 11", type: "central", x: 74, y: 50 },
  { id: 12, name: "Pista 12", type: "central", x: 90, y: 50 },
  { id: 13, name: "Pista 13", type: "panoramica", x: 26, y: 82 },
  { id: 14, name: "Pista 14", type: "panoramica", x: 58, y: 82 },
]

export const COURT_TYPE_LABEL: Record<CourtType, string> = {
  panoramica: "Panorámica",
  cristal: "Cristal completo",
  central: "Central",
}

export const COURT_TYPE_COLOR: Record<CourtType, string> = {
  panoramica: "#3a7d44",
  cristal: "#e8d44d",
  central: "#9aa0a6",
}

