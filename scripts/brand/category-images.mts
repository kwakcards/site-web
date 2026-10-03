/**
 * Illustrations des catégories (tuiles de l'accueil, menu mobile), dans le style de
 * la marque : fond noir, cartes jaune doré. Écrites dans public/images/categories/.
 *
 *   node scripts/brand/category-images.mts
 *
 * Une photo réelle peut les remplacer : même nom de fichier, format WebP 800 × 600.
 */
import { mkdir } from "node:fs/promises"
import { join } from "node:path"

import sharp from "sharp"

const WIDTH = 800
const HEIGHT = 600
const OUTPUT = join(process.cwd(), "public/images/categories")

const palettes = {
  gold: ["#ffd65a", "#f0a818"],
  fire: ["#ffd65a", "#d6452f"],
  sea: ["#e2403a", "#1d2a57"],
  violet: ["#8a6cf0", "#157f86"],
} as const

type Palette = keyof typeof palettes

const defs = `
  <defs>
    ${Object.entries(palettes)
      .map(
        ([name, [from, to]]) => `<linearGradient id="${name}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`
      )
      .join("")}
    <radialGradient id="backdrop" cx="0.5" cy="0.4" r="0.75">
      <stop offset="0" stop-color="#2a2730"/><stop offset="1" stop-color="#0a0a0b"/>
    </radialGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff7da" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#fff7da" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
  </defs>`

function frame(content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  ${defs}
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#backdrop)"/>
  ${content}
</svg>`
}

function star(cx: number, cy: number, r: number, opacity = 1): string {
  const points = Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? r : r * 0.42
    const angle = (Math.PI / 5) * index - Math.PI / 2
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`
  }).join(" ")
  return `<polygon points="${points}" fill="#fff7da" opacity="${opacity}"/>`
}

/** Carte vue de face, centrée en (cx, cy), inclinée de `angle` degrés. */
function card(cx: number, cy: number, w: number, angle: number, palette: Palette): string {
  const h = w * (88 / 63)
  const s = w / 200
  const x = cx - w / 2
  const y = cy - h / 2
  return `<g transform="rotate(${angle} ${cx} ${cy})">
    <rect x="${x + 6}" y="${y + 14}" width="${w}" height="${h}" rx="${12 * s}" fill="#000" opacity="0.55" filter="url(#shadow)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${12 * s}" fill="#f8c028"/>
    <rect x="${x + 8 * s}" y="${y + 8 * s}" width="${w - 16 * s}" height="${h - 16 * s}" rx="${8 * s}" fill="url(#${palette})"/>
    <rect x="${x + 18 * s}" y="${y + 22 * s}" width="${w - 80 * s}" height="${12 * s}" rx="${6 * s}" fill="#0a0a0b" opacity="0.45"/>
    <rect x="${x + 18 * s}" y="${y + 48 * s}" width="${w - 36 * s}" height="${118 * s}" rx="${6 * s}" fill="#0a0a0b" opacity="0.28"/>
    <circle cx="${cx}" cy="${y + 107 * s}" r="${48 * s}" fill="url(#glow)"/>
    ${star(cx, y + 107 * s, 36 * s)}
    <rect x="${x + 18 * s}" y="${y + 178 * s}" width="${w - 36 * s}" height="${60 * s}" rx="${6 * s}" fill="#0a0a0b" opacity="0.22"/>
  </g>`
}

const singles = frame(`
  ${card(275, 320, 190, -16, "violet")}
  ${card(525, 320, 190, 16, "sea")}
  ${card(400, 300, 210, 0, "fire")}`)

function slab(cx: number, cy: number, angle: number, grade: string, palette: Palette): string {
  const w = 230
  const h = 370
  const x = cx - w / 2
  const y = cy - h / 2
  return `<g transform="rotate(${angle} ${cx} ${cy})">
    <rect x="${x + 8}" y="${y + 16}" width="${w}" height="${h}" rx="16" fill="#000" opacity="0.5" filter="url(#shadow)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#d9dde3" opacity="0.2" stroke="#e8ecf1" stroke-width="5"/>
    <rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="70" rx="8" fill="#f4f5f7"/>
    <rect x="${x + 28}" y="${y + 34}" width="70" height="12" rx="6" fill="#b3261e"/>
    <rect x="${x + 28}" y="${y + 56}" width="100" height="9" rx="4.5" fill="#1b1b1e" opacity="0.6"/>
    <text x="${x + w - 26}" y="${y + 70}" font-family="Arial Black, Helvetica, Arial, sans-serif" font-weight="900" font-size="44" fill="#1b1b1e" text-anchor="end">${grade}</text>
  </g>
  ${card(cx, cy + 42, 160, angle, palette)}`
}

const graded = frame(`
  ${slab(300, 300, -10, "9", "sea")}
  ${slab(500, 300, 8, "10", "fire")}`)

function booster(cx: number, cy: number, angle: number, palette: Palette): string {
  const w = 190
  const h = 340
  const x = cx - w / 2
  const y = cy - h / 2
  const teeth = (top: number, flip: boolean) =>
    Array.from({ length: 13 }, (_, index) => {
      const tx = x + (index * w) / 12
      const ty = top + (index % 2 === 0 ? 0 : flip ? -10 : 10)
      return `${tx.toFixed(1)},${ty}`
    }).join(" ")
  return `<g transform="rotate(${angle} ${cx} ${cy})">
    <rect x="${x + 8}" y="${y + 16}" width="${w}" height="${h}" rx="8" fill="#000" opacity="0.5" filter="url(#shadow)"/>
    <polygon points="${teeth(y, false)} ${x + w},${y + 12} ${x + w},${y + h - 12} ${teeth(
      y + h,
      true
    )
      .split(" ")
      .reverse()
      .join(" ")} ${x},${y + h - 12} ${x},${y + 12}" fill="url(#${palette})"/>
    <rect x="${x}" y="${y + 30}" width="${w}" height="26" fill="#0a0a0b" opacity="0.25"/>
    <circle cx="${cx}" cy="${cy + 10}" r="70" fill="url(#glow)"/>
    ${star(cx, cy + 10, 56)}
  </g>`
}

const sealed = frame(`
  <rect x="300" y="160" width="330" height="330" fill="#000" opacity="0.45" filter="url(#shadow)"/>
  <polygon points="290,170 590,170 660,120 360,120" fill="#d6452f" opacity="0.85"/>
  <polygon points="590,170 660,120 660,420 590,470" fill="#0a0a0b" opacity="0.55"/>
  <rect x="290" y="170" width="300" height="300" fill="url(#fire)"/>
  <circle cx="440" cy="320" r="95" fill="url(#glow)"/>
  ${star(440, 320, 72)}
  ${booster(225, 330, -12, "sea")}`)

const accessories = frame(`
  <rect x="140" y="130" width="300" height="380" rx="16" fill="#000" opacity="0.5" filter="url(#shadow)"/>
  <rect x="130" y="115" width="300" height="380" rx="16" fill="#131315" stroke="#f8c028" stroke-width="8"/>
  <rect x="130" y="115" width="26" height="380" fill="#f8c028"/>
  ${Array.from({ length: 9 }, (_, index) => {
    const col = index % 3
    const row = Math.floor(index / 3)
    return `<rect x="${178 + col * 82}" y="${145 + row * 112}" width="70" height="98" rx="6" fill="#26252a" stroke="#f8c028" stroke-width="2"/>`
  }).join("")}
  ${Array.from({ length: 4 }, (_, index) => {
    const offset = index * 22
    return `<rect x="${470 + offset}" y="${150 + offset}" width="190" height="265" rx="14" fill="${index === 3 ? "url(#gold)" : "#2b2a2e"}" stroke="#a8a299" stroke-width="3" opacity="${0.55 + index * 0.15}"/>`
  }).join("")}`)

const images: Record<string, string> = {
  "cartes-a-l-unite": singles,
  "cartes-gradees": graded,
  scelle: sealed,
  accessoires: accessories,
}

await mkdir(OUTPUT, { recursive: true })
for (const [slug, svg] of Object.entries(images)) {
  const file = join(OUTPUT, `${slug}.webp`)
  const info = await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(file)
  console.log(`${slug}.webp : ${Math.round(info.size / 1024)} Ko`)
}
