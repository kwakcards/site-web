"use client"

import Image from "next/image"
import { useState } from "react"

import { CardTrio } from "@/components/brand/card-trio"
import { cn } from "@/lib/utils"

type ProductGalleryProps = {
  images: { url: string; alt: string }[]
  name: string
}

/** Photo principale et miniatures (boutons accessibles au clavier). */
export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0)
  const image = images[current] ?? images[0]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[63/88] overflow-hidden rounded-2xl border-2 border-edge bg-[radial-gradient(ellipse_at_top,var(--brand-ink-raised),var(--brand-ink)_70%)]">
        {image ? (
          <Image
            key={image.url}
            src={image.url}
            alt={image.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 384px"
            className="object-contain p-4"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <CardTrio className="w-1/2 opacity-30" />
            <p className="sr-only">Pas encore de photo pour {name}.</p>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2.5 pb-1" aria-label="Photos du produit">
          {images.map((item, index) => (
            <li key={item.url}>
              <button
                type="button"
                onClick={() => setCurrent(index)}
                aria-pressed={index === current}
                aria-label={`Afficher la photo ${index + 1} sur ${images.length}`}
                className={cn(
                  "relative block aspect-[63/88] w-full tactile overflow-hidden rounded-lg border-2 bg-card outline-none [--ledge-depth:3px] focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50",
                  index === current
                    ? "border-primary ledge-brand-deep"
                    : "border-edge hover:border-primary hover:ledge-brand-deep"
                )}
              >
                <Image src={item.url} alt="" fill sizes="96px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
