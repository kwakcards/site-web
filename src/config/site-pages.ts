/**
 * Pages publiques et indexables, utilisées par le plan du site (sitemap.xml)
 * et par le résumé destiné aux agents IA (llms.txt). Les fiches produits et
 * catégories sont ajoutées à partir de la base (voir src/app/sitemap.ts).
 */
export type SitePage = {
  path: string
  title: string
  description: string
  /** Document légal : daté par la date de mise à jour des documents légaux. */
  legal?: boolean
}

export const sitePages: SitePage[] = [
  {
    path: "/",
    title: "Accueil",
    description: "Présentation de la boutique, derniers ajouts et catégories.",
  },
  {
    path: "/boutique",
    title: "Catalogue",
    description:
      "Tous les articles, avec recherche, filtres (jeu, langue, état, gradation) et tri.",
  },
  {
    path: "/rachat",
    title: "Rachat de collection",
    description: "Vendre ses cartes : formulaire d'estimation gratuite, avec photos facultatives.",
  },
  {
    path: "/faq",
    title: "Questions fréquentes",
    description: "Commande, paiement, livraison, état des cartes et retours.",
  },
  { path: "/contact", title: "Contact", description: "Email, téléphone et adresse postale." },
  {
    path: "/politique-de-remboursement",
    title: "Livraison, retours et remboursements",
    description: "Frais et délais de livraison, retours sous 14 jours, remboursements.",
    legal: true,
  },
  {
    path: "/cgv",
    title: "Conditions générales de vente",
    description: "Commande, paiement hors ligne, livraison, rétractation, garanties légales.",
    legal: true,
  },
  {
    path: "/retractation",
    title: "Droit de rétractation",
    description: "Fonction « Renoncer au contrat ici » et modèle de formulaire.",
    legal: true,
  },
  {
    path: "/confidentialite",
    title: "Politique de confidentialité",
    description: "Données personnelles traitées, durées de conservation et droits.",
    legal: true,
  },
  {
    path: "/cookies",
    title: "Politique cookies",
    description: "Traceurs strictement nécessaires uniquement, sans consentement requis.",
    legal: true,
  },
  {
    path: "/conditions-utilisation",
    title: "Conditions générales d'utilisation",
    description: "Règles d'utilisation du site, y compris par des robots et agents IA.",
    legal: true,
  },
  {
    path: "/mentions-legales",
    title: "Mentions légales",
    description: "Éditeur, hébergeur, médiateur de la consommation.",
    legal: true,
  },
]
