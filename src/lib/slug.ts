/** Longueur maximale d'un slug (adresse de page). */
const MAX_LENGTH = 80

/**
 * « Dracaufeu ex — 199/165 » → « dracaufeu-ex-199-165 ». Minuscules, sans accents,
 * uniquement des lettres, chiffres et tirets simples.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_LENGTH)
    .replace(/-+$/g, "")
}

/** Même format que la contrainte SQL des slugs. */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
