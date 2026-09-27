import { cn } from "@/lib/utils"

/** Seuil à partir duquel on indique le nombre d'exemplaires restants. */
const LOW_STOCK = 3

export function stockLabel(stock: number): string {
  if (stock <= 0) return "En rupture de stock"
  if (stock === 1) return "Dernier exemplaire !"
  if (stock <= LOW_STOCK) return `Plus que ${stock} exemplaires`
  return "En stock"
}

export function StockStatus({ stock, className }: { stock: number; className?: string }) {
  const available = stock > 0
  return (
    <p className={cn("flex items-center gap-2 text-sm font-medium", className)}>
      <span
        aria-hidden="true"
        className={cn("size-2.5 rounded-full", available ? "bg-success" : "bg-muted-foreground")}
      />
      <span className={available ? "text-foreground" : "text-muted-foreground"}>
        {stockLabel(stock)}
      </span>
    </p>
  )
}
