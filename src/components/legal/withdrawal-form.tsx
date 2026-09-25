"use client"

import { CircleAlertIcon, CircleCheckIcon, InfoIcon } from "lucide-react"
import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  type WithdrawalFieldErrors,
  type WithdrawalInput,
  withdrawalFieldErrors,
  withdrawalSchema,
} from "@/lib/validation/withdrawal"
import { submitWithdrawal, type WithdrawalState } from "@/server/actions/withdrawal"

type Step = "start" | "form" | "review"

const EMPTY: WithdrawalInput = { fullName: "", email: "", orderNumber: "", items: "" }
const FIELD_ORDER: (keyof WithdrawalInput)[] = ["fullName", "email", "orderNumber", "items"]

type FieldProps = {
  name: keyof WithdrawalInput
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: (props: {
    id: string
    name: string
    "aria-describedby"?: string
    "aria-invalid"?: boolean
    required?: boolean
  }) => React.ReactNode
}

function Field({ name, label, hint, error, required = false, children }: FieldProps) {
  const id = `withdrawal-${name}`
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ")

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="text-muted-foreground"> (obligatoire)</span>
        ) : (
          <span className="text-muted-foreground"> (facultatif)</span>
        )}
      </Label>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {children({
        id,
        name,
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : undefined,
        required: required || undefined,
      })}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-destructive">
          <CircleAlertIcon className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Fonction de rétractation en ligne (art. D. 221-5 du code de la consommation) :
 * 1. bouton « Renoncer au contrat ici » ;
 * 2. saisie ou confirmation de l'identité, du contrat et de l'email ;
 * 3. bouton « Confirmer la rétractation », puis accusé de réception.
 */
export function WithdrawalForm({ contactEmail }: { contactEmail: string | null }) {
  const [step, setStep] = useState<Step>("start")
  const [values, setValues] = useState<WithdrawalInput>(EMPTY)
  const [errors, setErrors] = useState<WithdrawalFieldErrors>({})
  const [state, formAction, pending] = useActionState<WithdrawalState, FormData>(
    async (previous, formData) => {
      const result = await submitWithdrawal(previous, formData)
      // Refus côté serveur : retour à la saisie, erreurs affichées sous les champs.
      if (result.status === "invalid") {
        setErrors(result.fieldErrors)
        setStep("form")
      }
      return result
    },
    { status: "idle" }
  )

  const headingRef = useRef<HTMLHeadingElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // Déplace le focus au changement d'étape, pour les utilisateurs de clavier
  // et de lecteur d'écran.
  useEffect(() => {
    if (step !== "start") headingRef.current?.focus()
  }, [step])

  useEffect(() => {
    if (state.status === "unavailable" || state.status === "received") {
      statusRef.current?.focus()
    }
  }, [state])

  function update(field: keyof WithdrawalInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function review(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = withdrawalSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors = withdrawalFieldErrors(result.error)
      setErrors(fieldErrors)
      // Place le focus sur le premier champ à corriger.
      const firstInvalid = FIELD_ORDER.find((field) => fieldErrors[field])
      if (firstInvalid)
        event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    setErrors({})
    setValues(result.data)
    setStep("review")
  }

  if (state.status === "received") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex gap-3 rounded-xl border border-success/60 bg-success/10 p-5 outline-none"
      >
        <CircleCheckIcon className="mt-0.5 size-5 shrink-0 text-success" />
        <p>
          Votre rétractation a bien été enregistrée le {state.receivedAt}. Un accusé de réception
          vous est envoyé par email.
        </p>
      </div>
    )
  }

  if (step === "start") {
    return (
      <div className="flex flex-col items-start gap-3">
        <Button type="button" variant="cta" size="lg" onClick={() => setStep("form")}>
          Renoncer au contrat ici
        </Button>
        <p className="text-sm text-muted-foreground">
          Gratuit, sans justification, jusqu&apos;à 14 jours après la réception de votre commande.
        </p>
      </div>
    )
  }

  if (step === "form") {
    return (
      <form noValidate onSubmit={review} className="flex flex-col gap-5">
        <h3 ref={headingRef} tabIndex={-1} className="font-heading text-lg uppercase outline-none">
          Étape 1 sur 2 : votre demande
        </h3>
        <Field name="fullName" label="Nom et prénom" error={errors.fullName} required>
          {(props) => (
            <Input
              {...props}
              autoComplete="name"
              className="h-11"
              value={values.fullName}
              onChange={(event) => update("fullName", event.target.value)}
            />
          )}
        </Field>
        <Field
          name="email"
          label="Adresse email"
          hint="L'accusé de réception de votre rétractation sera envoyé à cette adresse."
          error={errors.email}
          required
        >
          {(props) => (
            <Input
              {...props}
              type="email"
              autoComplete="email"
              inputMode="email"
              className="h-11"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
            />
          )}
        </Field>
        <Field
          name="orderNumber"
          label="Numéro de commande"
          hint="Il figure dans l'email de confirmation de commande (exemple : KC-1001)."
          error={errors.orderNumber}
          required
        >
          {(props) => (
            <Input
              {...props}
              className="h-11"
              value={values.orderNumber}
              onChange={(event) => update("orderNumber", event.target.value)}
            />
          )}
        </Field>
        <Field
          name="items"
          label="Articles concernés"
          hint="Laissez vide si vous renoncez à la totalité de la commande."
          error={errors.items}
        >
          {(props) => (
            <Textarea
              {...props}
              rows={3}
              value={values.items}
              onChange={(event) => update("items", event.target.value)}
            />
          )}
        </Field>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg">
            Vérifier ma demande
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => setStep("start")}>
            Annuler
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Ces informations servent uniquement à traiter votre rétractation, comme la loi
          l&apos;impose au vendeur. Détails dans la{" "}
          <Link href="/confidentialite" className="underline underline-offset-4">
            politique de confidentialité
          </Link>
          .
        </p>
      </form>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <h3 ref={headingRef} tabIndex={-1} className="font-heading text-lg uppercase outline-none">
        Étape 2 sur 2 : vérifiez et confirmez
      </h3>
      <dl className="grid gap-x-6 gap-y-2 rounded-xl border border-border bg-card p-5 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="text-muted-foreground">Nom et prénom</dt>
        <dd>{values.fullName}</dd>
        <dt className="text-muted-foreground">Email</dt>
        <dd className="break-all">{values.email}</dd>
        <dt className="text-muted-foreground">Commande</dt>
        <dd>{values.orderNumber}</dd>
        <dt className="text-muted-foreground">Articles</dt>
        <dd className="whitespace-pre-line">{values.items || "Toute la commande"}</dd>
      </dl>
      {FIELD_ORDER.map((field) => (
        <input key={field} type="hidden" name={field} value={values[field]} />
      ))}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="cta" size="lg" disabled={pending}>
          {pending ? "Envoi en cours…" : "Confirmer la rétractation"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => setStep("form")}>
          Modifier
        </Button>
      </div>
      {state.status === "unavailable" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="status"
          className="flex gap-3 rounded-xl border border-primary/60 bg-accent p-4 text-sm outline-none"
        >
          <InfoIcon className="mt-0.5 size-5 shrink-0 text-primary" />
          <p>
            L&apos;envoi en ligne sera activé à l&apos;ouverture des commandes. En attendant,
            envoyez le formulaire type ci-dessous par email
            {contactEmail ? (
              <>
                {" "}
                à{" "}
                <a href={`mailto:${contactEmail}`} className="underline underline-offset-4">
                  {contactEmail}
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
      )}
    </form>
  )
}
