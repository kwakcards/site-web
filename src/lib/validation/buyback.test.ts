import { describe, expect, it } from "vitest"

import {
  buybackCollectionSchema,
  buybackContactSchema,
  buybackFieldErrors,
  buybackSchema,
} from "@/lib/validation/buyback"

const valid = {
  firstName: " Camille ",
  lastName: "Martin",
  email: "Camille@Example.fr",
  phone: "",
  city: "Lyon",
  itemTypes: ["cartes", "gradees"],
  games: ["pokemon"],
  languages: ["fr"],
  volume: "moyenne",
  expectedValue: "500-1000",
  summary: "Environ 400 cartes Pokémon, dont 3 gradées PSA",
  cardList: "",
  message: "",
  ownerCertified: true,
}

describe("buybackSchema", () => {
  it("accepte une demande complète et la nettoie", () => {
    const result = buybackSchema.parse(valid)
    expect(result.firstName).toBe("Camille")
    expect(result.email).toBe("camille@example.fr")
    expect(result.phone).toBeNull()
    expect(result.cardList).toBeNull()
  })

  it("exige les coordonnées utiles, le téléphone reste facultatif", () => {
    const result = buybackContactSchema.safeParse({
      firstName: "",
      lastName: "",
      email: "pas-un-email",
      phone: "",
      city: "",
    })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(Object.keys(buybackFieldErrors(result.error)).sort()).toEqual([
      "city",
      "email",
      "firstName",
      "lastName",
    ])
  })

  it("refuse un téléphone invalide et des choix hors liste", () => {
    expect(buybackContactSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false)
    expect(buybackCollectionSchema.safeParse({ ...valid, itemTypes: ["voiture"] }).success).toBe(
      false
    )
    expect(buybackCollectionSchema.safeParse({ ...valid, volume: "enorme" }).success).toBe(false)
  })

  it("exige au moins un type d'articles, une langue et la certification de propriété", () => {
    const result = buybackSchema.safeParse({
      ...valid,
      itemTypes: [],
      languages: [],
      ownerCertified: false,
    })
    expect(result.success).toBe(false)
    if (result.success) return
    const errors = buybackFieldErrors(result.error)
    expect(errors.itemTypes).toBeDefined()
    expect(errors.languages).toBeDefined()
    expect(errors.ownerCertified).toMatch(/appartiennent/)
  })
})
