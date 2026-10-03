import { CircleCheckIcon, ImageIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { BuybackStatusBadge } from "@/components/admin/buyback-status-badge"
import { Button } from "@/components/ui/button"
import { buybackItemTypes, buybackValues, optionLabel } from "@/config/buyback"
import { requireAdmin } from "@/lib/auth"
import { formatDateTimeParis } from "@/lib/dates"
import { listBuybackRequests } from "@/server/queries/buyback"

export const metadata: Metadata = { title: "Demandes de rachat" }

// Page liée à la session de l'admin : rendue à chaque requête (voir le layout).
export const instant = false

export default async function AdminBuybackPage({ searchParams }: PageProps<"/admin/rachats">) {
  await requireAdmin()
  const [{ supprime }, requests] = await Promise.all([searchParams, listBuybackRequests()])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">Demandes de rachat</h1>
        <p className="mt-1 text-muted-foreground">
          Envoyées depuis la page{" "}
          <Link href="/rachat" className="text-primary underline underline-offset-4">
            Rachat de collection
          </Link>
          , de la plus récente à la plus ancienne.
        </p>
      </div>

      {supprime === "1" && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border-2 border-success/60 bg-success/10 px-4 py-3 text-sm text-success"
        >
          <CircleCheckIcon aria-hidden="true" className="size-4" />
          La demande et ses photos ont été supprimées.
        </p>
      )}

      {requests.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-edge px-6 py-12 text-center">
          <p className="font-heading uppercase">Aucune demande pour l&apos;instant</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Les demandes envoyées depuis le site apparaîtront ici.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border-2 border-edge bg-card p-4"
            >
              <div className="min-w-56 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <BuybackStatusBadge status={request.status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDateTimeParis(request.createdAt)}
                  </span>
                </div>
                <p className="mt-2 font-medium">
                  {request.firstName} {request.lastName}{" "}
                  <span className="text-muted-foreground">· {request.city}</span>
                </p>
                <p className="line-clamp-1 text-sm text-muted-foreground">{request.summary}</p>
              </div>
              <dl className="text-sm">
                <dt className="sr-only">Articles</dt>
                <dd>
                  {request.itemTypes.map((type) => optionLabel(buybackItemTypes, type)).join(", ")}
                </dd>
                <dt className="sr-only">Valeur espérée</dt>
                <dd className="text-primary">
                  {optionLabel(buybackValues, request.expectedValue)}
                </dd>
              </dl>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/rachats/${request.id}`}>
                  <ImageIcon data-icon="inline-start" />
                  Voir la demande
                  <span className="sr-only">
                    {" "}
                    de {request.firstName} {request.lastName}
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
