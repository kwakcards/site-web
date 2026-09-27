/**
 * Données de démonstration du catalogue (projet Supabase de DÉVELOPPEMENT uniquement).
 *
 *   node --env-file=.env.local scripts/demo/demo-catalog.mts images
 *     Génère un visuel « de démonstration » pour chaque article demo-… sans photo
 *     (SVG converti en WebP avec sharp), l'envoie dans le bucket « media » avec la
 *     session de l'admin de démo, puis crée les lignes product_images.
 *
 *   node --env-file=.env.local scripts/demo/demo-catalog.mts remove
 *     Supprime tous les articles demo-… et leurs fichiers photo.
 *
 *   node --env-file=.env.local scripts/demo/demo-catalog.mts preview <dossier>
 *     Écrit les visuels dans un dossier local, sans rien envoyer.
 *
 * Les articles eux-mêmes sont créés par supabase/demo/demo-products.sql.
 * Variables lues dans .env.local : NEXT_PUBLIC_SUPABASE_URL,
 * NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD.
 */
import { randomUUID } from "node:crypto"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"

import { createClient } from "@supabase/supabase-js"
import sharp from "sharp"

const BUCKET = "media"
const WIDTH = 630
const HEIGHT = 880

type DemoProduct = {
  id: string
  slug: string
  name: string
  game: string | null
  set_name: string | null
  card_number: string | null
  rarity: string | null
  is_graded: boolean
  grading_company: string | null
  grade: number | null
  categories: { slug: string } | null
  product_images: { id: string }[]
}

function env(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Variable manquante : ${name} (lance le script avec --env-file=.env.local).`)
    process.exit(1)
  }
  return value
}

// ---------------------------------------------------------------------------
// Visuels SVG
// ---------------------------------------------------------------------------

const palettes: Record<string, [string, string]> = {
  Pokémon: ["#ffd65a", "#d6452f"],
  "One Piece": ["#e2403a", "#1d2a57"],
  "Disney Lorcana": ["#8a6cf0", "#157f86"],
  "Dragon Ball Super": ["#f7922b", "#2256c9"],
}
const brandPalette: [string, string] = ["#ffd65a", "#f0a818"]

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/** Découpe un texte en lignes d'au plus `max` caractères (sans couper les mots). */
function wrap(text: string, max: number, maxLines = 3): string[] {
  const lines: string[] = []
  let line = ""
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > max && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, maxLines)
}

function textLines(
  lines: string[],
  {
    x,
    y,
    size,
    color,
    weight = 800,
    anchor = "middle",
    lineHeight = 1.15,
  }: {
    x: number
    y: number
    size: number
    color: string
    weight?: number
    anchor?: "start" | "middle" | "end"
    lineHeight?: number
  }
): string {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * size * lineHeight}" font-family="Arial Black, Helvetica, Arial, sans-serif" font-weight="${weight}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${escapeXml(line)}</text>`
    )
    .join("")
}

const defs = (from: string, to: string) => `
  <defs>
    <linearGradient id="face" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.45" r="0.55">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.65"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="backdrop" cx="0.5" cy="0.35" r="0.8">
      <stop offset="0" stop-color="#26252a"/><stop offset="1" stop-color="#0a0a0b"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>`

/** Fond « photo » commun et mention de démonstration. */
function frame(content: string, from: string, to: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  ${defs(from, to)}
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#backdrop)"/>
  ${content}
  <text x="${WIDTH / 2}" y="${HEIGHT - 18}" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="15" letter-spacing="4" fill="#a8a299" text-anchor="middle">VISUEL DE DÉMONSTRATION</text>
</svg>`
}

function star(cx: number, cy: number, r: number, color: string, opacity = 1): string {
  const points = Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? r : r * 0.42
    const angle = (Math.PI / 5) * index - Math.PI / 2
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`
  }).join(" ")
  return `<polygon points="${points}" fill="${color}" opacity="${opacity}"/>`
}

/** Recto d'une carte, dans un rectangle (x, y, w, h). */
function cardFront(product: DemoProduct, x: number, y: number, w: number, h: number): string {
  const s = w / 500
  const title = wrap(product.name, 16, 2)
  const footer = [product.set_name, product.card_number].filter(Boolean).join(" · ")
  return `
  <rect x="${x + 8}" y="${y + 18}" width="${w}" height="${h}" rx="${24 * s}" fill="#000" opacity="0.55" filter="url(#shadow)"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${24 * s}" fill="#f8c028"/>
  <rect x="${x + 16 * s}" y="${y + 16 * s}" width="${w - 32 * s}" height="${h - 32 * s}" rx="${16 * s}" fill="url(#face)"/>
  ${textLines(title, { x: x + 38 * s, y: y + 72 * s, size: 36 * s, color: "#0a0a0b", anchor: "start" })}
  <rect x="${x + 38 * s}" y="${y + 170 * s}" width="${w - 76 * s}" height="${300 * s}" rx="${10 * s}" fill="#0a0a0b" opacity="0.3"/>
  <circle cx="${x + w / 2}" cy="${y + 320 * s}" r="${120 * s}" fill="url(#glow)"/>
  ${star(x + w / 2, y + 320 * s, 92 * s, "#fff7da")}
  ${star(x + w / 2 - 150 * s, y + 225 * s, 24 * s, "#fff7da", 0.7)}
  ${star(x + w / 2 + 155 * s, y + 420 * s, 18 * s, "#fff7da", 0.6)}
  <rect x="${x + 38 * s}" y="${y + 500 * s}" width="${w - 76 * s}" height="${120 * s}" rx="${10 * s}" fill="#0a0a0b" opacity="0.22"/>
  ${textLines(wrap(product.rarity ?? product.game ?? "", 26, 1), { x: x + w / 2, y: y + 552 * s, size: 22 * s, color: "#fff7da", weight: 700 })}
  ${textLines(wrap(footer, 30, 1), { x: x + w / 2, y: y + 592 * s, size: 20 * s, color: "#fff7da", weight: 700 })}
  ${textLines([product.game ?? ""], { x: x + w - 38 * s, y: y + h - 34 * s, size: 18 * s, color: "#0a0a0b", weight: 700, anchor: "end" })}`
}

/** Dos de carte générique. */
function cardBack(x: number, y: number, w: number, h: number): string {
  const s = w / 500
  return `
  <rect x="${x + 8}" y="${y + 18}" width="${w}" height="${h}" rx="${24 * s}" fill="#000" opacity="0.55" filter="url(#shadow)"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${24 * s}" fill="#1b1b1e" stroke="#f8c028" stroke-width="${14 * s}"/>
  <circle cx="${x + w / 2}" cy="${y + h / 2}" r="${150 * s}" fill="url(#face)"/>
  <circle cx="${x + w / 2}" cy="${y + h / 2}" r="${150 * s}" fill="none" stroke="#0a0a0b" stroke-width="${12 * s}"/>
  ${textLines(["KWAK"], { x: x + w / 2, y: y + h / 2 - 8 * s, size: 64 * s, color: "#0a0a0b" })}
  ${textLines(["& CARDS"], { x: x + w / 2, y: y + h / 2 + 58 * s, size: 40 * s, color: "#0a0a0b" })}`
}

function singleCard(product: DemoProduct, back: boolean): string {
  const [from, to] = palettes[product.game ?? ""] ?? brandPalette
  const w = 460
  const h = 642
  const x = (WIDTH - w) / 2
  const y = 90
  return frame(back ? cardBack(x, y, w, h) : cardFront(product, x, y, w, h), from, to)
}

function gradedCard(product: DemoProduct, back: boolean): string {
  const [from, to] = palettes[product.game ?? ""] ?? brandPalette
  const grade = product.grade != null ? String(product.grade).replace(".", ",") : ""
  const slab = `
  <rect x="93" y="42" width="444" height="790" rx="26" fill="#000" opacity="0.5" filter="url(#shadow)"/>
  <rect x="85" y="30" width="460" height="790" rx="26" fill="#d9dde3" opacity="0.18" stroke="#e8ecf1" stroke-width="6"/>
  <rect x="110" y="55" width="410" height="130" rx="12" fill="#f4f5f7"/>
  ${textLines([product.grading_company ?? ""], { x: 135, y: 105, size: 30, color: "#b3261e", anchor: "start" })}
  ${textLines(wrap(product.name, 16, 2), { x: 135, y: 138, size: 18, color: "#1b1b1e", weight: 700, anchor: "start" })}
  ${textLines([grade], { x: 495, y: 150, size: 64, color: "#1b1b1e", anchor: "end" })}`
  const card = back ? cardBack(125, 215, 380, 530) : cardFront(product, 125, 215, 380, 530)
  return frame(`${slab}${card}`, from, to)
}

function sealed(product: DemoProduct): string {
  const [from, to] = palettes[product.game ?? ""] ?? brandPalette
  const title = wrap(product.name, 18, 3)
  const subtitle = product.set_name ?? product.game ?? ""

  if (/^(booster|tripack)/i.test(product.name)) {
    // Sachet de booster : bords sertis en haut et en bas.
    const teeth = (y: number) =>
      Array.from(
        { length: 23 },
        (_, index) => `${130 + index * 16},${y + (index % 2 === 0 ? 0 : 12)}`
      ).join(" ")
    return frame(
      `<rect x="138" y="96" width="370" height="690" rx="10" fill="#000" opacity="0.5" filter="url(#shadow)"/>
      <polygon points="130,90 ${teeth(78)} 500,90 500,770 ${teeth(782).split(" ").reverse().join(" ")} 130,770" fill="url(#face)"/>
      <rect x="130" y="110" width="370" height="40" fill="#0a0a0b" opacity="0.25"/>
      <circle cx="315" cy="420" r="150" fill="url(#glow)"/>
      ${star(315, 420, 110, "#fff7da")}
      ${textLines(title, { x: 315, y: 220, size: 34, color: "#0a0a0b" })}
      ${textLines(wrap(subtitle, 24, 2), { x: 315, y: 640, size: 24, color: "#fff7da", weight: 700 })}`,
      from,
      to
    )
  }

  // Boîte en perspective : face avant, dessus et côté.
  return frame(
    `<rect x="90" y="250" width="420" height="470" fill="#000" opacity="0.5" filter="url(#shadow)"/>
    <polygon points="80,230 440,230 540,170 180,170" fill="${to}" opacity="0.85"/>
    <polygon points="440,230 540,170 540,640 440,700" fill="#0a0a0b" opacity="0.55"/>
    <rect x="80" y="230" width="360" height="470" fill="url(#face)"/>
    <circle cx="260" cy="470" r="130" fill="url(#glow)"/>
    ${star(260, 470, 90, "#fff7da")}
    ${textLines(wrap(product.name, 20, 3), { x: 260, y: 290, size: 28, color: "#0a0a0b" })}
    ${textLines(wrap(subtitle, 22, 2), { x: 260, y: 660, size: 22, color: "#fff7da", weight: 700 })}`,
    from,
    to
  )
}

function accessory(product: DemoProduct): string {
  const [from, to] = brandPalette
  const title = wrap(product.name, 22, 3)
  let art: string

  if (/pièce/i.test(product.name)) {
    art = `<circle cx="315" cy="400" r="215" fill="#000" opacity="0.5" filter="url(#shadow)"/>
    <circle cx="315" cy="390" r="210" fill="url(#face)"/>
    <circle cx="315" cy="390" r="178" fill="none" stroke="#0a0a0b" stroke-width="6" stroke-dasharray="4 10"/>
    ${textLines(["K&C"], { x: 315, y: 420, size: 96, color: "#0a0a0b" })}`
  } else if (/classeur/i.test(product.name)) {
    const pockets = Array.from({ length: 9 }, (_, index) => {
      const col = index % 3
      const row = Math.floor(index / 3)
      return `<rect x="${170 + col * 100}" y="${190 + row * 138}" width="86" height="120" rx="6" fill="#26252a" stroke="#f8c028" stroke-width="2"/>`
    }).join("")
    art = `<rect x="128" y="146" width="390" height="500" rx="18" fill="#000" opacity="0.5" filter="url(#shadow)"/>
    <rect x="120" y="130" width="390" height="500" rx="18" fill="#131315" stroke="#f8c028" stroke-width="8"/>
    <rect x="120" y="130" width="28" height="500" fill="#f8c028"/>${pockets}`
  } else {
    // Protège-cartes et toploaders : pile de protections décalées.
    const layers = Array.from({ length: 4 }, (_, index) => {
      const offset = index * 26
      return `<rect x="${150 + offset}" y="${110 + offset}" width="300" height="420" rx="16" fill="${index === 3 ? "url(#face)" : "#2b2a2e"}" stroke="#a8a299" stroke-width="3" opacity="${0.55 + index * 0.15}"/>`
    }).join("")
    art = `<rect x="160" y="150" width="380" height="480" rx="16" fill="#000" opacity="0.5" filter="url(#shadow)"/>${layers}`
  }

  return frame(
    `${art}${textLines(title, { x: 315, y: 730, size: 30, color: "#f2ebe1" })}`,
    from,
    to
  )
}

type Visual = { svg: string; alt: string }

function visualsFor(product: DemoProduct): Visual[] {
  const category = product.categories?.slug
  const label = `Visuel de démonstration : ${product.name}`
  if (category === "cartes-a-l-unite") {
    return [
      { svg: singleCard(product, false), alt: `${label}, recto` },
      { svg: singleCard(product, true), alt: `${label}, verso` },
    ]
  }
  if (category === "cartes-gradees") {
    return [
      { svg: gradedCard(product, false), alt: `${label} sous boîtier de gradation, recto` },
      { svg: gradedCard(product, true), alt: `${label} sous boîtier de gradation, verso` },
    ]
  }
  if (category === "accessoires" || !product.game) return [{ svg: accessory(product), alt: label }]
  return [{ svg: sealed(product), alt: label }]
}

// ---------------------------------------------------------------------------
// Commandes
// ---------------------------------------------------------------------------

async function main() {
  const command = process.argv[2]
  const previewDir = command === "preview" ? process.argv[3] : undefined
  if (
    !["images", "remove", "preview"].includes(command ?? "") ||
    (command === "preview" && !previewDir)
  ) {
    console.error(
      "Usage : node --env-file=.env.local scripts/demo/demo-catalog.mts <images | remove | preview <dossier>>"
    )
    process.exit(1)
  }

  const supabase = createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: env("DEMO_ADMIN_EMAIL"),
    password: env("DEMO_ADMIN_PASSWORD"),
  })
  if (authError) throw new Error(`Connexion de l'admin de démo impossible : ${authError.message}`)

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, game, set_name, card_number, rarity, is_graded, grading_company, grade, categories(slug), product_images(id)"
    )
    .like("slug", "demo-%")
    .order("slug")
  if (error) throw error
  const products = data as unknown as DemoProduct[]
  if (products.length === 0) {
    console.log("Aucun article demo-… : exécute d'abord supabase/demo/demo-products.sql.")
    return
  }

  if (previewDir) {
    await mkdir(previewDir, { recursive: true })
    for (const product of products) {
      for (const [index, visual] of visualsFor(product).entries()) {
        await sharp(Buffer.from(visual.svg))
          .webp({ quality: 82 })
          .toFile(join(previewDir, `${product.slug}-${index + 1}.webp`))
      }
    }
    console.log(`Visuels écrits dans ${previewDir}.`)
    return
  }

  if (command === "remove") {
    for (const product of products) {
      const folder = `products/${product.id}`
      const { data: files } = await supabase.storage.from(BUCKET).list(folder, { limit: 100 })
      if (files && files.length > 0) {
        const { error: removeError } = await supabase.storage
          .from(BUCKET)
          .remove(files.map((file) => `${folder}/${file.name}`))
        if (removeError) throw removeError
      }
      const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id)
      if (deleteError) throw deleteError
      console.log(`Supprimé : ${product.slug}`)
    }
    console.log(`${products.length} articles de démonstration supprimés.`)
    return
  }

  let uploaded = 0
  for (const product of products) {
    if (product.product_images.length > 0) {
      console.log(`Déjà illustré : ${product.slug}`)
      continue
    }
    const rows = []
    for (const [index, visual] of visualsFor(product).entries()) {
      const buffer = await sharp(Buffer.from(visual.svg)).webp({ quality: 82 }).toBuffer()
      const path = `products/${product.id}/${randomUUID()}.webp`
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, buffer, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      })
      if (uploadError) throw uploadError
      rows.push({ product_id: product.id, storage_path: path, alt: visual.alt, sort_order: index })
      uploaded += 1
    }
    const { error: insertError } = await supabase.from("product_images").insert(rows)
    if (insertError) throw insertError
    console.log(`Illustré : ${product.slug} (${rows.length} visuel${rows.length > 1 ? "s" : ""})`)
  }
  console.log(`Terminé : ${uploaded} visuels envoyés.`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
