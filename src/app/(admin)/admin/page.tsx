import { EyeOffIcon, PackageIcon, PackageXIcon, PlusIcon, TriangleAlertIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { brand } from "@/config/brand"
import { requireAdmin } from "@/lib/auth"
import { getAdminStats } from "@/server/queries/admin"

// Même segment que le layout : son modèle de titre ne s'applique pas ici.
export const metadata: Metadata = { title: { absolute: `Tableau de bord · Admin ${brand.name}` } }

// Page liée à la session de l'admin : rendue à chaque requête (voir le layout).
export const instant = false

export default async function AdminDashboardPage() {
  await requireAdmin()
  const stats = await getAdminStats()

  const cards = [
    {
      label: "Produits en ligne",
      value: stats.visible,
      icon: PackageIcon,
      href: "/admin/produits",
    },
    { label: "Produits masqués", value: stats.hidden, icon: EyeOffIcon, href: "/admin/produits" },
    {
      label: "En rupture (en ligne)",
      value: stats.soldOut,
      icon: PackageXIcon,
      href: "/admin/produits",
    },
    {
      label: "Stock faible (1 ou 2)",
      value: stats.lowStock,
      icon: TriangleAlertIcon,
      href: "/admin/produits",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Tableau de bord</h1>
          <p className="mt-1 text-muted-foreground">Vue d&apos;ensemble du catalogue.</p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/produits/nouveau">
            <PlusIcon data-icon="inline-start" />
            Ajouter un produit
          </Link>
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.label}>
            <Link
              href={card.href}
              className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <card.icon aria-hidden="true" className="size-6 text-primary" />
              <span className="font-heading text-3xl">{card.value}</span>
              <span className="text-sm text-muted-foreground">{card.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section
        aria-labelledby="bientot-title"
        className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground"
      >
        <h2 id="bientot-title" className="font-heading text-sm text-foreground uppercase">
          Bientôt dans l&apos;admin
        </h2>
        <p className="mt-2">
          Commandes (paiement hors ligne puis Stripe), bannières de l&apos;accueil, catégories,
          réglages de la boutique et newsletter.
        </p>
      </section>
    </div>
  )
}
