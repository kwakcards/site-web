import Image from "next/image"
import Link from "next/link"

import { CardTrio } from "@/components/brand/card-trio"
import { SectionHeading } from "@/components/home/section-heading"
import { categoryImage } from "@/lib/category-image"
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
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {categories.map((category) => {
          const image = categoryImage(category.slug)
          return (
            <li key={category.id}>
              <Link
                href={`/boutique/${category.slug}`}
                className="group flex h-full tactile flex-col overflow-hidden rounded-xl border-2 border-edge bg-card outline-none hover:border-primary hover:ledge-brand-deep focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ledge-brand-deep"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-background">
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : (
                    <CardTrio className="absolute inset-0 m-auto w-1/2 opacity-30" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <span className="font-heading text-sm uppercase">{category.name}</span>
                  {category.description && (
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {category.description}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
