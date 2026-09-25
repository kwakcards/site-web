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
  { label: "Livraison et retours", href: "/politique-de-remboursement" },
]

export const legalNav: NavLink[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Conditions générales de vente", href: "/cgv" },
  { label: "Politique de remboursement", href: "/politique-de-remboursement" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "Formulaire de rétractation", href: "/retractation" },
]

/**
 * Fonction de rétractation en ligne (art. L221-21 C. conso) : lien libellé sans
 * ambiguïté, visible en permanence. Libellé à faire valider juridiquement.
 */
export const withdrawalLink: NavLink = {
  label: "Se rétracter du contrat ici",
  href: "/retractation",
}
