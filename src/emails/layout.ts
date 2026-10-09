import { brand } from "@/config/brand"

/*
 * Mise en page commune des emails, aux couleurs de Kwak & Cards (theme.css) :
 * fond noir, carte sombre, accent jaune doré, bouton en relief comme sur le site.
 * HTML en tableaux et styles en ligne, seule forme lue par toutes les messageries
 * (Gmail, Outlook, Apple Mail). Pas de police web : repli sur Arial Black / Arial.
 */

const color = {
  black: "#0a0a0b",
  ink: "#131315",
  raised: "#1b1b1e",
  line: "#2b2a2e",
  yellow: "#f8c028",
  yellowDeep: "#f0a818",
  cream: "#f2ebe1",
  muted: "#a8a299",
}

const fontBody = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
const fontHeading = "'Archivo Black', 'Arial Black', 'Helvetica Neue', Arial, sans-serif"

/** Échappe un texte (souvent saisi par un visiteur) avant de l'insérer en HTML. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

/** Paragraphe de texte courant ; les retours à la ligne sont conservés. */
export function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;font-family:${fontBody};font-size:15px;line-height:24px;color:${color.cream}">${escapeHtml(text).replaceAll("\n", "<br>")}</p>`
}

/** Intertitre en capitales, comme les titres de section du site. */
export function heading(text: string): string {
  return `<p style="margin:28px 0 12px;font-family:${fontHeading};font-size:13px;line-height:18px;letter-spacing:1px;text-transform:uppercase;color:${color.yellow}">${escapeHtml(text)}</p>`
}

/** Tableau « intitulé / valeur » (récapitulatif d'une demande). */
export function details(rows: [string, string][]): string {
  const cells = rows
    .map(
      ([label, value], index) => `<tr>
        <td valign="top" style="padding:12px 16px;width:38%;font-family:${fontBody};font-size:13px;line-height:20px;color:${color.muted};${index > 0 ? `border-top:1px solid ${color.line};` : ""}">${escapeHtml(label)}</td>
        <td valign="top" style="padding:12px 16px;font-family:${fontBody};font-size:14px;line-height:20px;color:${color.cream};${index > 0 ? `border-top:1px solid ${color.line};` : ""}">${escapeHtml(value).replaceAll("\n", "<br>")}</td>
      </tr>`
    )
    .join("")
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;background:${color.raised};border:1px solid ${color.line};border-radius:12px">${cells}</table>`
}

/** Étapes numérotées (pastilles jaunes, comme sur la page Rachat). */
export function steps(items: string[]): string {
  const rows = items
    .map(
      (item, index) => `<tr>
        <td valign="top" style="padding:0 12px 12px 0;width:28px">
          <div style="width:28px;height:28px;border-radius:14px;background:${color.yellow};color:${color.black};font-family:${fontHeading};font-size:13px;line-height:28px;text-align:center">${index + 1}</div>
        </td>
        <td valign="top" style="padding:4px 0 12px;font-family:${fontBody};font-size:15px;line-height:22px;color:${color.cream}">${escapeHtml(item)}</td>
      </tr>`
    )
    .join("")
  return `<table role="presentation" cellpadding="0" cellspacing="0">${rows}</table>`
}

/** Bouton jaune en relief (bord inférieur plus foncé), lisible même sans images. */
export function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px"><tr>
    <td style="border-radius:10px;background:${color.yellow};border-bottom:4px solid ${color.yellowDeep}">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 26px;font-family:${fontHeading};font-size:14px;line-height:18px;letter-spacing:0.5px;text-transform:uppercase;color:${color.black};text-decoration:none">${escapeHtml(label)}</a>
    </td>
  </tr></table>`
}

type Layout = {
  /** Adresse publique du site, pour les liens et le logo. */
  siteUrl: string
  /** Aperçu affiché par la messagerie à côté du sujet. */
  preheader: string
  eyebrow: string
  title: string
  /** Contenu déjà en HTML (paragraphes, tableaux, bouton…). */
  body: string
  /** Mentions de bas de page, en texte. */
  footer: string[]
}

/** Document HTML complet d'un email. */
export function renderEmail({ siteUrl, preheader, eyebrow, title, body, footer }: Layout): string {
  // Depuis un poste de développement, les images viennent du site en ligne.
  const assets = siteUrl.startsWith("http://localhost") ? brand.publicUrl : siteUrl
  const site = siteUrl.replace(/^https?:\/\/(www\.)?/, "")

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark only">
<meta name="supported-color-schemes" content="dark only">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${color.black}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${color.black}">
  <tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
      <tr><td align="center" style="padding:0 0 24px">
        <a href="${escapeHtml(siteUrl)}"><img src="${escapeHtml(assets + brand.emailLogo)}" width="120" height="120" alt="${escapeHtml(brand.name)}" style="display:block;border:0"></a>
      </td></tr>
      <tr><td style="background:${color.ink};border:1px solid ${color.line};border-top:4px solid ${color.yellow};border-radius:16px;padding:32px 28px">
        <p style="margin:0 0 8px;font-family:${fontHeading};font-size:12px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:${color.yellow}">${escapeHtml(eyebrow)}</p>
        <h1 style="margin:0 0 20px;font-family:${fontHeading};font-size:26px;line-height:32px;text-transform:uppercase;color:${color.cream}">${escapeHtml(title)}</h1>
        ${body}
      </td></tr>
      <tr><td align="center" style="padding:24px 12px 0;font-family:${fontBody};font-size:12px;line-height:18px;color:${color.muted}">
        ${footer.map((line) => `<p style="margin:0 0 8px">${escapeHtml(line)}</p>`).join("")}
        <p style="margin:0"><a href="${escapeHtml(siteUrl)}" style="color:${color.yellow};text-decoration:none">${escapeHtml(site)}</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}
