import type { Metadata } from "next"
import Link from "next/link"

import { LegalPage } from "@/components/legal/legal-page"
import { storageKeys } from "@/config/storage"

export const metadata: Metadata = {
  title: "Politique cookies",
  description:
    "Traceurs utilisés par Kwak & Cards : traceurs strictement nécessaires et mesure anonyme de la vitesse des pages, sans publicité ni suivi.",
  alternates: { canonical: "/cookies" },
}

type Tracker = {
  name: string
  kind: string
  purpose: string
  duration: string
  /** Motif de dispense de consentement, si ce n'est pas un traceur strictement nécessaire. */
  exemption?: string
  note?: string
}

const trackers: Tracker[] = [
  {
    name: storageKeys.cart,
    kind: "Stockage local du navigateur (localStorage), déposé par ce site",
    purpose:
      "Mémoriser le contenu de votre panier (identifiants des produits et quantités, sans donnée personnelle).",
    duration:
      "Jusqu'à la validation de la commande, au vidage du panier ou à l'effacement des données de navigation.",
  },
  {
    name: "sb-…-auth-token",
    kind: "Cookies déposés par ce site (service d'authentification Supabase)",
    purpose: "Maintenir la connexion du vendeur à l'espace d'administration.",
    duration: "Jusqu'à la déconnexion ; renouvelés tant que la session reste active.",
    note: "Concerne uniquement le vendeur : aucun cookie de ce type n'est déposé chez les visiteurs.",
  },
  {
    name: "Cookie de sécurité de l'hébergeur",
    kind: "Cookie déposé par Vercel, hébergeur du site",
    purpose:
      "Mémoriser la réussite d'une vérification anti-robot, uniquement si une telle vérification est déclenchée pour protéger le site.",
    duration: "Courte durée, fixée par l'hébergeur.",
  },
  {
    name: "Vercel Speed Insights",
    kind: "Script de mesure de Vercel, hébergeur du site, sans cookie ni stockage sur votre appareil",
    purpose:
      "Mesurer anonymement la vitesse de chargement et d'affichage des pages, pour améliorer le site. Les mesures ne sont associées ni à votre adresse IP, ni à un identifiant ; rien n'est mesuré dans l'espace d'administration.",
    duration:
      "Rien n'est enregistré sur votre appareil ; les statistiques anonymes portent sur 30 jours au plus.",
    exemption:
      "Non requis : mesure de performance anonyme, dispensée de consentement (voir plus bas).",
  },
]

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Politique cookies"
      intro={
        <p>
          Ce site n&apos;utilise que des traceurs strictement nécessaires à son fonctionnement et
          une mesure anonyme de la vitesse de ses pages : aucune publicité, aucun réseau social,
          aucun suivi de votre navigation. C&apos;est pourquoi aucun bandeau de consentement ne
          s&apos;affiche.
        </p>
      }
      sections={[
        {
          id: "definition",
          title: "Qu'est-ce qu'un traceur ?",
          content: (
            <p>
              Un traceur est une information enregistrée ou lue sur votre appareil lors de la
              consultation d&apos;un site : cookie, stockage local du navigateur, etc. Leur usage
              est encadré par l&apos;article 82 de la loi « Informatique et Libertés ».
            </p>
          ),
        },
        {
          id: "traceurs",
          title: "Traceurs utilisés",
          content: (
            <>
              {trackers.map((tracker) => (
                <div key={tracker.name}>
                  <h3>
                    <code>{tracker.name}</code>
                  </h3>
                  <dl>
                    <dt>Type</dt>
                    <dd>{tracker.kind}</dd>
                    <dt>Finalité</dt>
                    <dd>{tracker.purpose}</dd>
                    <dt>Durée</dt>
                    <dd>{tracker.duration}</dd>
                    <dt>Consentement</dt>
                    <dd>{tracker.exemption ?? "Non requis : traceur strictement nécessaire."}</dd>
                  </dl>
                  {tracker.note && <p>{tracker.note}</p>}
                </div>
              ))}
            </>
          ),
        },
        {
          id: "absence-bandeau",
          title: "Pourquoi aucun bandeau de consentement ?",
          content: (
            <p>
              Les traceurs strictement nécessaires à un service demandé par l&apos;utilisateur,
              comme le panier d&apos;achat, l&apos;authentification ou la sécurité, sont dispensés
              de consentement (article 82 de la loi « Informatique et Libertés » ; lignes
              directrices de la CNIL du 17 septembre 2020, délibération n° 2020-091). Ils doivent
              seulement être portés à votre connaissance, ce que fait cette page.
            </p>
          ),
        },
        {
          id: "mesure-performance",
          title: "La mesure de la vitesse des pages",
          content: (
            <p>
              Elle est aussi dispensée de consentement, car elle remplit les conditions fixées par
              la CNIL pour les outils de mesure d&apos;audience : elle sert uniquement à mesurer les
              performances du site, produit des statistiques anonymes réservées à l&apos;éditeur, ne
              suit pas votre navigation et n&apos;est recoupée avec aucune autre donnée. Les
              adresses des pages sont transmises sans leurs paramètres (recherche, filtres).
            </p>
          ),
        },
        {
          id: "non-utilises",
          title: "Ce que nous n'utilisons pas",
          content: (
            <ul>
              <li>
                aucune statistique de visite (nombre de visiteurs, parcours d&apos;une page à
                l&apos;autre) : seule la vitesse des pages est mesurée ;
              </li>
              <li>aucun traceur publicitaire ni de reciblage ;</li>
              <li>aucun bouton de partage ni contenu intégré de réseau social ou de vidéo ;</li>
              <li>
                les polices de caractères et les images sont servies par le site lui-même, sans
                appel à des services tiers depuis votre navigateur.
              </li>
            </ul>
          ),
        },
        {
          id: "gerer",
          title: "Supprimer les traceurs",
          content: (
            <p>
              Vous pouvez à tout moment effacer les cookies et les données de site depuis les
              réglages de votre navigateur. Effacer les données du site vide votre panier.
            </p>
          ),
        },
        {
          id: "evolution",
          title: "Évolution de cette politique",
          content: (
            <p>
              Si un outil non dispensé de consentement devait être ajouté, votre accord serait
              demandé au préalable, avec la possibilité de refuser aussi simplement que
              d&apos;accepter, et cette page serait mise à jour. Pour en savoir plus sur vos
              données, consultez la{" "}
              <Link href="/confidentialite">politique de confidentialité</Link>.
            </p>
          ),
        },
      ]}
    />
  )
}
