import type { Metadata, Viewport } from "next"
import { Inter, Barlow_Condensed } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Toaster } from "sonner"
import { PromoBanner } from "@/components/layout/PromoBanner"
import { MobileFAB } from "@/components/layout/MobileFAB"
import { CommandPalette } from "@/components/layout/CommandPalette"
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd"
import { RouteLoader } from "@/components/effects/RouteLoader"
import { EasterEgg } from "@/components/effects/EasterEgg"
import { CookieBanner } from "@/components/layout/CookieBanner"
import { PageTransition } from "@/components/layout/PageTransition"
import { SITE_URL } from "@/lib/site"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Pádel Castillo de Agüimes",
    default: "Pádel Castillo de Agüimes — El mayor indoor de pádel de Canarias",
  },
  description:
    "Complejo deportivo de pádel en Agüimes, Gran Canaria. 14 pistas cubiertas, escuela de pádel, torneos y reservas online. El mayor centro indoor de pádel de Canarias.",
  keywords: [
    "pádel Agüimes",
    "pádel Gran Canaria",
    "pádel Canarias",
    "pistas pádel cubiertas",
    "escuela pádel",
    "torneos pádel",
    "Arinaga",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Pádel Castillo de Agüimes",
    title: "Pádel Castillo de Agüimes — El mayor indoor de pádel de Canarias",
    description:
      "14 pistas cubiertas, escuela, torneos y reserva online en el corazón de Gran Canaria.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Pádel Castillo de Agüimes — 14 pistas cubiertas en Gran Canaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pádel Castillo de Agüimes",
    description: "El mayor complejo indoor de pádel de Canarias. 14 pistas cubiertas.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`dark ${inter.variable} ${barlow.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.google.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0a0a0a] text-[#f5f5f0] font-sans antialiased">
        <LocalBusinessJsonLd />
        <a href="#main-content" className="skip-link">Saltar al contenido</a>
        <PromoBanner />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <MobileFAB />
        <CommandPalette />
        <RouteLoader />
        <EasterEgg />
        <CookieBanner />
        <Toaster
          theme="dark"
          position="top-center"
          richColors
          closeButton
          offset="80px"
          mobileOffset={{ top: "70px" }}
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f5f5f0",
            },
          }}
        />
      </body>
    </html>
  )
}
