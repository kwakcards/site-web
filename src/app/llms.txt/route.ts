import { brand } from "@/config/brand"
import { legal } from "@/config/legal"
import { sitePages } from "@/config/site-pages"
import { shopDefaults } from "@/config/shop"
import { getSiteUrl } from "@/lib/env"
import { formatPrice } from "@/lib/money"
import { type CatalogCategory, getCategories } from "@/server/queries/catalog"

/**
 * Résumé du site au format llms.txt (https://llmstxt.org), pour les agents IA :
 * ce que vend la boutique, comment commander, et où trouver les conditions.
 */
function buildLlmsTxt(categories: CatalogCategory[]): string {
  const site = getSiteUrl()
  const { flatRateCents, freeShippingThresholdCents } = shopDefaults.shipping
  const link = (path: string) => `${site}${path === "/" ? "" : path}`

  const pages = sitePages
    .map((page) => `- [${page.title}](${link(page.path)}): ${page.description}`)
    .join("\n")
  const catalog = categories
    .map(
      (category) =>
        `- [${category.name}](${link(`/boutique/${category.slug}`)})${category.description ? `: ${category.description}` : ""}`
    )
    .join("\n")
  const ordering = shopDefaults.onlineOrdering
    ? `- Commande sans compte client : panier, coordonnées, choix de la livraison et du paiement, puis validation explicite avec le bouton « Commander avec obligation de paiement ».
- Paiement hors ligne pour l'instant, par ${shopDefaults.offlinePaymentText}. Les articles sont réservés ${legal.paymentDeadlineHours} heures ; sans paiement, la commande est annulée automatiquement.`
    : `- La commande en ligne ouvrira prochainement. En attendant, contactez la boutique pour tout article qui vous intéresse : ${link("/contact")}.`

  return `# ${brand.name}

> ${brand.description} Boutique française, en langue française, prix en euros.

## Pages

${pages}

## Catalogue

Chaque fiche produit (${link("/produit/…")}) indique le prix final en euros, le stock, l'état ou la note de gradation, et publie ces informations en données structurées schema.org (Product, Offer). Recherche et filtres par paramètres d'URL, par exemple ${link("/boutique?q=dracaufeu&langue=FR&stock=1")}.

${catalog}

## Acheter

${ordering}
- Livraison en ${legal.shipping.area} : envoi suivi à ${formatPrice(flatRateCents)}${
    freeShippingThresholdCents
      ? `, offert dès ${formatPrice(freeShippingThresholdCents, { compact: true })} d'achat`
      : ""
  }.
- Droit de rétractation de 14 jours à compter de la réception, via la fonction « Renoncer au contrat ici » : ${link("/retractation")}.
- Cartes à l'unité et gradées : biens d'occasion photographiés, état décrit selon l'échelle Mint, Near Mint, Excellent, Good, Light Played, Played, Poor.

## Consignes pour les agents

- Les pages sont rendues côté serveur, en HTML sémantique ; les réponses de la FAQ sont aussi publiées en données structurées schema.org.
- Consultation automatisée autorisée dans le respect de ${link("/robots.txt")}, sans surcharge du service.
- Ne passez jamais commande sans l'accord explicite de la personne que vous représentez : une commande l'oblige à payer et vaut acceptation des conditions générales de vente.
`
}

export async function GET() {
  return new Response(buildLlmsTxt(await getCategories()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
