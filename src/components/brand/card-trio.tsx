import { cn } from "@/lib/utils"

const CARD = { x: 40, y: 34, width: 40, height: 56, rx: 5 }
const DROP = "M0 0C-3-6-11-20-11-31a11 11 0 0 1 22 0C11-20 3-6 0 0Z"

type CardTrioProps = {
  className?: string
}

/**
 * Trio de cartes en éventail du logo, en élément décoratif. Le contour suit
 * `currentColor` (par défaut text-primary), le fond reprend celui du site.
 */
export function CardTrio({ className }: CardTrioProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      aria-hidden="true"
      focusable="false"
      className={cn("text-primary", className)}
      fill="var(--background)"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinejoin="round"
    >
      <rect {...CARD} transform="translate(-20 4) rotate(-16 60 90)" />
      <rect {...CARD} transform="translate(20 4) rotate(16 60 90)" />
      <rect {...CARD} />
      <rect
        x={CARD.x + 5}
        y={CARD.y + 5}
        width={CARD.width - 10}
        height={CARD.height - 10}
        rx={3}
        strokeWidth={1.25}
        opacity={0.6}
      />
      <g transform="translate(60 72) scale(0.34)" fill="currentColor" stroke="none">
        <path d={DROP} transform="rotate(-38) scale(0.82)" />
        <path d={DROP} transform="rotate(38) scale(0.82)" />
        <path d={DROP} transform="scale(1 1.32)" />
      </g>
    </svg>
  )
}
