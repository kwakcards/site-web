"use server"

import { refresh } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { buybackStatuses } from "@/config/buyback"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export type BuybackAdminResult = { ok: true } | { ok: false; message: string }

const updateSchema = z.object({
  id: z.uuid(),
  status: z.enum(buybackStatuses.map((status) => status.value) as [string, ...string[]]),
  adminNote: z
    .string()
    .trim()
    .max(2000)
    .transform((value) => value || null),
})

/** Statut et note interne d'une demande de rachat. */
export async function updateBuybackRequest(input: unknown): Promise<BuybackAdminResult> {
  await requireAdmin()
  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: "Données invalides." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("buyback_requests")
    .update({ status: parsed.data.status, admin_note: parsed.data.adminNote })
    .eq("id", parsed.data.id)
  if (error) {
    console.error("[admin] mise à jour d'une demande de rachat", error)
    return { ok: false, message: "La mise à jour a échoué." }
  }
  refresh()
  return { ok: true }
}

/** Suppression définitive d'une demande et de ses photos (droit à l'effacement, durée de conservation). */
export async function deleteBuybackRequest(id: string): Promise<BuybackAdminResult> {
  await requireAdmin()
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Demande introuvable." }

  const supabase = await createClient()
  const { data: request } = await supabase
    .from("buyback_requests")
    .select("id, upload_token")
    .eq("id", id)
    .maybeSingle()
  if (!request) return { ok: false, message: "Cette demande a déjà été supprimée." }

  const folder = `${request.id}/${request.upload_token}`
  const { data: files } = await supabase.storage.from("buyback").list(folder, { limit: 20 })
  if (files && files.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("buyback")
      .remove(files.map((file) => `${folder}/${file.name}`))
    if (storageError) {
      console.error("[admin] suppression des photos de rachat", storageError)
      return { ok: false, message: "Les photos n'ont pas pu être supprimées. Réessaie." }
    }
  }

  const { error } = await supabase.from("buyback_requests").delete().eq("id", id)
  if (error) {
    console.error("[admin] suppression d'une demande de rachat", error)
    return { ok: false, message: "La suppression a échoué." }
  }
  redirect("/admin/rachats?supprime=1")
}
