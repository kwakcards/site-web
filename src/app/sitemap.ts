import type { MetadataRoute } from "next"

import { legal } from "@/config/legal"
import { sitePages } from "@/config/site-pages"
import { getSiteUrl } from "@/lib/env"

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl()

  return sitePages.map((page) => ({
    url: `${site}${page.path === "/" ? "" : page.path}`,
    ...(page.legal ? { lastModified: new Date(legal.updatedAt) } : {}),
  }))
}
