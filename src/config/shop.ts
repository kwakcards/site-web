import { formatPrice } from "@/lib/money"

/**
 * Valeurs par défaut de la boutique. En phase 5, elles deviennent éditables
 * dans l'admin (tables site_settings et payment_settings) : ces valeurs ne
 * serviront alors plus que de repli. Montants et délais à confirmer par Gil (propriétaire).
 */
const shipping = {
  /** Forfait de livraison suivie (centimes). */
  flatRateCents: 490,
  /** Livraison offerte à partir de ce montant d'achat (centimes), ou null. */
  freeShippingThresholdCents: 25000 as number | null,
}

/** Moyens de paiement hors ligne (avant Stripe), écrits comme dans une phrase. */
const offlinePaymentMethods = ["virement bancaire"]

/** « a », « a ou b », « a, b ou c ». */
function joinWithOr(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? ""
  return `${items.slice(0, -1).join(", ")} ou ${items.at(-1)}`
}

export const shopDefaults = {
  /**
   * Commande en ligne (panier + paiement hors ligne, phase 6). Tant que c'est
   * `false`, les fiches produits invitent à contacter la boutique.
   */
  onlineOrdering: false,
  shipping,
  offlinePaymentMethods,
  /** Les moyens de paiement en toutes lettres : « virement bancaire », « virement bancaire ou PayPal »… */
  offlinePaymentText: joinWithOr(offlinePaymentMethods),
  announcements: [
    ...(shipping.freeShippingThresholdCents
      ? [
          `Livraison offerte dès ${formatPrice(shipping.freeShippingThresholdCents, { compact: true })} d'achat`,
        ]
      : []),
    "Nouveautés ajoutées chaque semaine",
    "Envoi soigné et protégé",
    `Paiement par ${joinWithOr(offlinePaymentMethods)}`,
  ],
}
