import { Splash } from "@/components/brand/splash"
import { cn } from "@/lib/utils"

type AnnouncementBarProps = {
  messages: readonly string[]
  className?: string
}

/** Nombre minimal de messages par moitié de bande, pour couvrir les grands écrans. */
const MIN_ITEMS_PER_HALF = 8

/**
 * Bandeau d'annonce défilant en boucle. La bande contient deux moitiés
 * identiques et se décale de -50 % : la boucle est invisible. Pause au survol,
 * et défilement coupé si l'utilisateur préfère réduire les animations.
 */
export function AnnouncementBar({ messages, className }: AnnouncementBarProps) {
  if (messages.length === 0) return null

  const repeat = Math.ceil(MIN_ITEMS_PER_HALF / messages.length)
  const half = Array.from({ length: repeat }, () => messages).flat()

  return (
    <div className={cn("group overflow-hidden bg-primary text-primary-foreground", className)}>
      <p className="sr-only">{messages.join(". ")}</p>
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0">
            {half.map((message, index) => (
              <li
                key={`${copy}-${index}`}
                className="flex items-center gap-6 px-6 py-2 font-heading text-[0.7rem] tracking-wider whitespace-nowrap uppercase"
              >
                {message}
                <Splash className="size-4 text-primary-foreground" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
