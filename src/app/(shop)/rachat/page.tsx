import type { Metadata } from "next"
import Link from "next/link"

import { Splash } from "@/components/brand/splash"
import { BuybackForm } from "@/components/buyback/buyback-form"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: "Rachat de collection",
  description: `Vends ta collection de cartes à ${brand.name} : cartes à l'unité, gradées, produits scellés ou collection entière. Estimation gratuite et sans engagement.`,
  alternates: { canonical: "/rachat" },
}

const steps = [
  {
    title: "Décris ta collection",
    text: "Quelques questions et, si tu veux, des photos prises avec ton téléphone.",
  },
  {
    title: "Reçois une offre",
    text: "On étudie ta demande et on te répond par email.",
  },
  {
    title: "Vends en toute sécurité",
    text: "Remise en main propre ou envoi suivi, puis paiement après vérification des cartes.",
  },
]

export default function BuybackPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <p className="flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-primary uppercase">
        <Splash className="w-6" />
        Rachat de collection
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">Vends ta collection</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
        Cartes à l&apos;unité, cartes gradées, produits scellés ou collection entière : décris-nous
        ce que tu veux vendre et on te fait une offre. L&apos;estimation est gratuite et sans
        engagement.
      </p>

      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border-2 border-edge bg-card p-5">
            <span className="grid size-9 place-items-center rounded-full bg-primary font-heading text-primary-foreground">
              {index + 1}
            </span>
            <h2 className="mt-3 font-heading text-sm uppercase">{step.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>

      <section
        aria-labelledby="demande-title"
        className="mt-10 rounded-2xl border-2 border-edge bg-card p-5 md:p-8"
      >
        <h2 id="demande-title" className="font-display text-3xl">
          Ta demande d&apos;estimation
        </h2>
        <div className="mt-6">
          <BuybackForm />
        </div>
      </section>

      <section aria-labelledby="bon-a-savoir" className="mt-10">
        <h2 id="bon-a-savoir" className="font-heading text-sm uppercase">
          Bon à savoir
        </h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
          <li>L&apos;offre définitive est faite après vérification de l&apos;état des cartes.</li>
          <li>Tu restes libre de refuser l&apos;offre, sans frais.</li>
          <li>Si tu as moins de 18 ans, un parent doit donner son accord à la vente.</li>
          <li>
            Une question avant d&apos;envoyer ta demande ?{" "}
            <Link href="/contact" className="text-primary underline underline-offset-4">
              Écris-nous
            </Link>
            .
          </li>
        </ul>
      </section>
    </div>
  )
}
