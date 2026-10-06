import { brand } from "@/config/brand"
import { legal } from "@/config/legal"
import { getSiteUrl } from "@/lib/env"

/**
 * Description schema.org de la boutique : identité, politique de retour
 * (droit de rétractation de 14 jours) et site web. Seules les informations
 * renseignées dans src/config/legal.ts sont publiées.
 */
export function storeStructuredData() {
  const site = getSiteUrl()
  const { seller } = legal

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": `${site}/#store`,
        name: brand.name,
        url: site,
        logo: `${site}${brand.logo.src}`,
        description: brand.description,
        ...(seller.email ? { email: seller.email } : {}),
        ...(seller.phone ? { telephone: seller.phone } : {}),
        ...(seller.legalName ? { legalName: seller.legalName } : {}),
        ...(brand.social.length > 0 ? { sameAs: brand.social.map((network) => network.url) } : {}),
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "FR",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 14,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
          merchantReturnLink: `${site}/politique-de-remboursement`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: brand.name,
        inLanguage: "fr-FR",
        publisher: { "@id": `${site}/#store` },
      },
    ],
  }
}

type ProductForStructuredData = {
  slug: string
  name: string
  description: string | null
  subtitle: string | null
  game: string | null
  card_number: string | null
  condition: string | null
  is_graded: boolean
  price_cents: number
  stock: number
  images: { url: string }[]
  category: { slug: string; name: string } | null
}

/**
 * Fiche produit schema.org (Product + Offer) et fil d'Ariane. Les cartes à
 * l'unité et gradées sont des biens d'occasion (voir les CGV) ; le reste est neuf.
 */
export function productStructuredData(product: ProductForStructuredData) {
  const site = getSiteUrl()
  const url = `${site}/produit/${product.slug}`
  const used = product.is_graded || product.condition != null

  const breadcrumb = [
    { name: "Accueil", item: site },
    { name: "Catalogue", item: `${site}/boutique` },
    ...(product.category
      ? [{ name: product.category.name, item: `${site}/boutique/${product.category.slug}` }]
      : []),
    { name: product.name, item: url },
  ]

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        url,
        description: product.description || product.subtitle || product.name,
        ...(product.images.length > 0 ? { image: product.images.map((image) => image.url) } : {}),
        ...(product.game ? { brand: { "@type": "Brand", name: product.game } } : {}),
        ...(product.card_number ? { mpn: product.card_number } : {}),
        ...(product.category ? { category: product.category.name } : {}),
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "EUR",
          price: (product.price_cents / 100).toFixed(2),
          availability:
            product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: used
            ? "https://schema.org/UsedCondition"
            : "https://schema.org/NewCondition",
          seller: { "@id": `${site}/#store` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumb.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      },
    ],
  }
}
