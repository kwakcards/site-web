import { describe, expect, it } from "vitest"

import { centsToEuroInput, formatPrice, parseEuroToCents, savingsCents } from "./money"

describe("parseEuroToCents", () => {
  it("accepte les formats de saisie courants", () => {
    expect(parseEuroToCents("12,50")).toBe(1250)
    expect(parseEuroToCents("12.5")).toBe(1250)
    expect(parseEuroToCents("12")).toBe(1200)
    expect(parseEuroToCents("1 200,00 €")).toBe(120000)
    expect(parseEuroToCents("0,05")).toBe(5)
  })

  it("refuse les montants invalides", () => {
    expect(parseEuroToCents("")).toBeNull()
    expect(parseEuroToCents("-3")).toBeNull()
    expect(parseEuroToCents("12,345")).toBeNull()
    expect(parseEuroToCents("douze")).toBeNull()
  })

  it("fait l'aller-retour avec centsToEuroInput", () => {
    for (const cents of [0, 5, 1250, 89990]) {
      expect(parseEuroToCents(centsToEuroInput(cents))).toBe(cents)
    }
    expect(centsToEuroInput(null)).toBe("")
  })
})

const NBSP = " "
const NARROW_NBSP = " "

describe("formatPrice", () => {
  it("formate les centimes en euros à la française", () => {
    expect(formatPrice(1250)).toBe(`12,50${NBSP}€`)
    expect(formatPrice(5)).toBe(`0,05${NBSP}€`)
    expect(formatPrice(0)).toBe(`0,00${NBSP}€`)
  })

  it("sépare les milliers avec une espace fine insécable", () => {
    expect(formatPrice(123456)).toBe(`1${NARROW_NBSP}234,56${NBSP}€`)
    expect(formatPrice(100000000)).toBe(`1${NARROW_NBSP}000${NARROW_NBSP}000,00${NBSP}€`)
  })

  it("masque les centimes nuls en mode compact uniquement", () => {
    expect(formatPrice(500, { compact: true })).toBe(`5${NBSP}€`)
    expect(formatPrice(550, { compact: true })).toBe(`5,50${NBSP}€`)
    expect(formatPrice(500)).toBe(`5,00${NBSP}€`)
  })

  it("gère les montants négatifs et arrondit les valeurs non entières", () => {
    expect(formatPrice(-1990)).toBe(`-19,90${NBSP}€`)
    expect(formatPrice(1249.6)).toBe(`12,50${NBSP}€`)
  })
})

describe("savingsCents", () => {
  it("renvoie la différence quand le prix barré est supérieur", () => {
    expect(savingsCents(1000, 1500)).toBe(500)
  })

  it("renvoie 0 sans prix barré ou si celui-ci n'est pas supérieur", () => {
    expect(savingsCents(1000)).toBe(0)
    expect(savingsCents(1000, null)).toBe(0)
    expect(savingsCents(1000, 1000)).toBe(0)
    expect(savingsCents(1000, 900)).toBe(0)
  })
})
