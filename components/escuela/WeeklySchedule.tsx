const DAYS = ["L", "M", "X", "J", "V", "S"] as const

// Cada celda: nivel del grupo (o vacío)
const GRID: Record<string, Record<string, string>> = {
  // hora: { dia: grupo }
  "16:00": { L: "Infantil A", X: "Infantil A", V: "Infantil B" },
  "17:00": { L: "Infantil B", M: "Infantil C", J: "Infantil B", S: "Infantil C" },
  "18:00": { M: "Adultos Inic.", J: "Adultos Inter.", V: "Femenino" },
  "19:00": { L: "Adultos Inter.", X: "Adultos Inter.", V: "Adultos Avz." },
  "20:00": { L: "Adultos Avz.", M: "Competición", J: "Competición" },
  "10:00": { S: "Infantil mañana" },
  "11:00": { S: "Adultos prueba" },
}

const HOURS = ["10:00", "11:00", "16:00", "17:00", "18:00", "19:00", "20:00"]

const GROUP_COLOR: Record<string, string> = {
  "Infantil A": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  "Infantil B": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  "Infantil C": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  "Infantil mañana": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  "Adultos Inic.": "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "Adultos Inter.": "bg-[#3a7d44]/20 text-[#3a7d44] border-[#3a7d44]/40",
  "Adultos Avz.": "bg-red-500/15 text-red-300 border-red-500/30",
  "Adultos prueba": "bg-white/10 text-[#f5f5f0]/80 border-white/15",
  "Femenino": "bg-[#e8d44d]/15 text-[#e8d44d] border-[#e8d44d]/30",
  "Competición": "bg-red-500/15 text-red-300 border-red-500/30",
}

export function WeeklySchedule() {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 sm:p-6 overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="text-left text-[10px] uppercase tracking-widest text-[#f5f5f0]/45 font-bold pb-3 px-2" scope="col">
              Hora
            </th>
            {DAYS.map((d) => (
              <th key={d} scope="col" className="text-center text-[10px] uppercase tracking-widest text-[#f5f5f0]/45 font-bold pb-3 px-2">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((h) => (
            <tr key={h} className="border-t border-white/5">
              <th
                scope="row"
                className="text-left text-[#f5f5f0]/70 font-bold tabular-nums py-2 px-2 align-middle"
              >
                {h}
              </th>
              {DAYS.map((d) => {
                const group = GRID[h]?.[d]
                if (!group) return <td key={d} className="px-1.5 py-1.5 text-center text-[#f5f5f0]/15">—</td>
                return (
                  <td key={d} className="px-1.5 py-1.5 text-center">
                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-semibold border whitespace-nowrap ${GROUP_COLOR[group] || "bg-white/5 text-[#f5f5f0]/80 border-white/10"}`}>
                      {group}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-[#f5f5f0]/45 mt-4">
        Horarios indicativos. Las plazas se confirman al inscribirse. Pregunta por la clase de prueba gratuita.
      </p>
    </div>
  )
}
