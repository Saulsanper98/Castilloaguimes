import type { ReactNode } from "react"

interface Props {
  title: string
  updatedAt: string
  children: ReactNode
}

/** Layout uniforme de documento legal con tipografía cuidada y modo dark. */
export function LegalDoc({ title, updatedAt, children }: Props) {
  return (
    <div>
      <h1
        className="text-[#f5f5f0] font-display font-black tracking-tight mb-2"
        style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", letterSpacing: "-0.02em" }}
      >
        {title}
      </h1>
      <p className="text-[#f5f5f0]/45 text-xs mb-8">Última actualización: {updatedAt}</p>
      <div className="space-y-5 text-[#f5f5f0]/75 text-sm leading-relaxed [&_h2]:text-[#f5f5f0] [&_h2]:font-display [&_h2]:font-black [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-[#f5f5f0] [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-[#3a7d44] [&_a]:underline-offset-2 hover:[&_a]:underline [&_strong]:text-[#f5f5f0]">
        {children}
      </div>
    </div>
  )
}
