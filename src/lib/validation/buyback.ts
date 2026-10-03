import { z } from "zod"

import {
  buybackGames,
  buybackItemTypes,
  buybackLanguages,
  buybackValues,
  buybackVolumes,
} from "@/config/buyback"

/*
 * Formulaire de rachat de collection, en 3 étapes. Les mêmes schémas servent au
 * navigateur (étape par étape) et au serveur (demande complète). Seul le
 * nécessaire est demandé ; le téléphone reste facultatif.
 */

type Option = { readonly value: string }
const valuesOf = (options: readonly Option[]) =>
  options.map((option) => option.value) as [string, ...string[]]

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `${max} caractères maximum.` })
    .transform((value) => value || null)

export const buybackContactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { error: "Indique ton prénom." })
    .max(80, { error: "80 caractères maximum." }),
  lastName: z
    .string()
    .trim()
    .min(1, { error: "Indique ton nom." })
    .max(80, { error: "80 caractères maximum." }),
  email: z
    .email({ error: "Indique une adresse email valide : la réponse arrivera par email." })
    .max(254)
    .transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .max(30, { error: "30 caractères maximum." })
    .refine((value) => value === "" || /^[+0-9 ().-]{6,30}$/.test(value), {
      error: "Numéro de téléphone invalide.",
    })
    .transform((value) => value || null),
  city: z
    .string()
    .trim()
    .min(1, { error: "Indique ta ville." })
    .max(100, { error: "100 caractères maximum." }),
})

export const buybackCollectionSchema = z.object({
  itemTypes: z
    .array(z.enum(valuesOf(buybackItemTypes)))
    .min(1, { error: "Choisis au moins un type d'articles." }),
  games: z.array(z.enum(valuesOf(buybackGames))).max(buybackGames.length),
  languages: z
    .array(z.enum(valuesOf(buybackLanguages)))
    .min(1, { error: "Choisis au moins une langue." }),
  volume: z.enum(valuesOf(buybackVolumes), { error: "Choisis un volume approximatif." }),
  expectedValue: z.enum(valuesOf(buybackValues), { error: "Choisis une fourchette de valeur." }),
  summary: z
    .string()
    .trim()
    .min(2, { error: "Décris ta collection en quelques mots." })
    .max(300, { error: "300 caractères maximum." }),
  cardList: optionalText(10000),
})

export const buybackFinalSchema = z.object({
  message: optionalText(2000),
  ownerCertified: z.literal(true, {
    error: "Coche cette case pour certifier que les articles t'appartiennent.",
  }),
})

export const buybackSchema = buybackContactSchema
  .extend(buybackCollectionSchema.shape)
  .extend(buybackFinalSchema.shape)

export type BuybackInput = z.input<typeof buybackSchema>
export type BuybackData = z.output<typeof buybackSchema>
export type BuybackField = keyof BuybackInput
export type BuybackFieldErrors = Partial<Record<BuybackField, string>>

/** Premier message d'erreur par champ. */
export function buybackFieldErrors(error: z.ZodError): BuybackFieldErrors {
  const errors: BuybackFieldErrors = {}
  for (const issue of error.issues) {
    const field = issue.path[0] as BuybackField
    if (typeof field === "string" && !errors[field]) errors[field] = issue.message
  }
  return errors
}
