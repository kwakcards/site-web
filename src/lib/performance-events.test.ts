import { describe, expect, it } from "vitest"

import { filterPerformanceEvent } from "./performance-events"

const vital = (url: string, route?: string) => ({ type: "vital" as const, url, route })

describe("filterPerformanceEvent", () => {
  it("retire les paramètres d'URL et l'ancre", () => {
    expect(
      filterPerformanceEvent(vital("https://kwak-and-cards.fr/boutique?q=dracaufeu#liste"))
    ).toEqual(vital("https://kwak-and-cards.fr/boutique"))
    expect(filterPerformanceEvent(vital("/produit/dracaufeu-ex?ref=1", "/produit/[slug]"))).toEqual(
      vital("/produit/dracaufeu-ex", "/produit/[slug]")
    )
  })

  it("ignore les pages privées", () => {
    expect(filterPerformanceEvent(vital("https://kwak-and-cards.fr/admin/rachats/42"))).toBeNull()
    expect(filterPerformanceEvent(vital("/connexion?next=%2Fadmin"))).toBeNull()
    expect(filterPerformanceEvent(vital("/commande/jeton-secret"))).toBeNull()
  })

  it("garde les pages publiques dont le nom commence comme une page privée", () => {
    expect(filterPerformanceEvent(vital("/administration-des-cartes"))).toEqual(
      vital("/administration-des-cartes")
    )
  })
})
