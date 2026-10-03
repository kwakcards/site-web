import { cardConditions, languageLabel } from "@/config/catalog"
import { formatGrade, type ProductDetail } from "@/server/queries/catalog"

/**
 * Caractéristiques de la fiche produit ; seules les valeurs renseignées sont affichées
 * et la section disparaît s'il n'y en a aucune (accessoires, par exemple).
 */
export function ProductSpecs({ product }: { product: ProductDetail }) {
  const condition = cardConditions.find((item) => item.code === product.condition)

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Jeu", value: product.game },
    { label: "Extension", value: product.set_name },
    { label: "Numéro", value: product.card_number },
    { label: "Langue", value: languageLabel(product.language) },
    { label: "Rareté", value: product.rarity },
    {
      label: "Gradation",
      value:
        product.is_graded && product.grading_company
          ? `${product.grading_company}${product.grade != null ? ` ${formatGrade(product.grade)}/10` : ""}`
          : null,
    },
    {
      label: "État",
      value: condition ? (
        <>
          <span className="font-medium text-foreground">
            {condition.label} ({condition.code})
          </span>
          <span className="mt-0.5 block text-muted-foreground">{condition.description}</span>
        </>
      ) : (
        product.condition
      ),
    },
  ].filter((row) => row.value)

  if (rows.length === 0) return null

  return (
    <section aria-labelledby="specs-title">
      <h2 id="specs-title" className="font-heading text-sm uppercase">
        Caractéristiques
      </h2>
      <dl className="mt-2 divide-y divide-border rounded-xl border border-border bg-card text-sm">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[7rem_1fr] gap-3 px-4 py-3">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
