import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import {
  CatalogFilters,
  type FilterOption,
  type FilterOptions,
} from "@/components/catalog/catalog-filters"
import { CategoryChips } from "@/components/catalog/category-chips"
import { Pagination } from "@/components/catalog/pagination"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ProductGrid } from "@/components/product/product-grid"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cardConditions, conditionLabel, languageLabel } from "@/config/catalog"
import { catalogHref, parseCatalogParams } from "@/lib/catalog-params"
import {
  type CatalogCategory,
  type CatalogFacets,
  getCatalogFacets,
  getCategories,
  searchCatalog,
} from "@/server/queries/catalog"

type Props = PageProps<"/boutique/[[...categorie]]">

const CATALOG_DESCRIPTION =
  "Cartes Pokémon, One Piece, Lorcana et plus : cartes à l'unité, gradées, produits scellés, collector et accessoires."

/** Catégorie désignée par l'URL : null pour tout le catalogue, undefined si elle n'existe pas. */
async function findCategory(
  segments: string[] | undefined
): Promise<{ category: CatalogCategory | null; categories: CatalogCategory[] } | undefined> {
  const categories = await getCategories()
  if (!segments || segments.length === 0) return { category: null, categories }
  if (segments.length > 1) return undefined
  const category = categories.find((item) => item.slug === segments[0])
  return category ? { category, categories } : undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params
  const found = await findCategory(categorie)
  if (!found) return { title: "Page introuvable", robots: { index: false } }

  const { category } = found
  if (!category) {
    return {
      title: "Catalogue",
      description: CATALOG_DESCRIPTION,
      alternates: { canonical: "/boutique" },
    }
  }
  return {
    title: category.name,
    description: category.description ?? CATALOG_DESCRIPTION,
    alternates: { canonical: `/boutique/${category.slug}` },
  }
}

export default function CatalogPage({ params, searchParams }: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

function toOptions(
  values: CatalogFacets[keyof CatalogFacets],
  label: (value: string) => string | null = (value) => value
): FilterOption[] {
  return values.map(({ value, total }) => ({ value, total, label: label(value) ?? value }))
}

const conditionOrder = (code: string) => {
  const index = cardConditions.findIndex((condition) => condition.code === code)
  return index === -1 ? cardConditions.length : index
}

async function Catalog({ params, searchParams }: Pick<Props, "params" | "searchParams">) {
  const { categorie } = await params
  const found = await findCategory(categorie)
  if (!found) notFound()

  const { category, categories } = found
  const query = parseCatalogParams(await searchParams)
  const basePath = category ? `/boutique/${category.slug}` : "/boutique"

  const [result, facets] = await Promise.all([
    searchCatalog({ ...query, categorySlug: category?.slug }),
    getCatalogFacets(category?.id),
  ])

  const options: FilterOptions = {
    game: toOptions(facets.game),
    language: toOptions(facets.language, languageLabel),
    condition: toOptions(facets.condition, conditionLabel).sort(
      (a, b) => conditionOrder(a.value) - conditionOrder(b.value)
    ),
    grading: toOptions(facets.grading_company),
  }

  const countLabel =
    result.total === 0 ? "Aucun article" : `${result.total} article${result.total > 1 ? "s" : ""}`

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          ...(category
            ? [{ label: "Catalogue", href: "/boutique" }, { label: category.name }]
            : [{ label: "Catalogue" }]),
        ]}
      />

      <header className="mt-4 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl">{category?.name ?? "Catalogue"}</h1>
        <p className="mt-3 text-muted-foreground">{category?.description ?? CATALOG_DESCRIPTION}</p>
      </header>

      <div className="mt-6">
        <CategoryChips categories={categories} current={category?.slug ?? null} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-4 md:p-5">
        <CatalogFilters
          key={catalogHref(basePath, query)}
          basePath={basePath}
          params={query}
          options={options}
        />
      </div>

      <section aria-labelledby="resultats" className="mt-8">
        <h2 id="resultats" className="sr-only">
          Résultats
        </h2>
        <p role="status" className="mb-4 text-sm text-muted-foreground">
          {countLabel}
          {query.q && (
            <>
              {" "}
              pour « <span className="text-foreground">{query.q}</span> »
            </>
          )}
          {result.pageCount > 1 && ` · page ${result.page} sur ${result.pageCount}`}
        </p>

        {result.products.length > 0 ? (
          <ProductGrid products={result.products} />
        ) : (
          <div className="rounded-xl border-2 border-dashed border-edge px-6 py-12 text-center">
            <p className="font-heading uppercase">
              {result.total > 0 ? "Cette page est vide." : "Aucun article ne correspond."}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.total > 0
                ? "Les résultats tiennent sur moins de pages."
                : "Essaie d'autres mots-clés ou retire un filtre."}
            </p>
            <Button asChild variant="outline" className="mt-5">
              <Link
                href={result.total > 0 ? catalogHref(basePath, { ...query, page: 1 }) : basePath}
              >
                {result.total > 0
                  ? "Revenir à la première page"
                  : category
                    ? `Voir toute la catégorie ${category.name}`
                    : "Voir tout le catalogue"}
              </Link>
            </Button>
          </div>
        )}

        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          hrefFor={(page) => catalogHref(basePath, { ...query, page })}
        />
      </section>
    </>
  )
}

function CatalogSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        Chargement du catalogue…
      </p>
      <div aria-hidden="true">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-5 h-11 w-64" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-28 rounded-full" />
          ))}
        </div>
        <Skeleton className="mt-6 h-24 w-full rounded-xl" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="aspect-[63/88] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
