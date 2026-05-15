import { SITE_URL } from "@/lib/site"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "@id": `${SITE_URL}/#club`,
  name: "Pádel Castillo de Agüimes",
  description:
    "Complejo indoor de pádel en Agüimes, Gran Canaria. 14 pistas cubiertas, escuela de pádel, torneos y reservas online.",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.svg`,
  telephone: "+34-928-753-650",
  email: "recepcioncdca@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "C/ Pino nº10, P.I. Arinaga",
    addressLocality: "Agüimes",
    addressRegion: "Las Palmas",
    postalCode: "35118",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 27.866,
    longitude: -15.397,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:00", closes: "20:00" },
  ],
  priceRange: "€€",
  sameAs: ["https://www.facebook.com", "https://www.instagram.com"],
}

export function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
