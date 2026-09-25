import type { Metadata } from "next"
import Link from "next/link"

import { Fill } from "@/components/legal/fill"
import { LegalGuaranteeBox } from "@/components/legal/legal-guarantee-box"
import { LegalPage } from "@/components/legal/legal-page"
import {
  MediatorDetails,
  SellerEmail,
  SellerIdentity,
  VatStatement,
} from "@/components/legal/seller-identity"
import { WithdrawalModelForm } from "@/components/legal/withdrawal-model-form"
import { cardConditions } from "@/config/catalog"
import { legal } from "@/config/legal"
import { withdrawalLink } from "@/config/navigation"
import { shopDefaults } from "@/config/shop"

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Conditions générales de vente de Kwak & Cards : commande, paiement, livraison, droit de rétractation et garanties légales.",
  alternates: { canonical: "/cgv" },
}

export default function TermsOfSalePage() {
  const { seller, shipping, paymentDeadlineHours } = legal

  return (
    <LegalPage
      title="Conditions générales de vente"
      sections={[
        {
          id: "objet",
          title: "Objet et champ d'application",
          content: (
            <>
              <p>
                Les présentes conditions générales de vente (les « CGV ») s&apos;appliquent aux
                ventes de produits conclues sur le site {seller.tradeName} (le « Site ») entre le
                vendeur désigné à l&apos;article 2 et toute personne physique agissant à des fins
                qui n&apos;entrent pas dans le cadre de son activité commerciale, industrielle,
                artisanale, libérale ou agricole (le « Client »).
              </p>
              <p>
                Le Client accepte les CGV en cochant la case prévue à cet effet avant de valider sa
                commande. Les CGV applicables sont celles en vigueur à la date de la commande. Elles
                sont accessibles à tout moment sur le Site, peuvent être enregistrées ou imprimées,
                et sont transmises au Client avec la confirmation de sa commande.
              </p>
              <p>
                Le Client déclare avoir la capacité juridique de contracter. Un mineur doit obtenir
                l&apos;accord de son représentant légal avant de passer commande. Les CGV sont
                rédigées en langue française.
              </p>
            </>
          ),
        },
        {
          id: "vendeur",
          title: "Identité du vendeur",
          content: (
            <>
              <SellerIdentity />
              <p>
                Le vendeur répond des garanties légales décrites à l&apos;article 9. Le Client peut
                en demander la mise en œuvre par email, par téléphone ou par courrier, aux
                coordonnées ci-dessus.
              </p>
            </>
          ),
        },
        {
          id: "produits",
          title: "Produits",
          content: (
            <>
              <p>
                Le Site propose des cartes à collectionner à l&apos;unité, des cartes gradées, des
                produits scellés, des pièces de collection et des accessoires. Les caractéristiques
                essentielles de chaque produit (jeu, extension, numéro, langue, rareté, état et, le
                cas échéant, gradation) figurent sur sa fiche.
              </p>
              <p>
                Les cartes à l&apos;unité et les cartes gradées sont des biens d&apos;occasion. Leur
                fiche présente des photographies de l&apos;article réellement vendu et indique son
                état selon l&apos;échelle suivante :
              </p>
              <ul>
                {cardConditions.map((condition) => (
                  <li key={condition.code}>
                    <strong>
                      {condition.label} ({condition.code})
                    </strong>{" "}
                    : {condition.description}
                  </li>
                ))}
              </ul>
              <p>
                Pour une carte gradée, la société de gradation et la note sont celles qui figurent
                sur l&apos;étiquette de son boîtier scellé ; la note reflète l&apos;appréciation de
                cette société.
              </p>
              <p>
                Les produits scellés et les accessoires sont des produits neufs, vendus dans leur
                emballage d&apos;origine ; leurs photographies sont présentées à titre
                d&apos;illustration. Le vendeur ne vend que des produits authentiques.
              </p>
              <p>
                Les produits sont proposés dans la limite des stocks disponibles ; de nombreuses
                cartes sont des pièces uniques. Si un produit se révèle indisponible après la
                commande, le Client en est informé sans délai et les sommes éventuellement versées
                pour ce produit lui sont remboursées au plus tard dans les quatorze jours.
              </p>
            </>
          ),
        },
        {
          id: "prix",
          title: "Prix",
          content: (
            <>
              <p>
                Les prix sont indiqués en euros. <VatStatement />.
              </p>
              <p>
                Les frais de livraison sont indiqués avant la validation de la commande et figurent
                dans son récapitulatif. Le prix total à payer comprend le prix des produits et les
                frais de livraison. Le prix applicable est celui affiché au moment de la commande.
              </p>
              <p>
                Lorsqu&apos;une réduction de prix est annoncée, le prix barré de référence
                correspond au prix le plus bas pratiqué par le vendeur au cours des trente jours
                précédant l&apos;application de la réduction (article L. 112-1-1 du code de la
                consommation).
              </p>
            </>
          ),
        },
        {
          id: "commande",
          title: "Commande",
          content: (
            <>
              <p>Aucun compte client n&apos;est nécessaire. Pour commander, le Client :</p>
              <ol>
                <li>ajoute les produits souhaités à son panier ;</li>
                <li>
                  indique son adresse email, son nom et son prénom, son adresse de livraison en cas
                  d&apos;envoi et, s&apos;il le souhaite, son numéro de téléphone ;
                </li>
                <li>choisit le mode de livraison et le moyen de paiement ;</li>
                <li>
                  vérifie le récapitulatif de sa commande (produits, quantités, prix, frais de
                  livraison, prix total) et corrige les éventuelles erreurs de saisie ;
                </li>
                <li>accepte les présentes CGV ;</li>
                <li>
                  valide sa commande en cliquant sur le bouton « Commander avec obligation de
                  paiement ».
                </li>
              </ol>
              <p>
                Le contrat est conclu au moment de cette validation. Le vendeur adresse alors au
                Client, par email, une confirmation de commande qui reprend son contenu, les
                instructions de paiement, les CGV et les informations relatives au droit de
                rétractation.
              </p>
              <p>
                Le vendeur peut annuler une commande pour un motif légitime, notamment une commande
                anormale ou passée de mauvaise foi ; le Client en est alors informé.
              </p>
            </>
          ),
        },
        {
          id: "paiement",
          title: "Paiement",
          content: (
            <>
              <p>
                Le paiement s&apos;effectue hors ligne, selon l&apos;un des moyens proposés lors de
                la commande (par exemple {shopDefaults.offlinePaymentMethods.join(", ")}). Les
                instructions de paiement figurent sur la page de confirmation et dans l&apos;email
                de confirmation ; le numéro de commande sert de référence. Aucune donnée de carte
                bancaire n&apos;est collectée par le Site.
              </p>
              <p>
                Le paiement doit être reçu dans un délai de {paymentDeadlineHours} heures à compter
                de la commande. Les produits commandés sont réservés au Client pendant ce délai. À
                défaut de paiement dans ce délai, la commande est automatiquement annulée et les
                produits sont remis en vente, sans frais pour le Client. Le vendeur peut prolonger
                ce délai à la demande du Client.
              </p>
              <p>
                La commande est préparée après réception du paiement. Les produits restent la
                propriété du vendeur jusqu&apos;au paiement complet du prix.
              </p>
            </>
          ),
        },
        {
          id: "livraison",
          title: "Livraison",
          content: (
            <>
              <p>
                Les produits sont livrés en {shipping.area}, par envoi postal avec suivi, ou remis
                en main propre lorsque cette option est proposée lors de la commande (les modalités
                sont alors précisées au Client).
              </p>
              <p>
                Les commandes sont expédiées dans un délai de{" "}
                <Fill value={shipping.dispatchBusinessDays} label="nombre de jours" /> jours ouvrés
                après réception du paiement. Le délai d&apos;acheminement indicatif est communiqué
                lors de la commande. À défaut d&apos;indication ou d&apos;accord quant à la date de
                livraison, le vendeur livre le bien sans retard injustifié et au plus tard trente
                jours après la conclusion du contrat (article L. 216-1 du code de la consommation).
              </p>
              <p>
                En cas de manquement du vendeur à son obligation de livraison, le Client peut
                résoudre le contrat par lettre recommandée avec demande d&apos;avis de réception ou
                par un écrit sur un autre support durable si, après avoir enjoint selon les mêmes
                modalités le vendeur d&apos;effectuer la livraison dans un délai supplémentaire
                raisonnable, celui-ci ne s&apos;est pas exécuté dans ce délai (articles L. 216-6 et
                suivants du code de la consommation). Les sommes versées sont alors remboursées au
                plus tard dans les quatorze jours.
              </p>
              <p>
                Le risque de perte ou d&apos;endommagement des produits est transféré au Client au
                moment où lui-même, ou un tiers désigné par lui, en prend physiquement possession
                (article L. 216-4 du code de la consommation).
              </p>
              <p>
                Le Client est invité à vérifier l&apos;état du colis à sa réception et à signaler
                tout dommage au transporteur et au vendeur dans les meilleurs délais. Ces démarches
                ne le privent d&apos;aucune de ses garanties légales.
              </p>
            </>
          ),
        },
        {
          id: "retractation",
          title: "Droit de rétractation",
          content: (
            <>
              <h3>Délai</h3>
              <p>
                Le Client dispose d&apos;un délai de quatorze jours pour se rétracter, sans avoir à
                motiver sa décision ni à supporter d&apos;autres coûts que ceux prévus ci-dessous.
                Ce délai court à compter de la réception du produit par le Client ou par un tiers
                qu&apos;il a désigné, autre que le transporteur. Pour une commande de plusieurs
                produits livrés séparément, il court à compter de la réception du dernier produit
                (article L. 221-18 du code de la consommation). Le délai expirant un samedi, un
                dimanche ou un jour férié ou chômé est prolongé jusqu&apos;au premier jour ouvrable
                suivant (article L. 221-19).
              </p>
              <h3>Exercice du droit de rétractation</h3>
              <p>Le Client informe le vendeur de sa décision de se rétracter :</p>
              <ul>
                <li>
                  en ligne, avec la fonction{" "}
                  <Link href={withdrawalLink.href}>« {withdrawalLink.label} »</Link>, accessible en
                  permanence depuis le pied de page du Site ; un accusé de réception mentionnant le
                  contenu de la déclaration, sa date et son heure lui est alors envoyé sans délai
                  par email ;
                </li>
                <li>
                  ou en adressant le modèle de formulaire de rétractation figurant en annexe, par
                  email (<SellerEmail />) ou par courrier à l&apos;adresse du vendeur ;
                </li>
                <li>
                  ou par toute autre déclaration, dénuée d&apos;ambiguïté, exprimant sa volonté.
                </li>
              </ul>
              <h3>Retour des produits</h3>
              <p>
                Le Client renvoie les produits à l&apos;adresse du vendeur figurant à l&apos;article
                2, sans retard excessif et au plus tard dans les quatorze jours suivant la
                communication de sa décision. Les frais directs de renvoi sont à la charge du
                Client. Un envoi suivi et protégé est recommandé, les cartes étant fragiles. En cas
                de remise en main propre, le retour peut aussi se faire en main propre, par accord
                entre les parties.
              </p>
              <p>
                La responsabilité du Client n&apos;est engagée qu&apos;en cas de dépréciation des
                produits résultant de manipulations autres que celles nécessaires pour établir leur
                nature, leurs caractéristiques et leur bon fonctionnement (article L. 221-23 du code
                de la consommation). Par exemple, ouvrir un produit scellé (booster, display,
                coffret) ou retirer une carte de son boîtier de gradation va au-delà de ces
                manipulations.
              </p>
              <h3>Remboursement</h3>
              <p>
                Le vendeur rembourse la totalité des sommes versées, y compris les frais de
                livraison initiaux, sans retard injustifié et au plus tard dans les quatorze jours à
                compter de la date à laquelle il est informé de la décision du Client. Il peut
                différer le remboursement jusqu&apos;à la récupération des produits ou jusqu&apos;à
                ce que le Client ait fourni une preuve de leur expédition, la date retenue étant
                celle du premier de ces faits. Les frais supplémentaires liés au choix exprès, par
                le Client, d&apos;un mode de livraison plus coûteux que le mode standard proposé ne
                sont pas remboursés (article L. 221-24 du code de la consommation).
              </p>
              <p>
                Le remboursement est effectué avec le même moyen de paiement que celui utilisé pour
                la commande, sauf accord exprès du Client pour un autre moyen n&apos;occasionnant
                pas de frais pour lui. Pour une commande payée par virement, le remboursement se
                fait par virement : les coordonnées bancaires nécessaires sont alors demandées au
                Client.
              </p>
              <p>
                Le droit de rétractation s&apos;applique à tous les produits vendus sur le Site.
              </p>
            </>
          ),
        },
        {
          id: "garanties",
          title: "Garanties légales",
          content: (
            <>
              <p>
                Tous les produits vendus sur le Site bénéficient de la garantie légale de conformité
                et de la garantie légale des vices cachés, dans les conditions de l&apos;encadré
                suivant.
              </p>
              <LegalGuaranteeBox />
              <p>
                Pour les biens vendus d&apos;occasion, notamment les cartes à l&apos;unité et les
                cartes gradées, les défauts de conformité qui apparaissent dans un délai de douze
                mois à compter de la délivrance du bien sont présumés exister au moment de la
                délivrance (article L. 217-7 du code de la consommation).
              </p>
              <p>
                La conformité d&apos;un produit s&apos;apprécie notamment au regard de sa
                description : état, langue, extension, édition et, le cas échéant, note de
                gradation. Pour mettre en œuvre une garantie, le Client contacte le vendeur (article
                2) en indiquant son numéro de commande et le défaut constaté, avec des photographies
                si possible. Les frais de renvoi d&apos;un produit non conforme sont à la charge du
                vendeur.
              </p>
            </>
          ),
        },
        {
          id: "reclamations",
          title: "Réclamations et médiation",
          content: (
            <>
              <p>
                Toute réclamation peut être adressée au vendeur par email (<SellerEmail />) ou par
                courrier à l&apos;adresse figurant à l&apos;article 2.
              </p>
              <p>
                Si le litige n&apos;est pas résolu, le Client peut recourir gratuitement au
                médiateur de la consommation dont relève le vendeur (article L. 612-1 du code de la
                consommation) :
              </p>
              <MediatorDetails />
              <p>
                Le médiateur ne peut être saisi que si le Client justifie avoir tenté, au préalable,
                de résoudre le litige directement auprès du vendeur par une réclamation écrite, et
                au plus tard un an après cette réclamation (article L. 612-2 du code de la
                consommation). Le Client reste libre de saisir les juridictions compétentes.
              </p>
            </>
          ),
        },
        {
          id: "donnees",
          title: "Données personnelles",
          content: (
            <p>
              Les données collectées lors de la commande sont nécessaires à son traitement. Leur
              utilisation et les droits du Client sont décrits dans la{" "}
              <Link href="/confidentialite">politique de confidentialité</Link>.
            </p>
          ),
        },
        {
          id: "archivage",
          title: "Archivage du contrat",
          content: (
            <p>
              Pour toute commande d&apos;un montant égal ou supérieur à 120 euros, le vendeur
              conserve l&apos;écrit constatant le contrat pendant dix ans et en garantit
              l&apos;accès au Client à tout moment, sur simple demande (articles L. 213-1 et D.
              213-1 du code de la consommation).
            </p>
          ),
        },
        {
          id: "droit-applicable",
          title: "Droit applicable et litiges",
          content: (
            <p>
              Les CGV sont soumises au droit français. Le Client peut saisir soit l&apos;une des
              juridictions territorialement compétentes en vertu du code de procédure civile, soit
              la juridiction du lieu où il demeurait au moment de la conclusion du contrat ou de la
              survenance du fait dommageable (article R. 631-3 du code de la consommation).
            </p>
          ),
        },
        {
          id: "annexe",
          title: "Annexe : modèle de formulaire de rétractation",
          content: (
            <>
              <p>
                À utiliser uniquement si le Client ne souhaite pas passer par la fonction de
                rétractation en ligne.
              </p>
              <WithdrawalModelForm />
            </>
          ),
        },
      ]}
    />
  )
}
