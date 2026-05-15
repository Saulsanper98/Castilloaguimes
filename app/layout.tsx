import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    template: "Pádel Castillo de Agüimes | %s",
    default: "Pádel Castillo de Agüimes | El mayor indoor de pádel de Canarias",
  },
  description:
    "Complejo deportivo de pádel en Agüimes, Gran Canaria. 14 pistas cubiertas, escuela de pádel, torneos y más. El mayor centro indoor de pádel de Canarias.",
  keywords: ["pádel", "Agüimes", "Gran Canaria", "Canarias", "pistas pádel", "escuela pádel", "torneos"],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Pádel Castillo de Agüimes",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0a0a0a] text-[#f5f5f0] antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          position="bottom-right"
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
