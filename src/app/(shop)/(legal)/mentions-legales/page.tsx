import type { Metadata } from "next"
import Link from "next/link"

import { Fill } from "@/components/legal/fill"
import { LegalPage } from "@/components/legal/legal-page"
import { MediatorDetails, SellerIdentity } from "@/components/legal/seller-identity"
import { legal } from "@/config/legal"
import { getSiteUrl } from "@/lib/env"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergeur et informations légales du site Kwak & Cards.",
  alternates: { canonical: "/mentions-legales" },
}

export default function LegalNoticePage() {
  const { host, seller } = legal

  return (
    <LegalPage
      title="Mentions légales"
      intro={
        <p>
          Informations prévues par l&apos;article 1-1 de la loi n° 2004-575 du 21 juin 2004 pour la
          confiance dans l&apos;économie numérique (LCEN).
        </p>
      }
      sections={[
        {
          id: "editeur",
          title: "Éditeur du site",
          content: (
            <>
              <p>
                Le site {getSiteUrl()} (ci-après « le Site ») est édité par le vendeur suivant :
              </p>
              <SellerIdentity />
            </>
          ),
        },
        {
          id: "publication",
          title: "Directeur de la publication",
          content: (
            <p>
              <Fill
                value={seller.publicationDirector}
                label="directeur ou directrice de la publication"
              />
            </p>
          ),
        },
        {
          id: "hebergement",
          title: "Hébergement",
          content: (
            <>
              <p>Le Site est hébergé par :</p>
              <p>
                {host.name}
                <br />
                {host.address}
                <br />
                Téléphone : {host.phone}
                <br />
                <a href={host.website}>{host.website.replace("https://", "")}</a>
              </p>
              <p>
                Les données de la boutique (catalogue, commandes, images) sont stockées dans
                l&apos;Union européenne par Supabase. Le détail des prestataires figure dans la{" "}
                <Link href="/confidentialite">politique de confidentialité</Link>.
              </p>
            </>
          ),
        },
        {
          id: "mediation",
          title: "Médiation de la consommation",
          content: (
            <>
              <p>
                En cas de litige non résolu après une réclamation écrite auprès du vendeur, le
                consommateur peut recourir gratuitement au médiateur de la consommation suivant
                (articles L. 612-1 et R. 616-1 du code de la consommation) :
              </p>
              <MediatorDetails />
              <p>
                Les conditions de saisine sont détaillées dans les{" "}
                <Link href="/cgv#reclamations">conditions générales de vente</Link>.
              </p>
            </>
          ),
        },
        {
          id: "propriete-intellectuelle",
          title: "Propriété intellectuelle",
          content: (
            <>
              <p>
                Les textes, photographies, logos et éléments graphiques du Site appartiennent à{" "}
                {seller.tradeName} ou à leurs auteurs. Toute reproduction ou réutilisation sans
                autorisation est interdite (article L. 122-4 du code de la propriété
                intellectuelle).
              </p>
              <p>
                Les noms de jeux, de cartes, de personnages et d&apos;extensions cités sur le Site
                sont des marques ou des œuvres appartenant à leurs titulaires respectifs.{" "}
                {seller.tradeName} est un revendeur indépendant : il n&apos;est ni affilié à ces
                titulaires, ni sponsorisé ou approuvé par eux. Les photographies des cartes à
                l&apos;unité et des cartes gradées représentent les articles réellement mis en
                vente.
              </p>
            </>
          ),
        },
        {
          id: "credits",
          title: "Crédits",
          content: (
            <ul>
              <li>Polices Knewave, Archivo Black et Inter : licence SIL Open Font License 1.1.</li>
              <li>Icônes Lucide : licence ISC.</li>
            </ul>
          ),
        },
        {
          id: "donnees",
          title: "Données personnelles et cookies",
          content: (
            <p>
              Voir la <Link href="/confidentialite">politique de confidentialité</Link> et la{" "}
              <Link href="/cookies">politique cookies</Link>.
            </p>
          ),
        },
      ]}
    />
  )
}
