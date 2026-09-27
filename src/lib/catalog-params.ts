import { type CatalogSort, catalogSortOptions } from "@/config/catalog"

/*
 * Paramètres d'URL du catalogue (/boutique?q=…&jeu=…). L'état des filtres vit
 * dans l'URL : une recherche se partage par simple lien.
 */

export type CatalogParams = {
  q: string
  game: string
  language: string
  condition: string
  grading: string
  inStock: boolean
  sort: CatalogSort
  page: number
}

type RawSearchParams = Record<string, string | string[] | undefined>

/** Nom de chaque paramètre dans l'URL (en français, comme le reste du site). */
export const CATALOG_PARAM_NAMES = {
  q: "q",
  game: "jeu",
  language: "langue",
  condition: "etat",
  grading: "gradation",
  inStock: "stock",
  sort: "tri",
  page: "page",
} as const

const DEFAULT_SORT: CatalogSort = "nouveautes"
const MAX_TEXT_LENGTH = 80
const MAX_PAGE = 1000

function first(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value
  return (raw ?? "").trim().slice(0, MAX_TEXT_LENGTH)
}

function isSort(value: string): value is CatalogSort {
  return catalogSortOptions.some((option) => option.value === value)
}

/** Lit et nettoie les paramètres d'URL ; toute valeur invalide est ignorée. */
export function parseCatalogParams(searchParams: RawSearchParams): CatalogParams {
  const sort = first(searchParams[CATALOG_PARAM_NAMES.sort])
  const page = Number.parseInt(first(searchParams[CATALOG_PARAM_NAMES.page]), 10)

  return {
    q: first(searchParams[CATALOG_PARAM_NAMES.q]),
    game: first(searchParams[CATALOG_PARAM_NAMES.game]),
    language: first(searchParams[CATALOG_PARAM_NAMES.language]),
    condition: first(searchParams[CATALOG_PARAM_NAMES.condition]),
    grading: first(searchParams[CATALOG_PARAM_NAMES.grading]),
    inStock: first(searchParams[CATALOG_PARAM_NAMES.inStock]) === "1",
    sort: isSort(sort) ? sort : DEFAULT_SORT,
    page: Number.isFinite(page) && page >= 1 ? Math.min(page, MAX_PAGE) : 1,
  }
}

/** Nombre de filtres actifs (hors recherche, tri et page). */
export function activeFilterCount(params: CatalogParams): number {
  return [params.game, params.language, params.condition, params.grading, params.inStock].filter(
    Boolean
  ).length
}

/**
 * URL du catalogue pour un jeu de paramètres. Les valeurs vides ou par défaut
 * sont omises pour garder des liens courts.
 */
export function catalogHref(basePath: string, params: Partial<CatalogParams>): string {
  const query = new URLSearchParams()
  if (params.q) query.set(CATALOG_PARAM_NAMES.q, params.q)
  if (params.game) query.set(CATALOG_PARAM_NAMES.game, params.game)
  if (params.language) query.set(CATALOG_PARAM_NAMES.language, params.language)
  if (params.condition) query.set(CATALOG_PARAM_NAMES.condition, params.condition)
  if (params.grading) query.set(CATALOG_PARAM_NAMES.grading, params.grading)
  if (params.inStock) query.set(CATALOG_PARAM_NAMES.inStock, "1")
  if (params.sort && params.sort !== DEFAULT_SORT) query.set(CATALOG_PARAM_NAMES.sort, params.sort)
  if (params.page && params.page > 1) query.set(CATALOG_PARAM_NAMES.page, String(params.page))
  const search = query.toString()
  return search ? `${basePath}?${search}` : basePath
}
