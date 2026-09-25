import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { blend, contrastRatio } from "@/lib/contrast"

/**
 * Garde-fou d'accessibilité : si l'identité change (src/styles/theme.css),
 * les couleurs doivent rester lisibles. Seuils WCAG 2.2 niveau AA :
 * 4.5:1 pour le texte (1.4.3), 3:1 pour les contours de champs et le focus (1.4.11).
 */
const css = readFileSync(fileURLToPath(new URL("./theme.css", import.meta.url)), "utf8")

function token(name: string): string {
  const match = new RegExp(`--brand-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css)
  if (!match) throw new Error(`Token --brand-${name} introuvable dans theme.css`)
  return match[1]
}

const black = token("black")
const ink = token("ink")
const raised = token("ink-raised")
const yellow = token("yellow")
const backgrounds = { fond: black, surface: ink, "surface surélevée": raised }

const TEXT = 4.5
const NON_TEXT = 3

describe("contrastes du thème (WCAG 2.2 AA)", () => {
  it.each([
    ["texte principal", token("cream")],
    ["texte secondaire", token("muted")],
    ["accent jaune (prix, liens)", yellow],
    ["erreurs", token("danger")],
    ["succès", token("success")],
  ])("%s lisible sur chaque fond", (_label, color) => {
    for (const background of Object.values(backgrounds)) {
      expect(contrastRatio(color, background)).toBeGreaterThanOrEqual(TEXT)
    }
  })

  it("texte noir sur les boutons jaunes (repos et survol)", () => {
    expect(contrastRatio(black, yellow)).toBeGreaterThanOrEqual(TEXT)
    expect(contrastRatio(black, token("yellow-light"))).toBeGreaterThanOrEqual(TEXT)
  })

  it("texte des erreurs sur leur fond teinté (bouton Supprimer, repères à compléter)", () => {
    const danger = token("danger")
    expect(contrastRatio(danger, blend(danger, black, 0.2))).toBeGreaterThanOrEqual(TEXT)
  })

  it("contour des champs de formulaire visible sur chaque fond", () => {
    for (const background of Object.values(backgrounds)) {
      expect(contrastRatio(token("control"), background)).toBeGreaterThanOrEqual(NON_TEXT)
    }
  })

  it("anneau de focus (jaune à 50 %) visible sur le fond", () => {
    expect(contrastRatio(blend(yellow, black, 0.5), black)).toBeGreaterThanOrEqual(NON_TEXT)
  })
})
