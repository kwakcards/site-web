import { formatPrice, savingsCents } from "@/lib/money"
import { cn } from "@/lib/utils"

type PriceTagProps = {
  priceCents: number
  compareAtPriceCents?: number | null
  /** Affiche « À partir de » (produit décliné en plusieurs prix). */
  fromPrice?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const priceSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-3xl",
} as const

export function PriceTag({
  priceCents,
  compareAtPriceCents,
  fromPrice = false,
  size = "md",
  className,
}: PriceTagProps) {
  const discounted = savingsCents(priceCents, compareAtPriceCents) > 0

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      {fromPrice && <span className="text-xs text-muted-foreground">À partir de</span>}
      <span className={cn("font-heading text-primary", priceSizes[size])}>
        {formatPrice(priceCents)}
      </span>
      {discounted && compareAtPriceCents != null && (
        <s className="text-sm text-muted-foreground">
          <span className="sr-only">au lieu de </span>
          {formatPrice(compareAtPriceCents)}
        </s>
      )}
    </p>
  )
}
