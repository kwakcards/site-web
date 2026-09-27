import * as React from "react"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

/** Liste déroulante native : accessible au clavier et aux lecteurs d'écran sans script. */
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="native-select"
        className={cn(
          "h-10 w-full min-w-0 cursor-pointer appearance-none rounded-lg border-2 border-input bg-secondary pr-9 pl-3 text-base tactile-field outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ledge-brand-deep disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:ledge-destructive-deep md:text-sm [&>option]:bg-popover [&>option]:text-popover-foreground",
          className
        )}
        {...props}
      />
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}

export { NativeSelect }
