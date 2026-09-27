import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: string
  link?: { href: string; label: string }
}

/** Titre de section de la vitrine : surtitre, titre façon pinceau, lien optionnel. */
export function SectionHeading({ id, eyebrow, title, link }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-heading text-xs tracking-[0.25em] text-primary uppercase">{eyebrow}</p>
        <h2 id={id} className="mt-2 font-display text-3xl md:text-4xl">
          {title}
        </h2>
      </div>
      {link && (
        <Button asChild variant="cta-outline" size="sm">
          <Link href={link.href}>
            {link.label}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      )}
    </div>
  )
}
