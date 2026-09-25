import { Badge } from "@/components/ui/badge"
import { formatPrice, savingsCents } from "@/lib/money"
import { cn } from "@/lib/utils"

type ProductBadgesProps = {
  stock: number
  priceCents: number
  compareAtPriceCents?: number | null
  isNew?: boolean
  className?: string
}

export function ProductBadges({
  stock,
  priceCents,
  compareAtPriceCents,
  isNew = false,
  className,
}: ProductBadgesProps) {
  const soldOut = stock <= 0
  const savings = savingsCents(priceCents, compareAtPriceCents)

  if (!soldOut && savings === 0 && !isNew) return null

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {soldOut && (
        <Badge
          variant="secondary"
          className="border-border bg-background/90 font-heading uppercase"
        >
          En rupture
        </Badge>
      )}
      {!soldOut && savings > 0 && (
        <Badge className="font-heading uppercase">
          Économisez {formatPrice(savings, { compact: true })}
        </Badge>
      )}
      {!soldOut && isNew && (
        <Badge
          variant="outline"
          className="border-primary bg-background/90 font-heading text-primary uppercase"
        >
          Nouveau
        </Badge>
      )}
    </div>
  )
}
