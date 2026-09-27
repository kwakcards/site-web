import { describe, expect, it } from "vitest"

import { productFieldErrors, productFormSchema, readProductForm } from "@/lib/validation/product"

const id = "0f8b6f0e-3c2a-4a55-9d7e-2d8f3b1c4a10"
const categoryId = "5b1d2c3e-4f5a-4b6c-8d7e-9f0a1b2c3d4e"

function form(values: Record<string, string>) {
  const data = new FormData()
  const defaults = {
    id,
    mode: "create",
    name: "Dracaufeu ex",
    slug: "",
    categoryId,
    price: "12,50",
    compareAtPrice: "",
    stock: "1",
    condition: "NM",
    grade: "",
    images: "[]",
  }
  for (const [key, value] of Object.entries({ ...defaults, ...values })) data.set(key, value)
  return data
}

function parse(values: Record<string, string>) {
  return productFormSchema.safeParse(readProductForm(form(values)))
}

describe("productFormSchema", () => {
  it("convertit le formulaire : centimes, booléens, champs vides à null", () => {
    const result = parse({ game: "Pokémon", isVisible: "on", setName: "  " })
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data).toMatchObject({
      price: 1250,
      compareAtPrice: null,
      stock: 1,
      game: "Pokémon",
      setName: null,
      isVisible: true,
      isGraded: false,
      condition: "NM",
    })
  })

  it("exige un nom, un prix et un stock", () => {
    const result = parse({ name: " ", price: "", stock: "" })
    expect(result.success).toBe(false)
    if (result.success) return
    const errors = productFieldErrors(result.error)
    expect(errors.name).toBeDefined()
    expect(errors.price).toBe("Le prix est obligatoire.")
    expect(errors.stock).toBe("Indique le stock.")
  })

  it("refuse un prix barré inférieur ou égal au prix", () => {
    const result = parse({ compareAtPrice: "12,50" })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(productFieldErrors(result.error).compareAtPrice).toMatch(/supérieur/)
  })

  it("exige société et note pour une carte gradée", () => {
    const result = parse({ isGraded: "on" })
    expect(result.success).toBe(false)
    if (result.success) return
    const errors = productFieldErrors(result.error)
    expect(errors.gradingCompany).toBeDefined()
    expect(errors.grade).toBeDefined()

    const ok = parse({ isGraded: "on", gradingCompany: "PSA", grade: "9,5" })
    expect(ok.success && ok.data.grade).toBe(9.5)
    expect(parse({ isGraded: "on", gradingCompany: "PSA", grade: "9,55" }).success).toBe(false)
    expect(parse({ isGraded: "on", gradingCompany: "PSA", grade: "11" }).success).toBe(false)
  })

  it("n'accepte que les photos rangées dans le dossier du produit", () => {
    const good = JSON.stringify([{ path: `products/${id}/a1b2.webp`, alt: "Recto" }])
    expect(parse({ images: good }).success).toBe(true)

    const other = JSON.stringify([{ path: "products/autre/a1b2.webp", alt: "" }])
    const traversal = JSON.stringify([{ path: `products/${id}/../x.webp`, alt: "" }])
    expect(parse({ images: other }).success).toBe(false)
    expect(parse({ images: traversal }).success).toBe(false)
    expect(parse({ images: "pas du json" }).success).toBe(false)
  })

  it("valide le format du slug", () => {
    expect(parse({ slug: "dracaufeu-ex-199" }).success).toBe(true)
    expect(parse({ slug: "Dracaufeu EX" }).success).toBe(false)
  })
})
