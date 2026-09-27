import { describe, expect, it } from "vitest"

import { pageWindow } from "@/components/catalog/pagination"

describe("pageWindow", () => {
  it("liste toutes les pages quand il y en a peu", () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3])
  })

  it("insère des trous autour de la page courante", () => {
    expect(pageWindow(5, 10)).toEqual([1, "gap", 4, 5, 6, "gap", 10])
    expect(pageWindow(1, 10)).toEqual([1, 2, "gap", 10])
    expect(pageWindow(10, 10)).toEqual([1, "gap", 9, 10])
  })
})
