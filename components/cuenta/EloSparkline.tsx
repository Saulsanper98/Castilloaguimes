interface Props {
  data: number[]
  width?: number
  height?: number
  ariaLabel?: string
}

/** Sparkline minimalista (sin librerías). Trace + área degradada. */
export function EloSparkline({ data, width = 220, height = 60, ariaLabel = "Evolución ELO" }: Props) {
  if (data.length === 0) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = data.length > 1 ? width / (data.length - 1) : 0

  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * height
    return [x, y] as const
  })

  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(" ")
  const areaPath =
    points.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ") +
    ` L ${width} ${height} L 0 ${height} Z`

  const last = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${width} ${height + 4}`}
      width="100%"
      height={height + 4}
      role="img"
      aria-label={ariaLabel}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a7d44" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3a7d44" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark-fill)" />
      <path d={linePath} fill="none" stroke="#3a7d44" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill="#e8d44d" stroke="#0a0a0a" strokeWidth="1.5" />
    </svg>
  )
}
