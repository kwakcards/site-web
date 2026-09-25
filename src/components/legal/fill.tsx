type FillProps = {
  value: string | number | null | undefined
  /** Ce qui manque, affiché tant que la valeur n'est pas renseignée. */
  label: string
}

/** Affiche une information légale, ou un repère visible si elle reste à compléter. */
export function Fill({ value, label }: FillProps) {
  if (value !== null && value !== undefined && value !== "") return <>{value}</>
  return (
    <mark className="rounded-sm bg-destructive/15 px-1 font-medium text-destructive">
      [À compléter : {label}]
    </mark>
  )
}
