"use client"

import { PauseIcon, PlayIcon } from "lucide-react"
import { useState } from "react"

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
 * identiques et se décale de -50 % : la boucle est invisible.
 *
 * Accessibilité (WCAG 2.2.2) : bouton pause/lecture, pause au survol, et
 * défilement coupé si l'utilisateur préfère réduire les animations. Le texte
 * est lu une seule fois par les lecteurs d'écran.
 */
export function AnnouncementBar({ messages, className }: AnnouncementBarProps) {
  const [paused, setPaused] = useState(false)

  if (messages.length === 0) return null

  const repeat = Math.ceil(MIN_ITEMS_PER_HALF / messages.length)
  const half = Array.from({ length: repeat }, () => messages).flat()

  return (
    <section
      aria-label="Annonces"
      className={cn(
        "group flex items-center bg-primary text-primary-foreground print:hidden",
        className
      )}
    >
      <ul className="sr-only">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="min-w-0 flex-1 overflow-hidden">
        <div
          className={cn(
            "flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none",
            paused && "[animation-play-state:paused]"
          )}
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

      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        className="mx-1.5 my-1 grid size-7 shrink-0 tactile place-items-center rounded-md border-2 border-primary-foreground bg-primary [--ledge-depth:2px] ledge-primary-foreground hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground motion-reduce:hidden"
      >
        {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
        <span className="sr-only">
          {paused
            ? "Reprendre le défilement des annonces"
            : "Mettre en pause le défilement des annonces"}
        </span>
      </button>
    </section>
  )
}
