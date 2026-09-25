export type NavLink = {
  label: string
  href: string
}

/**
 * Catégories affichées dans le header. En phase 3, cette liste sera construite
 * à partir des catégories visibles en base (éditables dans l'admin). Elle sert
 * de valeur par défaut d'ici là.
 */
export const mainNav: NavLink[] = [
  { label: "Nouveautés", href: "/boutique" },
  { label: "Cartes à l'unité", href: "/boutique/cartes-a-l-unite" },
  { label: "Cartes gradées", href: "/boutique/cartes-gradees" },
  { label: "Scellé", href: "/boutique/scelle" },
  { label: "Collector", href: "/boutique/collector" },
  { label: "Accessoires", href: "/boutique/accessoires" },
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
