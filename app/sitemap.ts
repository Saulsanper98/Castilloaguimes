import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import noticias from "@/data/noticias.json"

export const dynamic = "force-static"

const base = SITE_URL.replace(/\/$/, "")

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/reservas",
    "/partidos-abiertos",
    "/partidos-abiertos/crear",
    "/escuela",
    "/campeonatos",
    "/instalaciones",
    "/noticias",
    "/tarifas",
    "/contacto",
    "/cuenta",
    "/legal",
    "/legal/privacidad",
    "/legal/aviso-legal",
    "/legal/cookies",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }))

  const newsRoutes: MetadataRoute.Sitemap = noticias.map((n) => ({
    url: `${base}/noticias/${n.slug}`,
    lastModified: new Date(n.fecha),
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  return [...staticRoutes, ...newsRoutes]
}
