/**
 * Informations légales de la boutique, fournies par Gil (propriétaire) : à tenir à jour
 * à chaque changement (adresse, téléphone, régime de TVA, médiateur…).
 *
 * Toutes les pages légales (mentions légales, CGV, confidentialité…) lisent ce
 * fichier. Une valeur `null` est affichée « [À compléter] » et listée dans
 * l'avertissement en tête des pages légales tant qu'elle n'est pas renseignée.
 * Voir docs/legal/conformite.md pour la liste des démarches associées.
 */

export type LegalConfig = {
  /** Date de dernière mise à jour des documents légaux (AAAA-MM-JJ). */
  updatedAt: string
  seller: {
    /** Nom commercial. */
    tradeName: string
    /** Entreprise individuelle : prénom et nom. Société : dénomination sociale. */
    legalName: string | null
    /** Ex. « Entrepreneur individuel (micro-entreprise) » ou « SAS au capital de 1 000 € ». */
    legalForm: string | null
    /** Adresse postale (siège, établissement ou domiciliation professionnelle). */
    address: string | null
    /** Numéro SIRET (14 chiffres). */
    siret: string | null
    /** Immatriculation, ex. « Inscrit au RNE » ou « RCS Strasbourg 123 456 789 ». */
    registration: string | null
    /** true : franchise en base de TVA (« TVA non applicable, art. 293 B du CGI »). */
    vatExempt: boolean | null
    /** Numéro de TVA intracommunautaire, uniquement si assujetti à la TVA. */
    vatNumber: string | null
    email: string | null
    phone: string | null
    /** Délai de réponse annoncé sur la page Contact, ex. « sous 48 h ouvrées ». */
    responseTime: string | null
    /** Personne physique responsable de la publication du site. */
    publicationDirector: string | null
  }
  /** Hébergeur du site (art. 1-1 de la loi n° 2004-575 « LCEN »). */
  host: {
    name: string
    address: string
    phone: string
    website: string
  }
  /**
   * Médiateur de la consommation (adhésion obligatoire, art. L612-1 et R616-1
   * du code de la consommation). Renseigner après adhésion à un médiateur
   * référencé par la CECMC.
   */
  mediator: {
    name: string | null
    website: string | null
    /** Page du médiateur pour déclarer un litige en ligne. */
    complaintUrl: string | null
    address: string | null
  }
  shipping: {
    /** Zone desservie. */
    area: string
    /** Transporteurs utilisés pour les envois suivis. */
    carriers: string[]
    /** Délai d'expédition après réception du paiement (jours ouvrés). */
    dispatchBusinessDays: number | null
    /** Délai d'acheminement maximal par le transporteur, après l'expédition (jours ouvrés). */
    deliveryBusinessDays: number | null
  }
  /** Délai laissé pour payer une commande hors ligne avant son annulation (heures). */
  paymentDeadlineHours: number
}

export const legal: LegalConfig = {
  updatedAt: "2026-10-06",
  // Réponses de Gil au formulaire de conformité (6 octobre 2026).
  seller: {
    tradeName: "Kwak & Cards",
    legalName: "Gil DA SILVA EI",
    legalForm: "Entrepreneur individuel (micro-entreprise)",
    address: "19 rue Jean-Baptiste Clément, 78500 Sartrouville",
    siret: "105 549 893 00029",
    registration: "Inscrit au RNE",
    vatExempt: true,
    vatNumber: null,
    email: "kwak.cards@gmail.com",
    phone: "07 69 74 95 41",
    responseTime: "sous 48 h ouvrées",
    publicationDirector: "Gil DA SILVA",
  },
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis",
    phone: "+1 559 288 7060",
    website: "https://vercel.com",
  },
  // Adhésion le 6 octobre 2026 ; coordonnées relevées sur cm2c.net (page Contact).
  mediator: {
    name: "CM2C (Centre de la médiation de la consommation de conciliateurs de justice)",
    website: "https://www.cm2c.net",
    complaintUrl: "https://www.cm2c.net/declarer-un-litige.php",
    address: "49 rue de Ponthieu, 75008 Paris",
  },
  shipping: {
    area: "France métropolitaine",
    carriers: ["Mondial Relay", "La Poste", "Colissimo", "DHL"],
    dispatchBusinessDays: 3,
    deliveryBusinessDays: 7,
  },
  paymentDeadlineHours: 72,
}

/** Libellés des informations obligatoires encore manquantes. */
export function missingLegalInfo(config: LegalConfig = legal): string[] {
  const { seller, mediator, shipping } = config
  const checks: [unknown, string][] = [
    [seller.legalName, "nom ou dénomination sociale du vendeur"],
    [seller.legalForm, "forme juridique"],
    [seller.address, "adresse postale"],
    [seller.siret, "numéro SIRET"],
    [seller.registration, "immatriculation (RNE ou RCS)"],
    [seller.vatExempt, "régime de TVA"],
    [seller.email, "adresse email de contact"],
    [seller.phone, "numéro de téléphone"],
    [seller.publicationDirector, "directeur ou directrice de la publication"],
    [mediator.name, "médiateur de la consommation"],
    [mediator.website, "site internet du médiateur"],
    [shipping.dispatchBusinessDays, "délai d'expédition"],
  ]
  if (seller.vatExempt === false)
    checks.push([seller.vatNumber, "numéro de TVA intracommunautaire"])
  return checks.filter(([value]) => value === null || value === "").map(([, label]) => label)
}
