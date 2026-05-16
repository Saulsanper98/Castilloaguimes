import type { Metadata } from "next"
import HeroSection from "@/components/home/HeroSection"
import { SpecialEventBanner } from "@/components/home/SpecialEventBanner"
import StatsBar from "@/components/home/StatsBar"
import ServicesGrid from "@/components/home/ServicesGrid"
import ScheduleSection from "@/components/home/ScheduleSection"
import NewsSection from "@/components/home/NewsSection"
import AppDownloadSection from "@/components/home/AppDownloadSection"
import { SocialTestimonials } from "@/components/home/SocialTestimonials"
import { FindUsBlock } from "@/components/home/FindUsBlock"

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Pádel Castillo de Agüimes — El mayor complejo indoor de pádel de Canarias. 14 pistas cubiertas, escuela de pádel, campeonatos y reservas online.",
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesGrid />
      <ScheduleSection />
      <SocialTestimonials />
      <NewsSection />
      <SpecialEventBanner />
      <FindUsBlock />
      <AppDownloadSection />
    </>
  )
}
