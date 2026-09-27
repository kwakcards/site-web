import { CircleCheckIcon, ImageOffIcon, PencilIcon, PlusIcon, SearchIcon } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { VisibilityToggle } from "@/components/admin/visibility-toggle"
import { Pagination } from "@/components/catalog/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireAdmin } from "@/lib/auth"
import { formatDateTimeParis } from "@/lib/dates"
import { formatPrice } from "@/lib/money"
import { getAdminCategories, listAdminProducts } from "@/server/queries/admin"

export const metadata: Metadata = { title: "Produits" }

// Page liée à la session de l'admin : rendue à chaque requête (voir le layout).
export const instant = false

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 80) ?? ""
}

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/produits">) {
  await requireAdmin()
  const params = await searchParams
  const q = first(params.q)
  const categoryId = first(params.categorie)
  const page = Math.max(1, Number.parseInt(first(params.page), 10) || 1)
  const deleted = first(params.supprime) === "1"

  const [categories, list] = await Promise.all([
    getAdminCategories(),
    listAdminProducts({ q, categoryId, page }),
  ])

  const hrefFor = (target: number) => {
    const query = new URLSearchParams()
    if (q) query.set("q", q)
    if (categoryId) query.set("categorie", categoryId)
    if (target > 1) query.set("page", String(target))
    const search = query.toString()
    return search ? `/admin/produits?${search}` : "/admin/produits"
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Produits</h1>
          <p className="mt-1 text-muted-foreground">
            {list.total} produit{list.total > 1 ? "s" : ""}
            {q || categoryId ? " correspondant à la recherche" : " au total"}
          </p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/produits/nouveau">
            <PlusIcon data-icon="inline-start" />
            Ajouter un produit
          </Link>
        </Button>
      </div>

      {deleted && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-success/60 bg-success/10 px-4 py-3 text-sm text-success"
        >
          <CircleCheckIcon aria-hidden="true" className="size-4" />
          Le produit a été supprimé.
        </p>
      )}

      <form
        role="search"
        aria-label="Rechercher un produit"
        action="/admin/produits"
        className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4"
      >
        <div className="flex min-w-56 flex-1 flex-col gap-1.5">
          <label htmlFor="admin-q" className="text-sm font-medium">
            Rechercher
          </label>
          <Input
            id="admin-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Nom, extension, numéro…"
            className="h-10"
          />
        </div>
        <div className="flex min-w-48 flex-col gap-1.5">
          <label htmlFor="admin-categorie" className="text-sm font-medium">
            Catégorie
          </label>
          <NativeSelect id="admin-categorie" name="categorie" defaultValue={categoryId}>
            <option value="">Toutes</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        <Button type="submit" variant="outline" className="h-10">
          <SearchIcon data-icon="inline-start" />
          Filtrer
        </Button>
        {(q || categoryId) && (
          <Button asChild variant="outline" className="h-10">
            <Link href="/admin/produits">Tout afficher</Link>
          </Button>
        )}
      </form>

      {list.products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="font-heading uppercase">Aucun produit</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {q || categoryId
              ? "Aucun produit ne correspond à cette recherche."
              : "Ajoute ton premier produit pour remplir la boutique."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  <span className="sr-only">Photo</span>
                </TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>En ligne</TableHead>
                <TableHead>Modifié le</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative aspect-[63/88] w-12 overflow-hidden rounded bg-background">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      ) : (
                        <>
                          <ImageOffIcon
                            aria-hidden="true"
                            className="absolute inset-0 m-auto size-4 text-muted-foreground"
                          />
                          <span className="sr-only">Sans photo</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-72 whitespace-normal">
                    <Link
                      href={`/admin/produits/${product.id}`}
                      className="font-medium underline-offset-4 hover:text-primary hover:underline"
                    >
                      {product.name}
                    </Link>
                    {product.subtitle && (
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {product.subtitle}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.categoryName}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-primary">
                      {formatPrice(product.priceCents)}
                    </span>
                    {product.compareAtPriceCents != null && (
                      <s className="block text-xs text-muted-foreground">
                        <span className="sr-only">au lieu de </span>
                        {formatPrice(product.compareAtPriceCents)}
                      </s>
                    )}
                  </TableCell>
                  <TableCell
                    className={product.stock === 0 ? "text-right text-destructive" : "text-right"}
                  >
                    {product.stock}
                  </TableCell>
                  <TableCell>
                    <VisibilityToggle
                      productId={product.id}
                      productName={product.name}
                      visible={product.isVisible}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTimeParis(product.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="icon">
                        <Link
                          href={`/admin/produits/${product.id}`}
                          aria-label={`Modifier ${product.name}`}
                        >
                          <PencilIcon />
                        </Link>
                      </Button>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                        compact
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination page={list.page} pageCount={list.pageCount} hrefFor={hrefFor} />
    </div>
  )
}
