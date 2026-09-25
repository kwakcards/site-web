"use server"

import {
  type WithdrawalFieldErrors,
  withdrawalFieldErrors,
  withdrawalSchema,
} from "@/lib/validation/withdrawal"

export type WithdrawalState =
  | { status: "idle" }
  | { status: "invalid"; fieldErrors: WithdrawalFieldErrors }
  | { status: "unavailable" }
  | { status: "received"; receivedAt: string }

/**
 * Réception d'une déclaration de rétractation en ligne (art. L221-21 et
 * D221-5 du code de la consommation).
 *
 * L'enregistrement horodaté (table withdrawal_requests, phase 2) et l'accusé
 * de réception par email (phase 6) doivent être branchés AVANT l'ouverture
 * des commandes. D'ici là, la demande est validée puis renvoyée vers le
 * formulaire type par email.
 */
export async function submitWithdrawal(
  _previous: WithdrawalState,
  formData: FormData
): Promise<WithdrawalState> {
  const parsed = withdrawalSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    orderNumber: String(formData.get("orderNumber") ?? ""),
    items: String(formData.get("items") ?? ""),
  })

  if (!parsed.success) {
    return { status: "invalid", fieldErrors: withdrawalFieldErrors(parsed.error) }
  }

  return { status: "unavailable" }
}
