type JsonLdProps = {
  data: Record<string, unknown>
}

/**
 * Données structurées schema.org (JSON-LD), lues par les moteurs de recherche
 * et les agents IA. Le « < » est échappé pour empêcher toute injection de balise.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
