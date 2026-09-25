/**
 * Identité de la boutique : nom, textes de marque et fichiers du logo.
 * Les coordonnées et réseaux sociaux seront éditables dans l'admin
 * (table site_settings). Seules les valeurs par défaut vivent ici.
 */
export const brand = {
  name: "Kwak & Cards",
  shortName: "Kwak",
  tagline: "Cartes à collectionner : à l'unité, gradées, scellé et collector",
  description:
    "Boutique en ligne de cartes à collectionner (TCG) : cartes à l'unité, cartes gradées, produits scellés, pièces collector et accessoires.",
  locale: "fr-FR",
  currency: "EUR",
  /** Couleur de la barre du navigateur mobile : reprend --brand-black (theme.css). */
  themeColor: "#0a0a0b",
  logo: {
    /** Logo détouré (fond transparent), à utiliser sur fond sombre. */
    src: "/brand/logo.png",
    width: 951,
    height: 973,
    alt: "Kwak & Cards",
  },
  /** Logo sur fond noir opaque, pour les emails et les supports clairs. */
  logoOnBlack: "/brand/logo-on-black.png",
} as const
