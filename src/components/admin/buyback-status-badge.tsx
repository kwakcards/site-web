import { buybackStatuses, optionLabel } from "@/config/buyback"
import { cn } from "@/lib/utils"

const styles: Record<string, string> = {
  nouvelle: "border-primary bg-primary text-primary-foreground",
  "en-cours": "border-primary text-primary",
  conclue: "border-success text-success",
  refusee: "border-edge text-muted-foreground",
}

export function BuybackStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border-2 px-2.5 font-heading text-[0.7rem] tracking-wide uppercase",
        styles[status] ?? styles.refusee
      )}
    >
      {optionLabel(buybackStatuses, status)}
    </span>
  )
}
