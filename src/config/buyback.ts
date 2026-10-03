/**
 * Rachat de collection : choix proposés dans le formulaire (/rachat). Les valeurs
 * sont celles enregistrées en base (contraintes de la table buyback_requests).
 */
export const buybackItemTypes = [
  { value: "cartes", label: "Cartes à l'unité" },
  { value: "gradees", label: "Cartes gradées" },
  { value: "scelle", label: "Produits scellés" },
  { value: "rares", label: "Cartes rares ou anciennes" },
  { value: "vrac", label: "Collection en vrac" },
  { value: "autre", label: "Autre" },
] as const

export const buybackGames = [
  { value: "pokemon", label: "Pokémon" },
  { value: "one-piece", label: "One Piece" },
  { value: "lorcana", label: "Disney Lorcana" },
  { value: "dragon-ball", label: "Dragon Ball Super" },
  { value: "magic", label: "Magic: The Gathering" },
  { value: "yu-gi-oh", label: "Yu-Gi-Oh!" },
  { value: "autre", label: "Autre jeu" },
] as const

export const buybackLanguages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "jp", label: "Japonais" },
  { value: "autre", label: "Autre langue" },
] as const

export const buybackVolumes = [
  { value: "petite", label: "Petite : moins de 100 cartes" },
  { value: "moyenne", label: "Moyenne : 100 à 1 000 cartes" },
  { value: "grosse", label: "Grosse : plus de 1 000 cartes" },
] as const

export const buybackValues = [
  { value: "moins-100", label: "Moins de 100 €" },
  { value: "100-500", label: "100 à 500 €" },
  { value: "500-1000", label: "500 à 1 000 €" },
  { value: "1000-5000", label: "1 000 à 5 000 €" },
  { value: "plus-5000", label: "Plus de 5 000 €" },
] as const

export const buybackStatuses = [
  { value: "nouvelle", label: "Nouvelle" },
  { value: "en-cours", label: "En cours" },
  { value: "conclue", label: "Conclue" },
  { value: "refusee", label: "Refusée" },
] as const

/** Photos par demande (limite aussi appliquée par la base). */
export const BUYBACK_MAX_PHOTOS = 8

/** Durée de conservation d'une demande sans rachat (politique de confidentialité). */
export const BUYBACK_RETENTION_MONTHS = 12

type Option = { readonly value: string; readonly label: string }

/** Libellé d'une valeur, ou la valeur elle-même si elle est inconnue. */
export function optionLabel(options: readonly Option[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value
}
