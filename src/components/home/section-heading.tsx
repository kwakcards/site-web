import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

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
        <Link
          href={link.href}
          className="inline-flex items-center gap-1.5 font-heading text-xs tracking-wide text-primary uppercase underline-offset-4 hover:underline"
        >
          {link.label}
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  )
}
