import type { MetadataRoute } from "next"

import { legal } from "@/config/legal"
import { sitePages } from "@/config/site-pages"
import { getSiteUrl } from "@/lib/env"
import { getCategories, getSitemapProducts } from "@/server/queries/catalog"

// Pages fixes, puis catégories et fiches produits visibles (lues en base, mises
// en cache et rafraîchies à chaque modification du catalogue dans l'admin).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl()
  const [categories, products] = await Promise.all([getCategories(), getSitemapProducts()])

  return [
    ...sitePages.map((page) => ({
      url: `${site}${page.path === "/" ? "" : page.path}`,
      ...(page.legal ? { lastModified: new Date(legal.updatedAt) } : {}),
    })),
    ...categories.map((category) => ({ url: `${site}/boutique/${category.slug}` })),
    ...products.map((product) => ({
      url: `${site}/produit/${product.slug}`,
      lastModified: new Date(product.updatedAt),
    })),
  ]
}
