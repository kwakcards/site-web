import { randomUUID } from "node:crypto"

import type { Metadata } from "next"

import { ProductForm } from "@/components/admin/product-form"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { requireAdmin } from "@/lib/auth"
import { getAdminCategories } from "@/server/queries/admin"

export const metadata: Metadata = { title: "Nouveau produit" }

// Page liée à la session de l'admin : rendue à chaque requête (voir le layout).
export const instant = false

export default async function NewProductPage({
  searchParams,
}: PageProps<"/admin/produits/nouveau">) {
  await requireAdmin()
  const [{ categorie }, categories] = await Promise.all([searchParams, getAdminCategories()])
  const preselected = categories.find((category) => category.slug === categorie)

  // L'identifiant est choisi dès l'ouverture du formulaire : les photos sont
  // rangées dans products/<id>/ avant même la création du produit.
  const productId = randomUUID()

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[{ label: "Produits", href: "/admin/produits" }, { label: "Nouveau produit" }]}
      />
      <h1 className="font-display text-4xl">Nouveau produit</h1>
      <ProductForm
        mode="create"
        productId={productId}
        categories={categories}
        initialImages={[]}
        initialValues={{
          name: "",
          slug: "",
          categoryId: preselected?.id ?? "",
          game: "",
          setName: "",
          cardNumber: "",
          language: "",
          rarity: "",
          condition: "",
          isGraded: false,
          gradingCompany: "",
          grade: "",
          price: "",
          compareAtPrice: "",
          stock: "1",
          description: "",
          isVisible: true,
        }}
      />
    </div>
  )
}
