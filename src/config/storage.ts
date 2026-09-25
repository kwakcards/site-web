/**
 * Clés de stockage local utilisées par le site. Toute nouvelle clé doit être
 * ajoutée ici ET décrite dans la politique cookies (src/app/(shop)/(legal)/cookies).
 */
export const storageKeys = {
  /** Contenu du panier : identifiants produits et quantités (phase 6). */
  cart: "kwak-cart",
} as const
