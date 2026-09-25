import { describe, expect, it } from "vitest"

import { formatDateFr } from "./dates"

describe("formatDateFr", () => {
  it("formate une date ISO en français", () => {
    expect(formatDateFr("2026-09-25")).toBe("25 septembre 2026")
    expect(formatDateFr("2026-08-01")).toBe("1er août 2026")
  })

  it("refuse une date invalide", () => {
    expect(() => formatDateFr("2026-13-01")).toThrow()
    expect(() => formatDateFr("pas une date")).toThrow()
  })
})
