import type { Metadata } from "next"
import Link from "next/link"

import { LegalPage } from "@/components/legal/legal-page"
import { legal } from "@/config/legal"

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Règles d'utilisation du site Kwak & Cards, y compris par des agents automatisés.",
  alternates: { canonical: "/conditions-utilisation" },
}

export default function TermsOfUsePage() {
  const { tradeName } = legal.seller

  return (
    <LegalPage
      title="Conditions générales d'utilisation"
      intro={
        <p>
          Les présentes conditions générales d&apos;utilisation (les « CGU ») encadrent
          l&apos;utilisation du site {tradeName} (le « Site »). Les achats sont régis par les{" "}
          <Link href="/cgv" className="underline underline-offset-4">
            conditions générales de vente
          </Link>
          .
        </p>
      }
      sections={[
        {
          id: "acces",
          title: "Accès au Site",
          content: (
            <>
              <p>
                Le Site est accessible gratuitement à toute personne disposant d&apos;un accès à
                internet ; les frais de connexion restent à sa charge. La consultation du catalogue
                ne nécessite aucune inscription.
              </p>
              <p>
                L&apos;éditeur s&apos;efforce d&apos;assurer la disponibilité du Site mais peut en
                suspendre l&apos;accès, notamment pour maintenance, sans que cela ouvre droit à
                indemnité.
              </p>
            </>
          ),
        },
        {
          id: "utilisation",
          title: "Utilisation autorisée",
          content: (
            <>
              <p>
                L&apos;utilisateur s&apos;engage à utiliser le Site de manière loyale. Il est
                interdit :
              </p>
              <ul>
                <li>de passer des commandes fictives ou de mauvaise foi ;</li>
                <li>
                  de tenter d&apos;accéder sans autorisation à l&apos;espace d&apos;administration,
                  aux données d&apos;autres personnes ou aux systèmes du Site (article 323-1 du code
                  pénal) ;
                </li>
                <li>
                  de perturber le fonctionnement du Site, notamment en le surchargeant de requêtes
                  ou en y introduisant un programme malveillant ;
                </li>
                <li>
                  de reproduire les contenus du Site (textes, photographies) à des fins commerciales
                  sans autorisation.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "agents",
          title: "Robots et agents d'intelligence artificielle",
          content: (
            <>
              <p>
                La consultation du Site par des outils automatisés (moteurs de recherche, agents
                d&apos;intelligence artificielle, navigateurs assistés) est autorisée, dans le
                respect du fichier <a href="/robots.txt">robots.txt</a>, sans surcharger le service
                ni contourner ses mesures de sécurité. Un résumé du Site destiné à ces outils est
                disponible à l&apos;adresse <a href="/llms.txt">/llms.txt</a>.
              </p>
              <p>
                Une commande passée par l&apos;intermédiaire d&apos;un agent engage la personne pour
                le compte de laquelle elle est passée. Elle suppose l&apos;accord explicite de cette
                personne, son acceptation des conditions générales de vente et sa validation de
                l&apos;obligation de paiement.
              </p>
            </>
          ),
        },
        {
          id: "propriete",
          title: "Propriété intellectuelle",
          content: (
            <p>
              Les contenus du Site sont protégés par le droit de la propriété intellectuelle. Les
              marques des jeux de cartes cités appartiennent à leurs titulaires respectifs ;{" "}
              {tradeName} est un revendeur indépendant, non affilié à ces titulaires. Voir les{" "}
              <Link href="/mentions-legales#propriete-intellectuelle">mentions légales</Link>.
            </p>
          ),
        },
        {
          id: "liens",
          title: "Liens hypertextes",
          content: (
            <p>
              Le Site peut contenir des liens vers des sites tiers, sur lesquels l&apos;éditeur
              n&apos;exerce aucun contrôle et dont il ne garantit pas le contenu. Tout lien vers le
              Site est autorisé, à condition de ne pas porter atteinte à son image ni de laisser
              croire à un partenariat qui n&apos;existe pas.
            </p>
          ),
        },
        {
          id: "responsabilite",
          title: "Responsabilité",
          content: (
            <p>
              L&apos;éditeur veille à l&apos;exactitude des informations publiées et les corrige dès
              qu&apos;une erreur lui est signalée. Dans les limites prévues par la loi, il ne peut
              être tenu responsable d&apos;une interruption du Site ou de dommages résultant
              d&apos;une utilisation non conforme aux présentes CGU. Ces stipulations ne limitent en
              rien les droits que les consommateurs tiennent de la loi.
            </p>
          ),
        },
        {
          id: "administration",
          title: "Espace d'administration",
          content: (
            <p>
              L&apos;espace d&apos;administration est réservé au vendeur. Aucun compte n&apos;est
              proposé aux visiteurs : les commandes se passent sans inscription.
            </p>
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
        {
          id: "modification",
          title: "Modification des CGU et droit applicable",
          content: (
            <p>
              Les CGU peuvent être modifiées à tout moment ; la version applicable est celle publiée
              sur le Site lors de son utilisation. Les CGU sont soumises au droit français.
            </p>
          ),
        },
      ]}
    />
  )
}
