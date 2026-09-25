import { z } from "zod"

/**
 * Déclaration de rétractation en ligne (art. D. 221-5 du code de la
 * consommation) : le consommateur fournit ou confirme son identité, les
 * informations sur le contrat concerné et le moyen de recevoir l'accusé de
 * réception. Rien de plus n'est demandé (minimisation des données).
 */
export const withdrawalSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { error: "Indiquez votre nom et votre prénom." })
    .max(120, { error: "120 caractères maximum." }),
  email: z
    .email({ error: "Indiquez une adresse email valide pour recevoir l'accusé de réception." })
    .max(254),
  orderNumber: z
    .string()
    .trim()
    .min(1, { error: "Indiquez le numéro de commande (par exemple KC-1001)." })
    .max(40, { error: "40 caractères maximum." }),
  items: z.string().trim().max(1000, { error: "1 000 caractères maximum." }),
})

export type WithdrawalInput = z.infer<typeof withdrawalSchema>

export type WithdrawalFieldErrors = Partial<Record<keyof WithdrawalInput, string>>

/** Premier message d'erreur par champ, pour l'affichage sous chaque champ. */
export function withdrawalFieldErrors(error: z.ZodError<WithdrawalInput>): WithdrawalFieldErrors {
  const flattened = z.flattenError(error).fieldErrors
  return Object.fromEntries(
    Object.entries(flattened).map(([field, messages]) => [field, messages?.[0]])
  ) as WithdrawalFieldErrors
}
