import { describe, expect, it } from "vitest"

import { withdrawalFieldErrors, withdrawalSchema } from "./withdrawal"

const valid = {
  fullName: "Camille Martin",
  email: "camille@example.fr",
  orderNumber: "KC-1001",
  items: "",
}

describe("withdrawalSchema", () => {
  it("accepte une déclaration complète et nettoie les espaces", () => {
    const result = withdrawalSchema.parse({ ...valid, fullName: "  Camille Martin  " })
    expect(result.fullName).toBe("Camille Martin")
    expect(result.items).toBe("")
  })

  it("exige le nom, un email valide et le numéro de commande", () => {
    const result = withdrawalSchema.safeParse({
      fullName: "C",
      email: "pas-un-email",
      orderNumber: " ",
      items: "",
    })
    expect(result.success).toBe(false)
    if (result.success) return
    const errors = withdrawalFieldErrors(result.error)
    expect(Object.keys(errors).sort()).toEqual(["email", "fullName", "orderNumber"])
  })

  it("ne demande aucune autre donnée", () => {
    expect(Object.keys(withdrawalSchema.shape).sort()).toEqual([
      "email",
      "fullName",
      "items",
      "orderNumber",
    ])
  })
})
