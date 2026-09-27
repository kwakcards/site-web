import { describe, expect, it } from "vitest"

import { activeFilterCount, catalogHref, parseCatalogParams } from "@/lib/catalog-params"

describe("parseCatalogParams", () => {
  it("applique les valeurs par défaut", () => {
    expect(parseCatalogParams({})).toEqual({
      q: "",
      game: "",
      language: "",
      condition: "",
      grading: "",
      inStock: false,
      sort: "nouveautes",
      page: 1,
    })
  })

  it("lit les paramètres en français", () => {
    const params = parseCatalogParams({
      q: "  dracaufeu ",
      jeu: "Pokémon",
      langue: "FR",
      etat: "NM",
      gradation: "PSA",
      stock: "1",
      tri: "prix-croissant",
      page: "3",
    })
    expect(params).toMatchObject({
      q: "dracaufeu",
      game: "Pokémon",
      language: "FR",
      condition: "NM",
      grading: "PSA",
      inStock: true,
      sort: "prix-croissant",
      page: 3,
    })
  })

  it("ignore les valeurs invalides", () => {
    const params = parseCatalogParams({ tri: "hack", page: "-2", stock: "oui" })
    expect(params.sort).toBe("nouveautes")
    expect(params.page).toBe(1)
    expect(params.inStock).toBe(false)
    expect(parseCatalogParams({ page: "abc" }).page).toBe(1)
    expect(parseCatalogParams({ page: "999999" }).page).toBe(1000)
  })

  it("prend la première valeur d'un paramètre répété et tronque les textes longs", () => {
    expect(parseCatalogParams({ jeu: ["One Piece", "Pokémon"] }).game).toBe("One Piece")
    expect(parseCatalogParams({ q: "a".repeat(200) }).q).toHaveLength(80)
  })
})

describe("catalogHref", () => {
  it("omet les valeurs vides et par défaut", () => {
    expect(catalogHref("/boutique", { sort: "nouveautes", page: 1, q: "" })).toBe("/boutique")
  })

  it("construit une URL partageable", () => {
    expect(
      catalogHref("/boutique/cartes-gradees", {
        q: "pikachu illustrator",
        grading: "PSA",
        inStock: true,
        sort: "prix-decroissant",
        page: 2,
      })
    ).toBe(
      "/boutique/cartes-gradees?q=pikachu+illustrator&gradation=PSA&stock=1&tri=prix-decroissant&page=2"
    )
  })
})

describe("activeFilterCount", () => {
  it("compte les filtres sans la recherche ni le tri", () => {
    const params = parseCatalogParams({ q: "x", jeu: "Pokémon", stock: "1", tri: "nom" })
    expect(activeFilterCount(params)).toBe(2)
  })
})
