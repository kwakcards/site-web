import type { Metadata } from "next"
import Link from "next/link"

import { Fill } from "@/components/legal/fill"
import { LegalPage } from "@/components/legal/legal-page"
import { SellerEmail } from "@/components/legal/seller-identity"
import { legal } from "@/config/legal"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Données personnelles traitées par Kwak & Cards : finalités, bases légales, durées de conservation, destinataires et droits.",
  alternates: { canonical: "/confidentialite" },
}

type Processing = {
  title: string
  data: React.ReactNode
  basis: React.ReactNode
  retention: React.ReactNode
}

const processings: Processing[] = [
  {
    title: "Traitement de vos commandes",
    data: (
      <>
        Adresse email ; nom et prénom ; adresse de livraison (uniquement en cas d&apos;envoi) ;
        numéro de téléphone (facultatif, transmis au transporteur pour le suivi) ; contenu de la
        commande, mode de livraison et moyen de paiement choisis ; note facultative. Ces données
        servent aussi à vous envoyer les emails liés à la commande (confirmation, instructions de
        paiement, expédition).
      </>
    ),
    basis: <>Exécution du contrat (article 6.1.b du RGPD).</>,
    retention: (
      <>
        Pendant la relation contractuelle (livraison, rétractation, garanties légales), puis en
        archives : 5 ans à compter de la commande à titre de preuve ; 10 ans pour les pièces
        comptables (article L. 123-22 du code de commerce) et pour les contrats d&apos;un montant
        d&apos;au moins 120 € (article L. 213-1 du code de la consommation).
      </>
    ),
  },
  {
    title: "Paiements et remboursements",
    data: (
      <>
        Moyen de paiement choisi, date et référence du paiement. Vos coordonnées bancaires (IBAN) ne
        sont demandées que si un remboursement par virement est nécessaire. Aucune donnée de carte
        bancaire n&apos;est collectée par le site.
      </>
    ),
    basis: <>Exécution du contrat et obligations légales (article 6.1.b et c du RGPD).</>,
    retention: (
      <>
        IBAN supprimé dès que le remboursement est effectué ; autres données conservées comme les
        commandes.
      </>
    ),
  },
  {
    title: "Rétractation, garanties et réclamations",
    data: (
      <>
        Nom et prénom, adresse email, numéro de commande, articles concernés, contenu de la demande,
        date et heure de réception.
      </>
    ),
    basis: <>Obligations légales du vendeur (article 6.1.c du RGPD).</>,
    retention: <>5 ans à compter de la demande, à titre de preuve.</>,
  },
  {
    title: "Rachat de collection (si vous nous proposez vos cartes)",
    data: (
      <>
        Prénom et nom ; adresse email ; ville ; numéro de téléphone (facultatif) ; description de la
        collection (types d&apos;articles, jeux, langues, volume, valeur espérée) ; liste des
        cartes, photos et message (facultatifs) ; certification que les articles vous appartiennent.
        Les photos sont conservées dans un espace privé, accessible au seul vendeur.
      </>
    ),
    basis: (
      <>
        Mesures précontractuelles prises à votre demande : étudier votre collection et vous faire
        une offre (article 6.1.b du RGPD).
      </>
    ),
    retention: (
      <>
        Sans rachat : supprimées au plus tard 12 mois après notre dernier échange. En cas de rachat
        : informations nécessaires aux obligations légales du vendeur (registre des achats
        d&apos;objets d&apos;occasion, comptabilité) conservées pendant les durées prévues par la
        loi.
      </>
    ),
  },
  {
    title: "Newsletter (uniquement si vous vous inscrivez)",
    data: <>Adresse email, date et origine de l&apos;inscription (preuve de votre consentement).</>,
    basis: (
      <>
        Consentement (article 6.1.a du RGPD et article L. 34-5 du code des postes et des
        communications électroniques), retirable à tout moment grâce au lien de désinscription
        présent dans chaque email.
      </>
    ),
    retention: (
      <>
        Jusqu&apos;à votre désinscription ou, au plus tard, 3 ans après votre dernier contact avec
        nous (par exemple un clic dans un email).
      </>
    ),
  },
  {
    title: "Sécurité et prévention des abus",
    data: (
      <>
        Empreinte non réversible (hachage) de votre adresse IP, associée à une commande en attente
        de paiement ; journaux techniques de l&apos;hébergeur (adresse IP, date, page demandée).
      </>
    ),
    basis: (
      <>
        Intérêt légitime (article 6.1.f du RGPD) : empêcher les commandes abusives qui bloqueraient
        le stock et protéger le site contre les attaques.
      </>
    ),
    retention: (
      <>
        Empreinte supprimée dès que la commande est payée, annulée ou expirée, et au plus tard après
        30 jours ; journaux techniques conservés par l&apos;hébergeur pour une durée limitée.
      </>
    ),
  },
  {
    title: "Échanges par email ou téléphone",
    data: <>Les informations que vous nous communiquez.</>,
    basis: <>Intérêt légitime : répondre à vos questions (article 6.1.f du RGPD).</>,
    retention: <>3 ans après votre dernier contact.</>,
  },
  {
    title: "Exercice de vos droits",
    data: <>Informations nécessaires au traitement de votre demande.</>,
    basis: <>Obligation légale (article 6.1.c du RGPD).</>,
    retention: <>Jusqu&apos;à la réponse, puis 5 ans à titre de preuve.</>,
  },
  {
    title: "Espace d'administration (vendeur uniquement)",
    data: (
      <>
        Adresse email, mot de passe (enregistré sous forme hachée, jamais en clair), journaux de
        connexion.
      </>
    ),
    basis: <>Intérêt légitime : sécuriser l&apos;accès à la gestion de la boutique.</>,
    retention: <>Pendant la durée d&apos;existence du compte.</>,
  },
]

export default function PrivacyPolicyPage() {
  const { seller } = legal

  return (
    <LegalPage
      title="Politique de confidentialité"
      intro={
        <p>
          Cette politique explique quelles données personnelles {seller.tradeName} traite, pourquoi,
          combien de temps, et comment exercer vos droits, conformément au règlement (UE) 2016/679
          (RGPD) et à la loi n° 78-17 du 6 janvier 1978 « Informatique et Libertés ».
        </p>
      }
      sections={[
        {
          id: "responsable",
          title: "Responsable du traitement",
          content: (
            <p>
              Le responsable du traitement est{" "}
              <Fill value={seller.legalName} label="nom ou dénomination sociale" /> (
              {seller.tradeName}), <Fill value={seller.address} label="adresse postale" />,
              joignable à l&apos;adresse <SellerEmail />.
            </p>
          ),
        },
        {
          id: "principes",
          title: "Ce que nous ne collectons pas",
          content: (
            <>
              <p>Seules les données nécessaires sont demandées :</p>
              <ul>
                <li>pas de compte client : vous commandez sans vous inscrire ;</li>
                <li>ni civilité, ni date de naissance ;</li>
                <li>
                  le numéro de téléphone est facultatif, et l&apos;adresse de livraison n&apos;est
                  demandée qu&apos;en cas d&apos;envoi ;
                </li>
                <li>aucune donnée de carte bancaire ;</li>
                <li>
                  aucun outil de mesure d&apos;audience, de publicité ou de réseau social, et aucun
                  profilage ;
                </li>
                <li>vos données ne sont jamais vendues ni louées.</li>
              </ul>
            </>
          ),
        },
        {
          id: "traitements",
          title: "Données traitées, finalités et durées",
          content: (
            <>
              {processings.map((processing) => (
                <div key={processing.title}>
                  <h3>{processing.title}</h3>
                  <dl>
                    <dt>Données</dt>
                    <dd>{processing.data}</dd>
                    <dt>Base légale</dt>
                    <dd>{processing.basis}</dd>
                    <dt>Durée de conservation</dt>
                    <dd>{processing.retention}</dd>
                  </dl>
                </div>
              ))}
              <p>
                Dans les formulaires, les champs obligatoires sont signalés : sans eux, la demande
                ne peut pas être traitée. Aucune décision automatisée n&apos;est prise à votre
                égard.
              </p>
            </>
          ),
        },
        {
          id: "destinataires",
          title: "Destinataires",
          content: (
            <>
              <p>
                Vos données sont accessibles uniquement aux personnes habilitées du vendeur et à ses
                prestataires techniques (sous-traitants), qui agissent sur ses instructions :
              </p>
              <ul>
                <li>
                  <strong>Vercel Inc.</strong> (États-Unis) : hébergement du site ;
                </li>
                <li>
                  <strong>Supabase Pte. Ltd.</strong> : base de données, authentification de
                  l&apos;espace d&apos;administration et stockage des images, avec des données
                  hébergées dans l&apos;Union européenne (Stockholm, Suède) ;
                </li>
                <li>
                  <strong>Plus Five Five, Inc.</strong> (« Resend », États-Unis) : envoi des emails.
                </li>
              </ul>
              <p>Certaines données sont aussi transmises, pour leur propre compte, à :</p>
              <ul>
                <li>
                  le transporteur (nom, adresse de livraison et, si vous l&apos;avez indiqué,
                  téléphone) ;
                </li>
                <li>l&apos;établissement ou le service de paiement que vous utilisez ;</li>
                <li>
                  le cas échéant, le médiateur de la consommation, l&apos;expert-comptable du
                  vendeur ou les autorités, lorsque la loi l&apos;exige.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "transferts",
          title: "Transferts hors de l'Union européenne",
          content: (
            <p>
              Vercel et Resend sont établis aux États-Unis. Ces transferts sont encadrés par le
              cadre de protection des données UE–États-Unis (Data Privacy Framework), auquel ces
              prestataires déclarent adhérer, et par les clauses contractuelles types de la
              Commission européenne prévues dans leurs accords de traitement des données. Les
              données stockées par Supabase restent dans l&apos;Union européenne ; tout accès depuis
              un pays tiers est encadré par des clauses contractuelles types.
            </p>
          ),
        },
        {
          id: "securite",
          title: "Sécurité",
          content: (
            <p>
              Les échanges avec le site sont chiffrés (HTTPS). L&apos;accès aux données est limité
              par des règles de sécurité appliquées directement dans la base de données,
              l&apos;espace d&apos;administration est protégé par authentification, et les mots de
              passe sont hachés.
            </p>
          ),
        },
        {
          id: "droits",
          title: "Vos droits",
          content: (
            <>
              <p>Vous disposez des droits suivants sur vos données :</p>
              <ul>
                <li>droit d&apos;accès, de rectification et d&apos;effacement ;</li>
                <li>droit à la limitation du traitement et droit à la portabilité ;</li>
                <li>
                  droit d&apos;opposition, notamment à tout moment et sans justification à la
                  prospection commerciale ;
                </li>
                <li>droit de retirer votre consentement à tout moment (newsletter) ;</li>
                <li>
                  droit de définir des directives relatives au sort de vos données après votre décès
                  (article 85 de la loi « Informatique et Libertés »).
                </li>
              </ul>
              <p>
                Pour les exercer, écrivez à <SellerEmail /> ou par courrier à l&apos;adresse du
                responsable du traitement. Une réponse vous est apportée dans un délai d&apos;un
                mois, prolongeable de deux mois si la demande est complexe. Un justificatif
                d&apos;identité ne peut être demandé qu&apos;en cas de doute raisonnable sur votre
                identité.
              </p>
              <p>
                Vous pouvez introduire une réclamation auprès de la CNIL (3 place de Fontenoy, TSA
                80715, 75334 Paris Cedex 07 ;{" "}
                <a href="https://www.cnil.fr/fr/plaintes">www.cnil.fr/fr/plaintes</a>).
              </p>
            </>
          ),
        },
        {
          id: "mineurs",
          title: "Mineurs",
          content: (
            <p>
              L&apos;inscription à la newsletter est réservée aux personnes de 15 ans et plus ; en
              dessous de cet âge, elle nécessite aussi l&apos;accord d&apos;un titulaire de
              l&apos;autorité parentale (article 45 de la loi « Informatique et Libertés »). Un
              mineur doit obtenir l&apos;accord de son représentant légal pour passer commande.
            </p>
          ),
        },
        {
          id: "cookies",
          title: "Cookies et traceurs",
          content: (
            <p>
              Le site n&apos;utilise que des traceurs strictement nécessaires à son fonctionnement :
              voir la <Link href="/cookies">politique cookies</Link>.
            </p>
          ),
        },
      ]}
    />
  )
}
