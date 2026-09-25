import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/env"

/**
 * Moteurs de recherche et agents IA sont les bienvenus sur les pages publiques
 * (voir /llms.txt). Seules les pages privées ou sans intérêt sont exclues.
 */
export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/connexion", "/panier", "/commande", "/dev"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  }
}
