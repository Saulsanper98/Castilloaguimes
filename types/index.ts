export interface Noticia {
  id: number
  slug: string
  titulo: string
  resumen: string
  contenido: string
  fecha: string
  imagen: string
  categoria: "Torneos" | "Escuela" | "Instalaciones" | "Club"
}

export interface Partido {
  id: number
  fecha: string
  hora: string
  pista: string
  nivel: "Iniciación" | "Intermedio" | "Avanzado"
  plazasTotal: number
  plazasOcupadas: number
  precio: number
  descripcion: string
}

export interface Campeonato {
  id: number
  nombre: string
  fecha: string
  tipo: "Americano" | "Liga" | "Open"
  plazas: number
  plazasOcupadas: number
  precio: number
  descripcion: string
  estado: "Inscripción abierta" | "Completo" | "Finalizado"
  imagen: string
}
