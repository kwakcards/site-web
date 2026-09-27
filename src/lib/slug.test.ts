import { describe, expect, it } from "vitest"

import { SLUG_PATTERN, slugify } from "./slug"

describe("slugify", () => {
  it("retire accents, majuscules et ponctuation", () => {
    expect(slugify("Dracaufeu ex — 199/165")).toBe("dracaufeu-ex-199-165")
    expect(slugify("Écarlate & Violet : Évolutions Prismatiques")).toBe(
      "ecarlate-violet-evolutions-prismatiques"
    )
    expect(slugify("  Cœur de Pikachu  ")).toBe("coeur-de-pikachu")
  })

  it("produit toujours un slug valide pour la base", () => {
    for (const value of ["Carte n°1 !!", "Sleeves (x100)", "PSA 10 - Mew ★"]) {
      expect(slugify(value)).toMatch(SLUG_PATTERN)
    }
  })

  it("coupe les slugs trop longs sans laisser de tiret final", () => {
    const slug = slugify("a".repeat(79) + " suite")
    expect(slug.length).toBeLessThanOrEqual(80)
    expect(slug.endsWith("-")).toBe(false)
  })
})
