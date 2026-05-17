import { FAQ_GROUPS } from "@/data/faq"

export interface FaqItem {
  q: string
  a: string
}

interface Props {
  /** Items personalizados. Si no se pasa, usa FAQ_GROUPS global. */
  items?: FaqItem[]
}

export function FaqJsonLd({ items }: Props = {}) {
  const list = items ?? FAQ_GROUPS.flatMap((g) => g.items)
  const entities = list.map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: i.a,
    },
  }))
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
