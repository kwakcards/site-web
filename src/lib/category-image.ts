/**
 * Illustration de chaque catégorie : public/images/categories/<slug>.webp, générée
 * par scripts/brand/category-images.mts. Une photo au même nom peut la remplacer.
 */
const ILLUSTRATED = new Set(["cartes-a-l-unite", "cartes-gradees", "scelle", "accessoires"])

export function categoryImage(slug: string): string | null {
  return ILLUSTRATED.has(slug) ? `/images/categories/${slug}.webp` : null
}

/** Slug de catégorie d'un lien du catalogue : « /boutique/scelle » → « scelle ». */
export function categorySlugFromHref(href: string): string | null {
  const match = /^\/boutique\/([a-z0-9-]+)$/.exec(href)
  return match ? match[1] : null
}
