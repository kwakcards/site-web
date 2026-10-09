import {
  BUYBACK_RETENTION_MONTHS,
  buybackGames,
  buybackItemTypes,
  buybackLanguages,
  buybackValues,
  buybackVolumes,
  optionLabel,
} from "@/config/buyback"
import { brand } from "@/config/brand"
import { button, details, heading, paragraph, renderEmail, steps } from "@/emails/layout"
import type { BuybackData } from "@/lib/validation/buyback"

/*
 * Emails d'une demande de rachat : alerte à la boutique et accusé de réception
 * au vendeur. Fonctions pures (texte et HTML), testées sans envoi réel.
 */

type Content = { subject: string; text: string; html: string }

const labels = (options: Parameters<typeof optionLabel>[0], values: string[]) =>
  values.map((value) => optionLabel(options, value)).join(", ")

/** Lignes « intitulé : valeur » communes aux deux emails. */
function summaryRows(data: BuybackData): [string, string][] {
  return [
    ["Articles", labels(buybackItemTypes, data.itemTypes)],
    ["Jeux", data.games.length > 0 ? labels(buybackGames, data.games) : "Non précisé"],
    ["Langues", labels(buybackLanguages, data.languages)],
    ["Volume", optionLabel(buybackVolumes, data.volume)],
    ["Valeur espérée", optionLabel(buybackValues, data.expectedValue)],
    ["En quelques mots", data.summary],
  ]
}

const rowsText = (rows: [string, string][]) =>
  rows.map(([label, value]) => `${label} : ${value}`).join("\n")

/** Alerte envoyée à la boutique, avec un lien vers la demande dans l'admin. */
export function buybackShopNotification(
  data: BuybackData,
  siteUrl: string,
  requestId: string
): Content {
  const adminUrl = `${siteUrl}/admin/rachats/${requestId}`
  const seller = `${data.firstName} ${data.lastName}`
  const contact: [string, string][] = [
    ["Vendeur", seller],
    ["Email", data.email],
    ["Téléphone", data.phone ?? "Non indiqué"],
    ["Ville", data.city],
  ]
  const extra: [string, string][] = [
    ...(data.cardList ? ([["Liste des cartes", data.cardList]] as [string, string][]) : []),
    ...(data.message ? ([["Message", data.message]] as [string, string][]) : []),
  ]
  const subject = `Nouvelle demande de rachat : ${seller} (${data.city})`

  return {
    subject,
    text: `${subject}\n\n${rowsText([...contact, ...summaryRows(data), ...extra])}\n\nPhotos et suivi : ${adminUrl}\n\nRépondre à cet email écrit directement au vendeur.`,
    html: renderEmail({
      siteUrl,
      preheader: `${seller}, ${data.city} : ${data.summary}`,
      eyebrow: "Rachat de collection",
      title: "Nouvelle demande",
      body: [
        paragraph(`${seller} (${data.city}) propose sa collection.`),
        heading("Le vendeur"),
        details(contact),
        heading("La collection"),
        details([...summaryRows(data), ...extra]),
        button("Voir la demande et les photos", adminUrl),
        paragraph("Répondre à cet email écrit directement au vendeur."),
      ].join(""),
      footer: [`Alerte envoyée par le site ${brand.name}.`],
    }),
  }
}

/** Accusé de réception envoyé au vendeur. */
export function buybackSellerAcknowledgement(data: BuybackData, siteUrl: string): Content {
  const subject = `${brand.name} : ta demande de rachat est bien reçue`
  const next = [
    "On étudie ta collection et tes photos.",
    "On t'envoie une proposition par email. L'estimation est gratuite et tu restes libre de refuser.",
    "Si l'offre te convient : remise en main propre ou envoi suivi, puis paiement après vérification des cartes.",
  ]
  const retention = `Sans rachat, tes informations sont supprimées au plus tard ${BUYBACK_RETENTION_MONTHS} mois après notre dernier échange (politique de confidentialité : ${siteUrl}/confidentialite).`

  return {
    subject,
    text: `Bonjour ${data.firstName},\n\nMerci pour ta demande, on l'a bien reçue !\n\nEt maintenant ?\n${next.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\nRécapitulatif :\n${rowsText(summaryRows(data))}\n\nUne précision à ajouter, des photos à envoyer ? Réponds simplement à cet email.\n\n${retention}\n\n${brand.name}`,
    html: renderEmail({
      siteUrl,
      preheader: "On étudie ta collection et on revient vers toi par email.",
      eyebrow: "Rachat de collection",
      title: "Demande bien reçue !",
      body: [
        paragraph(`Bonjour ${data.firstName},`),
        paragraph("Merci pour ta demande, on l'a bien reçue !"),
        heading("Et maintenant ?"),
        steps(next),
        heading("Ta demande"),
        details(summaryRows(data)),
        button("Voir la boutique", `${siteUrl}/boutique`),
        paragraph(
          "Une précision à ajouter, des photos à envoyer ? Réponds simplement à cet email."
        ),
      ].join(""),
      footer: [retention, `${brand.name} · Cartes à collectionner`],
    }),
  }
}
