import * as React from "react"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

/**
 * Case à cocher native (envoyée avec le formulaire, utilisable sans script),
 * au relief des autres champs. Le libellé reste un <label htmlFor> séparé.
 */
function NativeCheckbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <span className={cn("relative inline-grid size-6 shrink-0 place-items-center", className)}>
      <input
        type="checkbox"
        data-slot="native-checkbox"
        className="peer col-start-1 row-start-1 size-6 cursor-pointer appearance-none rounded-md border-2 border-input bg-secondary tactile-field outline-none checked:border-primary checked:bg-primary checked:ledge-brand-deep focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <CheckIcon
        aria-hidden="true"
        strokeWidth={3.5}
        className="pointer-events-none col-start-1 row-start-1 size-4 text-primary-foreground opacity-0 peer-checked:opacity-100"
      />
    </span>
  )
}

export { NativeCheckbox }
