import { cn } from "@/lib/utils"

/** Goutte orientée vers le haut, pointe à l'origine (base de l'éclaboussure). */
const DROP = "M0 0C-3-6-11-20-11-31a11 11 0 0 1 22 0C11-20 3-6 0 0Z"

type SplashProps = {
  className?: string
  /** Liseré couleur crème, comme sur le logo. */
  outlined?: boolean
}

/**
 * Éclaboussure jaune du logo, en élément décoratif. La couleur suit
 * `currentColor` (par défaut text-primary).
 */
export function Splash({ className, outlined = false }: SplashProps) {
  return (
    <svg
      viewBox="0 0 100 70"
      aria-hidden="true"
      focusable="false"
      className={cn("text-primary", className)}
      fill="currentColor"
      stroke={outlined ? "var(--brand-cream)" : "none"}
      strokeWidth={outlined ? 2.5 : 0}
      strokeLinejoin="round"
    >
      <g transform="translate(50 66)">
        <path d={DROP} transform="rotate(-72) translate(0 -10) scale(0.42)" />
        <path d={DROP} transform="rotate(72) translate(0 -10) scale(0.42)" />
        <path d={DROP} transform="rotate(-38) scale(0.82)" />
        <path d={DROP} transform="rotate(38) scale(0.82)" />
        <path d={DROP} transform="scale(1 1.32)" />
      </g>
    </svg>
  )
}
