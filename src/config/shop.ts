/**
 * Valeurs par défaut de la boutique. En phase 2, la plupart deviennent
 * éditables dans l'admin (table site_settings) : ces valeurs ne servent alors
 * plus que de repli si la base n'est pas encore configurée.
 */
export const shopDefaults = {
  announcements: [
    "Livraison offerte dès 100 € d'achat",
    "Nouveautés ajoutées chaque semaine",
    "Envoi soigné et protégé",
    "Paiement par virement, PayPal ou Wero",
  ],
} as const
