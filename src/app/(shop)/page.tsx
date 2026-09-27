import Link from "next/link"

import { CardTrio } from "@/components/brand/card-trio"
import { Logo } from "@/components/brand/logo"
import { Splash } from "@/components/brand/splash"
import { CategoryGrid } from "@/components/home/category-grid"
import { LatestProducts } from "@/components/home/latest-products"
import { Reassurance } from "@/components/home/reassurance"
import { Button } from "@/components/ui/button"
import { brand } from "@/config/brand"

// Les sections catégories et derniers ajouts lisent la base via des requêtes
// mises en cache : elles font partie de la page pré-rendue et sont rafraîchies
// à chaque modification faite dans l'admin.
export default function HomePage() {
  return (
    <>
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
              eager
              className="h-auto w-full drop-shadow-[0_20px_60px_rgb(248_192_40/0.25)]"
              sizes="448px"
            />
          </div>
        </div>
      </section>

      <Reassurance />
      <CategoryGrid />
      <LatestProducts />

      <section aria-labelledby="cta-title" className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-6">
        <div className="relative isolate overflow-hidden rounded-2xl border border-primary/40 bg-card px-6 py-10 text-center md:py-14">
          <CardTrio className="absolute -bottom-6 -left-6 -z-10 w-40 -rotate-12 opacity-10" />
          <h2 id="cta-title" className="font-display text-3xl md:text-4xl">
            Tu cherches une carte précise ?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Fouille le catalogue par jeu, langue ou état, ou écris-nous : on te dit si on l&apos;a.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="cta" size="lg">
              <Link href="/boutique#recherche">Rechercher une carte</Link>
            </Button>
            <Button asChild variant="cta-outline" size="lg">
              <Link href="/contact">Nous écrire</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
