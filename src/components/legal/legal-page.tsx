import { TriangleAlertIcon } from "lucide-react"

import { legal, missingLegalInfo } from "@/config/legal"
import { formatDateFr } from "@/lib/dates"

export type LegalSection = {
  id: string
  title: string
  content: React.ReactNode
}

type LegalPageProps = {
  title: string
  /** Surtitre, « Informations légales » par défaut. */
  eyebrow?: string
  intro?: React.ReactNode
  sections: LegalSection[]
}

/** Avertissement affiché tant que des informations légales obligatoires manquent. */
function DraftNotice() {
  const missing = missingLegalInfo()
  if (missing.length === 0) return null

  return (
    <div
      role="note"
      className="mt-8 flex gap-3 rounded-xl border border-destructive/60 bg-destructive/10 p-4 text-sm"
    >
      <TriangleAlertIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
      <div>
        <p className="font-semibold">Document en cours de finalisation</p>
        <p className="mt-1 text-muted-foreground">
          Informations que le vendeur doit encore compléter avant l&apos;ouverture de la boutique :{" "}
          {missing.join(", ")}.
        </p>
      </div>
    </div>
  )
}

/**
 * Mise en page commune des documents légaux : titre, date de mise à jour,
 * sommaire (navigation clavier et lecteurs d'écran) et sections titrées.
 */
export function LegalPage({
  title,
  eyebrow = "Informations légales",
  intro,
  sections,
}: LegalPageProps) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <header>
        <p className="font-heading text-xs tracking-[0.25em] text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-primary md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Dernière mise à jour :{" "}
          <time dateTime={legal.updatedAt}>{formatDateFr(legal.updatedAt)}</time>
        </p>
        {intro && <div className="mt-6 text-base text-foreground/90">{intro}</div>}
      </header>

      <DraftNotice />

      {sections.length > 3 && (
        <nav aria-label="Sommaire" className="mt-8 rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xs tracking-wider text-primary uppercase">Sommaire</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm marker:text-muted-foreground">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="underline-offset-4 hover:text-primary hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="prose mt-10 max-w-none prose-invert prose-kwak prose-headings:font-heading prose-headings:tracking-tight prose-h2:text-xl prose-h2:uppercase prose-h3:text-base prose-a:underline-offset-4 prose-table:text-sm">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <h2>
              {sections.length > 3 && <span className="text-primary">{index + 1}. </span>}
              {section.title}
            </h2>
            {section.content}
          </section>
        ))}
      </div>
    </article>
  )
}
