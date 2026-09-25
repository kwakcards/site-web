import type { Metadata } from "next"
import Link from "next/link"

import { CardTrio } from "@/components/brand/card-trio"
import { SiteShell } from "@/components/layout/site-shell"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <CardTrio className="w-32" />
        <p className="mt-8 font-heading text-sm tracking-[0.3em] text-muted-foreground uppercase">
          Erreur 404
        </p>
        <h1 className="mt-2 font-display text-4xl text-primary md:text-5xl">Carte introuvable</h1>
        <p className="mt-4 text-muted-foreground">
          Cette page n&apos;existe pas ou plus. Elle a peut-être rejoint la collection de
          quelqu&apos;un d&apos;autre.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="cta" size="lg">
            <Link href="/boutique">Voir le catalogue</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Accueil</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  )
}
