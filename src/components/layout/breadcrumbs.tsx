import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

export type Crumb = { label: string; href?: string }

/** Fil d'Ariane : le dernier élément est la page courante (non cliquable). */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn("text-sm text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(last && "text-foreground")}
                >
                  {item.label}
                </span>
              )}
              {!last && <ChevronRightIcon aria-hidden="true" className="size-3.5" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
