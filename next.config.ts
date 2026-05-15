import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
/** Vercel define VERCEL=1 en build y runtime; GitHub Pages no. */
const isVercel = process.env.VERCEL === "1";
/** Debe coincidir con el nombre del repo en GitHub (segmento de la URL de Pages). */
const repoName = "Castilloaguimes";

const useGitHubPagesBase = isProd && !isVercel;

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: useGitHubPagesBase ? `/${repoName}` : "",
  assetPrefix: useGitHubPagesBase ? `/${repoName}/` : "",
};

export default nextConfig;
