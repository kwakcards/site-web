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

export const shopDefaults = {
  /**
   * Commande en ligne (panier + paiement hors ligne, phase 6). Tant que c'est
   * `false`, les fiches produits invitent à contacter la boutique.
   */
  onlineOrdering: false,
  shipping,
  /** Moyens de paiement hors ligne proposés en v1 (avant Stripe). */
  offlinePaymentMethods: ["Virement bancaire", "PayPal", "Wero"],
  announcements: [
    ...(shipping.freeShippingThresholdCents
      ? [
          `Livraison offerte dès ${formatPrice(shipping.freeShippingThresholdCents, { compact: true })} d'achat`,
        ]
      : []),
    "Nouveautés ajoutées chaque semaine",
    "Envoi soigné et protégé",
    "Paiement par virement, PayPal ou Wero",
  ],
}
