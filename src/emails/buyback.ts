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
import type { BuybackData } from "@/lib/validation/buyback"

/*
 * Emails d'une demande de rachat : alerte à la boutique et accusé de réception
 * au vendeur. Fonctions pures (texte et HTML), testées sans envoi réel.
 */

type Content = { subject: string; text: string; html: string }

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")

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

function rowsText(rows: [string, string][]) {
  return rows.map(([label, value]) => `${label} : ${value}`).join("\n")
}

function rowsHtml(rows: [string, string][]) {
  return `<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="color:#555;vertical-align:top">${escape(label)}</td><td>${escape(value).replaceAll("\n", "<br>")}</td></tr>`
    )
    .join("")}</table>`
}

/** Alerte envoyée à la boutique, avec un lien vers la demande dans l'admin. */
export function buybackShopNotification(data: BuybackData, adminUrl: string): Content {
  const rows: [string, string][] = [
    ["Vendeur", `${data.firstName} ${data.lastName}`],
    ["Email", data.email],
    ["Téléphone", data.phone ?? "Non indiqué"],
    ["Ville", data.city],
    ...summaryRows(data),
    ...(data.cardList ? ([["Liste des cartes", data.cardList]] as [string, string][]) : []),
    ...(data.message ? ([["Message", data.message]] as [string, string][]) : []),
  ]
  const subject = `Nouvelle demande de rachat : ${data.firstName} ${data.lastName} (${data.city})`
  return {
    subject,
    text: `${subject}\n\n${rowsText(rows)}\n\nPhotos et suivi : ${adminUrl}\n\nRépondre à cet email écrit directement au vendeur.`,
    html: `<p><strong>${escape(subject)}</strong></p>${rowsHtml(rows)}<p><a href="${escape(adminUrl)}">Voir la demande et les photos dans l'admin</a></p><p style="color:#555">Répondre à cet email écrit directement au vendeur.</p>`,
  }
}

/** Accusé de réception envoyé au vendeur. */
export function buybackSellerAcknowledgement(data: BuybackData, siteUrl: string): Content {
  const subject = `${brand.name} : ta demande de rachat est bien reçue`
  const intro = `Bonjour ${data.firstName},\n\nMerci pour ta demande ! On étudie ta collection et on te répond par email avec une proposition. L'estimation est gratuite et tu restes libre de refuser l'offre.`
  const outro = `Une précision à ajouter, des photos à envoyer ? Réponds simplement à cet email.\n\nSans rachat, tes informations sont supprimées au plus tard ${BUYBACK_RETENTION_MONTHS} mois après notre dernier échange (${siteUrl}/confidentialite).\n\n${brand.name}`
  const rows = summaryRows(data)
  return {
    subject,
    text: `${intro}\n\nRécapitulatif :\n${rowsText(rows)}\n\n${outro}`,
    html: `${intro
      .split("\n\n")
      .map((paragraph) => `<p>${escape(paragraph)}</p>`)
      .join("")}<p><strong>Récapitulatif</strong></p>${rowsHtml(rows)}${outro
      .split("\n\n")
      .map((paragraph) => `<p>${escape(paragraph)}</p>`)
      .join("")}`,
  }
}
