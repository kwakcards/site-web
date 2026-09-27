import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/*
 * Tous les boutons partagent le style du bouton « Rechercher une carte » :
 * typo « CARDS » en capitales, bordure épaisse et bord inférieur plein qui
 * s'enfonce au clic (utilitaire tactile, voir globals.css). Seules les
 * couleurs changent d'une variante à l'autre.
 */
const neutral =
  "border-edge bg-secondary text-foreground hover:border-primary hover:text-primary hover:ledge-brand-deep aria-expanded:border-primary aria-expanded:text-primary aria-expanded:ledge-brand-deep"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 tactile items-center justify-center rounded-lg border-2 bg-clip-padding font-heading tracking-wide whitespace-nowrap uppercase outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Action principale : face jaune, relief jaune foncé.
        default:
          "border-primary bg-primary text-primary-foreground ledge-brand-deep hover:border-brand-light hover:bg-brand-light",
        cta: "border-primary bg-primary text-primary-foreground ledge-brand-deep hover:border-brand-light hover:bg-brand-light",
        // Action de marque secondaire : contour et relief jaunes, se remplit au survol.
        "cta-outline":
          "border-primary bg-background text-primary ledge-brand-deep hover:bg-primary hover:text-primary-foreground",
        // Actions neutres : face sombre, contour et relief gris, jaunes au survol.
        outline: neutral,
        secondary: neutral,
        ghost: neutral,
        // Action destructrice : contour et relief rouges, se remplit au survol.
        destructive:
          "border-destructive bg-secondary text-destructive ledge-destructive-deep hover:bg-destructive hover:text-primary-foreground focus-visible:border-destructive focus-visible:ring-destructive/40",
      },
      size: {
        default:
          "h-10 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs [--ledge-depth:3px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-[min(var(--radius-md),12px)] px-3 text-xs [--ledge-depth:3px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10",
        "icon-xs":
          "size-7 rounded-[min(var(--radius-md),10px)] [--ledge-depth:3px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),12px)] [--ledge-depth:3px] [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
