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
