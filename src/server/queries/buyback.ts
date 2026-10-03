import "server-only"

import { z } from "zod"

import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

/*
 * Demandes de rachat, lues avec la session de l'admin (RLS) : jamais en cache.
 * Les photos sont dans un bucket privé, affichées par liens signés d'une heure.
 */

const BUCKET = "buyback"
const SIGNED_URL_SECONDS = 60 * 60

export type BuybackListItem = {
  id: string
  createdAt: string
  status: string
  firstName: string
  lastName: string
  city: string
  itemTypes: string[]
  expectedValue: string
  summary: string
}

export async function listBuybackRequests(): Promise<BuybackListItem[]> {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("buyback_requests")
    .select(
      "id, created_at, status, first_name, last_name, city, item_types, expected_value, summary"
    )
    .order("created_at", { ascending: false })
    .limit(200)
  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    firstName: row.first_name,
    lastName: row.last_name,
    city: row.city,
    itemTypes: row.item_types,
    expectedValue: row.expected_value,
    summary: row.summary,
  }))
}

export async function countNewBuybackRequests(): Promise<number> {
  await requireAdmin()
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("buyback_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "nouvelle")
  if (error) throw error
  return count ?? 0
}

export async function getBuybackRequest(id: string) {
  await requireAdmin()
  if (!z.uuid().safeParse(id).success) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("buyback_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const folder = `${data.id}/${data.upload_token}`
  const { data: files } = await supabase.storage.from(BUCKET).list(folder, { limit: 20 })
  const paths = (files ?? []).map((file) => `${folder}/${file.name}`)
  const { data: signed } = paths.length
    ? await supabase.storage.from(BUCKET).createSignedUrls(paths, SIGNED_URL_SECONDS)
    : { data: [] }

  return {
    ...data,
    photos: (signed ?? []).flatMap((item) =>
      item.signedUrl ? [{ path: item.path ?? item.signedUrl, url: item.signedUrl }] : []
    ),
  }
}

export type BuybackRequestDetail = NonNullable<Awaited<ReturnType<typeof getBuybackRequest>>>
