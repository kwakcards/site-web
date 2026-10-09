"use server"

import { randomUUID } from "node:crypto"

import { after } from "next/server"
import { z } from "zod"

import { buybackSellerAcknowledgement, buybackShopNotification } from "@/emails/buyback"
import { sendEmail, shopEmail } from "@/lib/email"
import { getSiteUrl } from "@/lib/env"
import { createPublicClient } from "@/lib/supabase/public"
import {
  type BuybackFieldErrors,
  buybackFieldErrors,
  buybackSchema,
} from "@/lib/validation/buyback"

export type BuybackState =
  | { status: "invalid"; fieldErrors: BuybackFieldErrors }
  | { status: "error"; message: string }
  | { status: "sent"; requestId: string; uploadToken: string }

/** Protection contre les robots : champ piège vide et formulaire rempli en plus de 3 s. */
const antiBotSchema = z.object({
  website: z.literal(""),
  startedAt: z.number().int().positive(),
})

const MIN_FILL_MS = 3000

/**
 * Enregistre une demande de rachat. La base n'accepte que la création (aucune
 * relecture) et limite les envois ; les photos sont ensuite envoyées par le
 * navigateur dans le dossier de la demande, avec le jeton renvoyé ici.
 */
export async function submitBuybackRequest(input: unknown): Promise<BuybackState> {
  const record = (input ?? {}) as Record<string, unknown>
  const antiBot = antiBotSchema.safeParse({ website: record.website, startedAt: record.startedAt })
  if (!antiBot.success || Date.now() - antiBot.data.startedAt < MIN_FILL_MS) {
    return { status: "error", message: "Envoi refusé. Recharge la page et réessaie." }
  }

  const parsed = buybackSchema.safeParse(input)
  if (!parsed.success) {
    return { status: "invalid", fieldErrors: buybackFieldErrors(parsed.error) }
  }

  const data = parsed.data
  const requestId = randomUUID()
  const uploadToken = randomUUID()

  const { error } = await createPublicClient().from("buyback_requests").insert({
    id: requestId,
    upload_token: uploadToken,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    city: data.city,
    item_types: data.itemTypes,
    games: data.games,
    languages: data.languages,
    volume: data.volume,
    expected_value: data.expectedValue,
    summary: data.summary,
    card_list: data.cardList,
    message: data.message,
    owner_certified: data.ownerCertified,
  })

  if (error) {
    if (error.code === "42501") {
      return {
        status: "error",
        message:
          "Plusieurs demandes ont déjà été envoyées avec cette adresse aujourd'hui. On revient vers toi très vite.",
      }
    }
    console.error("[rachat] enregistrement de la demande", error)
    return { status: "error", message: "L'envoi a échoué. Réessaie dans un instant." }
  }

  // Emails envoyés après la réponse, pour ne pas ralentir le formulaire.
  after(async () => {
    const shop = shopEmail()
    const siteUrl = getSiteUrl()
    const notification = buybackShopNotification(data, siteUrl, requestId)
    const acknowledgement = buybackSellerAcknowledgement(data, siteUrl)
    await Promise.all([
      shop ? sendEmail({ to: shop, replyTo: data.email, ...notification }) : null,
      sendEmail({ to: data.email, ...(shop ? { replyTo: shop } : {}), ...acknowledgement }),
    ])
  })

  return { status: "sent", requestId, uploadToken }
}
