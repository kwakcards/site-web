import { CircleCheckIcon, PlusIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { DuplicateProductButton } from "@/components/admin/duplicate-product-button"
import { ProductForm } from "@/components/admin/product-form"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth"
import { centsToEuroInput } from "@/lib/money"
import { getAdminCategories, getAdminProduct } from "@/server/queries/admin"

export const metadata: Metadata = { title: "Modifier un produit" }

// Page liée à la session de l'admin : rendue à chaque requête (voir le layout).
export const instant = false

export default async function EditProductPage({
  params,
  searchParams,
}: PageProps<"/admin/produits/[id]">) {
  await requireAdmin()
  const [{ id }, query] = await Promise.all([params, searchParams])
  const [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategories()])
  if (!product) notFound()

  const notice =
    query.cree === "1"
      ? "Produit créé."
      : query.copie === "1"
        ? "Copie créée : elle est masquée et sans photos. Modifie-la puis rends-la visible."
        : null

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[{ label: "Produits", href: "/admin/produits" }, { label: product.name }]}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl">{product.name}</h1>
        <div className="flex flex-wrap gap-2">
          <DuplicateProductButton productId={product.id} />
          <DeleteProductButton
            productId={product.id}
            productName={product.name}
            redirectTo="/admin/produits"
          />
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-success/60 bg-success/10 px-4 py-3 text-sm"
        >
          <p className="flex items-center gap-2 text-success">
            <CircleCheckIcon aria-hidden="true" className="size-4" />
            {notice}
          </p>
          {query.cree === "1" && (
            <Button asChild variant="cta-outline" size="sm" className="ml-auto">
              <Link href="/admin/produits/nouveau">
                <PlusIcon data-icon="inline-start" />
                Ajouter un autre produit
              </Link>
            </Button>
          )}
        </div>
      )}

      <ProductForm
        mode="edit"
        productId={product.id}
        categories={categories}
        initialImages={product.product_images.map((image) => ({
          path: image.storage_path,
          alt: image.alt ?? "",
        }))}
        initialValues={{
          name: product.name,
          slug: product.slug,
          categoryId: product.category_id,
          game: product.game ?? "",
          setName: product.set_name ?? "",
          cardNumber: product.card_number ?? "",
          language: product.language ?? "",
          rarity: product.rarity ?? "",
          condition: product.condition ?? "",
          isGraded: product.is_graded,
          gradingCompany: product.grading_company ?? "",
          grade: product.grade != null ? String(product.grade) : "",
          price: centsToEuroInput(product.price_cents),
          compareAtPrice: centsToEuroInput(product.compare_at_price_cents),
          stock: String(product.stock),
          description: product.description ?? "",
          isVisible: product.is_visible,
        }}
      />
    </div>
  )
}
