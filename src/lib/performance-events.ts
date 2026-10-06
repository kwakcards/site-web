import type { BeforeSendMiddleware } from "@vercel/speed-insights"

/** Pages privées, jamais mesurées (l'URL d'une confirmation de commande contiendra un jeton). */
const PRIVATE_PATHS = ["/admin", "/connexion", "/commande"]

function isPrivate(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

/**
 * Filtre appliqué à chaque mesure Speed Insights avant son envoi : rien pour les
 * pages privées, et ni les paramètres d'URL (recherche, filtres) ni l'ancre.
 */
export const filterPerformanceEvent: BeforeSendMiddleware = (event) => {
  const absolute = /^https?:\/\//.test(event.url)
  const url = new URL(event.url, "https://kwak.invalid")
  if (isPrivate(url.pathname)) return null
  return { ...event, url: absolute ? `${url.origin}${url.pathname}` : url.pathname }
}
