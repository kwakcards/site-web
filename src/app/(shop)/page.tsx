import Link from "next/link"

import { CardTrio } from "@/components/brand/card-trio"
import { Logo } from "@/components/brand/logo"
import { Splash } from "@/components/brand/splash"
import { Button } from "@/components/ui/button"
import { brand } from "@/config/brand"

// Accueil provisoire : la landing complète (carrousel, catégories, derniers
// ajouts, réassurance, newsletter) arrive en phase 3.
export default function HomePage() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,color-mix(in_oklab,var(--brand-yellow)_14%,transparent),transparent)]"
      />
      <CardTrio className="absolute -right-10 bottom-6 -z-10 w-56 rotate-6 opacity-10" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-[1.1fr_1fr] md:px-6 md:py-24">
        <div>
          <p className="flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-primary uppercase">
            <Splash className="w-6" />
            Boutique en ligne
          </p>
          <h1 className="mt-4 text-brand-gradient font-display text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
            Tes cartes, ta collection.
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
            {brand.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="cta" size="lg">
              <Link href="/boutique">Voir le catalogue</Link>
            </Button>
            <Button asChild variant="cta-outline" size="lg">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto hidden w-full max-w-md md:block">
          <Logo
            href={null}
            className="h-auto w-full drop-shadow-[0_20px_60px_rgb(248_192_40/0.25)]"
            sizes="448px"
          />
        </div>
      </div>
    </section>
  )
}
