"use client"

interface Props {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
  id?: string
}

export function Toggle({ checked, onChange, label, description, id }: Props) {
  const inputId = id ?? `toggle-${label.toLowerCase().replace(/\s+/g, "-")}`
  return (
    <label
      htmlFor={inputId}
      className="flex items-start justify-between gap-4 cursor-pointer py-3"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[#f5f5f0] font-semibold text-sm">{label}</span>
        {description && (
          <span className="block text-[#f5f5f0]/55 text-xs mt-0.5 leading-relaxed">{description}</span>
        )}
      </span>
      <span className="relative shrink-0 mt-1">
        <input
          id={inputId}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          aria-hidden="true"
          className={`block w-10 h-6 rounded-full transition-colors ${
            checked ? "bg-[#3a7d44]" : "bg-white/10"
          }`}
        />
        <span
          aria-hidden="true"
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
    </label>
  )
}
