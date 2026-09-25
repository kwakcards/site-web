import type { Metadata } from "next"
import Link from "next/link"

import { LegalPage } from "@/components/legal/legal-page"
import { PrintButton } from "@/components/legal/print-button"
import { SellerEmail } from "@/components/legal/seller-identity"
import { WithdrawalForm } from "@/components/legal/withdrawal-form"
import { WithdrawalModelForm } from "@/components/legal/withdrawal-model-form"
import { legal } from "@/config/legal"

export const metadata: Metadata = {
  title: "Droit de rétractation",
  description:
    "Renoncer à une commande Kwak & Cards dans les 14 jours : fonction de rétractation en ligne et modèle de formulaire.",
  alternates: { canonical: "/retractation" },
}

export default function WithdrawalPage() {
  return (
    <LegalPage
      title="Droit de rétractation"
      intro={
        <p>
          Vous disposez de 14 jours à compter de la réception de votre commande pour y renoncer,
          gratuitement et sans avoir à vous justifier (articles L. 221-18 et suivants du code de la
          consommation).
        </p>
      }
      sections={[
        {
          id: "renoncer",
          title: "Renoncer au contrat en ligne",
          content: (
            <>
              <p>
                Indiquez votre nom, votre email et votre numéro de commande, vérifiez votre demande,
                puis confirmez-la. Un accusé de réception mentionnant le contenu de votre demande,
                sa date et son heure vous est envoyé sans délai par email.
              </p>
              <div className="not-prose my-6">
                <WithdrawalForm contactEmail={legal.seller.email} />
              </div>
            </>
          ),
        },
        {
          id: "autres-moyens",
          title: "Autres moyens de vous rétracter",
          content: (
            <p>
              Vous pouvez aussi nous envoyer le modèle de formulaire ci-dessous, ou toute autre
              déclaration exprimant clairement votre volonté, par email (<SellerEmail />) ou par
              courrier à l&apos;adresse figurant dans les{" "}
              <Link href="/mentions-legales#editeur">mentions légales</Link>. Dans ce cas, conservez
              une preuve de votre envoi.
            </p>
          ),
        },
        {
          id: "modele",
          title: "Modèle de formulaire de rétractation",
          content: (
            <>
              <WithdrawalModelForm />
              <PrintButton label="Imprimer le formulaire" />
            </>
          ),
        },
        {
          id: "apres",
          title: "Après votre demande",
          content: (
            <ul>
              <li>
                Renvoyez les produits dans les 14 jours suivant votre demande, à vos frais, de
                préférence en envoi suivi et protégé.
              </li>
              <li>
                Nous vous remboursons toutes les sommes versées, frais de livraison standard
                compris, au plus tard 14 jours après réception de votre demande. Le remboursement
                peut attendre le retour des produits ou la preuve de leur expédition.
              </li>
              <li>
                Toutes les conditions figurent à l&apos;
                <Link href="/cgv#retractation">article « Droit de rétractation » des CGV</Link>.
              </li>
            </ul>
          ),
        },
      ]}
    />
  )
}
