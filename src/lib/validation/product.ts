import { z } from "zod"

import { cardConditions } from "@/config/catalog"
import { parseEuroToCents } from "@/lib/money"
import { SLUG_PATTERN } from "@/lib/slug"

/** Nombre maximal de photos par produit. */
export const MAX_PRODUCT_IMAGES = 12

/** Chemin d'une photo dans le bucket : products/<id du produit>/<fichier>. */
export function productImagePrefix(productId: string): string {
  return `products/${productId}/`
}

const IMAGE_FILE_PATTERN = /^[a-z0-9-]+\.(webp|jpe?g|png|avif)$/

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `${max} caractères maximum.` })
    .transform((value) => value || null)

const euroAmount = z
  .string()
  .trim()
  .transform((value, context) => {
    if (!value) return null
    const cents = parseEuroToCents(value)
    if (cents == null || cents > 100_000_000) {
      context.addIssue({ code: "custom", message: "Montant invalide (ex. : 12,50)." })
      return z.NEVER
    }
    return cents
  })

const conditionCodes = cardConditions.map((condition) => condition.code) as [string, ...string[]]

export const productImageSchema = z.object({
  path: z.string().max(200),
  alt: z.string().trim().max(200, { error: "200 caractères maximum." }),
})

/**
 * Formulaire produit de l'admin, reçu sous forme de texte (FormData) puis
 * converti : montants en centimes, cases à cocher en booléens, champs vides en null.
 */
export const productFormSchema = z
  .object({
    id: z.uuid(),
    mode: z.enum(["create", "edit"]),
    name: z
      .string()
      .trim()
      .min(1, { error: "Le nom est obligatoire." })
      .max(160, { error: "160 caractères maximum." }),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .max(80, { error: "80 caractères maximum." })
      .refine((value) => value === "" || SLUG_PATTERN.test(value), {
        error: "Lettres minuscules sans accents, chiffres et tirets uniquement.",
      }),
    categoryId: z.uuid({ error: "Choisis une catégorie." }),
    game: optionalText(60),
    setName: optionalText(80),
    cardNumber: optionalText(30),
    language: optionalText(10),
    rarity: optionalText(60),
    condition: z.union([z.enum(conditionCodes), z.literal("")]).transform((value) => value || null),
    isGraded: z.boolean(),
    gradingCompany: optionalText(40),
    grade: z
      .string()
      .trim()
      .transform((value, context) => {
        if (!value) return null
        const grade = Number(value.replace(",", "."))
        const oneDecimal = Math.abs(grade * 10 - Math.round(grade * 10)) < 1e-9
        if (!Number.isFinite(grade) || grade < 1 || grade > 10 || !oneDecimal) {
          context.addIssue({ code: "custom", message: "Note entre 1 et 10 (ex. : 9,5)." })
          return z.NEVER
        }
        return grade
      }),
    price: euroAmount,
    compareAtPrice: euroAmount,
    stock: z
      .string()
      .trim()
      .min(1, { error: "Indique le stock." })
      .transform(Number)
      .pipe(
        z
          .number({ error: "Indique un nombre." })
          .int({ error: "Nombre entier uniquement." })
          .min(0, { error: "Le stock ne peut pas être négatif." })
          .max(9999, { error: "9 999 maximum." })
      ),
    description: optionalText(5000),
    isVisible: z.boolean(),
    images: z.array(productImageSchema).max(MAX_PRODUCT_IMAGES, {
      error: `${MAX_PRODUCT_IMAGES} photos maximum.`,
    }),
  })
  .superRefine((data, context) => {
    if (data.price == null) {
      context.addIssue({ code: "custom", path: ["price"], message: "Le prix est obligatoire." })
    }
    if (data.compareAtPrice != null && data.price != null && data.compareAtPrice <= data.price) {
      context.addIssue({
        code: "custom",
        path: ["compareAtPrice"],
        message: "Le prix barré doit être supérieur au prix de vente.",
      })
    }
    if (data.isGraded && !data.gradingCompany) {
      context.addIssue({
        code: "custom",
        path: ["gradingCompany"],
        message: "Indique la société de gradation.",
      })
    }
    if (data.isGraded && data.grade == null) {
      context.addIssue({ code: "custom", path: ["grade"], message: "Indique la note." })
    }
    const prefix = productImagePrefix(data.id)
    data.images.forEach((image, index) => {
      const file = image.path.slice(prefix.length)
      if (!image.path.startsWith(prefix) || !IMAGE_FILE_PATTERN.test(file)) {
        context.addIssue({
          code: "custom",
          path: ["images", index, "path"],
          message: "Photo invalide.",
        })
      }
    })
  })

export type ProductFormInput = z.input<typeof productFormSchema>
export type ProductFormData = z.output<typeof productFormSchema>

export type ProductField =
  | "name"
  | "slug"
  | "categoryId"
  | "game"
  | "setName"
  | "cardNumber"
  | "language"
  | "rarity"
  | "condition"
  | "gradingCompany"
  | "grade"
  | "price"
  | "compareAtPrice"
  | "stock"
  | "description"
  | "images"

export type ProductFieldErrors = Partial<Record<ProductField, string>>

/** Lecture du FormData envoyé par le formulaire produit. */
export function readProductForm(formData: FormData): unknown {
  const text = (name: string) => String(formData.get(name) ?? "")
  let images: unknown = []
  try {
    images = JSON.parse(text("images") || "[]")
  } catch {
    images = null
  }
  return {
    id: text("id"),
    mode: text("mode"),
    name: text("name"),
    slug: text("slug"),
    categoryId: text("categoryId"),
    game: text("game"),
    setName: text("setName"),
    cardNumber: text("cardNumber"),
    language: text("language"),
    rarity: text("rarity"),
    condition: text("condition"),
    isGraded: formData.get("isGraded") === "on",
    gradingCompany: text("gradingCompany"),
    grade: text("grade"),
    price: text("price"),
    compareAtPrice: text("compareAtPrice"),
    stock: text("stock"),
    description: text("description"),
    isVisible: formData.get("isVisible") === "on",
    images,
  }
}

/** Premier message d'erreur par champ (les erreurs de photos sont regroupées). */
export function productFieldErrors(error: z.ZodError): ProductFieldErrors {
  const errors: ProductFieldErrors = {}
  for (const issue of error.issues) {
    const field = (issue.path[0] === "images" ? "images" : issue.path[0]) as ProductField
    if (typeof field === "string" && !errors[field]) errors[field] = issue.message
  }
  return errors
}
