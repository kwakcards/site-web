"use client"

import Link from "next/link"

import { Splash } from "@/components/brand/splash"
import { Button } from "@/components/ui/button"

export default function ShopError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <Splash className="w-20" />
      <h1 className="mt-6 font-display text-4xl text-primary">Oups !</h1>
      <p className="mt-4 text-muted-foreground">
        Une erreur inattendue est survenue. Réessaie dans un instant ; si le problème persiste,
        contacte-nous.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="cta" size="lg" onClick={reset}>
          Réessayer
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </section>
  )
}
