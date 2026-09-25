/*
 * Montants : toujours manipulés en centimes (entiers), jamais en flottants.
 *
 * Le formatage est fait à la main plutôt qu'avec Intl.NumberFormat : les
 * moteurs ICU des navigateurs et de Node n'utilisent pas tous les mêmes espaces
 * insécables, ce qui provoquerait des écarts d'hydratation dans les composants
 * clients (panier).
 */

const NARROW_NBSP = " " // séparateur des milliers (norme française)
const NBSP = " " // espace avant le symbole €

type FormatOptions = {
  /** Masque les centimes quand ils sont nuls : « 5 € » au lieu de « 5,00 € ». */
  compact?: boolean
}

/** 1250 → « 12,50 € » ; 123456 → « 1 234,56 € ». */
export function formatPrice(cents: number, { compact = false }: FormatOptions = {}): string {
  const rounded = Math.round(cents)
  const sign = rounded < 0 ? "-" : ""
  const abs = Math.abs(rounded)
  const euros = Math.floor(abs / 100)
  const rest = abs % 100

  const eurosText = euros.toString().replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP)
  const centsText = compact && rest === 0 ? "" : `,${rest.toString().padStart(2, "0")}`

  return `${sign}${eurosText}${centsText}${NBSP}€`
}

/** Économie réalisée (en centimes) si le prix barré est valide, sinon 0. */
export function savingsCents(priceCents: number, compareAtPriceCents?: number | null): number {
  if (compareAtPriceCents == null || compareAtPriceCents <= priceCents) return 0
  return compareAtPriceCents - priceCents
}
