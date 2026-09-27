import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type PaginationProps = {
  page: number
  pageCount: number
  /** URL de la page n (les filtres en cours sont conservés). */
  hrefFor: (page: number) => string
}

/** Pages affichées autour de la page courante, avec des « … » entre les trous. */
export function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1])
  const sorted = [...pages].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b)
  const result: (number | "gap")[] = []
  sorted.forEach((n, index) => {
    if (index > 0 && n - sorted[index - 1] > 1) result.push("gap")
    result.push(n)
  })
  return result
}

const itemClass =
  "tactile inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-lg border-2 px-3 font-heading text-xs tracking-wide uppercase outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
const idleClass =
  "border-edge bg-secondary text-foreground hover:border-primary hover:text-primary hover:ledge-brand-deep"

export function Pagination({ page, pageCount, hrefFor }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-10">
      <ul className="flex flex-wrap items-center justify-center gap-2.5">
        <li>
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} className={cn(itemClass, idleClass)}>
              <ChevronLeftIcon aria-hidden="true" className="size-4" />
              Précédente
            </Link>
          ) : null}
        </li>
        {pageWindow(page, pageCount).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  itemClass,
                  item === page
                    ? "border-primary bg-primary text-primary-foreground ledge-brand-deep"
                    : idleClass
                )}
              >
                {item}
              </Link>
            </li>
          )
        )}
        <li>
          {page < pageCount ? (
            <Link href={hrefFor(page + 1)} className={cn(itemClass, idleClass)}>
              Suivante
              <ChevronRightIcon aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </li>
      </ul>
    </nav>
  )
}
