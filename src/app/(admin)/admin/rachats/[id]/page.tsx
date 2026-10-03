import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BuybackStatusBadge } from "@/components/admin/buyback-status-badge"
import { BuybackStatusForm } from "@/components/admin/buyback-status-form"
import { DeleteBuybackButton } from "@/components/admin/delete-buyback-button"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import {
  buybackGames,
  buybackItemTypes,
  buybackLanguages,
  buybackValues,
  buybackVolumes,
  optionLabel,
} from "@/config/buyback"
import { requireAdmin } from "@/lib/auth"
import { formatDateTimeParis } from "@/lib/dates"
import { getBuybackRequest } from "@/server/queries/buyback"

export const metadata: Metadata = { title: "Demande de rachat" }

// Page liée à la session de l'admin : rendue à chaque requête (voir le layout).
export const instant = false

const labels = (options: readonly { value: string; label: string }[], values: string[]) =>
  values.map((value) => optionLabel(options, value)).join(", ") || "Non précisé"

export default async function AdminBuybackDetailPage({ params }: PageProps<"/admin/rachats/[id]">) {
  await requireAdmin()
  const { id } = await params
  const request = await getBuybackRequest(id)
  if (!request) notFound()

  const name = `${request.first_name} ${request.last_name}`
  const rows: [string, React.ReactNode][] = [
    ["Reçue le", formatDateTimeParis(request.created_at)],
    [
      "Email",
      <a key="email" href={`mailto:${request.email}`} className="text-primary underline">
        {request.email}
      </a>,
    ],
    [
      "Téléphone",
      request.phone ? (
        <a key="phone" href={`tel:${request.phone}`} className="text-primary underline">
          {request.phone}
        </a>
      ) : (
        "Non renseigné"
      ),
    ],
    ["Ville", request.city],
    ["Articles", labels(buybackItemTypes, request.item_types)],
    ["Jeux", labels(buybackGames, request.games)],
    ["Langues", labels(buybackLanguages, request.languages)],
    ["Volume", optionLabel(buybackVolumes, request.volume)],
    ["Valeur espérée", optionLabel(buybackValues, request.expected_value)],
    ["En quelques mots", request.summary],
  ]

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[{ label: "Demandes de rachat", href: "/admin/rachats" }, { label: name }]}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <BuybackStatusBadge status={request.status} />
          <h1 className="mt-2 font-display text-4xl">{name}</h1>
        </div>
        <DeleteBuybackButton id={request.id} name={name} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <dl className="divide-y divide-border rounded-xl border-2 border-edge bg-card text-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[9rem_1fr] gap-3 px-4 py-3">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="break-words">{value}</dd>
              </div>
            ))}
          </dl>

          {request.card_list && (
            <section aria-labelledby="liste-title">
              <h2 id="liste-title" className="font-heading text-sm uppercase">
                Liste des cartes
              </h2>
              <p className="mt-2 rounded-xl border-2 border-edge bg-card p-4 text-sm whitespace-pre-wrap">
                {request.card_list}
              </p>
            </section>
          )}

          {request.message && (
            <section aria-labelledby="message-title">
              <h2 id="message-title" className="font-heading text-sm uppercase">
                Message
              </h2>
              <p className="mt-2 rounded-xl border-2 border-edge bg-card p-4 text-sm whitespace-pre-wrap">
                {request.message}
              </p>
            </section>
          )}

          <section aria-labelledby="photos-title">
            <h2 id="photos-title" className="font-heading text-sm uppercase">
              Photos ({request.photos.length})
            </h2>
            {request.photos.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Aucune photo envoyée.</p>
            ) : (
              <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {request.photos.map((photo, index) => (
                  <li key={photo.path}>
                    <a href={photo.url} target="_blank" rel="noreferrer" className="block">
                      {/* Lien signé d'un bucket privé, valable 1 heure : pas d'optimisation next/image. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={`Photo ${index + 1} envoyée par ${name}`}
                        className="aspect-square w-full rounded-lg border-2 border-edge object-cover"
                      />
                      <span className="sr-only"> (ouvre la photo en grand, nouvel onglet)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-xl border-2 border-edge bg-card p-4">
          <BuybackStatusForm
            id={request.id}
            status={request.status}
            adminNote={request.admin_note}
          />
        </aside>
      </div>
    </div>
  )
}
