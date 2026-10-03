"use client"

import imageCompression from "browser-image-compression"
import { CircleCheckIcon, ImagePlusIcon, LoaderCircleIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeCheckbox } from "@/components/ui/native-checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  BUYBACK_MAX_PHOTOS,
  BUYBACK_RETENTION_MONTHS,
  buybackGames,
  buybackItemTypes,
  buybackLanguages,
  buybackValues,
  buybackVolumes,
} from "@/config/buyback"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  type BuybackField,
  type BuybackFieldErrors,
  buybackCollectionSchema,
  buybackContactSchema,
  buybackFieldErrors,
  buybackFinalSchema,
} from "@/lib/validation/buyback"
import { submitBuybackRequest } from "@/server/actions/buyback"

type Values = {
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  itemTypes: string[]
  games: string[]
  languages: string[]
  volume: string
  expectedValue: string
  summary: string
  cardList: string
  message: string
  ownerCertified: boolean
}

const EMPTY: Values = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  itemTypes: [],
  games: [],
  languages: [],
  volume: "",
  expectedValue: "",
  summary: "",
  cardList: "",
  message: "",
  ownerCertified: false,
}

const STEPS = [
  {
    title: "Tes coordonnées",
    schema: buybackContactSchema,
    fields: ["firstName", "lastName", "email", "phone", "city"],
  },
  {
    title: "Ta collection",
    schema: buybackCollectionSchema,
    fields: ["itemTypes", "games", "languages", "volume", "expectedValue", "summary", "cardList"],
  },
  { title: "Photos et envoi", schema: buybackFinalSchema, fields: ["message", "ownerCertified"] },
] as const satisfies readonly { title: string; schema: unknown; fields: readonly BuybackField[] }[]

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SOURCE_BYTES = 25 * 1024 * 1024
const EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
}

type Photo = { id: string; file: File; preview: string }
type Phase = "form" | "sending" | "uploading" | "done"

/**
 * Demande de rachat en 3 étapes. La demande est enregistrée par une action
 * serveur ; les photos (facultatives) sont ensuite compressées dans le
 * navigateur et envoyées directement dans le dossier privé de la demande.
 */
export function BuybackForm() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<BuybackFieldErrors>({})
  const [photos, setPhotos] = useState<Photo[]>([])
  const [phase, setPhase] = useState<Phase>("form")
  const [serverError, setServerError] = useState<string | null>(null)
  const [failedPhotos, setFailedPhotos] = useState(0)

  const startedAt = useRef(0)
  const honeypot = useRef<HTMLInputElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)
  const photosRef = useRef<Photo[]>([])
  const changedStep = useRef(false)
  const fileInputId = useId()

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  // Libère les aperçus des photos quand le formulaire disparaît.
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  useEffect(
    () => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview)),
    []
  )

  // Place le focus sur le titre de l'étape, pour le clavier et les lecteurs d'écran.
  useEffect(() => {
    if (changedStep.current) headingRef.current?.focus()
  }, [step])

  useEffect(() => {
    if (phase === "done") doneRef.current?.focus()
  }, [phase])

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    clearError(field)
  }

  function toggle(field: "itemTypes" | "games" | "languages", value: string) {
    setValues((current) => {
      const list = current[field]
      return {
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      }
    })
    clearError(field)
  }

  // Le message d'erreur d'un champ disparaît dès qu'il est modifié.
  function clearError(field: BuybackField) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function validateStep(index: number, form: HTMLFormElement): boolean {
    const { schema, fields } = STEPS[index]
    const subset = Object.fromEntries(fields.map((field) => [field, values[field]]))
    const result = schema.safeParse(subset)
    if (result.success) {
      setErrors({})
      return true
    }
    const fieldErrors = buybackFieldErrors(result.error)
    setErrors(fieldErrors)
    // Place le focus sur le premier champ à corriger.
    const firstInvalid = fields.find((field) => fieldErrors[field])
    if (firstInvalid) form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
    return false
  }

  function goTo(index: number) {
    changedStep.current = true
    setStep(index)
    setServerError(null)
  }

  function addPhotos(files: FileList | null) {
    if (!files) return
    const room = BUYBACK_MAX_PHOTOS - photos.length
    const accepted = Array.from(files)
      .filter((file) => ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_SOURCE_BYTES)
      .slice(0, Math.max(0, room))
      .map((file) => ({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) }))
    setPhotos((current) => [...current, ...accepted])
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const photo = current.find((item) => item.id === id)
      if (photo) URL.revokeObjectURL(photo.preview)
      return current.filter((item) => item.id !== id)
    })
  }

  async function uploadPhoto(file: File, requestId: string, token: string) {
    const compressed = await imageCompression(file, {
      maxWidthOrHeight: 1600,
      maxSizeMB: 1,
      fileType: "image/webp",
      initialQuality: 0.8,
      // Pas de Web Worker : la bibliothèque le chargerait depuis un CDN externe.
      useWebWorker: false,
    })
    const extension = EXTENSIONS[compressed.type]
    if (!extension) throw new Error("Format non pris en charge")
    const path = `${requestId}/${token}/${crypto.randomUUID()}.${extension}`
    const { error } = await createClient()
      .storage.from("buyback")
      .upload(path, compressed, { contentType: compressed.type, upsert: false })
    if (error) throw error
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (step < STEPS.length - 1) {
      if (validateStep(step, form)) goTo(step + 1)
      return
    }
    if (!validateStep(step, form)) return

    setPhase("sending")
    setServerError(null)
    const response = await submitBuybackRequest({
      ...values,
      website: honeypot.current?.value ?? "",
      startedAt: startedAt.current,
    })

    if (response.status === "invalid") {
      setErrors(response.fieldErrors)
      const firstStep = STEPS.findIndex((item) =>
        item.fields.some((field) => response.fieldErrors[field])
      )
      setPhase("form")
      if (firstStep >= 0 && firstStep !== step) goTo(firstStep)
      return
    }
    if (response.status === "error") {
      setServerError(response.message)
      setPhase("form")
      return
    }

    setPhase("uploading")
    let failed = 0
    for (const photo of photos) {
      try {
        await uploadPhoto(photo.file, response.requestId, response.uploadToken)
      } catch {
        failed += 1
      }
    }
    setFailedPhotos(failed)
    setPhase("done")
  }

  if (phase === "done") {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 rounded-2xl border-2 border-success/60 bg-success/10 p-6 outline-none"
      >
        <CircleCheckIcon aria-hidden="true" className="size-8 text-success" />
        <div>
          <h3 className="font-heading text-lg uppercase">Demande envoyée</h3>
          <p className="mt-2 text-sm">
            Merci {values.firstName} ! On étudie ta collection et on te répond par email à{" "}
            <strong>{values.email}</strong>.
          </p>
          {failedPhotos > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {failedPhotos === 1
                ? "1 photo n'a pas pu être envoyée"
                : `${failedPhotos} photos n'ont pas pu être envoyées`}{" "}
              : tu pourras nous les transmettre en répondant à notre email.
            </p>
          )}
        </div>
        <Button asChild variant="outline">
          <Link href="/boutique">Voir la boutique</Link>
        </Button>
      </div>
    )
  }

  const busy = phase !== "form"
  const isLast = step === STEPS.length - 1

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={busy} className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Étape {step + 1} sur {STEPS.length}
        </p>
        <div aria-hidden="true" className="mt-2 flex gap-1.5">
          {STEPS.map((item, index) => (
            <span
              key={item.title}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                index <= step ? "bg-primary" : "bg-secondary"
              )}
            />
          ))}
        </div>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-heading text-lg uppercase outline-none"
        >
          {STEPS[step].title}
        </h3>
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-xl border-2 border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      {step === 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Prénom"
            name="firstName"
            required
            error={errors.firstName}
            value={values.firstName}
            onChange={(value) => update("firstName", value)}
            autoComplete="given-name"
          />
          <TextField
            label="Nom"
            name="lastName"
            required
            error={errors.lastName}
            value={values.lastName}
            onChange={(value) => update("lastName", value)}
            autoComplete="family-name"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            hint="Notre réponse arrivera à cette adresse."
            error={errors.email}
            value={values.email}
            onChange={(value) => update("email", value)}
            autoComplete="email"
          />
          <TextField
            label="Téléphone"
            name="phone"
            type="tel"
            hint="Facultatif."
            error={errors.phone}
            value={values.phone}
            onChange={(value) => update("phone", value)}
            autoComplete="tel"
          />
          <TextField
            label="Ville"
            name="city"
            required
            hint="Pour savoir si une remise en main propre est possible."
            error={errors.city}
            value={values.city}
            onChange={(value) => update("city", value)}
            autoComplete="address-level2"
          />
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <ChoiceGroup
            legend="Que vends-tu ?"
            name="itemTypes"
            type="checkbox"
            required
            options={buybackItemTypes}
            selected={values.itemTypes}
            onToggle={(value) => toggle("itemTypes", value)}
            error={errors.itemTypes}
          />
          <ChoiceGroup
            legend="Quels jeux ?"
            name="games"
            type="checkbox"
            options={buybackGames}
            selected={values.games}
            onToggle={(value) => toggle("games", value)}
            error={errors.games}
          />
          <ChoiceGroup
            legend="Langues des cartes"
            name="languages"
            type="checkbox"
            required
            options={buybackLanguages}
            selected={values.languages}
            onToggle={(value) => toggle("languages", value)}
            error={errors.languages}
          />
          <ChoiceGroup
            legend="Volume approximatif"
            name="volume"
            type="radio"
            required
            options={buybackVolumes}
            selected={values.volume ? [values.volume] : []}
            onToggle={(value) => update("volume", value)}
            error={errors.volume}
          />
          <ChoiceGroup
            legend="Valeur que tu espères"
            name="expectedValue"
            type="radio"
            required
            options={buybackValues}
            selected={values.expectedValue ? [values.expectedValue] : []}
            onToggle={(value) => update("expectedValue", value)}
            error={errors.expectedValue}
          />
          <TextField
            label="Ta collection en quelques mots"
            name="summary"
            required
            hint="Ex. : 300 cartes Pokémon de 2020 à 2024, dont une dizaine de cartes rares."
            error={errors.summary}
            value={values.summary}
            onChange={(value) => update("summary", value)}
            maxLength={300}
          />
          <TextField
            label="Liste des cartes"
            name="cardList"
            multiline
            hint="Facultatif : colle ici ta liste (nom, extension, état), si tu en as une."
            error={errors.cardList}
            value={values.cardList}
            onChange={(value) => update("cardList", value)}
            maxLength={10000}
          />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p id={`${fileInputId}-label`} className="text-sm font-medium">
              Photos de ta collection
            </p>
            <p id={`${fileInputId}-hint`} className="text-xs text-muted-foreground">
              Facultatif, {BUYBACK_MAX_PHOTOS} photos maximum (JPEG, PNG ou WebP). Elles servent
              uniquement à l&apos;estimation et sont allégées avant l&apos;envoi.
            </p>
            {photos.length > 0 && (
              <ul className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {photos.map((photo, index) => (
                  <li key={photo.id} className="relative">
                    {/* Aperçu local (blob:) avant l'envoi : next/image ne s'applique pas. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.preview}
                      alt={`Photo ${index + 1}`}
                      className="aspect-square w-full rounded-lg border-2 border-edge object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      aria-label={`Retirer la photo ${index + 1}`}
                      className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full border-2 border-destructive bg-secondary text-destructive"
                    >
                      <XIcon aria-hidden="true" className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {photos.length < BUYBACK_MAX_PHOTOS && (
              <label
                htmlFor={fileInputId}
                className="flex tactile cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-input bg-secondary px-4 py-6 text-center hover:border-primary hover:ledge-brand-deep has-[:focus-visible]:border-primary has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
              >
                <ImagePlusIcon aria-hidden="true" className="size-7 text-primary" />
                <span className="font-heading text-sm uppercase">Ajouter des photos</span>
                <span className="text-xs text-muted-foreground">
                  Depuis ta galerie ou ton appareil photo
                </span>
                <input
                  id={fileInputId}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  multiple
                  aria-labelledby={`${fileInputId}-label`}
                  aria-describedby={`${fileInputId}-hint`}
                  className="sr-only"
                  onChange={(event) => {
                    addPhotos(event.target.files)
                    event.target.value = ""
                  }}
                />
              </label>
            )}
          </div>

          <TextField
            label="Message"
            name="message"
            multiline
            hint="Facultatif : une précision, tes disponibilités…"
            error={errors.message}
            value={values.message}
            onChange={(value) => update("message", value)}
            maxLength={2000}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <NativeCheckbox
                id="buyback-owner"
                name="ownerCertified"
                checked={values.ownerCertified}
                onChange={(event) => update("ownerCertified", event.target.checked)}
                aria-invalid={errors.ownerCertified ? true : undefined}
                aria-describedby={errors.ownerCertified ? "buyback-owner-error" : undefined}
              />
              <Label htmlFor="buyback-owner" className="leading-snug">
                <span>
                  Je certifie que les articles proposés m&apos;appartiennent.{" "}
                  <span aria-hidden="true" className="text-primary">
                    *
                  </span>
                </span>
              </Label>
            </div>
            {errors.ownerCertified && (
              <p id="buyback-owner-error" className="text-sm text-destructive">
                {errors.ownerCertified}
              </p>
            )}
          </div>

          {/* Champ piège pour les robots : invisible et ignoré par les lecteurs d'écran. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="buyback-website">Ne pas remplir ce champ</label>
            <input
              ref={honeypot}
              id="buyback-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Tes informations servent uniquement à étudier et traiter ta demande. Sans rachat, elles
            sont supprimées au plus tard {BUYBACK_RETENTION_MONTHS} mois après notre dernier
            échange. Détails et droits :{" "}
            <Link href="/confidentialite#traitements" className="text-primary underline">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <Button type="submit" variant="cta" size="lg" disabled={busy}>
          {busy && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
          {phase === "sending"
            ? "Envoi…"
            : phase === "uploading"
              ? "Envoi des photos…"
              : isLast
                ? "Envoyer ma demande"
                : "Continuer"}
        </Button>
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => goTo(step - 1)}
            disabled={busy}
          >
            Retour
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Les champs marqués d&apos;un <span className="text-primary">*</span> sont obligatoires.
      </p>
    </form>
  )
}

type TextFieldProps = {
  label: string
  name: BuybackField
  value: string
  onChange: (value: string) => void
  required?: boolean
  hint?: string
  error?: string
  type?: string
  autoComplete?: string
  maxLength?: number
  multiline?: boolean
}

function TextField({
  label,
  name,
  value,
  onChange,
  required = false,
  hint,
  error,
  type = "text",
  autoComplete,
  maxLength,
  multiline = false,
}: TextFieldProps) {
  const id = `buyback-${name}`
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ")
  const shared = {
    id,
    name,
    value,
    required,
    maxLength,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  }

  return (
    <div className={cn("flex flex-col gap-2", multiline && "sm:col-span-2")}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-primary">
            *
          </span>
        )}
      </Label>
      {multiline ? (
        <Textarea {...shared} rows={5} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <Input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="h-11"
        />
      )}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

type ChoiceGroupProps = {
  legend: string
  name: BuybackField
  type: "checkbox" | "radio"
  options: readonly { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
  required?: boolean
  error?: string
}

/** Choix sous forme de puces : cases à cocher ou boutons radio natifs, masqués visuellement. */
function ChoiceGroup({
  legend,
  name,
  type,
  options,
  selected,
  onToggle,
  required = false,
  error,
}: ChoiceGroupProps) {
  const errorId = `buyback-${name}-error`
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-medium">
        {legend}
        {required && (
          <span aria-hidden="true" className="text-primary">
            {" "}
            *
          </span>
        )}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((option) => {
          const id = `buyback-${name}-${option.value}`
          return (
            <label key={option.value} htmlFor={id} className="cursor-pointer">
              <input
                id={id}
                type={type}
                name={name}
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() => onToggle(option.value)}
                aria-invalid={error ? true : undefined}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-10 tactile items-center rounded-full border-2 border-edge bg-secondary px-4 py-2 text-sm [--ledge-depth:3px] peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:ledge-brand-deep peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 hover:border-primary">
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
}
