import Image from "next/image"
import Link from "next/link"

import { CardTrio } from "@/components/brand/card-trio"
import { PriceTag } from "@/components/product/price-tag"
import { ProductBadges } from "@/components/product/product-badges"
import { cn } from "@/lib/utils"

export type ProductCardProps = {
  href: string
  name: string
  /** Ligne d'infos sous le nom, ex. « Flammes Obsidiennes · FR · Near Mint ». */
  subtitle?: string | null
  imageUrl?: string | null
  imageAlt?: string
  priceCents: number
  compareAtPriceCents?: number | null
  stock: number
  isNew?: boolean
  fromPrice?: boolean
  /** Largeur affichée de l'image, pour next/image. */
  sizes?: string
  className?: string
}

export function ProductCard({
  href,
  name,
  subtitle,
  imageUrl,
  imageAlt,
  priceCents,
  compareAtPriceCents,
  stock,
  isNew = false,
  fromPrice = false,
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
  className,
}: ProductCardProps) {
  const soldOut = stock <= 0

  return (
    <article
      className={cn(
        "group relative flex tactile flex-col overflow-hidden rounded-xl border-2 border-edge bg-card",
        "hover:border-primary hover:ledge-brand-deep",
        "focus-within:border-primary focus-within:ledge-brand-deep has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
        className
      )}
    >
      <div className="relative aspect-[63/88] overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--brand-ink-raised),var(--brand-ink)_70%)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            sizes={sizes}
            className={cn(
              "object-contain p-3 transition duration-300 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100",
              soldOut && "opacity-50 grayscale"
            )}
          />
        ) : (
          <div className="grid h-full place-items-center">
            <CardTrio className="w-1/2 opacity-30" />
          </div>
        )}
        <ProductBadges
          className="absolute top-2 left-2"
          stock={stock}
          priceCents={priceCents}
          compareAtPriceCents={compareAtPriceCents}
          isNew={isNew}
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {subtitle && <p className="line-clamp-1 text-xs text-muted-foreground">{subtitle}</p>}
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {name}
          </Link>
        </h3>
        <PriceTag
          className="mt-auto pt-1"
          priceCents={priceCents}
          compareAtPriceCents={compareAtPriceCents}
          fromPrice={fromPrice}
          size="sm"
        />
      </div>
    </article>
  )
}
