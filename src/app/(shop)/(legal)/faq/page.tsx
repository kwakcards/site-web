import { ChevronDownIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { cardConditions } from "@/config/catalog"
import { legal } from "@/config/legal"
import { withdrawalLink } from "@/config/navigation"
import { shopDefaults } from "@/config/shop"
import { formatPrice } from "@/lib/money"

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Commande, paiement, livraison, état des cartes, retours : les réponses aux questions fréquentes sur Kwak & Cards.",
  alternates: { canonical: "/faq" },
}

type Faq = {
  question: string
  /** Réponse en texte brut (reprise dans les données structurées). */
  answer: string
  /** Liens complémentaires affichés sous la réponse. */
  links?: { label: string; href: string }[]
}

function buildFaq(): Faq[] {
  const { shipping, paymentDeadlineHours } = legal
  const { flatRateCents, freeShippingThresholdCents } = shopDefaults.shipping
  const methods = shopDefaults.offlinePaymentMethods.join(", ")

  return [
    {
      question: "Comment passer commande ?",
      answer:
        "Ajoutez vos articles au panier, indiquez vos coordonnées, choisissez la livraison et le moyen de paiement, puis validez avec le bouton « Commander avec obligation de paiement ». Aucun compte n'est nécessaire. Un email de confirmation vous est aussitôt envoyé avec les instructions de paiement.",
    },
    {
      question: "Comment payer ma commande ?",
      answer: `Pour l'instant, le paiement se fait hors ligne, selon les moyens proposés lors de la commande (${methods}). Vos articles vous sont réservés pendant ${paymentDeadlineHours} heures ; sans paiement dans ce délai, la commande est annulée automatiquement, sans frais.`,
    },
    {
      question: "Quand ma commande est-elle expédiée ?",
      answer: shipping.dispatchBusinessDays
        ? `Sous ${shipping.dispatchBusinessDays} jours ouvrés après réception du paiement, dans un emballage protégé, avec un numéro de suivi.`
        : "Après réception du paiement, dans un emballage protégé, avec un numéro de suivi. Le délai est précisé lors de la commande.",
    },
    {
      question: "Combien coûte la livraison ?",
      answer: `L'envoi suivi en ${shipping.area} coûte ${formatPrice(flatRateCents)}${
        freeShippingThresholdCents
          ? ` ; il est offert dès ${formatPrice(freeShippingThresholdCents, { compact: true })} d'achat`
          : ""
      }. Les frais exacts sont toujours affichés avant la validation de la commande.`,
      links: [
        { label: "Livraison, retours et remboursements", href: "/politique-de-remboursement" },
      ],
    },
    {
      question: "Comment est décrit l'état des cartes ?",
      answer: `Chaque carte à l'unité est photographiée et son état est indiqué selon l'échelle suivante, de la meilleure à la plus usée : ${cardConditions
        .map((condition) => `${condition.label} (${condition.code})`)
        .join(", ")}. Le détail de chaque état figure dans les conditions générales de vente.`,
      links: [{ label: "Échelle d'état détaillée (CGV)", href: "/cgv#produits" }],
    },
    {
      question: "Les cartes sont-elles authentiques ?",
      answer:
        "Oui : nous ne vendons que des produits authentiques. Les photos des cartes à l'unité et des cartes gradées montrent l'article exact que vous recevrez.",
    },
    {
      question: "Qu'est-ce qu'une carte gradée ?",
      answer:
        "C'est une carte évaluée par une société spécialisée (par exemple PSA, PCA ou CGC), qui lui attribue une note et la scelle dans un boîtier. La société et la note figurent sur la fiche du produit.",
    },
    {
      question: "Puis-je changer d'avis après ma commande ?",
      answer:
        "Oui : vous disposez de 14 jours à compter de la réception pour renoncer à votre achat, sans justification, grâce à la fonction « Renoncer au contrat ici ». Les frais de retour sont à votre charge, et vous êtes remboursé au plus tard 14 jours après votre demande.",
      links: [{ label: withdrawalLink.label, href: withdrawalLink.href }],
    },
    {
      question: "Ma carte est arrivée abîmée ou ne correspond pas à sa description : que faire ?",
      answer:
        "Contactez-nous avec votre numéro de commande et des photos. Vous bénéficiez de la garantie légale de conformité : réparation, remplacement, réduction du prix ou remboursement selon le cas, et les frais de retour sont à notre charge.",
      links: [{ label: "Nous contacter", href: "/contact" }],
    },
    {
      question: "Comment me désinscrire de la newsletter ?",
      answer:
        "Chaque email contient un lien de désinscription. Vous pouvez aussi nous écrire : votre adresse est alors supprimée de la liste.",
    },
    {
      question: "Quelles données personnelles collectez-vous ?",
      answer:
        "Uniquement ce qui est nécessaire à votre commande : email, nom, adresse de livraison en cas d'envoi et, si vous le souhaitez, téléphone. Ni compte client, ni données bancaires de carte, ni outil de suivi publicitaire.",
      links: [{ label: "Politique de confidentialité", href: "/confidentialite" }],
    },
  ]
}

export default function FaqPage() {
  const faq = buildFaq()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <p className="font-heading text-xs tracking-[0.25em] text-primary uppercase">Aide</p>
      <h1 className="mt-3 font-display text-4xl text-primary md:text-5xl">Questions fréquentes</h1>
      <p className="mt-4 text-muted-foreground">
        Vous ne trouvez pas votre réponse ?{" "}
        <Link href="/contact" className="text-primary underline underline-offset-4">
          Contactez-nous
        </Link>
        .
      </p>

      {/* <details> natif : réponses présentes dans le HTML (lecteurs d'écran, moteurs,
          agents IA) et utilisables au clavier, même sans JavaScript. */}
      <div className="mt-10 flex flex-col gap-4">
        {faq.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border-2 border-edge bg-card px-5 tactile-field open:border-primary open:ledge-brand-deep hover:border-primary hover:ledge-brand-deep has-[summary:focus-visible]:border-primary has-[summary:focus-visible]:ring-3 has-[summary:focus-visible]:ring-ring/50"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-base font-semibold outline-none marker:content-none [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDownIcon className="mt-1 size-5 shrink-0 text-primary transition-transform group-open:rotate-180 motion-reduce:transition-none" />
            </summary>
            <div className="pb-5 text-base text-foreground/90">
              <p>{item.answer}</p>
              {item.links && (
                <ul className="mt-3 flex flex-col gap-1">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-primary underline underline-offset-4">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
    </div>
  )
}
