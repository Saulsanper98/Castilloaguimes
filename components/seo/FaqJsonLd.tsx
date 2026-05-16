import { FAQ_GROUPS } from "@/data/faq"

export function FaqJsonLd() {
  const entities = FAQ_GROUPS.flatMap((g) =>
    g.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: i.a,
      },
    }))
  )
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entities,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
