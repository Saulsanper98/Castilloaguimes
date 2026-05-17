"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Check, Save, RefreshCw } from "lucide-react"
import { CustomSelect } from "@/components/ui/CustomSelect"
import { InfoTooltip } from "@/components/ui/InfoTooltip"
import { MemberCard } from "@/components/cuenta/MemberCard"
import { eloPercentile, type PlayerLevel, type DominantHand, type CourtPosition, type PlayerProfile } from "@/lib/player"

interface Props {
  profile: PlayerProfile
  onPatch: (patch: Partial<PlayerProfile>) => void
}

const LEVEL_OPTS: Array<{ value: PlayerLevel; label: string; hint: string }> = [
  { value: "Iniciación", label: "Iniciación", hint: "Sin experiencia o primeras clases" },
  { value: "Intermedio", label: "Intermedio", hint: "Dominas los golpes básicos" },
  { value: "Avanzado", label: "Avanzado", hint: "Técnica depurada y juego competitivo" },
]
const HAND_OPTS: Array<{ value: DominantHand; label: string }> = [
  { value: "diestra", label: "Diestra" },
  { value: "zurda", label: "Zurda" },
]
const POSITION_OPTS: Array<{ value: CourtPosition; label: string; hint: string }> = [
  { value: "drive", label: "Drive", hint: "Lado derecho de la pista (si eres diestro)" },
  { value: "reves", label: "Revés", hint: "Lado izquierdo de la pista (si eres diestro)" },
  { value: "indistinto", label: "Indistinto", hint: "Te adaptas a cualquier lado" },
]

export function PerfilTab({ profile, onPatch }: Props) {
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? "",
    birthDate: profile.birthDate ?? "",
    gender: profile.gender ?? "",
    bio: profile.bio ?? "",
    level: profile.level,
    hand: profile.hand,
    position: profile.position,
  })
  const [savedField, setSavedField] = useState<string | null>(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone ?? "",
        birthDate: profile.birthDate ?? "",
        gender: profile.gender ?? "",
        bio: profile.bio ?? "",
        level: profile.level,
        hand: profile.hand,
        position: profile.position,
      })
    )
    return () => cancelAnimationFrame(raf)
  }, [profile])

  const dirty =
    form.name !== profile.name ||
    form.email !== profile.email ||
    form.phone !== (profile.phone ?? "") ||
    form.birthDate !== (profile.birthDate ?? "") ||
    form.gender !== (profile.gender ?? "") ||
    form.bio !== (profile.bio ?? "") ||
    form.level !== profile.level ||
    form.hand !== profile.hand ||
    form.position !== profile.position

  const emailValid = form.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const canSave = dirty && emailValid

  function save() {
    if (!emailValid) {
      toast.error("Email no válido", { description: "Revisa la dirección e inténtalo de nuevo." })
      return
    }
    const parts = form.name.trim().split(/\s+/).filter(Boolean)
    const initials =
      parts.length === 0
        ? "IN"
        : parts.length === 1
          ? form.name.slice(0, 2).toUpperCase()
          : parts
              .slice(0, 2)
              .map((p) => p[0])
              .join("")
              .toUpperCase()
    onPatch({
      name: form.name || "Invitado",
      initials,
      email: form.email,
      phone: form.phone,
      birthDate: form.birthDate,
      gender: form.gender ? (form.gender as "M" | "F" | "X") : undefined,
      bio: form.bio,
      level: form.level,
      hand: form.hand,
      position: form.position,
    })
    setSavedField("all")
    toast.success("Perfil actualizado")
    setTimeout(() => setSavedField(null), 2200)
  }

  const percentile = eloPercentile(profile.elo)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      {/* Main column */}
      <div className="space-y-5">
        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-[#f5f5f0] font-display font-black text-xl mb-1">Datos personales</h2>
          <p className="text-[#f5f5f0]/55 text-xs mb-5">
            Solo tu nombre y nivel son visibles para otros socios. El resto es privado.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="prof-name"
              label="Nombre completo"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              autoComplete="name"
            />
            <Field
              id="prof-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              autoComplete="email"
              error={!emailValid && form.email !== "" ? "Email no válido" : undefined}
            />
            <Field
              id="prof-phone"
              label="Teléfono"
              type="tel"
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              autoComplete="tel"
              placeholder="+34 ···"
            />
            <Field
              id="prof-birth"
              label="Fecha de nacimiento"
              type="date"
              value={form.birthDate}
              onChange={(v) => setForm((f) => ({ ...f, birthDate: v }))}
            />
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-1.5">
                Género
              </label>
              <CustomSelect
                value={form.gender || ""}
                options={[
                  { value: "", label: "Prefiero no decir" },
                  { value: "M", label: "Masculino" },
                  { value: "F", label: "Femenino" },
                  { value: "X", label: "No binario" },
                ]}
                onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                ariaLabel="Género"
              />
            </div>
            <div>
              <label htmlFor="prof-bio" className="block text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-1.5">
                Sobre ti
              </label>
              <textarea
                id="prof-bio"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={2}
                maxLength={160}
                placeholder="Una línea o dos: cuándo juegas, qué buscas…"
                className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none transition-colors resize-none placeholder:text-[#f5f5f0]/35"
              />
              <p className="text-[10px] text-[#f5f5f0]/45 mt-1 text-right tabular-nums">
                {form.bio.length}/160
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-[#f5f5f0] font-display font-black text-xl mb-1">Datos de juego</h2>
          <p className="text-[#f5f5f0]/55 text-xs mb-5">
            Información que ayuda a otros jugadores a saber si encajáis en la pista.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-1.5">
                Nivel
                <InfoTooltip text="Nos sirve para emparejarte con jugadores de tu nivel en partidos abiertos." />
              </label>
              <CustomSelect
                value={form.level}
                options={LEVEL_OPTS}
                onChange={(v) => setForm((f) => ({ ...f, level: v }))}
                ariaLabel="Nivel"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-1.5">
                Mano dominante
              </label>
              <CustomSelect
                value={form.hand}
                options={HAND_OPTS}
                onChange={(v) => setForm((f) => ({ ...f, hand: v }))}
                ariaLabel="Mano dominante"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-1.5">
                Posición
              </label>
              <CustomSelect
                value={form.position}
                options={POSITION_OPTS}
                onChange={(v) => setForm((f) => ({ ...f, position: v }))}
                ariaLabel="Posición"
              />
            </div>
          </div>
        </section>

        {/* ELO context block */}
        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-[#f5f5f0] font-display font-black text-xl">Tu nivel competitivo</h2>
            <InfoTooltip text="Tu ELO se calcula con los resultados oficiales de partidos. Empezamos en 1450 y se mueve según juegues." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Stat label="ELO actual" value={profile.elo.toString()} accent />
            <Stat label="Percentil del club" value={`Top ${100 - percentile}%`} />
            <Stat label="Diferencia 6m" value={`${profile.eloHistory[profile.eloHistory.length - 1] - profile.eloHistory[0] >= 0 ? "+" : ""}${profile.eloHistory[profile.eloHistory.length - 1] - profile.eloHistory[0]}`} />
          </div>
        </section>

        {/* Save bar */}
        <div className="sticky bottom-3 z-20 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-2xl shadow-black/40 transition-all ${
              canSave
                ? "bg-[#3a7d44] hover:bg-[#4a9d54] text-white"
                : "bg-white/10 text-[#f5f5f0]/40 cursor-not-allowed"
            }`}
          >
            {savedField === "all" ? <Check size={14} aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
            {savedField === "all"
              ? "Guardado"
              : !emailValid && form.email !== ""
                ? "Revisa el email"
                : dirty
                  ? "Guardar cambios"
                  : "Sin cambios"}
          </button>
        </div>
      </div>

      {/* Aside: member card */}
      <aside className="space-y-4">
        <MemberCard
          name={profile.name}
          initials={profile.initials}
          avatarColor={profile.avatarColor}
          memberCode={profile.memberCode}
          level={profile.level}
          elo={profile.elo}
          loyaltyPoints={profile.loyaltyPoints}
          joinedAt={profile.joinedAt}
        />
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#3a7d44] mb-1">
            Tarjeta digital
          </p>
          <p className="text-[#f5f5f0]/65 text-xs leading-relaxed mb-3">
            Enseña este QR en recepción y en el torno de acceso. Si la pierdes, regenérala desde aquí.
          </p>
          <button
            type="button"
            onClick={() => {
              onPatch({ memberCode: `PCDC-${Date.now().toString(36).toUpperCase().slice(-6)}` })
              toast.success("Tarjeta regenerada", {
                description: "Tu QR anterior ha quedado invalidado.",
              })
            }}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3a7d44] hover:text-[#4a9d54] border border-[#3a7d44]/40 hover:border-[#3a7d44]/60 px-3 py-1.5 rounded-lg"
          >
            <RefreshCw size={11} aria-hidden="true" />
            Regenerar QR
          </button>
        </div>
      </aside>
    </div>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  autoComplete?: string
  error?: string
}

function Field({ id, label, value, onChange, type = "text", placeholder, autoComplete, error }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full bg-[#1a1a1a] border text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none transition-colors placeholder:text-[#f5f5f0]/35 ${
          error
            ? "border-red-500/50 focus:border-red-400"
            : "border-white/10 focus:border-[#3a7d44]/60"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[10px] text-red-400 font-semibold">
          {error}
        </p>
      )}
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent ? "bg-[#3a7d44]/10 border-[#3a7d44]/40" : "bg-[#1a1a1a] border-white/5"
      }`}
    >
      <p className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55">{label}</p>
      <p className={`font-display font-black text-2xl tabular-nums leading-tight ${accent ? "text-[#3a7d44]" : "text-[#f5f5f0]"}`}>
        {value}
      </p>
    </div>
  )
}
