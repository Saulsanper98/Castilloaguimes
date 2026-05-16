"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Lock, Smartphone, Monitor, AlertTriangle, Check, ShieldCheck } from "lucide-react"
import { Toggle } from "@/components/ui/Toggle"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import userSessions from "@/data/userSessions.json"
import type { PlayerProfile } from "@/lib/player"
import { clearProfile } from "@/lib/player"
import { getDemoCredentials } from "@/lib/auth"

interface Props {
  profile: PlayerProfile
  onPatch: (patch: Partial<PlayerProfile>) => void
  onLogout: () => void
}

type Session = (typeof userSessions)[number]

export function SeguridadTab({ profile, onPatch, onLogout }: Props) {
  const [current, setCurrent] = useState("")
  const [pwd, setPwd] = useState("")
  const [pwd2, setPwd2] = useState("")
  const [updating, setUpdating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmCloseAll, setConfirmCloseAll] = useState(false)
  const [sessions, setSessions] = useState<Session[]>(userSessions as Session[])

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!current || !pwd || !pwd2) {
      toast.error("Rellena todos los campos")
      return
    }
    if (current !== getDemoCredentials().password) {
      toast.error("La contraseña actual no es correcta")
      return
    }
    if (pwd.length < 8 || !/[A-Z]/.test(pwd) || !/\d/.test(pwd)) {
      toast.error("Mínimo 8 caracteres con una mayúscula y un número")
      return
    }
    if (pwd !== pwd2) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    setUpdating(true)
    await new Promise((r) => setTimeout(r, 600))
    setUpdating(false)
    setCurrent("")
    setPwd("")
    setPwd2("")
    toast.success("Contraseña actualizada", { description: "La próxima vez que entres usa la nueva." })
  }

  function toggle2fa(v: boolean) {
    onPatch({ twoFactorEnabled: v })
    toast.success(v ? "2FA activado" : "2FA desactivado")
  }

  function closeSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    toast("Sesión cerrada en ese dispositivo")
  }

  function closeAllOther() {
    setSessions((prev) => prev.filter((s) => s.current))
    setConfirmCloseAll(false)
    toast.success("Cerraste sesión en los demás dispositivos")
  }

  function deleteAccount() {
    clearProfile()
    setConfirmDelete(false)
    toast.success("Cuenta eliminada", { description: "Esperamos verte de nuevo." })
    onLogout()
  }

  // Password strength (very simple heuristic)
  const strength = (() => {
    if (!pwd) return 0
    let s = 0
    if (pwd.length >= 8) s++
    if (/[A-Z]/.test(pwd)) s++
    if (/[0-9]/.test(pwd)) s++
    if (/[^A-Za-z0-9]/.test(pwd)) s++
    return s
  })()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[#f5f5f0] font-display font-black text-xl">Seguridad</h2>
        <p className="text-[#f5f5f0]/55 text-xs">Protege tu cuenta y revisa tus sesiones activas.</p>
      </div>

      {/* Change password */}
      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#3a7d44]/15 border border-[#3a7d44]/30 flex items-center justify-center shrink-0">
            <Lock size={15} className="text-[#3a7d44]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-[#f5f5f0] font-display font-black text-base">Contraseña</h3>
            <p className="text-[#f5f5f0]/55 text-xs">Mínimo 8 caracteres con número y mayúscula.</p>
          </div>
        </div>
        <form onSubmit={changePassword} className="space-y-3 max-w-md">
          <Field id="cur-pwd" label="Contraseña actual" value={current} onChange={setCurrent} type="password" />
          <Field id="new-pwd" label="Nueva contraseña" value={pwd} onChange={setPwd} type="password" />
          {pwd && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all rounded-full"
                  style={{
                    width: `${(strength / 4) * 100}%`,
                    background: strength < 2 ? "#ef4444" : strength < 4 ? "#e8d44d" : "#3a7d44",
                  }}
                />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#f5f5f0]/55">
                {strength < 2 ? "Débil" : strength < 4 ? "Media" : "Fuerte"}
              </span>
            </div>
          )}
          <Field id="new-pwd2" label="Repetir nueva contraseña" value={pwd2} onChange={setPwd2} type="password" />
          <button
            type="submit"
            disabled={updating}
            className="inline-flex items-center gap-2 bg-[#3a7d44] hover:bg-[#4a9d54] disabled:opacity-60 text-white font-bold text-sm px-5 py-2.5 rounded-xl"
          >
            {updating ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} aria-hidden="true" />}
            {updating ? "Actualizando…" : "Actualizar contraseña"}
          </button>
        </form>
      </section>

      {/* 2FA */}
      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#3a7d44]/15 border border-[#3a7d44]/30 flex items-center justify-center shrink-0">
            <ShieldCheck size={15} className="text-[#3a7d44]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-[#f5f5f0] font-display font-black text-base">Verificación en dos pasos</h3>
            <p className="text-[#f5f5f0]/55 text-xs">Añade una capa extra de protección con tu app autenticadora.</p>
          </div>
        </div>
        <Toggle
          label={profile.twoFactorEnabled ? "2FA activado" : "Activar 2FA"}
          description={profile.twoFactorEnabled ? "Pedimos un código de tu app cada vez que inicies sesión." : "Recomendado para cuentas con saldo en wallet."}
          checked={profile.twoFactorEnabled}
          onChange={toggle2fa}
        />
      </section>

      {/* Sessions */}
      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3a7d44]/15 border border-[#3a7d44]/30 flex items-center justify-center shrink-0">
              <Monitor size={15} className="text-[#3a7d44]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-[#f5f5f0] font-display font-black text-base">Sesiones activas</h3>
              <p className="text-[#f5f5f0]/55 text-xs">Dispositivos en los que tu cuenta está abierta.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmCloseAll(true)}
            className="text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-300"
          >
            Cerrar otras
          </button>
        </div>
        <ul className="space-y-2.5">
          {sessions.map((s) => (
            <li
              key={s.id}
              className={`rounded-xl border p-3 flex items-center gap-3 ${
                s.current ? "border-[#3a7d44]/40 bg-[#3a7d44]/10" : "border-white/10 bg-[#1a1a1a]"
              }`}
            >
              <Smartphone size={14} className={s.current ? "text-[#3a7d44]" : "text-[#f5f5f0]/55"} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-[#f5f5f0] font-bold text-sm flex items-center gap-2">
                  {s.device}
                  {s.current && (
                    <span className="text-[9px] uppercase tracking-widest font-bold bg-[#3a7d44] text-white px-1.5 py-0.5 rounded-full">
                      Este equipo
                    </span>
                  )}
                </p>
                <p className="text-[#f5f5f0]/55 text-[11px]">
                  {s.location} · {s.ip} · {s.lastActive}
                </p>
              </div>
              {!s.current && (
                <button
                  type="button"
                  onClick={() => closeSession(s.id)}
                  className="text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 px-2.5 py-1.5 rounded-lg"
                >
                  Cerrar
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center shrink-0">
            <AlertTriangle size={15} className="text-red-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-[#f5f5f0] font-display font-black text-base">Zona peligrosa</h3>
            <p className="text-[#f5f5f0]/55 text-xs">Estas acciones no se pueden deshacer.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/40 hover:border-red-500/60 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-colors"
        >
          Eliminar mi cuenta
        </button>
      </section>

      <ConfirmDialog
        open={confirmDelete}
        title="¿Eliminar tu cuenta?"
        description="Perderás todas tus reservas, partidos, saldo wallet y puntos. Esta acción es definitiva."
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        destructive
        onConfirm={deleteAccount}
        onCancel={() => setConfirmDelete(false)}
      />
      <ConfirmDialog
        open={confirmCloseAll}
        title="Cerrar sesión en otros dispositivos"
        description="Mantendrás la sesión solo en este dispositivo."
        confirmLabel="Cerrar otras"
        cancelLabel="Cancelar"
        destructive
        onConfirm={closeAllOther}
        onCancel={() => setConfirmCloseAll(false)}
      />
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
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
        className="w-full bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 text-[#f5f5f0] text-sm rounded-xl px-3 py-2.5 outline-none transition-colors"
      />
    </div>
  )
}
