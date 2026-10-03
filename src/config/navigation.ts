export type NavLink = {
  label: string
  href: string
  /** Pictogramme du menu mobile pour les liens sans illustration de catégorie. */
  icon?: "new" | "buyback"
  /** Mis en avant (contour jaune) dans le header. */
  highlight?: boolean
}

/**
 * Onglets du header : catalogue, catégories (mêmes slugs qu'en base) et rachat.
 * Les catégories s'affichent avec leur illustration dans le menu mobile.
 */
export const mainNav: NavLink[] = [
  { label: "Nouveautés", href: "/boutique", icon: "new" },
  { label: "Cartes à l'unité", href: "/boutique/cartes-a-l-unite" },
  { label: "Cartes gradées", href: "/boutique/cartes-gradees" },
  { label: "Scellé", href: "/boutique/scelle" },
  { label: "Accessoires", href: "/boutique/accessoires" },
  { label: "Rachat de collection", href: "/rachat", icon: "buyback", highlight: true },
]

export const helpNav: NavLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Livraison, retours et remboursements", href: "/politique-de-remboursement" },
]

export const legalNav: NavLink[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Conditions générales de vente", href: "/cgv" },
  { label: "Conditions d'utilisation", href: "/conditions-utilisation" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "Politique cookies", href: "/cookies" },
  { label: "Droit de rétractation", href: "/retractation" },
]

/**
 * Fonction de rétractation en ligne (art. L221-21 et D221-5 du code de la
 * consommation) : le libellé « renoncer au contrat ici » est celui prévu par
 * le décret n° 2026-3. Lien visible en permanence dans le footer.
 */
export const withdrawalLink: NavLink = {
  label: "Renoncer au contrat ici",
  href: "/retractation#renoncer",
}
