/*
 * Calcul du rapport de contraste WCAG 2.x entre deux couleurs hexadécimales.
 * https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 */

function channel(value: number): number {
  const c = value / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function parseHex(hex: string): [number, number, number] {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) throw new Error(`Couleur hexadécimale invalide : ${hex}`)
  const value = match[1]
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16)) as [
    number,
    number,
    number,
  ]
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map(channel)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/** Couleur obtenue en posant `foreground` avec une opacité `alpha` sur `background`. */
export function blend(foreground: string, background: string, alpha: number): string {
  const fg = parseHex(foreground)
  const bg = parseHex(background)
  return `#${fg
    .map((value, index) =>
      Math.round(value * alpha + bg[index] * (1 - alpha))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`
}
