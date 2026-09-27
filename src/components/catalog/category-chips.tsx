import Link from "next/link"

import { cn } from "@/lib/utils"
import type { CatalogCategory } from "@/server/queries/catalog"

type CategoryChipsProps = {
  categories: CatalogCategory[]
  /** Slug de la catégorie affichée, ou null pour tout le catalogue. */
  current: string | null
}

const chipClass =
  "tactile inline-flex h-10 items-center rounded-full border-2 px-4 font-heading text-xs tracking-wide whitespace-nowrap uppercase outline-none [--ledge-depth:3px] focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"

export function CategoryChips({ categories, current }: CategoryChipsProps) {
  const items: { slug: string | null; name: string; href: string }[] = [
    { slug: null, name: "Tout", href: "/boutique" },
    ...categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      href: `/boutique/${category.slug}`,
    })),
  ]

  return (
    <nav aria-label="Catégories">
      <ul className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pt-1 pb-3 md:mx-0 md:flex-wrap md:px-0">
        {items.map((item) => {
          const active = item.slug === current
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  chipClass,
                  active
                    ? "border-primary bg-primary text-primary-foreground ledge-brand-deep"
                    : "border-edge bg-secondary text-foreground hover:border-primary hover:text-primary hover:ledge-brand-deep"
                )}
              >
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
