import type { Metadata } from "next"
import Link from "next/link"

import { Fill } from "@/components/legal/fill"
import { LegalPage } from "@/components/legal/legal-page"
import { MediatorDetails, SellerEmail, SellerPhone } from "@/components/legal/seller-identity"
import { legal } from "@/config/legal"
import { withdrawalLink } from "@/config/navigation"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter Kwak & Cards : email, téléphone, adresse postale.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  const { seller } = legal

  return (
    <LegalPage
      title="Contact"
      eyebrow="Aide"
      intro={
        <p>
          Une question sur une carte, une commande ou une livraison ? Écrivez-nous en indiquant, le
          cas échéant, votre numéro de commande.
        </p>
      }
      sections={[
        {
          id: "coordonnees",
          title: "Nous joindre",
          content: (
            <dl>
              <dt>Email</dt>
              <dd>
                <SellerEmail />
              </dd>
              <dt>Téléphone</dt>
              <dd>
                <SellerPhone />
              </dd>
              <dt>Adresse postale</dt>
              <dd>
                <Fill value={seller.legalName} label="nom du vendeur" /> ({seller.tradeName})
                <br />
                <Fill value={seller.address} label="adresse postale" />
              </dd>
            </dl>
          ),
        },
        {
          id: "demarches",
          title: "Démarches fréquentes",
          content: (
            <ul>
              <li>
                Renoncer à une commande dans les 14 jours :{" "}
                <Link href={withdrawalLink.href}>« {withdrawalLink.label} »</Link>.
              </li>
              <li>
                Produit abîmé ou non conforme : voir{" "}
                <Link href="/politique-de-remboursement#non-conforme">
                  livraison, retours et remboursements
                </Link>
                .
              </li>
              <li>
                Accès, rectification ou suppression de vos données : écrivez-nous par email (voir la{" "}
                <Link href="/confidentialite#droits">politique de confidentialité</Link>).
              </li>
            </ul>
          ),
        },
        {
          id: "mediation",
          title: "Médiation de la consommation",
          content: (
            <>
              <p>
                Si un litige persiste après une réclamation écrite, vous pouvez saisir gratuitement
                le médiateur de la consommation :
              </p>
              <MediatorDetails />
            </>
          ),
        },
      ]}
    />
  )
}
