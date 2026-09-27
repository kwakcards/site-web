"use client"

import { LoaderCircleIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useId, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { type CatalogSort, catalogSortOptions } from "@/config/catalog"
import {
  activeFilterCount,
  CATALOG_PARAM_NAMES as P,
  type CatalogParams,
  catalogHref,
} from "@/lib/catalog-params"
import { cn } from "@/lib/utils"

export type FilterOption = { value: string; label: string; total: number }

export type FilterOptions = {
  game: FilterOption[]
  language: FilterOption[]
  condition: FilterOption[]
  grading: FilterOption[]
}

type CatalogFiltersProps = {
  basePath: string
  params: CatalogParams
  options: FilterOptions
}

/**
 * Recherche, filtres et tri du catalogue. Sans JavaScript, le formulaire est
 * envoyé en GET classique ; avec, l'URL est mise à jour sans recharger la page
 * et chaque changement de filtre s'applique aussitôt.
 */
export function CatalogFilters({ basePath, params, options }: CatalogFiltersProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const activeCount = activeFilterCount(params)
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const hasCriteria = activeCount > 0 || params.q !== "" || params.sort !== "nouveautes"

  function apply(form: HTMLFormElement) {
    const data = new FormData(form)
    const text = (name: string) => String(data.get(name) ?? "").trim()
    const href = catalogHref(basePath, {
      q: text(P.q),
      game: text(P.game),
      language: text(P.language),
      condition: text(P.condition),
      grading: text(P.grading),
      inStock: data.get(P.inStock) === "1",
      sort: text(P.sort) as CatalogSort,
    })
    startTransition(() => router.push(href, { scroll: false }))
  }

  const applyOnChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    if (event.currentTarget.form) apply(event.currentTarget.form)
  }

  return (
    <form
      role="search"
      aria-label="Rechercher et filtrer le catalogue"
      action={basePath}
      method="get"
      onSubmit={(event) => {
        event.preventDefault()
        apply(event.currentTarget)
      }}
      aria-busy={pending}
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="recherche" className="sr-only">
            Rechercher une carte
          </label>
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="recherche"
            name={P.q}
            type="search"
            defaultValue={params.q}
            placeholder="Nom, extension, numéro…"
            enterKeyHint="search"
            autoComplete="off"
            maxLength={80}
            className="h-11 pl-10"
          />
        </div>
        <Button type="submit" variant="cta" className="h-11">
          Rechercher
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-3 md:hidden">
        <Button
          type="button"
          variant="outline"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="h-10"
        >
          <SlidersHorizontalIcon data-icon="inline-start" />
          Filtres et tri
          {activeCount > 0 && <span className="text-primary">({activeCount})</span>}
        </Button>
      </div>

      <div
        id={panelId}
        className={cn(
          "mt-4 items-end gap-3 sm:grid-cols-2 md:grid md:grid-cols-3 xl:grid-cols-6",
          open ? "grid" : "hidden"
        )}
      >
        {options.game.length > 0 && (
          <FilterSelect
            label="Jeu"
            name={P.game}
            value={params.game}
            options={options.game}
            onChange={applyOnChange}
          />
        )}
        {options.language.length > 0 && (
          <FilterSelect
            label="Langue"
            allLabel="Toutes"
            name={P.language}
            value={params.language}
            options={options.language}
            onChange={applyOnChange}
          />
        )}
        {options.condition.length > 0 && (
          <FilterSelect
            label="État"
            name={P.condition}
            value={params.condition}
            options={options.condition}
            onChange={applyOnChange}
          />
        )}
        {options.grading.length > 0 && (
          <FilterSelect
            label="Gradation"
            allLabel="Toutes"
            name={P.grading}
            value={params.grading}
            options={options.grading}
            onChange={applyOnChange}
          />
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${panelId}-tri`} className="text-sm font-medium">
            Trier par
          </label>
          <NativeSelect
            id={`${panelId}-tri`}
            name={P.sort}
            defaultValue={params.sort}
            onChange={applyOnChange}
          >
            {catalogSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="flex h-10 items-center gap-2.5">
          <input
            id={`${panelId}-stock`}
            type="checkbox"
            name={P.inStock}
            value="1"
            defaultChecked={params.inStock}
            onChange={applyOnChange}
            className="size-5 accent-primary"
          />
          <label htmlFor={`${panelId}-stock`} className="text-sm font-medium">
            En stock uniquement
          </label>
        </div>
      </div>

      {hasCriteria && (
        <Link
          href={basePath}
          scroll={false}
          className="mt-3 inline-flex items-center gap-1 text-sm text-primary underline underline-offset-4"
        >
          <XIcon aria-hidden="true" className="size-4" />
          Effacer la recherche et les filtres
        </Link>
      )}
      <p
        aria-live="polite"
        className={cn(
          "text-sm text-muted-foreground",
          pending ? "mt-3 flex items-center gap-1.5" : "sr-only"
        )}
      >
        {pending && (
          <>
            <LoaderCircleIcon
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
            Mise à jour des résultats…
          </>
        )}
      </p>
    </form>
  )
}

type FilterSelectProps = {
  label: string
  /** Libellé de l'option « sans filtre » (« Tous », « Toutes »). */
  allLabel?: string
  name: string
  value: string
  options: FilterOption[]
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

function FilterSelect({
  label,
  allLabel = "Tous",
  name,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const id = useId()
  // Une valeur d'URL absente des options reste sélectionnable (et donc effaçable).
  const list =
    value && !options.some((option) => option.value === value)
      ? [...options, { value, label: value, total: 0 }]
      : options

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <NativeSelect id={id} name={name} defaultValue={value} onChange={onChange}>
        <option value="">{allLabel}</option>
        {list.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} ({option.total})
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}
