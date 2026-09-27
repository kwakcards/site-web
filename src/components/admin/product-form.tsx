"use client"

import { ExternalLinkIcon, LoaderCircleIcon } from "lucide-react"
import Link from "next/link"
import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { type EditableImage, ImageUploader } from "@/components/admin/image-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import {
  cardConditions,
  gameSuggestions,
  gradingCompanies,
  productLanguages,
} from "@/config/catalog"
import { slugify } from "@/lib/slug"
import { cn } from "@/lib/utils"
import type { ProductField } from "@/lib/validation/product"
import type { AdminCategory } from "@/server/queries/admin"
import { type ProductFormState, saveProduct } from "@/server/actions/products"

export type ProductFormValues = {
  name: string
  slug: string
  categoryId: string
  game: string
  setName: string
  cardNumber: string
  language: string
  rarity: string
  condition: string
  isGraded: boolean
  gradingCompany: string
  grade: string
  price: string
  compareAtPrice: string
  stock: string
  description: string
  isVisible: boolean
}

type ProductFormProps = {
  mode: "create" | "edit"
  productId: string
  categories: AdminCategory[]
  initialValues: ProductFormValues
  initialImages: EditableImage[]
}

const sectionClass = "flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6"
const legendClass = "font-heading text-sm tracking-wide uppercase"

export function ProductForm({
  mode,
  productId,
  categories,
  initialValues,
  initialImages,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(saveProduct, {
    status: "idle",
  })
  const [name, setName] = useState(initialValues.name)
  const [isGraded, setIsGraded] = useState(initialValues.isGraded)
  const [condition, setCondition] = useState(initialValues.condition)
  const [slug, setSlug] = useState(initialValues.slug)
  const [uploading, setUploading] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {}
  const selectedCondition = cardConditions.find((item) => item.code === condition)

  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus()
    if (state.status === "saved") toast.success(state.message)
  }, [state])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Envoi manuel : React ne réinitialise pas le formulaire après l'action,
    // les valeurs saisies restent affichées (utile en cas d'erreur).
    event.preventDefault()
    if (uploading) {
      toast.error("Patiente jusqu'à la fin de l'envoi des photos.")
      return
    }
    const formData = new FormData(event.currentTarget)
    startTransition(() => formAction(formData))
  }

  const field = (name: ProductField, hint?: boolean) => {
    const error = errors[name]
    const describedBy = [hint ? `${name}-hint` : null, error ? `${name}-error` : null]
      .filter(Boolean)
      .join(" ")
    return {
      id: name,
      name,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy || undefined,
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-busy={pending}>
      <input type="hidden" name="id" value={productId} />
      <input type="hidden" name="mode" value={mode} />

      <div
        ref={summaryRef}
        tabIndex={-1}
        role={state.status === "error" ? "alert" : "status"}
        className="outline-none empty:hidden"
      >
        {state.status === "error" && (
          <div className="rounded-xl border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <p className="font-semibold">{state.message}</p>
            {Object.keys(errors).length > 0 && (
              <ul className="mt-1 list-disc pl-5">
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key}>
                    <a href={`#${key === "images" ? "photos" : key}`} className="underline">
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {state.status === "saved" && (
          <p className="rounded-xl border border-success/60 bg-success/10 px-4 py-3 text-sm text-success">
            {state.message}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Les champs marqués d&apos;un <span className="text-primary">*</span> sont obligatoires.
      </p>

      <fieldset className={sectionClass}>
        <legend className={cn(legendClass, "float-left")}>Informations</legend>
        <div className="clear-both grid gap-5 md:grid-cols-2">
          <Field label="Nom" name="name" required error={errors.name} className="md:col-span-2">
            <Input
              {...field("name")}
              required
              maxLength={160}
              defaultValue={initialValues.name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex. : Dracaufeu ex"
              className="h-10"
            />
          </Field>

          <Field label="Catégorie" name="categoryId" required error={errors.categoryId}>
            <NativeSelect {...field("categoryId")} required defaultValue={initialValues.categoryId}>
              <option value="" disabled>
                Choisir…
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                  {category.isVisible ? "" : " (masquée)"}
                </option>
              ))}
            </NativeSelect>
          </Field>

          <Field label="Jeu" name="game" error={errors.game}>
            <Input
              {...field("game")}
              list="game-suggestions"
              maxLength={60}
              defaultValue={initialValues.game}
              placeholder="Ex. : Pokémon"
              className="h-10"
            />
            <datalist id="game-suggestions">
              {gameSuggestions.map((game) => (
                <option key={game} value={game} />
              ))}
            </datalist>
          </Field>

          <Field label="Extension" name="setName" error={errors.setName}>
            <Input
              {...field("setName")}
              maxLength={80}
              defaultValue={initialValues.setName}
              placeholder="Ex. : Flammes Obsidiennes"
              className="h-10"
            />
          </Field>

          <Field label="Numéro" name="cardNumber" error={errors.cardNumber}>
            <Input
              {...field("cardNumber")}
              maxLength={30}
              defaultValue={initialValues.cardNumber}
              placeholder="Ex. : 223/197"
              className="h-10"
            />
          </Field>

          <Field label="Langue" name="language" error={errors.language}>
            <NativeSelect {...field("language")} defaultValue={initialValues.language}>
              <option value="">Non précisée</option>
              {productLanguages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </NativeSelect>
          </Field>

          <Field label="Rareté" name="rarity" error={errors.rarity}>
            <Input
              {...field("rarity")}
              maxLength={60}
              defaultValue={initialValues.rarity}
              placeholder="Ex. : Illustration spéciale rare"
              className="h-10"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={cn(legendClass, "float-left")}>État et gradation</legend>
        <div className="clear-both flex items-center gap-3">
          <input
            id="isGraded"
            name="isGraded"
            type="checkbox"
            checked={isGraded}
            onChange={(event) => setIsGraded(event.target.checked)}
            className="size-5 accent-primary"
          />
          <Label htmlFor="isGraded">Carte gradée (sous boîtier, avec une note)</Label>
        </div>

        <div className="grid gap-5 md:grid-cols-2" hidden={!isGraded}>
          <Field
            label="Société de gradation"
            name="gradingCompany"
            required
            error={errors.gradingCompany}
          >
            <Input
              {...field("gradingCompany")}
              list="grading-suggestions"
              required={isGraded}
              maxLength={40}
              defaultValue={initialValues.gradingCompany}
              placeholder="Ex. : PSA"
              className="h-10"
            />
            <datalist id="grading-suggestions">
              {gradingCompanies.map((company) => (
                <option key={company} value={company} />
              ))}
            </datalist>
          </Field>
          <Field label="Note sur 10" name="grade" required error={errors.grade}>
            <Input
              {...field("grade")}
              type="number"
              inputMode="decimal"
              min={1}
              max={10}
              step={0.1}
              required={isGraded}
              defaultValue={initialValues.grade}
              placeholder="Ex. : 9,5"
              className="h-10"
            />
          </Field>
        </div>

        <div hidden={isGraded}>
          <Field
            label="État"
            name="condition"
            error={errors.condition}
            hint={
              selectedCondition?.description ??
              "Laisse vide pour un produit neuf (scellé, accessoire)."
            }
          >
            <NativeSelect
              {...field("condition", true)}
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
            >
              <option value="">Non applicable (produit neuf)</option>
              {cardConditions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} · {item.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={cn(legendClass, "float-left")}>Prix et stock</legend>
        <div className="clear-both grid gap-5 md:grid-cols-3">
          <Field label="Prix de vente (€)" name="price" required error={errors.price}>
            <Input
              {...field("price")}
              required
              inputMode="decimal"
              autoComplete="off"
              defaultValue={initialValues.price}
              placeholder="Ex. : 12,50"
              className="h-10"
            />
          </Field>

          <Field
            label="Prix barré (€)"
            name="compareAtPrice"
            error={errors.compareAtPrice}
            hint={
              mode === "create"
                ? "Disponible après la création : une réduction se calcule à partir d'un prix déjà pratiqué."
                : "Optionnel. Au plus le prix le plus bas pratiqué ces 30 derniers jours (règle légale)."
            }
          >
            <Input
              {...field("compareAtPrice", true)}
              inputMode="decimal"
              autoComplete="off"
              disabled={mode === "create"}
              defaultValue={initialValues.compareAtPrice}
              placeholder={mode === "create" ? "" : "Ex. : 15,00"}
              className="h-10"
            />
          </Field>

          <Field label="Stock" name="stock" required error={errors.stock}>
            <Input
              {...field("stock")}
              type="number"
              inputMode="numeric"
              required
              min={0}
              max={9999}
              step={1}
              defaultValue={initialValues.stock}
              className="h-10"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset id="photos" className={sectionClass}>
        <legend className={cn(legendClass, "float-left")}>Photos</legend>
        <div className="clear-both">
          <ImageUploader
            productId={productId}
            productName={name}
            initialImages={initialImages}
            error={errors.images}
            onBusyChange={setUploading}
          />
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={cn(legendClass, "float-left")}>Description</legend>
        <div className="clear-both">
          <Field
            label="Texte de la fiche"
            name="description"
            error={errors.description}
            hint="État détaillé, défauts visibles, contenu d'un produit scellé…"
          >
            <Textarea
              {...field("description", true)}
              rows={6}
              maxLength={5000}
              defaultValue={initialValues.description}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={cn(legendClass, "float-left")}>Publication</legend>
        <div className="clear-both flex items-center gap-3">
          <input
            id="isVisible"
            name="isVisible"
            type="checkbox"
            defaultChecked={initialValues.isVisible}
            className="size-5 accent-primary"
          />
          <Label htmlFor="isVisible">Visible sur la boutique</Label>
        </div>

        <Field
          label="Adresse de la page"
          name="slug"
          error={errors.slug}
          hint={
            mode === "create"
              ? "Laisse vide : elle est créée à partir du nom."
              : "Modifier l'adresse rend les anciens liens partagés inutilisables."
          }
        >
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">/produit/</span>
            <Input
              {...field("slug", true)}
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              maxLength={80}
              placeholder={slugify(name) || "nom-du-produit"}
              autoComplete="off"
              spellCheck={false}
              className="h-10"
            />
          </div>
        </Field>
      </fieldset>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-border bg-background/95 px-4 py-4 backdrop-blur md:mx-0 md:rounded-xl md:border">
        <Button type="submit" variant="cta" size="lg" disabled={pending || uploading}>
          {pending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
          {pending
            ? "Enregistrement…"
            : mode === "create"
              ? "Créer le produit"
              : "Enregistrer les modifications"}
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/admin/produits">Retour à la liste</Link>
        </Button>
        {mode === "edit" && initialValues.isVisible && (
          <Button asChild variant="link" className="ml-auto">
            <Link href={`/produit/${initialValues.slug}`} target="_blank">
              Voir la fiche en ligne
              <ExternalLinkIcon data-icon="inline-end" />
              <span className="sr-only">(nouvel onglet)</span>
            </Link>
          </Button>
        )}
        {uploading && (
          <p className="w-full text-sm text-muted-foreground" aria-live="polite">
            Envoi des photos en cours…
          </p>
        )}
      </div>
    </form>
  )
}

type FieldProps = {
  label: string
  name: ProductField
  required?: boolean
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}

function Field({ label, name, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-primary">
            *
          </span>
        )}
      </Label>
      {children}
      {hint && (
        <p id={`${name}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
