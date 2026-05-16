/** URL canónica del sitio (SEO, sitemap, JSON-LD). Override en Vercel: NEXT_PUBLIC_SITE_URL */
export const SITE_URL =
  (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://padelcastillodeaguimes.com"

/** Google Maps: ruta hasta el club (CTA «Cómo llegar»). */
export const GOOGLE_MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=C%2F+Pino+10%2C+Pol%C3%ADgono+Industrial+Arinaga%2C+Ag%C3%BCimes"
