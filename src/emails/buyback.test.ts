import { describe, expect, it } from "vitest"

import type { BuybackData } from "@/lib/validation/buyback"

import { buybackSellerAcknowledgement, buybackShopNotification } from "./buyback"

const data: BuybackData = {
  firstName: "Léa",
  lastName: "Martin",
  email: "lea@example.com",
  phone: null,
  city: "Lyon",
  itemTypes: ["cartes", "gradees"],
  games: ["pokemon"],
  languages: ["fr"],
  volume: "moyenne",
  expectedValue: "100-500",
  summary: "50 cartes <b>rares</b>",
  cardList: null,
  message: null,
  ownerCertified: true,
}

describe("emails de rachat", () => {
  it("alerte la boutique avec les libellés lisibles et le lien admin", () => {
    const email = buybackShopNotification(data, "https://www.kwak-and-cards.fr", "42")
    expect(email.subject).toBe("Nouvelle demande de rachat : Léa Martin (Lyon)")
    expect(email.text).toContain("Articles : Cartes à l'unité, Cartes gradées")
    expect(email.text).toContain("Téléphone : Non indiqué")
    expect(email.html).toContain('href="https://www.kwak-and-cards.fr/admin/rachats/42"')
  })

  it("échappe le texte saisi par le vendeur dans le HTML", () => {
    const email = buybackSellerAcknowledgement(data, "https://www.kwak-and-cards.fr")
    expect(email.html).toContain("50 cartes &lt;b&gt;rares&lt;/b&gt;")
    expect(email.html).not.toContain("<b>rares</b>")
    expect(email.text).toContain("Bonjour Léa,")
  })
})
