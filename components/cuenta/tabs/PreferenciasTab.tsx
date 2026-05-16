"use client"

import { toast } from "sonner"
import type { LucideIcon } from "lucide-react"
import { Bell, Globe, Eye, Mail } from "lucide-react"

import { Toggle } from "@/components/ui/Toggle"
import { CustomSelect } from "@/components/ui/CustomSelect"
import type { PlayerProfile } from "@/lib/player"

interface Props {
  profile: PlayerProfile
  onPatch: (patch: Partial<PlayerProfile>) => void
}

export function PreferenciasTab({ profile, onPatch }: Props) {
  function update(k: keyof PlayerProfile, v: PlayerProfile[keyof PlayerProfile]) {
    onPatch({ [k]: v } as Partial<PlayerProfile>)
    toast.success("Preferencia guardada")
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[#f5f5f0] font-display font-black text-xl">Preferencias</h2>
        <p className="text-[#f5f5f0]/55 text-xs">Personaliza tu experiencia y cómo te contactamos.</p>
      </div>

      {/* Notifications */}
      <Section icon={Bell} title="Notificaciones" description="Decide cómo quieres recibir avisos del club.">
        <div className="divide-y divide-white/5">
          <Toggle
            label="Email"
            description="Resumen semanal, confirmaciones de reserva y noticias importantes."
            checked={profile.notifEmail}
            onChange={(v) => update("notifEmail", v)}
          />
          <Toggle
            label="Notificaciones push"
            description="Disponible cuando la app oficial del club esté publicada. Mientras tanto, usa email o WhatsApp en recepción."
            checked={profile.notifPush}
            disabled
            onChange={() =>
              toast("Aún no disponible", {
                description: "Activable cuando lancemos la app oficial del club.",
              })
            }
          />
          <Toggle
            label="WhatsApp"
            description="Avisos por WhatsApp desde la web: en preparación. Indica tu preferencia y lo tendremos en cuenta al migrar a la app."
            checked={profile.notifWhatsapp}
            onChange={(v) => update("notifWhatsapp", v)}
          />
        </div>
      </Section>

      {/* Privacy */}
      <Section icon={Eye} title="Privacidad" description="Control sobre cómo te ven otros socios.">
        <Toggle
          label="Perfil público"
          description="Otros socios pueden verte en partidos abiertos y enviarte invitaciones."
          checked={profile.publicProfile}
          onChange={(v) => update("publicProfile", v)}
        />
      </Section>

      {/* Language */}
      <Section icon={Globe} title="Idioma" description="Idioma en el que prefieres ver la web y recibir emails.">
        <div className="max-w-xs">
          <CustomSelect
            value={profile.language}
            options={[
              { value: "es", label: "Español" },
              { value: "en", label: "English" },
              { value: "de", label: "Deutsch" },
            ]}
            onChange={(v) => update("language", v as PlayerProfile["language"])}
            ariaLabel="Idioma"
          />
        </div>
      </Section>

      {/* Newsletter */}
      <Section icon={Mail} title="Newsletter" description="Una vez por semana, lo importante del club.">
        <Toggle
          label="Recibir newsletter"
          description="Eventos, ofertas de bonos, calendario de la escuela. Sin spam."
          checked={profile.newsletter}
          onChange={(v) => update("newsletter", v)}
        />
      </Section>
    </div>
  )
}

interface SectionProps {
  icon: LucideIcon
  title: string
  description?: string
  children: React.ReactNode
}

function Section({ icon: Icon, title, description, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#3a7d44]/15 border border-[#3a7d44]/30 flex items-center justify-center shrink-0">
          <Icon size={15} className="text-[#3a7d44]" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-[#f5f5f0] font-display font-black text-base sm:text-lg leading-tight">
            {title}
          </h3>
          {description && <p className="text-[#f5f5f0]/55 text-xs mt-0.5">{description}</p>}
        </div>
      </div>
      <div>{children}</div>
    </section>
  )
}
