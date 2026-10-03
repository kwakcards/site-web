import { describe, expect, it } from "vitest"

import { categoryImage, categorySlugFromHref } from "@/lib/category-image"

describe("illustrations des catégories", () => {
  it("renvoie l'image d'une catégorie connue, rien sinon", () => {
    expect(categoryImage("scelle")).toBe("/images/categories/scelle.webp")
    expect(categoryImage("collector")).toBeNull()
  })

  it("lit le slug d'un lien de catégorie", () => {
    expect(categorySlugFromHref("/boutique/cartes-gradees")).toBe("cartes-gradees")
    expect(categorySlugFromHref("/boutique")).toBeNull()
    expect(categorySlugFromHref("/rachat")).toBeNull()
  })
})
