"use client"

import { useEffect, useRef, useState } from "react"
import { X, Send } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface Message {
  id: number
  author: string
  initials: string
  color: string
  text: string
  ts: number
  own?: boolean
}

const COLORS = ["bg-[#3a7d44]", "bg-blue-600", "bg-purple-600", "bg-orange-600"]

const SEED_MSGS: Record<number, Message[]> = {}

function seedFor(matchId: number): Message[] {
  if (SEED_MSGS[matchId]) return SEED_MSGS[matchId]
  const base = [
    { author: "Marcos G.", initials: "MG", text: "¡Hola! ¿Llevamos pelotas nuevas?" },
    { author: "Ana R.", initials: "AR", text: "Yo llevo un bote sin abrir 👌" },
    { author: "Juanjo L.", initials: "JL", text: "Confirmado, allí a las y media." },
  ]
  SEED_MSGS[matchId] = base.map((m, i) => ({
    id: i,
    ...m,
    color: COLORS[i % COLORS.length],
    ts: Date.now() - (3 - i) * 1000 * 60 * 30,
  }))
  return SEED_MSGS[matchId]
}

interface Props {
  matchId: number | null
  onClose: () => void
}

export function MatchChat({ matchId, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (matchId == null) return
    const raf = requestAnimationFrame(() => setMessages(seedFor(matchId)))
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(focusTimer)
    }
  }, [matchId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  function send() {
    const t = text.trim()
    if (!t || matchId == null) return
    const msg: Message = {
      id: Date.now(),
      author: "Tú",
      initials: "TÚ",
      color: "bg-[#e8d44d]",
      text: t,
      ts: Date.now(),
      own: true,
    }
    SEED_MSGS[matchId] = [...(SEED_MSGS[matchId] ?? []), msg]
    setMessages(SEED_MSGS[matchId])
    setText("")
  }

  return (
    <AnimatePresence>
      {matchId != null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Chat del partido"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-[#111111] sm:border sm:border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh] sm:h-[560px]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div>
                <h3 className="text-[#f5f5f0] font-bold text-sm">Chat del partido</h3>
                <p className="text-[#f5f5f0]/50 text-[10px]">Mensajes de los jugadores apuntados</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar chat"
                className="p-1 text-[#f5f5f0]/65 hover:text-[#f5f5f0] rounded hover:bg-white/5"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex items-start gap-2.5 ${m.own ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${m.color}`}>
                    {m.initials}
                  </div>
                  <div className={`max-w-[78%] ${m.own ? "items-end" : ""} flex flex-col`}>
                    <span className="text-[10px] text-[#f5f5f0]/45 mb-0.5">{m.author}</span>
                    <span
                      className={`px-3 py-2 rounded-2xl text-xs leading-snug ${
                        m.own
                          ? "bg-[#3a7d44] text-white rounded-tr-sm"
                          : "bg-white/5 text-[#f5f5f0]/90 rounded-tl-sm"
                      }`}
                    >
                      {m.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send() }}
              className="flex items-center gap-2 p-3 border-t border-white/10"
            >
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe un mensaje…"
                aria-label="Mensaje"
                className="flex-1 bg-[#1a1a1a] border border-white/10 focus:border-[#3a7d44]/60 rounded-xl px-3 py-2 text-sm text-[#f5f5f0] outline-none placeholder:text-[#f5f5f0]/30"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                aria-label="Enviar mensaje"
                className="w-10 h-10 rounded-xl bg-[#3a7d44] hover:bg-[#4a9d54] disabled:opacity-40 text-white flex items-center justify-center transition-colors"
              >
                <Send size={14} aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
