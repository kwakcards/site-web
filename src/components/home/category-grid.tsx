import Link from "next/link"

import { CardTrio } from "@/components/brand/card-trio"
import { SectionHeading } from "@/components/home/section-heading"
import { getCategories } from "@/server/queries/catalog"

export async function CategoryGrid() {
  const categories = await getCategories()
  if (categories.length === 0) return null

  return (
    <section
      aria-labelledby="categories-title"
      className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6"
    >
      <SectionHeading id="categories-title" eyebrow="Explorer" title="Les catégories" />
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/boutique/${category.slug}`}
              className="group relative flex h-full min-h-36 tactile flex-col justify-end overflow-hidden rounded-xl border-2 border-edge bg-card p-4 outline-none hover:border-primary hover:ledge-brand-deep focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ledge-brand-deep"
            >
              <CardTrio className="absolute -top-2 -right-4 w-24 rotate-6 opacity-20 transition group-hover:opacity-40 motion-reduce:transition-none" />
              <span className="relative font-heading text-sm uppercase">{category.name}</span>
              {category.description && (
                <span className="relative mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {category.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
