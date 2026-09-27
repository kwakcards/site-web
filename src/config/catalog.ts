/**
 * Référentiels du catalogue. L'échelle d'état décrit ce que le client est en
 * droit d'attendre : elle sert à apprécier la conformité d'une carte à sa
 * description (garantie légale de conformité).
 */
export const cardConditions = [
  {
    code: "M",
    label: "Mint",
    description: "État parfait, comme sortie du booster : aucun défaut visible.",
  },
  {
    code: "NM",
    label: "Near Mint",
    description:
      "Quasi parfaite : défauts infimes visibles seulement à l'examen attentif (très légère usure d'un coin, par exemple).",
  },
  {
    code: "EX",
    label: "Excellent",
    description: "Légère usure visible (bords ou coins un peu blanchis), sans pliure.",
  },
  {
    code: "GD",
    label: "Good",
    description: "Usure marquée des bords et des coins, légères rayures, sans pliure importante.",
  },
  {
    code: "LP",
    label: "Light Played",
    description: "Usure nette sur l'ensemble de la carte ; une petite pliure est possible.",
  },
  {
    code: "PL",
    label: "Played",
    description: "Usure importante : pliures, marques ou rayures bien visibles.",
  },
  {
    code: "PO",
    label: "Poor",
    description: "Très abîmée : pliures marquées, déchirures ou taches.",
  },
] as const

export type CardConditionCode = (typeof cardConditions)[number]["code"]

/** Libellé d'un état à partir de son code (« NM » → « Near Mint »). */
export function conditionLabel(code: string | null | undefined): string | null {
  if (!code) return null
  return cardConditions.find((condition) => condition.code === code)?.label ?? code
}

/** Langues proposées dans l'admin (valeur stockée = code). */
export const productLanguages = [
  { code: "FR", label: "Français" },
  { code: "EN", label: "Anglais" },
  { code: "JP", label: "Japonais" },
  { code: "KR", label: "Coréen" },
  { code: "CN", label: "Chinois" },
  { code: "DE", label: "Allemand" },
  { code: "ES", label: "Espagnol" },
  { code: "IT", label: "Italien" },
] as const

export function languageLabel(code: string | null | undefined): string | null {
  if (!code) return null
  return productLanguages.find((language) => language.code === code)?.label ?? code
}

/** Sociétés de gradation courantes (saisie libre possible). */
export const gradingCompanies = ["PSA", "PCA", "CGC", "BGS", "Collect Aura", "SGC"] as const

/** Jeux proposés en suggestion dans l'admin (saisie libre possible). */
export const gameSuggestions = [
  "Pokémon",
  "One Piece",
  "Disney Lorcana",
  "Dragon Ball Super",
  "Magic: The Gathering",
  "Yu-Gi-Oh!",
] as const

export const catalogSortOptions = [
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-croissant", label: "Prix croissant" },
  { value: "prix-decroissant", label: "Prix décroissant" },
  { value: "nom", label: "Nom (A à Z)" },
] as const

export type CatalogSort = (typeof catalogSortOptions)[number]["value"]

/** Nombre de produits par page du catalogue. */
export const CATALOG_PAGE_SIZE = 24

/** Un produit mis en ligne depuis moins de 14 jours porte le badge « Nouveau ». */
export const NEW_PRODUCT_DAYS = 14
