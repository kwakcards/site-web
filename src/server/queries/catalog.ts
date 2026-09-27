import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import {
  CATALOG_PAGE_SIZE,
  type CatalogSort,
  conditionLabel,
  NEW_PRODUCT_DAYS,
} from "@/config/catalog"
import type { Tables } from "@/lib/supabase/database.types"
import { createPublicClient } from "@/lib/supabase/public"
import { mediaUrl } from "@/lib/storage"

/*
 * Lectures publiques du catalogue, mises en cache et invalidées par les tags
 * « products » et « categories » lors des modifications faites dans l'admin.
 */

export const CATALOG_TAGS = {
  products: "products",
  categories: "categories",
  product: (slug: string) => `product:${slug}`,
} as const

type ProductRow = Tables<"products">
type ImageRow = Pick<Tables<"product_images">, "storage_path" | "alt" | "sort_order">

export type CatalogProduct = {
  id: string
  slug: string
  name: string
  subtitle: string | null
  priceCents: number
  compareAtPriceCents: number | null
  stock: number
  imageUrl: string | null
  imageAlt: string
  isNew: boolean
}

export type CatalogCategory = Pick<
  Tables<"categories">,
  "id" | "slug" | "name" | "description" | "sort_order"
>

const CARD_COLUMNS =
  "id, slug, name, game, set_name, language, condition, is_graded, grading_company, grade, price_cents, compare_at_price_cents, stock, published_at, product_images(storage_path, alt, sort_order)"

type CardRow = Pick<
  ProductRow,
  | "id"
  | "slug"
  | "name"
  | "game"
  | "set_name"
  | "language"
  | "condition"
  | "is_graded"
  | "grading_company"
  | "grade"
  | "price_cents"
  | "compare_at_price_cents"
  | "stock"
  | "published_at"
> & { product_images: ImageRow[] }

/** Note de gradation au format français : 9.5 → « 9,5 ». */
export function formatGrade(grade: number): string {
  return String(grade).replace(".", ",")
}

/** Ligne d'infos sous le nom : extension · langue · état, ou société et note pour une gradée. */
export function productSubtitle(product: {
  game: string | null
  set_name: string | null
  language: string | null
  condition: string | null
  is_graded: boolean
  grading_company: string | null
  grade: number | null
}): string | null {
  const parts = product.is_graded
    ? [
        product.set_name,
        product.grading_company && product.grade != null
          ? `${product.grading_company} ${formatGrade(product.grade)}`
          : null,
      ]
    : [product.set_name, product.language, conditionLabel(product.condition)]
  const subtitle = parts.filter(Boolean).join(" · ")
  return subtitle || product.game
}

function isRecent(publishedAt: string | null, now: number): boolean {
  if (!publishedAt) return false
  return now - new Date(publishedAt).getTime() < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000
}

function toCatalogProduct(row: CardRow, now: number): CatalogProduct {
  const image = [...row.product_images].sort((a, b) => a.sort_order - b.sort_order)[0]
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: productSubtitle(row),
    priceCents: row.price_cents,
    compareAtPriceCents: row.compare_at_price_cents,
    stock: row.stock,
    imageUrl: image ? mediaUrl(image.storage_path) : null,
    imageAlt: image?.alt || row.name,
    isNew: isRecent(row.published_at, now),
  }
}

/** Recherche sans accents ni majuscules, comme la colonne search_text. */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[%_\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export async function getCategories(): Promise<CatalogCategory[]> {
  "use cache"
  cacheTag(CATALOG_TAGS.categories)
  cacheLife("hours")

  const { data, error } = await createPublicClient()
    .from("categories")
    .select("id, slug, name, description, sort_order")
    .order("sort_order")
  if (error) throw error
  return data
}

/** Fiches visibles et date de dernière modification, pour le plan du site. */
export async function getSitemapProducts(): Promise<{ slug: string; updatedAt: string }[]> {
  "use cache"
  cacheTag(CATALOG_TAGS.products)
  cacheLife("hours")

  const { data, error } = await createPublicClient()
    .from("products")
    .select("slug, updated_at")
    .eq("is_visible", true)
    .order("updated_at", { ascending: false })
    .limit(5000)
  if (error) throw error
  return data.map((row) => ({ slug: row.slug, updatedAt: row.updated_at }))
}

export async function getLatestProducts(limit = 8): Promise<CatalogProduct[]> {
  "use cache"
  cacheTag(CATALOG_TAGS.products)
  cacheLife("hours")

  const { data, error } = await createPublicClient()
    .from("products")
    .select(CARD_COLUMNS)
    .eq("is_visible", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("sort_order", { referencedTable: "product_images" })
    .limit(1, { referencedTable: "product_images" })
    .limit(limit)
  if (error) throw error
  const now = Date.now()
  return data.map((row) => toCatalogProduct(row, now))
}

export type CatalogQuery = {
  categorySlug?: string
  q?: string
  game?: string
  language?: string
  condition?: string
  grading?: string
  inStock?: boolean
  sort: CatalogSort
  page: number
}

export type CatalogResult = {
  products: CatalogProduct[]
  total: number
  page: number
  pageCount: number
}

export async function searchCatalog(query: CatalogQuery): Promise<CatalogResult> {
  "use cache"
  cacheTag(CATALOG_TAGS.products)
  cacheLife("minutes")

  const supabase = createPublicClient()
  let request = supabase
    .from("products")
    .select(`${CARD_COLUMNS}, categories!inner(slug)` as const, { count: "exact" })
    .eq("is_visible", true)

  if (query.categorySlug) request = request.eq("categories.slug", query.categorySlug)
  // Chaque mot doit apparaître, dans n'importe quel ordre : « ex dracaufeu » trouve « Dracaufeu ex ».
  const words = query.q ? normalizeSearch(query.q).split(" ").filter(Boolean).slice(0, 6) : []
  for (const word of words) request = request.ilike("search_text", `%${word}%`)
  if (query.game) request = request.eq("game", query.game)
  if (query.language) request = request.eq("language", query.language)
  if (query.condition) request = request.eq("condition", query.condition)
  if (query.grading) request = request.eq("grading_company", query.grading)
  if (query.inStock) request = request.gt("stock", 0)

  switch (query.sort) {
    case "prix-croissant":
      request = request.order("price_cents", { ascending: true })
      break
    case "prix-decroissant":
      request = request.order("price_cents", { ascending: false })
      break
    case "nom":
      request = request.order("name", { ascending: true })
      break
    default:
      request = request.order("published_at", { ascending: false, nullsFirst: false })
  }

  const page = Math.max(1, query.page)
  const from = (page - 1) * CATALOG_PAGE_SIZE
  const { data, count, error } = await request
    .order("id")
    .order("sort_order", { referencedTable: "product_images" })
    .limit(1, { referencedTable: "product_images" })
    .range(from, from + CATALOG_PAGE_SIZE - 1)
  if (error) throw error

  const total = count ?? 0
  const now = Date.now()
  return {
    products: data.map((row) => toCatalogProduct(row, now)),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE)),
  }
}

export type CatalogFacets = Record<
  "game" | "set_name" | "language" | "rarity" | "condition" | "grading_company",
  { value: string; total: number }[]
>

export async function getCatalogFacets(categoryId?: string): Promise<CatalogFacets> {
  "use cache"
  cacheTag(CATALOG_TAGS.products)
  cacheLife("minutes")

  const { data, error } = await createPublicClient().rpc(
    "catalog_facets",
    categoryId ? { p_category_id: categoryId } : {}
  )
  if (error) throw error

  const facets: CatalogFacets = {
    game: [],
    set_name: [],
    language: [],
    rarity: [],
    condition: [],
    grading_company: [],
  }
  for (const row of data) {
    const key = row.facet as keyof CatalogFacets
    if (key in facets) facets[key].push({ value: row.value, total: row.total })
  }
  for (const list of Object.values(facets))
    list.sort((a, b) => a.value.localeCompare(b.value, "fr"))
  return facets
}

export type ProductDetail = ProductRow & {
  category: { slug: string; name: string } | null
  images: { url: string; alt: string }[]
  subtitle: string | null
  isNew: boolean
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  "use cache"
  cacheTag(CATALOG_TAGS.products, CATALOG_TAGS.product(slug))
  cacheLife("hours")

  const { data, error } = await createPublicClient()
    .from("products")
    .select("*, categories(slug, name), product_images(storage_path, alt, sort_order)")
    .eq("slug", slug)
    .eq("is_visible", true)
    .order("sort_order", { referencedTable: "product_images" })
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const { categories, product_images, ...product } = data
  return {
    ...product,
    category: categories,
    images: product_images.map((image) => ({
      url: mediaUrl(image.storage_path),
      alt: image.alt || product.name,
    })),
    subtitle: productSubtitle(product),
    isNew: isRecent(product.published_at, Date.now()),
  }
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<CatalogProduct[]> {
  "use cache"
  cacheTag(CATALOG_TAGS.products)
  cacheLife("hours")

  const { data, error } = await createPublicClient()
    .from("products")
    .select(CARD_COLUMNS)
    .eq("is_visible", true)
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("sort_order", { referencedTable: "product_images" })
    .limit(1, { referencedTable: "product_images" })
    .limit(limit)
  if (error) throw error
  const now = Date.now()
  return data.map((row) => toCatalogProduct(row, now))
}
