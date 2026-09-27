"use server"

import type { PostgrestError } from "@supabase/supabase-js"
import { refresh, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { requireAdmin } from "@/lib/auth"
import { formatPrice } from "@/lib/money"
import { slugify } from "@/lib/slug"
import { MEDIA_BUCKET } from "@/lib/storage"
import { createClient } from "@/lib/supabase/server"
import {
  type ProductFieldErrors,
  productFieldErrors,
  type ProductFormData,
  productFormSchema,
  productImagePrefix,
  readProductForm,
} from "@/lib/validation/product"
import { CATALOG_TAGS } from "@/server/queries/catalog"

/*
 * Actions de l'admin sur les produits. Chaque action revérifie le rôle admin
 * (requireAdmin) ; la RLS de Supabase le vérifie une seconde fois.
 */

export type ProductFormState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: ProductFieldErrors }
  | { status: "saved"; message: string; slug: string; savedAt: number }

export type ActionResult = { ok: true } | { ok: false; message: string }

type Supabase = Awaited<ReturnType<typeof createClient>>

const uuid = z.uuid()

/** Vide le cache du catalogue public et rafraîchit l'écran de l'admin. */
function refreshCatalog(...slugs: (string | null | undefined)[]) {
  updateTag(CATALOG_TAGS.products)
  for (const slug of new Set(slugs)) if (slug) updateTag(CATALOG_TAGS.product(slug))
  refresh()
}

/** Premier slug libre de la forme base, base-2, base-3… */
async function freeSlug(supabase: Supabase, base: string, productId: string): Promise<string> {
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .or(`slug.eq.${base},slug.like.${base}-%`)
    .neq("id", productId)
  if (error) throw error

  const taken = new Set(data.map((row) => row.slug))
  if (!taken.has(base)) return base
  for (let n = 2; ; n++) {
    const suffix = `-${n}`
    const candidate = `${base.slice(0, 80 - suffix.length).replace(/-+$/, "")}${suffix}`
    if (!taken.has(candidate)) return candidate
  }
}

async function isSlugTaken(supabase: Supabase, slug: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .neq("id", productId)
    .maybeSingle()
  if (error) throw error
  return data != null
}

function productRow(data: ProductFormData, slug: string) {
  return {
    slug,
    category_id: data.categoryId,
    name: data.name,
    game: data.game,
    set_name: data.setName,
    card_number: data.cardNumber,
    language: data.language,
    rarity: data.rarity,
    // Une carte gradée est décrite par sa note, pas par l'échelle d'état.
    condition: data.isGraded ? null : data.condition,
    is_graded: data.isGraded,
    grading_company: data.isGraded ? data.gradingCompany : null,
    grade: data.isGraded ? data.grade : null,
    price_cents: data.price ?? 0,
    compare_at_price_cents: data.compareAtPrice,
    stock: data.stock,
    description: data.description,
    is_visible: data.isVisible,
  }
}

function databaseError(error: PostgrestError): Extract<ProductFormState, { status: "error" }> {
  if (error.message === "PRICE_REFERENCE") {
    const reference = Number.parseInt(error.details ?? "", 10)
    return {
      status: "error",
      message: "Le prix barré n'est pas autorisé.",
      fieldErrors: {
        compareAtPrice: Number.isFinite(reference)
          ? `Le prix barré ne peut pas dépasser ${formatPrice(reference)} : c'est le prix le plus bas pratiqué au cours des 30 derniers jours.`
          : "Un produit qui vient d'être créé n'a pas encore de prix de référence : enregistre-le sans prix barré.",
      },
    }
  }
  if (error.code === "23505") {
    return {
      status: "error",
      message: "Cette adresse de page est déjà utilisée.",
      fieldErrors: { slug: "Déjà utilisée par un autre produit : choisis-en une autre." },
    }
  }
  if (error.code === "23503") {
    return {
      status: "error",
      message: "La catégorie choisie n'existe plus.",
      fieldErrors: { categoryId: "Choisis une autre catégorie." },
    }
  }
  console.error("[admin] enregistrement du produit", error)
  return { status: "error", message: "L'enregistrement a échoué. Réessaie dans un instant." }
}

/** Aligne la table product_images sur la liste envoyée (ordre, textes alternatifs, retraits). */
async function syncImages(
  supabase: Supabase,
  productId: string,
  images: ProductFormData["images"]
): Promise<PostgrestError | null> {
  const { data: current, error } = await supabase
    .from("product_images")
    .select("id, storage_path")
    .eq("product_id", productId)
  if (error) return error

  const kept = new Set(images.map((image) => image.path))
  const removed = current.filter((image) => !kept.has(image.storage_path))

  if (removed.length > 0) {
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .in(
        "id",
        removed.map((image) => image.id)
      )
    if (deleteError) return deleteError
  }

  if (images.length > 0) {
    const { error: upsertError } = await supabase.from("product_images").upsert(
      images.map((image, index) => ({
        product_id: productId,
        storage_path: image.path,
        alt: image.alt || null,
        sort_order: index,
      })),
      { onConflict: "storage_path" }
    )
    if (upsertError) return upsertError
  }

  if (removed.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove(removed.map((image) => image.storage_path))
    if (storageError) console.error("[admin] suppression des fichiers photo", storageError)
  }
  return null
}

export async function saveProduct(
  _previous: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin()

  const parsed = productFormSchema.safeParse(readProductForm(formData))
  if (!parsed.success) {
    return {
      status: "error",
      message: "Certains champs sont à corriger.",
      fieldErrors: productFieldErrors(parsed.error),
    }
  }

  const data = parsed.data
  const supabase = await createClient()

  let previousSlug: string | null = null
  if (data.mode === "edit") {
    const { data: existing, error } = await supabase
      .from("products")
      .select("slug")
      .eq("id", data.id)
      .maybeSingle()
    if (error) return databaseError(error)
    if (!existing) return { status: "error", message: "Ce produit n'existe plus." }
    previousSlug = existing.slug
  }

  // Adresse de la page : saisie, conservée, ou générée à partir du nom.
  let slug: string
  if (data.slug) {
    if (await isSlugTaken(supabase, data.slug, data.id)) {
      return {
        status: "error",
        message: "Cette adresse de page est déjà utilisée.",
        fieldErrors: { slug: "Déjà utilisée par un autre produit : choisis-en une autre." },
      }
    }
    slug = data.slug
  } else if (previousSlug) {
    slug = previousSlug
  } else {
    slug = await freeSlug(supabase, slugify(data.name) || `produit-${data.id.slice(0, 8)}`, data.id)
  }

  const row = productRow(data, slug)
  const { error: writeError } =
    data.mode === "create"
      ? await supabase.from("products").insert({ id: data.id, ...row })
      : await supabase.from("products").update(row).eq("id", data.id)
  if (writeError) return databaseError(writeError)

  const imageError = await syncImages(supabase, data.id, data.images)
  refreshCatalog(slug, previousSlug)
  if (imageError) {
    console.error("[admin] enregistrement des photos", imageError)
    return {
      status: "error",
      message: "Le produit est enregistré, mais pas ses photos. Réessaie d'enregistrer.",
      fieldErrors: { images: "Les photos n'ont pas pu être enregistrées." },
    }
  }

  if (data.mode === "create") redirect(`/admin/produits/${data.id}?cree=1`)
  return { status: "saved", message: "Modifications enregistrées.", slug, savedAt: Date.now() }
}

export async function setProductVisibility(
  productId: string,
  visible: boolean
): Promise<ActionResult> {
  await requireAdmin()
  if (!uuid.safeParse(productId).success || typeof visible !== "boolean") {
    return { ok: false, message: "Demande invalide." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .update({ is_visible: visible })
    .eq("id", productId)
    .select("slug")
    .maybeSingle()
  if (error || !data) return { ok: false, message: "La mise à jour a échoué." }

  refreshCatalog(data.slug)
  return { ok: true }
}

/** Supprime le produit, ses lignes de photos (cascade) et tous les fichiers de son dossier. */
export async function deleteProduct(
  productId: string,
  options: { redirectTo?: "/admin/produits" } = {}
): Promise<ActionResult> {
  await requireAdmin()
  if (!uuid.safeParse(productId).success) return { ok: false, message: "Produit introuvable." }

  const supabase = await createClient()
  const { data: product, error: readError } = await supabase
    .from("products")
    .select("slug, product_images(storage_path)")
    .eq("id", productId)
    .maybeSingle()
  if (readError) return { ok: false, message: "La suppression a échoué." }
  if (!product) return { ok: false, message: "Ce produit a déjà été supprimé." }

  const { error } = await supabase.from("products").delete().eq("id", productId)
  if (error) {
    console.error("[admin] suppression du produit", error)
    return { ok: false, message: "La suppression a échoué." }
  }

  // Fichiers enregistrés et éventuelles photos envoyées mais jamais enregistrées.
  const folder = productImagePrefix(productId).replace(/\/$/, "")
  const { data: files } = await supabase.storage.from(MEDIA_BUCKET).list(folder, { limit: 100 })
  const paths = new Set([
    ...product.product_images.map((image) => image.storage_path),
    ...(files ?? []).map((file) => `${folder}/${file.name}`),
  ])
  if (paths.size > 0) {
    const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove([...paths])
    if (storageError) console.error("[admin] suppression des fichiers photo", storageError)
  }

  refreshCatalog(product.slug)
  if (options.redirectTo === "/admin/produits") redirect("/admin/produits?supprime=1")
  return { ok: true }
}

/** Copie un produit (masqué, sans photos ni prix barré) et ouvre la copie. */
export async function duplicateProduct(productId: string): Promise<ActionResult> {
  await requireAdmin()
  if (!uuid.safeParse(productId).success) return { ok: false, message: "Produit introuvable." }

  const supabase = await createClient()
  const { data: source, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle()
  if (error || !source) return { ok: false, message: "Produit introuvable." }

  const name = `${source.name} (copie)`.slice(0, 160)
  const id = crypto.randomUUID()
  const slug = await freeSlug(supabase, slugify(name) || `produit-${id.slice(0, 8)}`, id)
  const { error: insertError } = await supabase.from("products").insert({
    id,
    slug,
    name,
    category_id: source.category_id,
    game: source.game,
    set_name: source.set_name,
    card_number: source.card_number,
    language: source.language,
    rarity: source.rarity,
    condition: source.condition,
    is_graded: source.is_graded,
    grading_company: source.grading_company,
    grade: source.grade,
    price_cents: source.price_cents,
    stock: source.stock,
    description: source.description,
    is_visible: false,
  })
  if (insertError) {
    console.error("[admin] duplication du produit", insertError)
    return { ok: false, message: "La duplication a échoué." }
  }

  refreshCatalog()
  redirect(`/admin/produits/${id}?copie=1`)
}
