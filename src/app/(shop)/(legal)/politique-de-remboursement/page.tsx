import type { Metadata } from "next"
import Link from "next/link"

import { Fill } from "@/components/legal/fill"
import { LegalPage } from "@/components/legal/legal-page"
import { SellerEmail } from "@/components/legal/seller-identity"
import { legal } from "@/config/legal"
import { withdrawalLink } from "@/config/navigation"
import { shopDefaults } from "@/config/shop"
import { formatPrice } from "@/lib/money"

export const metadata: Metadata = {
  title: "Livraison, retours et remboursements",
  description:
    "Frais et délais de livraison, droit de rétractation de 14 jours, retours et remboursements chez Kwak & Cards.",
  alternates: { canonical: "/politique-de-remboursement" },
}

export default function ShippingAndReturnsPage() {
  const { shipping, paymentDeadlineHours } = legal
  const { flatRateCents, freeShippingThresholdCents } = shopDefaults.shipping

  return (
    <LegalPage
      title="Livraison, retours et remboursements"
      intro={
        <p>
          L&apos;essentiel en un coup d&apos;œil. Le texte qui fait foi est celui des{" "}
          <Link href="/cgv" className="underline underline-offset-4">
            conditions générales de vente
          </Link>
          .
        </p>
      }
      sections={[
        {
          id: "livraison",
          title: "Livraison",
          content: (
            <ul>
              <li>Zone desservie : {shipping.area}.</li>
              <li>
                Envoi postal suivi : {formatPrice(flatRateCents)}
                {freeShippingThresholdCents
                  ? `, offert dès ${formatPrice(freeShippingThresholdCents, { compact: true })} d'achat`
                  : ""}
                . Les frais exacts sont toujours indiqués avant la validation de la commande.
              </li>
              <li>Transporteurs : {shipping.carriers.join(", ")}.</li>
              <li>
                Expédition sous{" "}
                <Fill value={shipping.dispatchBusinessDays} label="nombre de jours" /> jours ouvrés
                après réception du paiement, dans un emballage protégé, puis livraison en{" "}
                <Fill value={shipping.deliveryBusinessDays} label="nombre de jours" /> jours ouvrés
                au plus.
              </li>
              <li>
                Les commandes non payées dans les {paymentDeadlineHours} heures sont annulées
                automatiquement, sans frais.
              </li>
              <li>
                À la réception, vérifiez l&apos;état du colis et signalez tout dommage au
                transporteur et à nous-mêmes rapidement : vos garanties légales restent intactes.
              </li>
            </ul>
          ),
        },
        {
          id: "retours",
          title: "Changer d'avis : 14 jours pour renoncer",
          content: (
            <>
              <p>
                Vous disposez de 14 jours à compter de la réception de votre commande pour y
                renoncer, sans justification. Le plus simple : la fonction{" "}
                <Link href={withdrawalLink.href}>« {withdrawalLink.label} »</Link>, qui vous envoie
                immédiatement un accusé de réception.
              </p>
              <ul>
                <li>
                  Renvoyez ensuite les produits dans les 14 jours suivant votre demande ; les frais
                  de retour sont à votre charge. Un envoi suivi et protégé est recommandé.
                </li>
                <li>
                  Un produit scellé ouvert ou une carte retirée de son boîtier de gradation perd de
                  sa valeur : cette dépréciation peut rester à votre charge.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "remboursement",
          title: "Remboursement",
          content: (
            <ul>
              <li>
                Au plus tard 14 jours après réception de votre demande de rétractation, frais de
                livraison initiaux compris (sur la base de la livraison standard).
              </li>
              <li>
                Le remboursement peut attendre la réception des produits retournés ou la preuve de
                leur expédition.
              </li>
              <li>
                Il est effectué avec le moyen de paiement utilisé pour la commande : une commande
                payée par virement est remboursée par virement.
              </li>
            </ul>
          ),
        },
        {
          id: "non-conforme",
          title: "Produit abîmé ou non conforme",
          content: (
            <>
              <p>
                Tous les produits bénéficient de la garantie légale de conformité pendant 2 ans ;
                pour les cartes d&apos;occasion, un défaut apparu dans les 12 mois suivant la
                livraison est présumé exister dès l&apos;origine. Écrivez-nous (<SellerEmail />) en
                indiquant votre numéro de commande et le problème constaté, avec des photos si
                possible.
              </p>
              <p>
                Selon le cas : réparation, remplacement, réduction du prix ou remboursement. Les
                frais de retour d&apos;un produit non conforme sont à notre charge. Détails dans
                l&apos;<Link href="/cgv#garanties">article « Garanties légales » des CGV</Link>.
              </p>
            </>
          ),
        },
      ]}
    />
  )
}
