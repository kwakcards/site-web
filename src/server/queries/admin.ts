import "server-only"

import { z } from "zod"

import { requireAdmin } from "@/lib/auth"
import { mediaUrl } from "@/lib/storage"
import { createClient } from "@/lib/supabase/server"
import { normalizeSearch, productSubtitle } from "@/server/queries/catalog"

/*
 * Lectures de l'admin : jamais mises en cache, faites avec la session de
 * l'administrateur (la RLS donne accès aux produits masqués).
 */

export const ADMIN_PAGE_SIZE = 50

export type AdminCategory = { id: string; slug: string; name: string; isVisible: boolean }

export async function getAdminCategories(): Promise<AdminCategory[]> {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, is_visible")
    .order("sort_order")
  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    isVisible: row.is_visible,
  }))
}

export type AdminProductRow = {
  id: string
  slug: string
  name: string
  subtitle: string | null
  categoryName: string | null
  priceCents: number
  compareAtPriceCents: number | null
  stock: number
  isVisible: boolean
  updatedAt: string
  imageUrl: string | null
}

export type AdminProductList = {
  products: AdminProductRow[]
  total: number
  page: number
  pageCount: number
}

export async function listAdminProducts(query: {
  q: string
  categoryId: string
  page: number
}): Promise<AdminProductList> {
  await requireAdmin()
  const supabase = await createClient()

  let request = supabase
    .from("products")
    .select(
      "id, slug, name, game, set_name, language, condition, is_graded, grading_company, grade, price_cents, compare_at_price_cents, stock, is_visible, updated_at, categories(name), product_images(storage_path, sort_order)",
      { count: "exact" }
    )
  const words = normalizeSearch(query.q).split(" ").filter(Boolean).slice(0, 6)
  for (const word of words) request = request.ilike("search_text", `%${word}%`)
  if (z.uuid().safeParse(query.categoryId).success)
    request = request.eq("category_id", query.categoryId)

  const page = Math.max(1, query.page)
  const from = (page - 1) * ADMIN_PAGE_SIZE
  const { data, count, error } = await request
    .order("updated_at", { ascending: false })
    .order("id")
    .order("sort_order", { referencedTable: "product_images" })
    .limit(1, { referencedTable: "product_images" })
    .range(from, from + ADMIN_PAGE_SIZE - 1)
  if (error) throw error

  const total = count ?? 0
  return {
    products: data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      subtitle: productSubtitle(row),
      categoryName: row.categories?.name ?? null,
      priceCents: row.price_cents,
      compareAtPriceCents: row.compare_at_price_cents,
      stock: row.stock,
      isVisible: row.is_visible,
      updatedAt: row.updated_at,
      imageUrl: row.product_images[0] ? mediaUrl(row.product_images[0].storage_path) : null,
    })),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  }
}

export type AdminStats = {
  visible: number
  hidden: number
  soldOut: number
  lowStock: number
}

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin()
  const supabase = await createClient()
  const count = () => supabase.from("products").select("id", { count: "exact", head: true })

  const [visible, hidden, soldOut, lowStock] = await Promise.all([
    count().eq("is_visible", true),
    count().eq("is_visible", false),
    count().eq("is_visible", true).eq("stock", 0),
    count().eq("is_visible", true).gt("stock", 0).lte("stock", 2),
  ])
  for (const result of [visible, hidden, soldOut, lowStock]) if (result.error) throw result.error

  return {
    visible: visible.count ?? 0,
    hidden: hidden.count ?? 0,
    soldOut: soldOut.count ?? 0,
    lowStock: lowStock.count ?? 0,
  }
}

export async function getAdminProduct(id: string) {
  await requireAdmin()
  if (!z.uuid().safeParse(id).success) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(storage_path, alt, sort_order)")
    .eq("id", id)
    .order("sort_order", { referencedTable: "product_images" })
    .maybeSingle()
  if (error) throw error
  return data
}

export type AdminProduct = NonNullable<Awaited<ReturnType<typeof getAdminProduct>>>
