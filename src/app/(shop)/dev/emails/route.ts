import { brand } from "@/config/brand"
import { buybackSellerAcknowledgement, buybackShopNotification } from "@/emails/buyback"
import { sendEmail } from "@/lib/email"
import type { BuybackData } from "@/lib/validation/buyback"

/*
 * Aperçu des emails en développement : /dev/emails?type=vendeur (ou boutique),
 * et &envoyer=adresse pour le recevoir. Introuvable en production.
 */

const sample: BuybackData = {
  firstName: "Léa",
  lastName: "Martin",
  email: "lea@example.com",
  phone: "06 12 34 56 78",
  city: "Lyon",
  itemTypes: ["cartes", "gradees"],
  games: ["pokemon", "one-piece"],
  languages: ["fr", "jp"],
  volume: "moyenne",
  expectedValue: "500-1000",
  summary: "Environ 400 cartes Pokémon de 2020 à 2024, dont une vingtaine de rares.",
  cardList: "Dracaufeu ex 223/197 (NM)\nPikachu VMAX 044/185",
  message: "Disponible le week-end pour une remise en main propre.",
  ownerCertified: true,
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 })

  const { origin, searchParams } = new URL(request.url)
  const email =
    searchParams.get("type") === "boutique"
      ? buybackShopNotification(sample, origin, "exemple")
      : buybackSellerAcknowledgement(sample, origin)

  // ?envoyer=adresse : envoie l'email réel (logo chargé depuis le site en ligne).
  const to = searchParams.get("envoyer")
  if (to) {
    const sent = await sendEmail({ to, ...email })
    return new Response(sent ? `Envoyé à ${to}` : "Échec de l'envoi (voir la console)")
  }

  // Le logo vient normalement du site en ligne : en local, on sert le fichier du projet.
  const html = email.html.replaceAll(`${brand.publicUrl}${brand.emailLogo}`, brand.emailLogo)
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
}
