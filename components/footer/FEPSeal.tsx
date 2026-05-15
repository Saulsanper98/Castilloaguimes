export function FEPSeal() {
  return (
    <div className="flex items-center gap-3 text-[#f5f5f0]/60 text-xs">
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true" className="shrink-0">
        <circle cx="20" cy="20" r="19" fill="none" stroke="#e8d44d" strokeWidth="1.5" strokeDasharray="2 3" />
        <circle cx="20" cy="20" r="14" fill="#0a0a0a" stroke="#3a7d44" strokeWidth="1.2" />
        <text
          x="20"
          y="17"
          textAnchor="middle"
          fontSize="6"
          fontWeight="800"
          fill="#e8d44d"
          fontFamily="system-ui, sans-serif"
          letterSpacing="1.2"
        >
          OFICIAL
        </text>
        <text
          x="20"
          y="25"
          textAnchor="middle"
          fontSize="8"
          fontWeight="800"
          fill="#3a7d44"
          fontFamily="system-ui, sans-serif"
        >
          FEP
        </text>
        <text
          x="20"
          y="31"
          textAnchor="middle"
          fontSize="3.5"
          fontWeight="600"
          fill="#f5f5f0"
          fillOpacity="0.65"
          fontFamily="system-ui, sans-serif"
        >
          afiliado
        </text>
      </svg>
      <div>
        <p className="text-[#f5f5f0]/80 font-bold text-[11px] leading-tight">Club afiliado FEP</p>
        <p className="text-[10px] leading-tight">Federación Española de Pádel</p>
      </div>
    </div>
  )
}
