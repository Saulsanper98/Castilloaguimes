import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
/** Vercel define VERCEL=1 en build y runtime; GitHub Pages no. */
const isVercel = process.env.VERCEL === "1";
/** Debe coincidir con el nombre del repo en GitHub (segmento de la URL de Pages). */
const repoName = "Castilloaguimes";

const useGitHubPagesBase = isProd && !isVercel;

/**
 * `output: "export"` genera solo `out/` y NO deja el manifiesto que el preset Next de Vercel
 * espera en `.next/` → error "routes-manifest" al desplegar.
 * En Vercel usamos build estándar (SSG donde aplique); en GitHub Pages seguimos con export estático.
 */
const nextConfig: NextConfig = {
  ...(isVercel ? {} : { output: "export" as const }),
  images: { unoptimized: !isVercel },
  trailingSlash: true,
  basePath: useGitHubPagesBase ? `/${repoName}` : "",
  assetPrefix: useGitHubPagesBase ? `/${repoName}/` : "",
};

export default nextConfig;
