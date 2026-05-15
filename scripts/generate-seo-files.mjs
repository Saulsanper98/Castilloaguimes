/**
 * Genera public/sitemap.xml y public/robots.txt antes del build (output: export).
 * Dominio: NEXT_PUBLIC_SITE_URL o fallback.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://padelcastillodeaguimes.com").replace(/\/$/, "")

const staticPaths = [
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
]

const noticias = JSON.parse(readFileSync(join(root, "data/noticias.json"), "utf8"))
const lastmod = "2026-05-15"

const urls = [
  ...staticPaths.map((loc) => ({ loc: `${BASE}${loc}`, lastmod })),
  ...noticias.map((n) => ({
    loc: `${BASE}/noticias/${n.slug}`,
    lastmod: n.fecha || lastmod,
  })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.loc === `${BASE}/` ? "1.0" : u.loc.includes("/noticias/") ? "0.65" : "0.85"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

const robots = `User-agent: *
Allow: /

Sitemap: ${BASE}/sitemap.xml
Host: ${new URL(BASE).host}
`

writeFileSync(join(root, "public/sitemap.xml"), sitemap, "utf8")
writeFileSync(join(root, "public/robots.txt"), robots, "utf8")
console.log("SEO: wrote public/sitemap.xml and public/robots.txt for", BASE)
