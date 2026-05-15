/** URL canónica del sitio (SEO, sitemap, JSON-LD). Override en Vercel: NEXT_PUBLIC_SITE_URL */
export const SITE_URL =
  (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://padelcastillodeaguimes.com"
