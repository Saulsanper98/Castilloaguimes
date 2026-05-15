interface Props {
  initials: string
  color: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const SIZES = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 sm:w-24 sm:h-24 text-2xl sm:text-3xl",
}

export function Avatar({ initials, color, size = "md", className = "" }: Props) {
  return (
    <span
      className={`relative rounded-full flex items-center justify-center text-white font-display font-black shrink-0 shadow-lg ${SIZES[size]} ${className}`}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc 60%, ${color}88)` }}
      aria-hidden="true"
    >
      {/* Subtle ring */}
      <span className="absolute inset-0 rounded-full ring-2 ring-white/10" />
      <span className="relative">{initials}</span>
    </span>
  )
}
